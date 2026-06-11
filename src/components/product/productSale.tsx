import type { Product } from "../../type/product";
import "../../css/components/product/productSale.css";

type Props = {
  product: Product;
};

export default function ProductSell({ product }: Props) {
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN").format(price);
  return (
    <div key={product.id} className="flash-card">
      <div className="discount-tag">-{product.discount}%</div>

      <img src={product.image} alt={product.name} />

      <h4>{product.name}</h4>

      <div className="price">{formatPrice(product.price)}đ</div>

      <div className="old-price">{formatPrice(product.oldPrice)}đ</div>

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
