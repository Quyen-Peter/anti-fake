import { useState } from "react";
import CartItem from "../../components/cart/cartItem";
import CartSummary from "../../components/cart/cartSummary";
import "../../css/pages/cart.css";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([
    {
      id: "1",
      name: "iPhone 15 Pro Max 256GB iPhone 15 Pro",
      image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569",
      price: 28990000,
      oldPrice: 34990000,
      quantity: 1,
      selected: true,
    },
    {
      id: "2",
      name: "Sony WH-1000XM5",
      image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b",
      price: 6490000,
      oldPrice: 8190000,
      quantity: 1,
      selected: true,
    },
     {
      id: "3",
      name: "Sony WH-1000XM5",
      image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b",
      price: 6490000,
      oldPrice: 8190000,
      quantity: 1,
      selected: true,
    },
     {
      id: "4",
      name: "Sony WH-1000XM5",
      image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b",
      price: 6490000,
      oldPrice: 8190000,
      quantity: 1,
      selected: true,
    },
  ]);

  const toggleSelect = (id: string) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item,
      ),
    );
  };

  const subtotal = cartItems
    .filter((item) => item.selected)
    .reduce((sum, item) => sum + item.price * item.quantity, 0);

  const discount = cartItems
    .filter((item) => item.selected)
    .reduce(
      (sum, item) => sum + (item.oldPrice - item.price) * item.quantity,
      0,
    );

  const total = subtotal;

  return (
    <div className="cart-page">
      <div className="cart-left">
        <div className="cart-header">
          <h1>Giỏ hàng của bạn</h1>
          <span>({cartItems.length} sản phẩm)</span>
        </div>

        {cartItems.map((item) => (
          <CartItem key={item.id} item={item} toggleSelect={toggleSelect} />
        ))}
      </div>
      <div className="cart-right">
        <CartSummary subtotal={subtotal} discount={discount} total={total} />
      </div>
    </div>
  );
}
