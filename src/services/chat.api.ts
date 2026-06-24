
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchChatThreads = async (token: string) => {
  const response = await fetch(
    `${BASE_URL}/api/products/chat/threads`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Không thể lấy danh sách cuộc trò chuyện");
  }
 
  const data = response.json();
  return data;
};

export const fetchThreadMessages = async (
  threadId: string,
  token: string,
  limit = 50
) => {
  const response = await fetch(
    `${BASE_URL}/api/products/chat/threads/${threadId}?limit=${limit}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Không thể lấy tin nhắn");
  }

    const data = response.json();
  return data;
};