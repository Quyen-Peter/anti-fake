import { authFetch } from "../ultil/auth";
import type { Order } from "../type/order";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const normalizeItems = (data: any) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.orders)) return data.orders;
  if (Array.isArray(data?.data?.items)) return data.data.items;
  if (Array.isArray(data?.data?.orders)) return data.data.orders;
  return [];
};

const firstOrderItem = (order: any) => {
  const rootItems = order.items ?? order.orderItems;
  if (Array.isArray(rootItems) && rootItems.length > 0) return rootItems[0];

  const shops = order.shops ?? order.orderShops;
  if (Array.isArray(shops)) {
    for (const shop of shops) {
      const items = shop.items ?? shop.orderItems;
      if (Array.isArray(items) && items.length > 0) return items[0];
    }
  }

  return {};
};

const firstShop = (order: any) => {
  const shops = order.shops ?? order.orderShops;
  if (Array.isArray(shops) && shops.length > 0) return shops[0];
  return order.shop ?? {};
};

const countOrderItems = (order: any) => {
  const rootItems = order.items ?? order.orderItems;
  if (Array.isArray(rootItems)) return rootItems.length;

  const shops = order.shops ?? order.orderShops;
  if (!Array.isArray(shops)) return firstOrderItem(order)?.id ? 1 : 0;

  return shops.reduce((sum: number, shop: any) => {
    const items = shop.items ?? shop.orderItems;
    return sum + (Array.isArray(items) ? items.length : 0);
  }, 0);
};

const toUserOrder = (order: any): Order => {
  const item = firstOrderItem(order);
  const shop = firstShop(order);
  const itemCount = countOrderItems(order);

  return {
    id: String(order.id ?? order.orderId ?? ""),
    orderCode: String(order.orderCode ?? order.code ?? order.orderId ?? ""),
    status: String(order.status ?? order.orderStatus ?? "PENDING"),
    shopName: String(shop.shopName ?? shop.name ?? order.shopName ?? "Shop"),
    totalAmount: Number(
      order.totalAmount ?? order.orderAmount ?? order.paymentAmount ?? 0,
    ),
    paymentMethod: String(order.paymentMethod ?? order.payment?.method ?? ""),
    firstProduct: {
      name: String(
        item.name ??
          item.productName ??
          item.offerTitleSnapshot ??
          item.offerTitle ??
          "San pham",
      ),
      variant: String(item.variantName ?? item.variant ?? ""),
      quantity: Number(item.quantity ?? 1),
      price: Number(item.price ?? item.unitPrice ?? item.totalPrice ?? 0),
      image: String(item.image ?? item.thumbnailUrl ?? item.thumbnail ?? ""),
    },
    otherProducts: Math.max(itemCount - 1, 0),
  };
};

export const fetchMyOrders = async (): Promise<Order[]> => {
  const response = await authFetch(`${BASE_URL}/api/orders/mine`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Khong the tai danh sach don hang");
  }

  return normalizeItems(data).map(toUserOrder);
};

export type SellerOrderCustomer = {
  id?: string;
  name?: string;
  email?: string;
};

export type SellerOrder = {
  orderId: string;
  customer?: SellerOrderCustomer;
  orderAmount?: number;
  orderStatus: string;
  createdAt?: string;
  createdDate?: string;
  orderDate?: string;
};

export type SellerOrdersResponse = {
  total: number;
  page: number;
  pageSize: number;
  items: SellerOrder[];
};

type FetchSellerOrdersParams = {
  shopId: string;
  orderStatus?: string;
  page?: number;
  pageSize?: number;
};

export const fetchSellerOrders = async ({
  shopId,
  orderStatus = "all",
  page = 1,
  pageSize = 20,
}: FetchSellerOrdersParams): Promise<SellerOrdersResponse> => {
  const params = new URLSearchParams({
    orderStatus,
    page: String(page),
    pageSize: String(pageSize),
  });

  const response = await authFetch(
    `${BASE_URL}/api/orders/seller/shops/${shopId}?${params.toString()}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Khong the tai danh sach don hang");
  }

  const items = Array.isArray(data)
    ? data
    : Array.isArray(data.items)
      ? data.items
      : [];

  return {
    total: Number(data.total ?? items.length),
    page: Number(data.page ?? page),
    pageSize: Number(data.pageSize ?? pageSize),
    items,
  };
};
