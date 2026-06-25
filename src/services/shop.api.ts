const BASE_URL = import.meta.env.VITE_API_BASE_URL;

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