import type { LiveOffer } from "../../services/live.api";
import LiveProductCard from "./liveProductCard";

export default function LiveProducts({
  products,
  sessionId,
}: {
  products: LiveOffer[];
  sessionId: string;
}) {
  return (
    <div className="live-products">
      <div className="live-products-header">
        <h3>Sản phẩm trong livestream</h3>
        <span>{products.length} sản phẩm</span>
      </div>
      {products.length ? (
        <div className="live-products-grid">
          {products.map((product) => (
            <LiveProductCard
              key={product.offerId}
              product={product}
              sessionId={sessionId}
            />
          ))}
        </div>
      ) : (
        <p className="live-products-empty">
          Shop chưa gắn sản phẩm cho buổi phát này.
        </p>
      )}
    </div>
  );
}
