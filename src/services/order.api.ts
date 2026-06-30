import { authFetch } from "../ultil/auth";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

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

  return {
    total: Number(data.total ?? 0),
    page: Number(data.page ?? page),
    pageSize: Number(data.pageSize ?? pageSize),
    items: Array.isArray(data.items) ? data.items : [],
  };
};
