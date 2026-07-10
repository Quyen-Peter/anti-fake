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

export interface ShippingOption {
  optionCode: string;
  providerCode: string;
  providerName: string;
  methodName: string;
  shippingFee: number;
  estimatedDelivery: string;
}

export interface ShippingOptionsRequest {
  cartItemIds: string[];
}

export interface ShippingOptionsResponse {
  options: ShippingOption[];
}

export interface CartCheckoutRequest {
  cartItemIds: string[];
  paymentMethod: string;
  shippingOptionCode: string;
  affiliateCode?: string;
}

export interface CartCheckoutResponse {
  orderId?: string;
  orderCode?: string | number;
  checkoutUrl?: string;
  paymentLinkId?: string;
}

export type CheckoutSource = "cart" | "buy-now";

export interface BuyNowSelection {
  offerId: string;
  variantId?: string;
  quantity: number;
}

export interface BuyNowPreview extends BuyNowSelection {
  shopId: string;
  shopName: string;
  modelName: string;
  sku?: string;
  price: number;
  thumbnailUrl?: string;
  shippingOptions: ShippingOption[];
}

export interface BuyNowCheckoutRequest extends BuyNowSelection {
  paymentMethod: string;
  shippingOptionCode: string;
}
