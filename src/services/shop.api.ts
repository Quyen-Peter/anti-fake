import { authFetch } from "../ultil/auth";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export type CreateShopPayload = {
  shopName: string;
  registrationType: string;
  taxCode: string;
  businessType: string;
  categoryIds: string[];
};

export type ShopCategory = {
  id: string | number;
  name: string;
};

export type ShopOffer = {
  id: string;
  title: string;
  price?: number;
  currency?: string;
  salesMode?: string;
  minWholesaleQty?: number;
  availableQuantity?: number;
  soldQuantity?: number;
  verificationLevel?: string;
  offerStatus?: string;
  categoryId?: string;
  brandId?: string;
  thumbnailUrl?: string;
  createdAt?: string;
};

export type ShopOffersResponse = {
  total: number;
  page: number;
  pageSize: number;
  items: ShopOffer[];
};

export type ShopSummaryMetric = {
  value: number;
  growthPercent: number;
};

export type ShopSummaryMetricsResponse = {
  range?: {
    from?: string;
    to?: string;
    days?: number;
  };
  revenue?: ShopSummaryMetric;
  orders?: ShopSummaryMetric;
  offers?: ShopSummaryMetric;
};

export type ShopBestSellingProduct = {
  id: string;
  title: string;
  price: number;
  currency?: string;
  availableQuantity?: number;
  soldQuantity?: number;
  verificationLevel?: string;
  offerStatus?: string;
  salesMode?: string;
  thumbnailUrl?: string;
  createdAt?: string;
};

export type UpdateShopProfilePayload = {
  shopName: string;
  businessType: string;
  taxCode: string;
  warehouseAddress: string;
  warehouseProvinceCode: string;
  warehouseProvinceName: string;
  warehouseWardCode: string;
  warehouseWardName: string;
};

export const fetchShops = async (
  page: number,
  pageSize: number,
) => {
  try {
    const response = await fetch(
      `${BASE_URL}/api/shops?page=${page}&pageSize=${pageSize}`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
  
    const data =   await response.json()
    return data;
  } catch (error) {
    throw error;
  }
};

export const fetchShopByOffer = async (offerId: string) => {
  const response = await fetch(
    `${BASE_URL}/api/shops/by-offer/${offerId}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Không thể lấy thông tin shop");
  }
  const data =  await response.json()
    return data;
};

export const getShopDetail = async (
  shopId: string
) => {
  const response = await fetch(
    `${BASE_URL}/api/shops/${shopId}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Lấy thông tin cửa hàng thất bại");
  }

  return data;
};

export const getMyShop = async () => {
  const response = await authFetch(`${BASE_URL}/api/shops/mine`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  if (response.status === 204 || response.status === 404) {
    return null;
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Không thể lấy thông tin cửa hàng");
  }

  return data;
};

export const updateShopProfile = async (
  shopId: string,
  payload: UpdateShopProfilePayload,
) => {
  const response = await authFetch(`${BASE_URL}/api/shops/${shopId}/profile`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Khong the cap nhat thong tin cua hang");
  }

  return data;
};

export const createShop = async (payload: CreateShopPayload) => {
  const response = await authFetch(`${BASE_URL}/api/shops`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Đăng ký cửa hàng thất bại");
  }

  return data;
};

export const fetchShopCategories = async (shopId: string) => {
  const response = await fetch(`${BASE_URL}/api/shops/${shopId}/categories`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Không thể lấy danh mục của cửa hàng");
  }

  const payload = data?.data ?? data?.items ?? data;
  if (!Array.isArray(payload)) return [];

  return payload
    .map((item: any) => ({
      id: item.id ?? item.categoryId,
      name: item.name ?? item.categoryName,
    }))
    .filter((item: ShopCategory) => item.id && item.name);
};


export const fetchShopOffers = async (
  shopId: string,
  page = 1,
  pageSize = 20,
): Promise<ShopOffersResponse> => {
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });

  const response = await authFetch(
    `${BASE_URL}/api/shops/${shopId}/offers?${params.toString()}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Khong the lay danh sach san pham");
  }

  return {
    total: Number(data.total ?? 0),
    page: Number(data.page ?? page),
    pageSize: Number(data.pageSize ?? pageSize),
    items: Array.isArray(data.items) ? data.items : [],
  };
};


export const getShopSummaryMetrics = async (
  shopId: string,
  from: string,
  to: string
): Promise<ShopSummaryMetricsResponse> => {
  const params = new URLSearchParams({ from, to });

  const response = await authFetch(
    `${BASE_URL}/api/shops/${shopId}/summary-metrics?${params.toString()}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Lấy thống kê thất bại");
  }

  return data;
};

export const fetchShopBestSellingProducts = async (
  shopId: string,
  limit = 10,
): Promise<ShopBestSellingProduct[]> => {
  const params = new URLSearchParams({ limit: String(limit) });

  const response = await fetch(
    `${BASE_URL}/api/shops/${shopId}/best-selling-products?${params.toString()}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Khong the lay san pham ban chay");
  }

  const payload = data?.data ?? data?.items ?? data;
  return Array.isArray(payload) ? payload : [];
};
