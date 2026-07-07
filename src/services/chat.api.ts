import { authFetch } from "../ultil/auth";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchChatThreads = async () => {
  const response = await authFetch(
    `${BASE_URL}/api/chat/threads`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Không thể lấy danh sách cuộc trò chuyện");
  }
 
  const data = response.json();
  return data;
};


export const getChatMessages = async (
  threadId: string,
  limit = 20
) => {

  const response = await authFetch(
    `${BASE_URL}/api/chat/threads/${threadId}?limit=${limit}`,
    {
      method: "GET",
      headers: {
        accept: "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Không thể lấy tin nhắn");
  }

  return await response.json();
};


export const getShopChatThread = async (
  shopId: string,
) => {
  const response = await authFetch(
    `${BASE_URL}/api/shops/${shopId}/chat-thread`,
    {
      method: "POST",
      headers: {
        accept: "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Không thể lấy danh sách chat");
  }

  const data = await response.json();
  return data;
};




export const sendMessage = async (
  threadId: string,
  body: string,
  clientMessageId = crypto.randomUUID()
) => {

  const response = await authFetch(
    `${BASE_URL}/api/chat/threads/${threadId}/messages`,
    {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        body,
        clientMessageId,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Không thể gửi tin nhắn");
  }

  return await response.json();
};
