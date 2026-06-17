export interface MessageRoom {
  id: string;
  shopId: string;
  shopName: string;
  avatar: string;
  isVerified: boolean;
  isOnline: boolean;
  lastMessage: string;
  lastTime: string;
  unreadCount: number;
}

export interface ChatMessage {
  id: string;
  roomId: string;
  sender: "USER" | "SHOP";
  content?: string;
  image?: string;
  createdAt: string;
  seen: boolean;
}