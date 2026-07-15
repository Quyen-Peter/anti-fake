import { Trash2 } from "lucide-react";
import { formatVnd } from "../../ultil/currency";
import type { CartItem as CartItemType } from "../../type/checkout";

type Props = {
  item: CartItemType & { selected: boolean };
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
        {item.variantSku ? (
          <div className="cart-variant">Phân loại: {item.variantSku}</div>
        ) : null}
        <div className="cart-price">
          {formatVnd(item.unitPriceSnapshot, item.currencySnapshot)}
        </div>

        {item.oldPrice ? (
          <div className="cart-old-price">{formatVnd(item.oldPrice)}</div>
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
