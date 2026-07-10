import { io } from "socket.io-client";
import { getToken } from "../ultil/auth";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const socket = io(
  `${BASE_URL}`,
  {
    path: '/api/socket.io',
    autoConnect: false,
    transports: [
      "websocket",
      "polling",
    ],
  }
);

export const connectSocket = (accessToken?: string) => {
  const token = accessToken || getToken();

  if (!token) {
    socket.disconnect();
    return socket;
  }

  const shouldReconnect = Boolean(accessToken && socket.connected);
  if (shouldReconnect) {
    socket.disconnect();
  }

  socket.auth = {
    accessToken: token,
  };

  if (!socket.connected) {
    socket.connect();
  }

  return socket;
};
