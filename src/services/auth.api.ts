import { removeToken, removeUser, saveToken, saveUser } from "../ultil/auth";
import { connectSocket } from "./socket";

export interface RegisterRequest {
  email: string;
  phone: string;
  displayName: string;
  password: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    phone: string;
    displayName: string;
    role: string;
    accountStatus: string;
    createdAt: string;
    updatedAt: string;
  };
}


const BASE_URL = import.meta.env.VITE_API_BASE_URL;



export const login = async (
  payload: LoginRequest
): Promise<LoginResponse> => {
  const response = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Đăng nhập thất bại");
  }

  connectSocket(data.accessToken);
  return data;
};

export const register = async (
  payload: RegisterRequest
) => {
  const response = await fetch(
    `${BASE_URL}/api/auth/register`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Đăng ký thất bại"
    );
  }

  return data;
};


export const logout = () => {
  removeToken();
  removeUser();
  connectSocket().disconnect();
  window.location.href = "/";
};


export const refreshToken = async () => {
  const response = await fetch(`${BASE_URL}/api/auth/refresh`, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
    credentials: "include",
  });


  const data = await response.json();


  if (!response.ok) {
    logout();
    throw new Error(data.message || "Làm mới token thất bại");
  }

  saveToken(data.accessToken);
  saveUser(data.user);

  return data.accessToken;
};