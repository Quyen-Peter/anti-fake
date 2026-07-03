import { authFetch } from "../ultil/auth";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export type CreateOfferReviewPayload = {
  rating: number;
  comment: string;
};

export const fetchOfferReviews = async (
  offerId: string
) => {
  const response = await fetch(
    `${BASE_URL}/api/offers/${offerId}/reviews`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Lấy đánh giá thất bại");
  }
 const data = response.json();
  return data;
};

export const createOfferReview = async (
  offerId: string,
  payload: CreateOfferReviewPayload,
) => {
  const response = await authFetch(
    `${BASE_URL}/api/offers/${offerId}/reviews`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.message || "Danh gia san pham that bai");
  }

  return data;
};
