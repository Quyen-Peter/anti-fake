import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import "../../css/pages/message.css";
import EmptyChat from "../../components/message/emptyChat";
import MessageSidebar from "../../components/message/messageSidebar";
import ChatHeader from "../../components/message/chatHeader";
import ChatMessages from "../../components/message/chatMessages";
import ChatInput from "../../components/message/chatInput";
import { getToken } from "../../ultil/auth";
import { fetchChatThreads } from "../../services/chat.api";
import type { ChatRoom } from "../../type/message";



export default function MessagePage() {
  const { roomId } = useParams();
  const [rooms, setRooms] = useState<ChatRoom[]>([]);

  useEffect(() => {
    const loadThreads = async () => {
      try {
        const token = getToken();

        if (!token) return;

        const data = await fetchChatThreads(token);

        setRooms(data);
      } catch (error) {
        console.error(error);
      }
    };

    loadThreads();
  }, []);

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
