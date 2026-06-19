import { isAuthenticated } from "../ultil/auth";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;


export const addToCart = async (
  offerId: string,
  quantity: number
) => {
  const token = isAuthenticated();

  const response = await fetch(
    `${BASE_URL}/api/orders/cart/items`,
    {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        offerId,
        quantity,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Không thể thêm vào giỏ hàng");
  }

  return await response.json();
};