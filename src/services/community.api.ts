import { authFetch } from "../ultil/auth";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getSocialPosts = async (
  page = 1,
  pageSize = 20
) => {

  const response = await authFetch(
    `${BASE_URL}/api/social/posts?page=${page}&pageSize=${pageSize}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Lấy bài viết thất bại");
  }

  return data;
};