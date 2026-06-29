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
