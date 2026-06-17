import { BadgeCheck } from "lucide-react";
import { NavLink } from "react-router-dom";

import type { MessageRoom } from "../../type/message";

type Props = {
  room: MessageRoom;
};

export default function MessageRoomCard({ room }: Props) {
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
        <img src={room.avatar} alt="" />

        {room.isOnline && (
          <span className="online-dot" />
        )}
      </div>

      <div className="message-room-content">
        <div className="message-room-top">
          <div className="message-room-name">
            <span>{room.shopName}</span>

            {room.isVerified && (
              <BadgeCheck size={14} />
            )}
          </div>

          <span className="message-room-time">
            {room.lastTime}
          </span>
        </div>

        <div className="message-room-bottom">
          <span className="message-room-last-message">
            {room.lastMessage}
          </span>

          {room.unreadCount > 0 && (
            <span className="message-room-unread">
              {room.unreadCount}
            </span>
          )}
        </div>
      </div>
    </NavLink>
  );
}