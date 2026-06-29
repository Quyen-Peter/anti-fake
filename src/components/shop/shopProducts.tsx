import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import SearchHeader from "../layout/searchHeader";
import SearchSidebar, { type SearchCategory } from "../layout/searchSidebar";
import ProductCard from "../product/productCard";
import LoadingOverlay from "../loadingOverlay";
import { searchOffers } from "../../services/product.api";
import { fetchShopCategories } from "../../services/shop.api";
import "../../css/components/shop/shopProduct.css";

const normalizeList = (data: any) => {
  const payload = data?.data ?? data?.items ?? data;
  return Array.isArray(payload) ? payload : [];
};

export default function ShopProducts() {
  const { shopId } = useParams<{ shopId: string }>();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<SearchCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortType, setSortType] = useState("all");

  const keyword = searchParams.get("q") || "";
  const categoryId = searchParams.get("categoryId");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const basePath = shopId ? `/shop/${shopId}/products` : "/search";

  useEffect(() => {
    if (!shopId) return;

    const loadCategories = async () => {
      try {
        const data = await fetchShopCategories(shopId);
        setCategories(data);
      } catch (error) {
        console.error(error);
      }
    };

    loadCategories();
  }, [shopId]);

  useEffect(() => {
    if (!shopId) return;

    const loadProducts = async () => {
      try {
        setLoading(true);

        const data = await searchOffers({
          shopId,
          q: keyword || undefined,
          categoryId: categoryId || undefined,
          minPrice: minPrice ? Number(minPrice) : undefined,
          maxPrice: maxPrice ? Number(maxPrice) : undefined,
          page: 1,
          pageSize: 20,
        });

        setProducts(normalizeList(data));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [shopId, keyword, categoryId, minPrice, maxPrice]);

  const sortedProducts = [...products];

  switch (sortType) {
    case "priceAsc":
      sortedProducts.sort((a, b) => a.price - b.price);
      break;
    case "priceDesc":
      sortedProducts.sort((a, b) => b.price - a.price);
      break;
    case "newest":
      sortedProducts.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      break;
    case "bestSelling":
      sortedProducts.sort((a, b) => b.soldQuantity - a.soldQuantity);
      break;
  }

  return (
    <div className="shop-products-page">
      <div className="shop-products-sidebar">
        <SearchSidebar categories={categories} basePath={basePath} />
      </div>

      <div className="shop-products-content">
        <SearchHeader
          sortType={sortType}
          setSortType={setSortType}
          categories={categories}
          basePath={basePath}
        />

        <div className="shop-products-grid">
          {loading && <LoadingOverlay />}

          {!loading && sortedProducts.length === 0 && (
            <div className="shop-products-empty">
              <h3>Không tìm thấy sản phẩm</h3>
              <p>Hãy thử thay đổi danh mục hoặc khoảng giá.</p>
            </div>
          )}

          {!loading &&
            sortedProducts.length > 0 &&
            sortedProducts.map((product) => (
              <div key={product.id}>
                <ProductCard product={product} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
