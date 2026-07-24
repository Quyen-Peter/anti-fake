import { Link } from "react-router-dom";
import type { LiveOffer } from "../../services/live.api";

export default function LiveProductCard({
  product,
  sessionId,
}: {
  product: LiveOffer;
  sessionId: string;
}) {
  return (
    <div className="live-product-card">
      {product.thumbnailUrl ? (
        <img src={product.thumbnailUrl} alt={product.title} />
      ) : (
        <div className="live-product-placeholder">Không có ảnh</div>
      )}
      <div className="live-product-info">
        <h4>{product.title}</h4>
        <p>
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: product.currency || "VND",
          }).format(product.price)}
        </p>
        <small>Còn {product.availableQuantity} sản phẩm</small>
        <Link to={`/product/${product.offerId}?live=${encodeURIComponent(sessionId)}`}>
          Xem sản phẩm
        </Link>
      </div>
    </div>
  );
}
