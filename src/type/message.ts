interface LastMessage {
  id: string;
  clientMessageId: string | null;
  messageType: string;
  body: string;
  sentAt: string;
}

export interface ChatRoom {
  id: string;
  chatUserID: string;
  chatUserName: string;
  lastMessage: LastMessage[];
  createdAt: string;
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