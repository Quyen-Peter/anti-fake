import { useEffect, useState } from "react";
import { Store } from "lucide-react";

import CartItem from "../../components/cart/cartItem";
import CartSummary from "../../components/cart/cartSummary";

import "../../css/pages/cart.css";

import {
  deleteCartItem,
  fetchCart,
  updateCartItemQuantity,
} from "../../services/cart.api";
import { getToken } from "../../ultil/auth";
import { toast } from "sonner";

export default function CartPage() {
  const [cartShops, setCartShops] = useState<any[]>([]);

  useEffect(() => {
    const loadCart = async () => {
      try {
        const token = getToken();

        if (!token) return;

        const data = await fetchCart(token);

        setCartShops(
          (data.shops || []).map((shop: any) => ({
            ...shop,
            items: shop.items.map((item: any) => ({
              ...item,
              selected: false,
            })),
          })),
        );
      } catch (error) {
        console.error(error);
      }
    };

    loadCart();
  }, []);

  const handleQuantityChange = async (itemId: string, quantity: number) => {
    try {
      const token = getToken();

      if (!token) return;

      if (quantity < 1) return;

      await updateCartItemQuantity(itemId, quantity, token);

      setCartShops((prev) =>
        prev.map((shop) => ({
          ...shop,
          items: shop.items.map((item: any) =>
            item.id === itemId
              ? {
                  ...item,
                  quantity,
                }
              : item,
          ),
        })),
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      const token = getToken();

      if (!token) {
        return;
      }

      await deleteCartItem(itemId, token);

      setCartShops((prev) =>
        prev
          .map((shop) => ({
            ...shop,
            items: shop.items.filter((item: any) => item.id !== itemId),
          }))
          .filter((shop) => shop.items.length > 0),
      );
    } catch (error) {
      console.error(error);
      toast.error("Xóa thất bại!");
    }
  };

  const isShopSelected = (shopId: string) => {
    const shop = cartShops.find((s) => s.shopId === shopId);

    if (!shop) return false;

    return shop.items.some((item: any) => item.selected);
  };

  const toggleShopSelect = (shopId: string) => {
    setCartShops((prev) =>
      prev.map((shop) => {
        if (shop.shopId !== shopId) return shop;

        const allSelected = shop.items.every((item: any) => item.selected);

        return {
          ...shop,
          items: shop.items.map((item: any) => ({
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
        items: shop.items.map((item: any) =>
          item.id === id
            ? {
                ...item,
                selected: !item.selected,
              }
            : item,
        ),
      })),
    );
  };

  const subtotal = cartShops.reduce(
    (shopSum, shop) =>
      shopSum +
      shop.items
        .filter((item: any) => item.selected)
        .reduce(
          (itemSum: number, item: any) =>
            itemSum + item.unitPriceSnapshot * item.quantity,
          0,
        ),
    0,
  );

  const discount = 0;

  const total = subtotal - discount;

  const totalItems = cartShops.reduce(
    (sum, shop) => sum + shop.items.length,
    0,
  );

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

            {shop.items.map((item: any) => (
              <CartItem
                key={item.id}
                item={item}
                toggleSelect={toggleSelect}
                onQuantityChange={handleQuantityChange}
                onDelete={handleDeleteItem}
              />
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
