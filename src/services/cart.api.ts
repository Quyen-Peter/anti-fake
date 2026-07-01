import { authFetch } from "../ultil/auth";
import type {
  CartCheckoutRequest,
  CartCheckoutResponse,
  ShippingOptionsRequest,
  ShippingOptionsResponse,
} from "../type/checkout";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;


export const addToCart = async (
  offerId: string,
  quantity: number
) => {

  const response = await authFetch(
    `${BASE_URL}/api/cart/items`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
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

export const fetchCart = async () => {
  const response = await authFetch(`${BASE_URL}/api/cart`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP Error: ${response.status}`);
  }

  return response.json();
};

export const fetchShippingOptions = async (
  payload: ShippingOptionsRequest,
): Promise<ShippingOptionsResponse> => {
  const response = await authFetch(`${BASE_URL}/api/cart/shipping-options`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Không thể lấy phương thức vận chuyển");
  }

  return {
    options: Array.isArray(data.options) ? data.options : [],
  };
};

export const checkoutCart = async (
  payload: CartCheckoutRequest,
): Promise<CartCheckoutResponse> => {
  const response = await authFetch(`${BASE_URL}/api/cart/checkout`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Khong the tao thanh toan");
  }

  return data;
};


export const updateCartItemQuantity = async (
  cartItemId: string,
  quantity: number,
) => {
  const response = await authFetch(
    `${BASE_URL}/api/cart/items/${cartItemId}`,
    {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
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
) => {
  const response = await authFetch(
    `${BASE_URL}/api/cart/items/${cartItemId}`,
    {
      method: "DELETE",
      headers: {
        Accept: "*/*",
      },
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Xóa sản phẩm thất bại");
  }

  return true;
};
