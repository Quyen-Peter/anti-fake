import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import type { ChatRoom } from "../../type/message";

type ConversationListProps = {
  rooms: ChatRoom[];
  basePath: string;
};

type ConversationCardProps = {
  room: ChatRoom;
  basePath: string;
};

function ConversationCard({ room, basePath }: ConversationCardProps) {
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

export default function ConversationList({
  rooms,
  basePath,
}: ConversationListProps) {
  const [keyword, setKeyword] = useState("");
  const [filter, setFilter] = useState("ALL");

  const filteredRooms = useMemo(() => {
    let result = rooms;

    if (keyword.trim()) {
      result = result.filter((room) =>
        room.chatUserName.toLowerCase().includes(keyword.toLowerCase()),
      );
    }

    return result;
  }, [rooms, keyword]);

  return (
    <aside className="message-sidebar">
      <div className="message-search">
        <Search size={18} />

        <input
          type="text"
          placeholder="Tìm kiếm cuộc trò chuyện..."
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
        />
      </div>

      <div className="message-filters">
        <button
          className={filter === "ALL" ? "active" : ""}
          onClick={() => setFilter("ALL")}
        >
          Tất cả
        </button>

        <button
          className={filter === "UNREAD" ? "active" : ""}
          onClick={() => setFilter("UNREAD")}
        >
          Chưa đọc
        </button>

        <button
          className={filter === "SHOP" ? "active" : ""}
          onClick={() => setFilter("SHOP")}
        >
          Người bán
        </button>
      </div>

      <div className="message-room-list">
        {filteredRooms.map((room) => (
          <ConversationCard key={room.id} room={room} basePath={basePath} />
        ))}
      </div>
    </aside>
  );
}
