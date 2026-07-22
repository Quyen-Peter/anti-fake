import { authFetch } from "../ultil/auth";
import type {
  CartCheckoutRequest,
  CartCheckoutResponse,
  CartCheckoutQuote,
  CartResponse,
  ShippingOptionsRequest,
  ShippingOptionsResponse,
} from "../type/checkout";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const pickCheckoutValue = (
  data: any,
  key: "orderId" | "orderCode" | "checkoutUrl" | "paymentLinkId",
) =>
  data?.[key] ??
  data?.data?.[key] ??
  data?.order?.[key] ??
  data?.data?.order?.[key] ??
  data?.orders?.[0]?.[key] ??
  data?.data?.orders?.[0]?.[key];

const getApiErrorMessage = async (response: Response, fallback: string) => {
  const text = await response.text();
  if (!text) return fallback;

  try {
    const data = JSON.parse(text);
    return data?.message ?? data?.error ?? fallback;
  } catch {
    return text;
  }
};

export const addToCart = async (
  offerId: string,
  quantity: number,
  variantId?: string,
) => {
  const response = await authFetch(`${BASE_URL}/api/cart/items`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      offerId,
      quantity,
      ...(variantId ? { variantId } : {}),
    }),
  });

  if (!response.ok) {
    throw new Error(
      await getApiErrorMessage(response, "Không thể thêm vào giỏ hàng"),
    );
  }

  return response.json();
};

export const fetchCart = async (): Promise<CartResponse> => {
  const response = await authFetch(`${BASE_URL}/api/cart`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      await getApiErrorMessage(response, `HTTP Error: ${response.status}`),
    );
  }

  const data = await response.json();
  return data?.data ?? data;
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
    throw new Error(data.message || "Không thể tạo thanh toán");
  }

  const checkout = {
    ...data,
    orderId: pickCheckoutValue(data, "orderId") ?? data?.id ?? data?.data?.id,
    orderCode:
      pickCheckoutValue(data, "orderCode") ?? data?.code ?? data?.data?.code,
    checkoutUrl: pickCheckoutValue(data, "checkoutUrl") ?? data?.paymentUrl,
    paymentLinkId: pickCheckoutValue(data, "paymentLinkId"),
  };

  if (payload.paymentMethod === "PAYOS" && !checkout.paymentLinkId) {
    throw new Error("API checkout PAYOS thiếu paymentLinkId");
  }

  return checkout;
};

export const quoteCartCheckout = async (payload: Omit<CartCheckoutRequest, "paymentMethod" | "affiliateCode">): Promise<CartCheckoutQuote> => {
  const response = await authFetch(`${BASE_URL}/api/cart/checkout/quote`, {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Không thể tính báo giá checkout");
  return data?.data ?? data;
};

export const updateCartItemQuantity = async (
  cartItemId: string,
  quantity: number,
) => {
  const response = await authFetch(`${BASE_URL}/api/cart/items/${cartItemId}`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      quantity,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Cập nhật số lượng thất bại");
  }

  return data;
};

export const deleteCartItem = async (cartItemId: string) => {
  const response = await authFetch(`${BASE_URL}/api/cart/items/${cartItemId}`, {
    method: "DELETE",
    headers: {
      Accept: "*/*",
    },
  });

  if (!response.ok) {
    throw new Error(
      await getApiErrorMessage(response, "Xóa sản phẩm thất bại"),
    );
  }

  return true;
};
