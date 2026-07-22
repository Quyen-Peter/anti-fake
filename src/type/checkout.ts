export interface CheckoutItem {
  id: string;
  offerId?: string;
  variantId?: string | null;
  variantSku?: string | null;
  thumbnailUrl: string;
  offerTitleSnapshot: string;
  unitPriceSnapshot: number;
  oldPrice?: number;
  currencySnapshot: string;
  quantity: number;
}

export interface CheckoutShop {
  shopId: string;
  shopName: string;
  items: CheckoutItem[];
}

export interface CartItem extends CheckoutItem {
  offerId: string;
  variantId: string | null;
  variantSku: string | null;
  shopNameSnapshot?: string;
  selected?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartShop {
  shopId: string;
  shopName: string;
  items: CartItem[];
}

export interface CartResponse {
  id: string;
  buyerUserId: string;
  shops: CartShop[];
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
  paymentMethod: "COD" | "PAYOS" | "WALLET";
  shippingOptionCode: string;
  affiliateCode?: string;
  systemVoucherCode?: string;
  shopVouchers?: Array<{ shopId: string; voucherCode: string }>;
  shippingVouchers?: Array<{ shopId: string; voucherCode: string }>;
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
  paymentMethod: "COD" | "PAYOS" | "WALLET";
  shippingOptionCode: string;
  systemVoucherCode?: string;
  shopVoucherCode?: string;
  shippingVoucherCode?: string;
}

export interface CartCheckoutQuote {
  baseAmount: number;
  shippingFeeAmount: number;
  discountAmount: number;
  buyerPayableAmount: number;
  groups: Array<{
    shopId: string;
    baseAmount: number;
    discountAmount: number;
    shippingFeeAmount: number;
    sellerReceivableAmount: number;
  }>;
}
