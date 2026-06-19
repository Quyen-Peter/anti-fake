import { getToken } from "../ultil/auth";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;


export const addToCart = async (
  offerId: string,
  quantity: number
) => {
  const token = getToken();

  const response = await fetch(
    `${BASE_URL}/api/cart/items`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
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

export const fetchCart = async (token: string) => {
  const response = await fetch(`${BASE_URL}/api/cart`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP Error: ${response.status}`);
  }

  return response.json();
};


export const updateCartItemQuantity = async (
  cartItemId: string,
  quantity: number,
  token: string
) => {
  const response = await fetch(
    `${BASE_URL}/api/cart/items/${cartItemId}`,
    {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        quantity,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Cập nhật số lượng thất bại");
  }

  return data;
};


export const deleteCartItem = async (
  cartItemId: string,
  token: string
) => {
  const response = await fetch(
    `${BASE_URL}/api/cart/items/${cartItemId}`,
    {
      method: "DELETE",
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Xóa sản phẩm thất bại");
  }

  return true;
};