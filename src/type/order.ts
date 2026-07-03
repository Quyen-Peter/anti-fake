export type Order = {
  id: string;
  orderCode: string;
  status: string;
  shopName: string;
  totalAmount: number;
  paymentMethod: string;
  firstProduct: {
    name: string;
    variant: string;
    quantity: number;
    price: number;
    image: string;
  };
  otherProducts: number;
};


export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPING"
  | "COMPLETED"
  | "CANCELLED";

export type PaymentMethod =
  | "COD"
  | "PAYOS"
  | "VNPay"
  | "Momo"
  | "ZaloPay"
  | "BankTransfer";

export interface OrderHistory {
  status: OrderStatus;
  description: string;
  createdAt: string;
}


export interface OrderItem {
  id: string;
  offerId?: string;
  productId: string;
  productName: string;
  thumbnailUrl: string;
  variantName?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface OrderShop {
  id?: string;
  name?: string;
  shopId?: string;
  shopName?: string;
  fulfillmentStatus?: string;
  items: OrderItem[];
}

export interface OrderDetail {
  id: string;
  orderCode: string;
  status: OrderStatus | string;
  createdAt: string;

  receiverName: string;
  receiverPhone: string;
  shippingAddress: string;

  carrier?: string;
  trackingCode?: string;
  shippingMethod?: string;
  estimatedDelivery?: string;

  paymentMethod: PaymentMethod;
  paymentStatus?: string;

  subtotal: number;
  discount: number;
  shippingFee: number;
  totalAmount: number;

  note?: string;

  histories: OrderHistory[];

  shops: OrderShop[];
}
