import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { ChatRealtimeEvent } from "../../hooks/useChatRealtime";
import type { ChatRoom } from "../../type/message";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";

type ChatWindowProps = {
  room: ChatRoom;
  basePath: string;
  realtimeEvent: ChatRealtimeEvent | null;
  typingUserIds: string[];
  connected: boolean;
  error?: string | null;
  onSendMessage: (
    body: string,
    clientMessageId: string,
  ) => Promise<{ thread: unknown; clientMessageId: string } | null>;
  onTyping: (isTyping: boolean) => void;
};

export default function ChatWindow({
  room,
  basePath,
  realtimeEvent,
  typingUserIds,
  connected,
  error,
  onSendMessage,
  onTyping,
}: ChatWindowProps) {
  const navigate = useNavigate();

  return (
    <>
      <div className="chat-header">
        <button className="chat-back-btn" onClick={() => navigate(basePath)}>
          <ArrowLeft size={20} />
        </button>

        <div className="chat-shop-info">
          <img src={room.chatUserAvatar} alt={room.chatUserName} />

          <div>
            <div className="chat-shop-name">
              <span>{room.chatUserName}</span>
            </div>

            <span className="chat-shop-status">Đang trò chuyện</span>
          </div>
        </div>
      </div>

      <MessageList
        roomId={room.id}
        realtimeEvent={realtimeEvent}
        typingUserIds={typingUserIds}
      />
      <MessageInput
        roomId={room.id}
        connected={connected}
        error={error}
        onSendMessage={onSendMessage}
        onTyping={onTyping}
      />
    </>
  );
}
