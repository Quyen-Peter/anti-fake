import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import type { MessageRoom } from "../../type/message";
import MessageRoomCard from "./messageRoomCard";

type Props = {
  rooms: MessageRoom[];
};

export default function MessageSidebar({ rooms }: Props) {
  const [keyword, setKeyword] = useState("");
  const [filter, setFilter] = useState("ALL");

  const filteredRooms = useMemo(() => {
    let result = rooms;

    if (filter === "UNREAD") {
      result = result.filter((x) => x.unreadCount > 0);
    }

    if (filter === "SHOP") {
      result = result.filter((x) => x.shopId);
    }

    if (keyword.trim()) {
      result = result.filter((x) =>
        x.shopName.toLowerCase().includes(keyword.toLowerCase()),
      );
    }

    return result;
  }, [rooms, keyword, filter]);

  return (
    <aside className="message-sidebar">
      <div className="message-search">
        <Search size={18} />

        <input
          type="text"
          placeholder="Tìm kiếm cuộc trò chuyện..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
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
          <MessageRoomCard key={room.id} room={room} />
        ))}
      </div>
    </aside>
  );
}
