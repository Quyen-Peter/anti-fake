
import { authFetch, getToken } from "../ultil/auth";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getSocialPosts = async (
  page = 1,
  pageSize = 20
) => {
  const token = getToken();

  const url = `${BASE_URL}/api/social/posts?page=${page}&pageSize=${pageSize}`;

  const response = token
    ? await authFetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      })
    : await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Lấy bài viết thất bại");
  }

  return data;
};


export const getComments = async (
  postId: string,
  page = 1,
  pageSize = 10
) => {
  const response = await authFetch(
    `${BASE_URL}/api/social/posts/${postId}/comments?page=${page}&pageSize=${pageSize}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    }
  );

  const data = await response.json();
  console.log(data);
  if (!response.ok) {
    throw new Error(data as never);
  }

  return data;
};


export const getReplies = async (
  commentId: string,
  page = 1,
  pageSize = 5
) => {
  const response = await authFetch(
    `${BASE_URL}/api/social/comments/${commentId}/replies?page=${page}&pageSize=${pageSize}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Lấy danh sách phản hồi thất bại");
  }

  return data;
};


export const likePost = async (
  postId: string,
  reactionType: "LIKE"
) => {

  const response = await authFetch(
    `${BASE_URL}/api/social/posts/${postId}/reactions`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reactionType,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Thả cảm xúc thất bại");
  }

  return data;
};


export const unLikePost = async (
  postId: string,
  reactionType: "LIKE"
) => {

  const response = await authFetch(
    `${BASE_URL}/api/social/posts/${postId}/reactions`,
    {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reactionType,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Thả cảm xúc thất bại");
  }

  return data;
};

export const createComment = async (
  postId: string,
  body: string
) => {
  const response = await authFetch(
    `${BASE_URL}/api/social/posts/${postId}/comments`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        body,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Đăng bình luận thất bại");
  }

  return data;
};

export const createReply = async (commentId: string, body: string) => {
  const response = await authFetch(
    `${BASE_URL}/api/social/comments/${commentId}/replies`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        body,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Đăng phản hồi thất bại");
  }

  return data;
};
