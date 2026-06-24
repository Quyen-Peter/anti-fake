import { NavLink } from "react-router-dom";
import type { ChatRoom } from "../../type/message";

type Props = {
  room: ChatRoom;
};

export default function MessageRoomCard({ room }: Props) {
  const latestMessage = room.lastMessage?.[0];

  return (
    <NavLink
      to={`/messages/${room.id}`}
      className={({ isActive }) =>
        isActive
          ? "message-room-card active"
          : "message-room-card"
      }
    >
      <div className="message-room-avatar">
        {/* TODO: Backend chưa trả avatar */}
        <img
          src="https://i.pravatar.cc/150?img=12"
          alt={room.chatUserName}
        />

        {/* TODO: Backend chưa trả trạng thái online */}
        {/* {room.isOnline && (
          <span className="online-dot" />
        )} */}
      </div>

      <div className="message-room-content">
        <div className="message-room-top">
          <div className="message-room-name">
            <span>{room.chatUserName}</span>

            {/* TODO: Backend chưa trả verified */}
            {/* {room.isVerified && (
              <BadgeCheck size={14} />
            )} */}
          </div>

          <span className="message-room-time">
            {latestMessage
              ? new Date(
                  latestMessage.sentAt
                ).toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : ""}
          </span>
        </div>

        <div className="message-room-bottom">
          <span className="message-room-last-message">
            {latestMessage?.body ||
              "Chưa có tin nhắn"}
          </span>

          {/* TODO: Backend chưa trả unreadCount */}
          {/* {room.unreadCount > 0 && (
            <span className="message-room-unread">
              {room.unreadCount}
            </span>
          )} */}
        </div>
      </div>
    </NavLink>
  );
}