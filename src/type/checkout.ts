export interface CheckoutItem {
  id: string;
  thumbnailUrl: string;
  offerTitleSnapshot: string;
  unitPriceSnapshot: number;
  currencySnapshot: string;
  quantity: number;
}

export interface CheckoutShop {
  shopId: string;
  shopName: string;
  items: CheckoutItem[];
}