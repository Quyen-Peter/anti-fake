import { NavLink } from "react-router-dom";
import type { ChatRoom } from "../../type/message";

type Props = {
  room: ChatRoom;
  basePath?: string;
};

export default function MessageRoomCard({ room, basePath = "/chat" }: Props) {
  const latestMessage = room.lastMessage?.[0];

  return (
    <NavLink
      to={`${basePath}/${room.id}`}
      className={({ isActive }) =>
        isActive ? "message-room-card active" : "message-room-card"
      }
    >
      <div className="message-room-avatar">
        <img src="https://i.pravatar.cc/150?img=12" alt={room.chatUserName} />
      </div>

      <div className="message-room-content">
        <div className="message-room-top">
          <div className="message-room-name">
            <span>{room.chatUserName}</span>
          </div>

          <span className="message-room-time">
            {latestMessage
              ? new Date(latestMessage.sentAt).toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : ""}
          </span>
        </div>

        <div className="message-room-bottom">
          <span className="message-room-last-message">
            {latestMessage?.body || "Chưa có tin nhắn"}
          </span>
        </div>
      </div>
    </NavLink>
  );
}
