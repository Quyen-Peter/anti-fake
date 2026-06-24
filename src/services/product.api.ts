const BASE_URL = import.meta.env.VITE_API_BASE_URL;


interface SearchParams {
  q?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  pageSize?: number;
}

export const fetchOffers = async (page: number, pageSize: number) => {
  try {
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
  } catch (error) {
     throw error;
  }
};

export const fetchOfferDetail = async (id: string) => {
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

  const data = response.json();
  return data;
};

export const searchOffers = async ({
  q,
  categoryId,
  minPrice,
  maxPrice,
  page = 1,
  pageSize = 20,
}: SearchParams = {}) => {
  const params = new URLSearchParams();

  if (q) params.append("q", q);
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
