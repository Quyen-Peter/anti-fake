import { Trash2 } from "lucide-react";

type Props = {
  item: any;
  toggleSelect: (id: string) => void;
  onQuantityChange: (id: string, quantity: number) => void;
  onDelete: (id: string) => void;
};

export default function CartItem({
  item,
  toggleSelect,
  onQuantityChange,
  onDelete,
}: Props) {

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN").format(price);

  

  return (
    <div className="cart-item">
      <input
        type="checkbox"
        checked={item.selected}
        onChange={() => toggleSelect(item.id)}
      />
      <img src={item.thumbnailUrl} alt="" />
      <div className="cart-item-info">
        <h3>{item.offerTitleSnapshot}</h3>
        <div className="cart-price">
          {formatPrice(item.unitPriceSnapshot)} {item.currencySnapshot}
        </div>

        {item.oldPrice ? (
          <div className="cart-old-price">{formatPrice(item.oldPrice)}đ</div>
        ) : (
          <div></div>
        )}
      </div>

      <div className="cart-actions">
        <Trash2 size={19}  onClick={() => onDelete(item.id)}/>

        <div className="cart-qty">
          <button
            onClick={() => onQuantityChange(item.id, item.quantity - 1)}
            disabled={item.quantity <= 1}
          >
            -
          </button>
          <span>{item.quantity}</span>
          <button onClick={() => onQuantityChange(item.id, item.quantity + 1)}>
            +
          </button>
        </div>
      </div>
    </div>
  );
}
