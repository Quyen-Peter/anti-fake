import { useEffect, useState } from "react";
import {
  fetchShopBestSellingProducts,
  type ShopBestSellingProduct,
} from "../../services/shop.api";
import { formatVnd } from "../../ultil/currency";

type SellerTopProductsProps = {
  shopId?: string;
};

export default function SellerTopProducts({ shopId }: SellerTopProductsProps) {
  const [products, setProducts] = useState<ShopBestSellingProduct[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!shopId) return;

    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchShopBestSellingProducts(shopId, 4);
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
    <div className="seller-top-card">
      <div className="seller-card-header">
        <h3>Bán chạy nhất</h3>
      </div>

      {loading && (
        <div className="seller-dashboard-orders-state">
          Đang tải sản phẩm...
        </div>
      )}

      {!loading && products.length === 0 && (
        <div className="seller-dashboard-orders-state">
          Chưa có sản phẩm bán chạy
        </div>
      )}

      {!loading &&
        products.map((product) => (
          <div
            key={product.id}
            className="seller-top-item"
          >
            <img
              src={product.thumbnailUrl || "https://picsum.photos/60?random=1"}
              alt={product.title}
            />

            <div className="seller-top-info">
              <h4>{product.title}</h4>
              <span>Đã bán {product.soldQuantity ?? 0}</span>
            </div>

            <b>{formatVnd(product.price, product.currency)}</b>
          </div>
        ))}
    </div>
  );
}
