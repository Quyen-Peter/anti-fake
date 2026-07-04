import { authFetch } from "../ultil/auth";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export type AdminUser = {
  id: string;
  email: string;
  phone?: string | null;
  displayName?: string | null;
  address?: string | null;
  defaultAddress?: string | null;
  role?: string;
  accountStatus?: string;
  createdAt?: string;
  updatedAt?: string;
  avatar?: string | null;
  avatarUrl?: string | null;
  shopName?: string | null;
  shop?: {
    shopName?: string | null;
  } | null;
  shops?: Array<{
    shopName?: string | null;
  }>;
};

export type AdminShopRegistrationOwner = {
  id: string;
  displayName?: string | null;
  email?: string | null;
};

export type AdminShopRegistration = {
  id: string;
  shopName: string;
  owner?: AdminShopRegistrationOwner | null;
  businessType?: string | null;
  registrationType?: string | null;
  avatar?: string | null;
  createdAt?: string;
  shopStatus?: string;
};

export type FetchAdminShopRegistrationsParams = {
  shopStatus?: string;
  registrationType?: string;
  search?: string;
  page?: number;
  pageSize?: number;
};

export type AdminShopRegistrationsResponse = {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  items: AdminShopRegistration[];
};

export type AdminOffer = {
  id: string;
  title: string;
  thumbnail?: string | null;
  price?: number;
  currency?: string;
  shop?: {
    id?: string;
    name?: string;
  } | null;
  category?: {
    id?: string;
    name?: string;
  } | null;
  verificationLevel?: string;
  offerStatus?: string;
  moderationStatus?: string;
  createdAt?: string;
};

export type FetchAdminOffersParams = {
  offerStatus?: string;
  moderationStatus?: string;
  page?: number;
  pageSize?: number;
};

export type AdminOffersResponse = {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  items: AdminOffer[];
};

export const fetchAdminUsers = async (role?: string): Promise<AdminUser[]> => {
  const params = new URLSearchParams();
  if (role) params.set("role", role);

  const query = params.toString();
  const response = await authFetch(
    `${BASE_URL}/api/admin/users${query ? `?${query}` : ""}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Không thể lấy danh sách người dùng");
  }

  const payload = data?.data ?? data?.items ?? data;
  return Array.isArray(payload) ? payload : [];
};

export const banAdminUser = async (id: string): Promise<AdminUser> => {
  const response = await authFetch(`${BASE_URL}/api/admin/users/${id}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Khong the khoa nguoi dung");
  }

  return data?.data ?? data;
};

export const fetchAdminShopRegistrations = async (
  params: FetchAdminShopRegistrationsParams = {},
): Promise<AdminShopRegistrationsResponse> => {
  const query = new URLSearchParams();
  if (params.shopStatus) query.set("shopStatus", params.shopStatus);
  if (params.registrationType) {
    query.set("registrationType", params.registrationType);
  }
  if (params.search) query.set("search", params.search);
  query.set("page", String(params.page ?? 1));
  query.set("pageSize", String(params.pageSize ?? 10));

  const response = await authFetch(
    `${BASE_URL}/api/shops/admin/list-shop?${query.toString()}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Khong the lay danh sach shop");
  }

  const payload = data?.data ?? data;
  return {
    page: Number(payload?.page ?? params.page ?? 1),
    pageSize: Number(payload?.pageSize ?? params.pageSize ?? 10),
    totalItems: Number(payload?.totalItems ?? 0),
    totalPages: Number(payload?.totalPages ?? 1),
    items: Array.isArray(payload?.items) ? payload.items : [],
  };
};

export const fetchAdminOffers = async (
  params: FetchAdminOffersParams = {},
): Promise<AdminOffersResponse> => {
  const query = new URLSearchParams();
  if (params.offerStatus) query.set("offerStatus", params.offerStatus);
  if (params.moderationStatus) {
    query.set("moderationStatus", params.moderationStatus);
  }
  query.set("page", String(params.page ?? 1));
  query.set("pageSize", String(params.pageSize ?? 10));

  const response = await authFetch(
    `${BASE_URL}/api/offers/admin/list-offer?${query.toString()}`,
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

  const payload = data?.data ?? data;
  return {
    page: Number(payload?.page ?? params.page ?? 1),
    pageSize: Number(payload?.pageSize ?? params.pageSize ?? 10),
    totalItems: Number(payload?.totalItems ?? 0),
    totalPages: Number(payload?.totalPages ?? 1),
    items: Array.isArray(payload?.items) ? payload.items : [],
  };
};
