const BASE_URL = import.meta.env.VITE_API_BASE_URL;

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