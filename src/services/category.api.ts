const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchCategories = async () => {
  const response = await fetch(
    `${BASE_URL}/api/products/categories`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    }
  );

  

  if (!response.ok) {
    throw new Error("Lấy danh mục thất bại");
  }
  const data = await response.json();
  return data;

};