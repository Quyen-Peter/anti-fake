import { create } from "zustand";
import { fetchCart } from "../services/cart.api";

type CartStore = {
  cartCount: number;
  setCartCount: (count: number) => void;
  refreshCart: () => Promise<void>;
};

export const useCartStore = create<CartStore>((set) => ({
  cartCount: 0,

  setCartCount: (count) =>
    set({
      cartCount: count,
    }),

  refreshCart: async () => {
    try {
      const data = await fetchCart();

      const count = (data.shops || []).reduce(
        (sum: number, shop: any) => sum + shop.items.length,
        0
      );

      set({
        cartCount: count,
      });
    } catch (error) {
      console.error(error);
    }
  },
}));