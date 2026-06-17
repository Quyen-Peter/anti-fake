import { MessageCircleMore } from "lucide-react";

export default function EmptyChat() {
  return (
    <div className="empty-chat">
      <MessageCircleMore size={80} />

      <h2>Chưa chọn cuộc trò chuyện</h2>

      <p>
        Chọn một cuộc trò chuyện ở bên trái để bắt đầu nhắn tin.
      </p>
    </div>
  );
}