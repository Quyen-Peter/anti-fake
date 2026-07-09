import type { Product } from "../../type/product";
import "../../css/components/product/productSale.css";
import { formatVnd } from "../../ultil/currency";

type Props = {
  product: Product;
};

export default function ProductSell({ product }: Props) {
  return (
    <div key={product.id} className="flash-card">
      <div className="discount-tag">-{product.discount}%</div>

      <img src={product.image} alt={product.name} />

      <h4>{product.name}</h4>

      <div className="price">{formatVnd(product.price)}</div>

      <div className="old-price">{formatVnd(product.oldPrice)}</div>

      <div className="sold-bar">
        <div
          className="sold-progress"
          style={{
            width: `${product.soldPercent}%`,
          }}
        />
      </div>

      <div className="sold-text">Đã bán {product.soldPercent}%</div>
    </div>
  );
}
