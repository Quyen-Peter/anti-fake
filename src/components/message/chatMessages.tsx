import { useEffect, useRef } from "react";
import type { ChatMessage } from "../../type/message";

type Props = {
  roomId: string;
};

export const mockMessages: ChatMessage[] = [
  {
    id: "msg-1",
    roomId: "17813e50-e0ca-4f8c-bc66-3e6781b0fb58",
    sender: "SHOP",
    content: "Xin chào bạn 👋",
    createdAt: "09:00",
    seen: true,
  },

  {
    id: "msg-2",
    roomId: "17813e50-e0ca-4f8c-bc66-3e6781b0fb58",
    sender: "SHOP",
    content: "Shop có thể hỗ trợ gì cho bạn hôm nay?",
    createdAt: "09:01",
    seen: true,
  },

  {
    id: "msg-3",
    roomId: "17813e50-e0ca-4f8c-bc66-3e6781b0fb58",
    sender: "USER",
    content: "Cho mình hỏi ví da bò sáp màu nâu còn hàng không?",
    createdAt: "09:03",
    seen: true,
  },

  {
    id: "msg-4",
    roomId: "17813e50-e0ca-4f8c-bc66-3e6781b0fb58",
    sender: "SHOP",
    content: "Dạ còn hàng bạn nhé.",
    createdAt: "09:04",
    seen: true,
  },

  {
    id: "msg-5",
    roomId: "17813e50-e0ca-4f8c-bc66-3e6781b0fb58",
    sender: "SHOP",
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600",
    createdAt: "09:05",
    seen: true,
  },

  {
    id: "msg-6",
    roomId: "17813e50-e0ca-4f8c-bc66-3e6781b0fb58",
    sender: "USER",
    content: "Mẫu này đẹp quá 😍",
    createdAt: "09:06",
    seen: true,
  },

  {
    id: "msg-7",
    roomId: "17813e50-e0ca-4f8c-bc66-3e6781b0fb58",
    sender: "SHOP",
    content: "Hiện đang giảm giá còn 450.000đ.",
    createdAt: "09:07",
    seen: true,
  },

  {
    id: "msg-8",
    roomId: "17813e50-e0ca-4f8c-bc66-3e6781b0fb58",
    sender: "USER",
    content: "Mình lấy 1 cái nhé.",
    createdAt: "09:08",
    seen: true,
  },

  {
    id: "msg-9",
    roomId: "17813e50-e0ca-4f8c-bc66-3e6781b0fb58",
    sender: "SHOP",
    content: "Dạ shop đã ghi nhận đơn hàng của bạn.",
    createdAt: "09:09",
    seen: true,
  },

  {
    id: "msg-10",
    roomId: "17813e50-e0ca-4f8c-bc66-3e6781b0fb58",
    sender: "USER",
    content: "Cảm ơn shop ❤️",
    createdAt: "09:10",
    seen: true,
  },

  {
    id: "msg-11",
    roomId: "17813e50-e0ca-4f8c-bc66-3e6781b0fb58",
    sender: "USER",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600",
    createdAt: "09:11",
    seen: false,
  },
];

export default function ChatMessages({ roomId }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [roomId]);

  const messages = mockMessages.filter((msg) => msg.roomId === roomId);

  return (
    <div className="chat-messages">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`chat-message-community ${
            msg.sender === "USER" ? "chat-message-user" : "chat-message-shop"
          }`}
        >
          <div className="chat-bubble">
            {msg.image && <img src={msg.image} alt="" className="chat-image" />}

            {msg.content && <p className="chat-text">{msg.content}</p>}
          </div>

          <div className="chat-meta">
            <span>{msg.createdAt}</span>

            {msg.sender === "USER" && (
              <span>{msg.seen ? "Đã xem" : "Đã gửi"}</span>
            )}
          </div>
        </div>
      ))}

      <div ref={bottomRef} />
    </div>
  );
}
