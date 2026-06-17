import { useState } from "react";
import { useParams } from "react-router-dom";

import "../../css/pages/message.css";
import EmptyChat from "../../components/message/emptyChat";
import MessageSidebar from "../../components/message/messageSidebar";
import ChatHeader from "../../components/message/chatHeader";
import ChatMessages from "../../components/message/chatMessages";
import ChatInput from "../../components/message/chatInput";

export default function MessagePage() {
  const { roomId } = useParams();
  const [rooms] = useState([
    {
      id: "room-1",
      shopId: "shop-1",
      shopName: "Luxury Leather Goods",
      avatar: "https://i.pravatar.cc/150?img=11",
      isVerified: true,
      isOnline: true,
      lastMessage: "Chào bạn, ví da bò sáp bên mình còn hàng.",
      lastTime: "10:45",
      unreadCount: 2,
    },
    {
      id: "room-2",
      shopId: "shop-2",
      shopName: "Apple Authorised Store",
      avatar: "https://i.pravatar.cc/150?img=12",
      isVerified: true,
      isOnline: false,
      lastMessage: "iPhone 15 Pro Max hiện có sẵn.",
      lastTime: "Hôm qua",
      unreadCount: 0,
    },
    {
      id: "room-3",
      shopId: "shop-3",
      shopName: "Hỗ trợ AntiFake",
      avatar: "https://i.pravatar.cc/150?img=13",
      isVerified: false,
      isOnline: true,
      lastMessage: "Yêu cầu xác thực của bạn đã được duyệt.",
      lastTime: "2 ngày trước",
      unreadCount: 1,
    },
  ]);

  const room = rooms.find((r) => r.id === roomId);

  return (
    <div className={`message-page ${room ? "room-open" : ""}`}>
      <MessageSidebar rooms={rooms} />

      <div className="message-content">
        {!room ? (
          <EmptyChat />
        ) : (
          <>
            <ChatHeader room={room} />
            <ChatMessages roomId={room.id} />
            <ChatInput />
          </>
        )}
      </div>
    </div>
  );
}
