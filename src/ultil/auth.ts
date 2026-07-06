import { toast } from "sonner";
import { refreshToken } from "../services/auth.api";

const ACCESS_TOKEN_KEY = "accessToken";
const USER_KEY = "user";

export const saveToken = (token: string) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
};

export const getToken = () => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const removeToken = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
};

export const saveUser = (user: any) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getUser = () => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const removeUser = () => {
  localStorage.removeItem(USER_KEY);
};

export const authFetch = async (
  input: RequestInfo,
  init: RequestInit = {}
) => {
  let token = getToken();

  if (!token) {
    throw new Error("Vui long dang nhap");
  }

  let response = await fetch(input, {
    ...init,
    headers: {
      ...init.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status !== 401) {
    return response;
  }

  try {
    token = await refreshToken();

    response = await fetch(input, {
      ...init,
      headers: {
        ...init.headers,
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch {
    removeToken();
    removeUser();
    toast.error("Phien dang nhap da het han");

    if (window.location.pathname !== "/auth") {
      window.location.assign("/auth");
    }

    throw new Error("Phien dang nhap da het han");
  }
};
