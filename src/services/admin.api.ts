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
