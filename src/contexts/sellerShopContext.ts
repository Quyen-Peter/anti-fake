import { createContext, useContext } from "react";
import type { MyShop } from "../services/shop.api";

export type SellerShopContextValue = {
  shop: MyShop;
  shopId: string;
  refreshShop: () => Promise<void>;
};

export const SellerShopContext =
  createContext<SellerShopContextValue | null>(null);

export function useSellerShop() {
  const context = useContext(SellerShopContext);

  if (!context) {
    throw new Error("useSellerShop must be used within SellerShopProvider");
  }

  return context;
}
