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

export type ShopDocumentRequirement = {
  id: string;
  code: string;
  name: string;
  description?: string;
  required?: boolean;
  multipleFilesAllowed?: boolean;
  sortOrder?: number;
  document?: unknown;
};

export type ShopDocumentRequirementsResponse = {
  shopType?: {
    id?: string;
    code?: string;
    name?: string;
    description?: string;
  };
  requirements: ShopDocumentRequirement[];
};

export type SubmitShopDocumentsPayload = {
  docTypes: string[];
  files: File[];
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

export const fetchShopDocumentRequirements = async (
  shopId: string,
): Promise<ShopDocumentRequirementsResponse> => {
  const response = await authFetch(
    `${BASE_URL}/api/shops/${shopId}/document-requirements`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Khong the lay danh sach giay to can nop");
  }

  const payload = data?.data ?? data;
  return {
    shopType: payload?.shopType,
    requirements: Array.isArray(payload?.requirements)
      ? payload.requirements
      : [],
  };
};

export const submitShopDocuments = async (
  shopId: string,
  payload: SubmitShopDocumentsPayload,
) => {
  const formData = new FormData();
  formData.append("docTypes", payload.docTypes.join(","));
  payload.files.forEach((file) => {
    formData.append("files", file);
  });

  const response = await authFetch(`${BASE_URL}/api/shops/${shopId}/documents`, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Không thể nộp hồ sơ pháp lý của shop");
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
    .map((item: Record<string, unknown>): ShopCategory | null => {
      const id = item.id ?? item.categoryId;
      const name = item.name ?? item.categoryName;

      if (
        (typeof id !== "string" && typeof id !== "number") ||
        typeof name !== "string"
      ) {
        return null;
      }

      return { id, name };
    })
    .filter((item): item is ShopCategory => Boolean(item));
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
