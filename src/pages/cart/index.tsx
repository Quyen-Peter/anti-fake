import { useState } from "react";
import CartItem from "../../components/cart/cartItem";
import CartSummary from "../../components/cart/cartSummary";
import "../../css/pages/cart.css";
import { Store } from "lucide-react";

export default function CartPage() {
  const [cartShops, setCartShops] = useState([
    {
      shopId: "shop-1",
      shopName: "Apple Official Store",
      items: [
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
          name: "AirPods Pro Gen 2",
          image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1",
          price: 5990000,
          oldPrice: 6990000,
          quantity: 1,
          selected: true,
        },
      ],
    },

    {
      shopId: "shop-2",
      shopName: "Sony Official Store",
      items: [
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
          name: "Sony WF-1000XM5",
          image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b",
          price: 4990000,
          oldPrice: 5990000,
          quantity: 1,
          selected: true,
        },
      ],
    },
  ]);

  const isShopSelected = (shopId: string) => {
    const shop = cartShops.find((s) => s.shopId === shopId);
    if (!shop) return false;
    return shop.items.some((item) => item.selected);
  };

  const toggleShopSelect = (shopId: string) => {
    setCartShops((prev) =>
      prev.map((shop) => {
        if (shop.shopId !== shopId) return shop;

        const allSelected = shop.items.every((item) => item.selected);

        return {
          ...shop,
          items: shop.items.map((item) => ({
            ...item,
            selected: !allSelected,
          })),
        };
      }),
    );
  };

  const toggleSelect = (id: string) => {
    setCartShops((prev) =>
      prev.map((shop) => ({
        ...shop,
        items: shop.items.map((item) =>
          item.id === id ? { ...item, selected: !item.selected } : item,
        ),
      })),
    );
  };

  const subtotal = cartShops.reduce(
    (shopSum, shop) =>
      shopSum +
      shop.items
        .filter((item) => item.selected)
        .reduce((itemSum, item) => itemSum + item.price * item.quantity, 0),
    0,
  );

  const discount = cartShops.reduce(
    (shopSum, shop) =>
      shopSum +
      shop.items
        .filter((item) => item.selected)
        .reduce(
          (itemSum, item) =>
            itemSum + (item.oldPrice - item.price) * item.quantity,
          0,
        ),
    0,
  );

  const totalItems = cartShops.reduce(
    (sum, shop) => sum + shop.items.length,
    0,
  );
  const total = subtotal;

  return (
    <div className="cart-page">
      <div className="cart-left">
        <div className="cart-header">
          <h1>Giỏ hàng của bạn</h1>
          <span>({totalItems} sản phẩm)</span>
        </div>

        {cartShops.map((shop) => (
          <div key={shop.shopId} className="cart-shop">
            <div className="cart-shop-header">
              <input
                type="checkbox"
                checked={isShopSelected(shop.shopId)}
                onChange={() => toggleShopSelect(shop.shopId)}
              />
              <Store size={18} />
              <span>{shop.shopName}</span>
            </div>

            {shop.items.map((item) => (
              <CartItem key={item.id} item={item} toggleSelect={toggleSelect} />
            ))}
          </div>
        ))}
      </div>
      <div className="cart-right">
        <CartSummary subtotal={subtotal} discount={discount} total={total} />
      </div>
    </div>
  );
}
