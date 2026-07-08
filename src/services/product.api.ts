import { authFetch } from "../ultil/auth";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;


interface SearchParams {
  q?: string;
  shopId?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  pageSize?: number;
}

export type CreateOfferPayload = {
  categoryId: string;
  brandId: string;
  title: string;
  description: string;
  productImages: string[];
  price: number;
  currency: "VND";
  itemCondition: "new" | "used";
  availableQuantity: number;
  gtin: string;
  model: string;
  weightGrams: number;
  lengthCm: number;
  widthCm: number;
  heightCm: number;
};

export type OfferDetail = {
  id: string;
  title: string;
  description?: string | null;
  price?: number;
  currency?: string;
  itemCondition?: string;
  availableQuantity?: number;
  parcelWeightGrams?: number;
  parcelLengthCm?: number;
  parcelWidthCm?: number;
  parcelHeightCm?: number;
  soldQuantity?: number;
  verificationLevel?: string;
  offerStatus?: string;
  moderationStatus?: string;
  moderationReason?: string | null;
  categoryId?: string;
  brandId?: string;
  gtin?: number | string;
  verificationPolicy?: string;
  distributionNodeId?: string;
  distributionNetworkId?: string;
  categoryName?: string;
  productModelName?: string;
  thumbnailUrl?: string | null;
  imageUrls?: string[];
  createdAt?: string;
};

export const createOffer = async (payload: CreateOfferPayload) => {
  const response = await authFetch(`${BASE_URL}/api/offers`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Khong the tao san pham moi");
  }

  return data?.data ?? data;
};

export const fetchOffers = async (page: number, pageSize: number) => {
  const response = await fetch(
    `${BASE_URL}/api/offers?page=${page}&pageSize=${pageSize}`,
    {
      method: "GET",
      headers: {
        accept: "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const data = await response.json();
  return data;
};

export const fetchOfferDetail = async (id: string): Promise<OfferDetail> => {
  const response = await fetch(
    `${BASE_URL}/api/offers/${id}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Không thể lấy chi tiết sản phẩm");
  }

  const data = await response.json();
  return data?.data ?? data;
};

export const searchOffers = async ({
  q,
  shopId,
  categoryId,
  minPrice,
  maxPrice,
  page = 1,
  pageSize = 20,
}: SearchParams = {}) => {
  const params = new URLSearchParams();

  if (q) params.append("q", q);
  if (shopId) params.append("shopId", shopId);
  if (categoryId) params.append("categoryId", categoryId);
  if (minPrice !== undefined)
    params.append("minPrice", String(minPrice));
  if (maxPrice !== undefined)
    params.append("maxPrice", String(maxPrice));

  params.append("page", String(page));
  params.append("pageSize", String(pageSize));

  const response = await fetch(
    `${BASE_URL}/api/offers?${params.toString()}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Không thể tải danh sách sản phẩm");
  }
  const data = response.json()
  return data;
};
