import { authFetch } from "../ultil/auth";
import type { Order, OrderDetail, OrderItem } from "../type/order";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

type RawOrderItem = Partial<OrderItem> & {
  offerId?: string;
  productId?: string;
};

type RawOrderShop = {
  id?: string;
  shopId?: string;
  name?: string;
  shopName?: string;
  items?: RawOrderItem[];
};

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
  if (order.firstProduct) return order.firstProduct;

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

const resolveFulfillmentStatus = (value: unknown): string => {
  const order = value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : {};
  const shops = order.shops ?? order.orderShops;
  const shopStatus = Array.isArray(shops)
    ? shops.find(
        (shop) =>
          shop &&
          typeof shop === "object" &&
          "fulfillmentStatus" in shop &&
          shop.fulfillmentStatus,
      )?.fulfillmentStatus
    : undefined;

  return String(
    order.fulfillmentStatus ??
      shopStatus ??
      order.orderStatus ??
      order.status ??
      "PENDING",
  ).toUpperCase();
};

const countOrderItems = (order: any) => {
  if (order.firstProduct) return Number(order.otherProducts ?? 0) + 1;

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
  const firstProduct = order.firstProduct
    ? {
        name: String(order.firstProduct.name ?? "San pham"),
        variant: String(order.firstProduct.variant ?? ""),
        quantity: Number(order.firstProduct.quantity ?? 1),
        price: Number(order.firstProduct.price ?? 0),
        image: String(order.firstProduct.image ?? ""),
      }
    : {
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
      };

  return {
    id: String(order.id ?? order.orderId ?? ""),
    orderCode: String(order.orderCode ?? order.code ?? order.orderId ?? ""),
    status: resolveFulfillmentStatus(order),
    shopName: String(shop.shopName ?? shop.name ?? order.shopName ?? "Shop"),
    totalAmount: Number(
      order.totalAmount ?? order.orderAmount ?? order.paymentAmount ?? 0,
    ),
    paymentMethod: String(order.paymentMethod ?? order.payment?.method ?? ""),
    firstProduct,
    otherProducts: Number(order.otherProducts ?? Math.max(itemCount - 1, 0)),
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

  const orders: Order[] = normalizeItems(data).map(toUserOrder);

  return Promise.all(
    orders.map(async (order) => {
      if (order.status !== "PENDING" || !order.id) return order;

      try {
        const detail = await fetchOrderDetail(order.id);
        return { ...order, status: detail.status };
      } catch {
        return order;
      }
    }),
  );
};

export const fetchOrderDetail = async (orderId: string): Promise<OrderDetail> => {
  const response = await authFetch(`${BASE_URL}/api/orders/${orderId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Khong the tai chi tiet don hang");
  }

  const payload = data?.data ?? data;

  return {
    ...payload,
    id: payload.id ?? payload.orderId,
    status: resolveFulfillmentStatus(payload),
    shops: Array.isArray(payload.shops)
      ? payload.shops.map((shop: RawOrderShop) => ({
          ...shop,
          id: shop.id ?? shop.shopId,
          name: shop.name ?? shop.shopName,
          items: Array.isArray(shop.items)
            ? shop.items.map((item: RawOrderItem) => ({
                ...item,
                offerId: item.offerId ?? item.productId,
                productId: item.productId ?? item.offerId,
              }))
            : [],
        }))
      : [],
    histories: Array.isArray(payload.histories) ? payload.histories : [],
  };
};

export const cancelOrder = async (orderId: string) => {
  const response = await authFetch(`${BASE_URL}/api/orders/${orderId}/cancel`, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.message || "Khong the huy don hang");
  }

  return data;
};

export type FulfillmentStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPING"
  | "DELIVERED"
  | "CANCELLED";

export const updateOrderFulfillment = async (
  orderId: string,
  fulfillmentStatus: FulfillmentStatus,
) => {
  const response = await authFetch(`${BASE_URL}/api/orders/${orderId}/fulfillment`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fulfillmentStatus }),
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.message || "Khong the cap nhat trang thai don hang");
  }

  return data?.data ?? data;
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

export type ShopOrderStatusSummary = {
  totalOrders: number;
  pendingOrders: number;
  shippingOrders: number;
  deliveredOrders: number;
};

type FetchSellerOrdersParams = {
  shopId: string;
  orderStatus?: string;
  page?: number;
  pageSize?: number;
};

const toSellerOrder = (order: any): SellerOrder => ({
  orderId: String(order.orderId ?? order.id ?? ""),
  customer:
    order.customer ??
    ({
      id: order.customerId,
      name:
        order.customerName ??
        order.receiverName ??
        order.buyerName ??
        order.userName,
      email: order.customerEmail ?? order.buyerEmail ?? order.userEmail,
    } satisfies SellerOrderCustomer),
  orderAmount: Number(order.orderAmount ?? order.totalAmount ?? 0),
  orderStatus: resolveFulfillmentStatus(order),
  createdAt: order.createdAt,
  createdDate: order.createdDate,
  orderDate: order.orderDate,
});

export const fetchSellerOrders = async ({
  shopId,
  orderStatus = "all",
  page = 1,
  pageSize = 20,
}: FetchSellerOrdersParams): Promise<SellerOrdersResponse> => {
  const params = new URLSearchParams({
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

  const items = normalizeItems(data).map(toSellerOrder);
  const filteredItems =
    orderStatus && orderStatus !== "all"
      ? items.filter(
          (item: SellerOrder) =>
            item.orderStatus.toLowerCase() === orderStatus.toLowerCase(),
        )
      : items;

  return {
    total:
      orderStatus && orderStatus !== "all"
        ? filteredItems.length
        : Number(data.total ?? data.data?.total ?? filteredItems.length),
    page: Number(data.page ?? page),
    pageSize: Number(data.pageSize ?? pageSize),
    items: filteredItems,
  };
};

export const fetchShopOrderStatusSummary = async (
  shopId: string,
): Promise<ShopOrderStatusSummary> => {
  const response = await authFetch(
    `${BASE_URL}/api/shops/${shopId}/order-status-summary`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Khong the tai thong ke don hang");
  }

  const payload = data?.data ?? data;

  return {
    totalOrders: Number(payload.totalOrders ?? 0),
    pendingOrders: Number(payload.pendingOrders ?? 0),
    shippingOrders: Number(payload.shippingOrders ?? 0),
    deliveredOrders: Number(payload.deliveredOrders ?? payload.completedOrders ?? 0),
  };
};
