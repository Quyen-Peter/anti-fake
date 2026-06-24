import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { ChatRoom } from "../../type/message";

type Props = {
  room: ChatRoom;
};

export default function ChatHeader({ room }: Props) {
  const navigate = useNavigate();

  return (
    <div className="chat-header">
      <button
        className="chat-back-btn"
        onClick={() => navigate("/messages")}
      >
        <ArrowLeft size={20} />
      </button>

      <div className="chat-shop-info">
        {/* TODO: Backend chưa trả avatar */}
        <img
          src="https://i.pravatar.cc/100?img=12"
          alt={room.chatUserName}
        />

        <div>
          <div className="chat-shop-name">
            <span>{room.chatUserName}</span>

            {/* TODO: Backend chưa trả isVerified */}
            {/* {room.isVerified && (
              <BadgeCheck size={15} />
            )} */}
          </div>

          <span className="chat-shop-status">
            {/* TODO: Backend chưa trả isOnline */}
            Đang trò chuyện
          </span>
        </div>
      </div>
    </div>
  );
}