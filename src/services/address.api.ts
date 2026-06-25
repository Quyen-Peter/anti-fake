import type { CreateAddressRequest, UpdateAddressRequest } from "../type/address";
import { getToken } from "../ultil/auth";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getUserAddresses = async () => {
  const token = getToken();

  const response = await fetch(
    `${BASE_URL}/api/user/addresses`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Lấy danh sách địa chỉ thất bại");
  }

  return data;
};



export const createAddress = async (
  payload: CreateAddressRequest
) => {
  const response = await fetch(
    `${BASE_URL}/api/user/addresses`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(payload),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Tạo địa chỉ thất bại");
  }

  return data;
};


export const setDefaultAddress = async (addressId: string) => {
  const token = getToken();

  const response = await fetch(
    `${BASE_URL}/api/user/addresses/${addressId}/default`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Đặt địa chỉ mặc định thất bại");
  }

  return data;
};


export const deleteAddress = async (addressId: string) => {
  try {
    const response = await fetch(
    `${BASE_URL}/api/user/addresses/${addressId}`,
    {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Xóa địa chỉ thất bại");
    }

    return true;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateAddress = async (
  id: string,
  payload: UpdateAddressRequest
) => {
  const token = getToken();

  const response = await fetch(
    `${BASE_URL}/api/user/addresses/${id}`,
    {
      method: "PATCH", 
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Cập nhật địa chỉ thất bại");
  }

  return data;
};