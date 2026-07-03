import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../product/productCard";
import {
  fetchShopBestSellingProducts,
  type ShopBestSellingProduct,
} from "../../services/shop.api";
import type { ProductView } from "../../type/product";

const mapProductView = (product: ShopBestSellingProduct): ProductView => ({
  id: product.id,
  title: product.title,
  price: product.price,
  currency: product.currency || "VND",
  thumbnailUrl: product.thumbnailUrl || "",
  soldQuantity: product.soldQuantity ?? 0,
  categoryName: "",
  salesMode: product.salesMode === "WHOLESALE" ? "WHOLESALE" : "RETAIL",
  verificationLevel: product.verificationLevel || "",
  offerStatus: product.offerStatus || "",
  brandId: "",
  shopId: "",
});

export default function ShopReviews() {
  const { shopId } = useParams<{ shopId: string }>();
  const [products, setProducts] = useState<ShopBestSellingProduct[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!shopId) return;

    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchShopBestSellingProducts(shopId, 12);
        setProducts(data);
      } catch (error) {
        console.error(error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [shopId]);

  return (
    <div className="shop-best-selling">
      <div className="shop-best-selling-header">
        <h3>Sản phẩm bán chạy</h3>
      </div>

      {loading && (
        <div className="shop-best-selling-state">
          Đang tải sản phẩm bán chạy...
        </div>
      )}

      {!loading && products.length === 0 && (
        <div className="shop-best-selling-state">
          Chưa có sản phẩm bán chạy
        </div>
      )}

      {!loading && products.length > 0 && (
        <div className="shop-best-selling-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={mapProductView(product)} />
          ))}
        </div>
      )}
    </div>
  );
}
