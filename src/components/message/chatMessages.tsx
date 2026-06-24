import { useEffect, useRef, useState } from "react";
import type { ChatRealtimeEvent } from "../../hooks/useChatRealtime";
import type { ChatMessage } from "../../type/message";
import { getChatMessages } from "../../services/chat.api";
import { getUser } from "../../ultil/auth";

type RawMessage = {
  id?: string;
  senderUserId?: string;
  body?: string;
  sentAt?: string;
  createdAt?: string;
};

type Props = {
  roomId: string;
  realtimeEvent?: ChatRealtimeEvent | null;
  typingUserIds?: string[];
};

const formatTime = (value?: string) =>
  new Date(value || Date.now()).toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });

const mapMessage = (
  msg: RawMessage,
  roomId: string,
  currentUserId?: string
): ChatMessage | null => {
  if (!msg.id) return null;

  return {
    id: msg.id,
    roomId,
    sender: msg.senderUserId === currentUserId ? "USER" : "SHOP",
    content: msg.body,
    createdAt: formatTime(msg.sentAt || msg.createdAt),
    seen: true,
  };
};

export default function ChatMessages({
  roomId,
  realtimeEvent,
  typingUserIds = [],
}: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!roomId) return;

    const loadMessages = async () => {
      try {
        setLoading(true);

        const user = getUser();
        const data = await getChatMessages(roomId);

        const mappedMessages: ChatMessage[] = data.messages
          .map((msg: RawMessage) => mapMessage(msg, data.id, user?.id))
          .filter(Boolean);

        setMessages(mappedMessages);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [roomId]);

  useEffect(() => {
    if (!realtimeEvent?.message) return;

    const eventRoomId = realtimeEvent.threadId || realtimeEvent.roomId;
    if (eventRoomId !== roomId) return;

    const user = getUser();
    const newMessage = mapMessage(
      realtimeEvent.message as RawMessage,
      roomId,
      user?.id
    );

    if (!newMessage) return;

    setMessages((current) => {
      if (current.some((message) => message.id === newMessage.id)) {
        return current;
      }

      return [...current, newMessage];
    });
  }, [realtimeEvent, roomId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages.length, typingUserIds.length]);

  if (loading) {
    return <div className="chat-messages" />;
  }

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

      {typingUserIds.length > 0 && (
        <div className="chat-message-community chat-message-shop">
          <div className="chat-bubble">
            <p className="chat-text">Dang go...</p>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
