import { Trash2 } from "lucide-react";

type Props = {
  item: any;
  toggleSelect: (id: string) => void;
};

export default function CartItem({ item, toggleSelect }: Props) {
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN").format(price);

  return (
    <div className="cart-item">
      <input
        type="checkbox"
        checked={item.selected}
        onChange={() => toggleSelect(item.id)}
      />

      <img src={item.image} alt="" />

      <div className="cart-item-info">
        <h3>{item.name}</h3>
        <div className="cart-price">{formatPrice(item.price)}đ</div>

        <div className="cart-old-price">{formatPrice(item.oldPrice)}đ</div>
      </div>

      <div className="cart-actions">
        <Trash2 size={19} />

        <div className="cart-qty">
          <button>-</button>
          <span>{item.quantity}</span>
          <button>+</button>
        </div>
      </div>
    </div>
  );
}
