import { useSearchParams } from "react-router-dom";
import SearchSidebar from "../../components/layout/searchSidebar";
import "../../css/pages/search.css";
import SearchHeader from "../../components/layout/searchHeader";
import { useEffect, useState } from "react";
import { searchOffers } from "../../services/product.api";
import LoadingOverlay from "../../components/loadingOverlay";
import ProductCard from "../../components/product/productCard";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const keyword = searchParams.get("q") || "";
  const categoryId = searchParams.get("categoryId");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const [sortType, setSortType] = useState("all");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);

        const data = await searchOffers({
          q: keyword || undefined,
          categoryId: categoryId ? Number(categoryId) : undefined,
          minPrice: minPrice ? Number(minPrice) : undefined,
          maxPrice: maxPrice ? Number(maxPrice) : undefined,
          page: 1,
          pageSize: 20,
        });

        setProducts(data.items || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [keyword, categoryId, minPrice, maxPrice]);

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
    <div className="search-page">
      <div className="s-sidebar-page">
        <SearchSidebar />
      </div>

      <div className="search-content">
        <SearchHeader sortType={sortType} setSortType={setSortType} />
        <div className="s-product-grid">
          {loading && <LoadingOverlay />}

          {!loading && sortedProducts.length === 0 && (
            <div className="empty-search">
              <h3>Không tìm thấy sản phẩm</h3>
              <p>Hãy thử từ khóa khác hoặc thay đổi bộ lọc tìm kiếm.</p>
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
