import { ArrowLeft, BadgeCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { MessageRoom } from "../../type/message";

type Props = {
  room: MessageRoom;
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
        <img src={room.avatar} alt="" />

        <div>
          <div className="chat-shop-name">
            <span>{room.shopName}</span>

            {room.isVerified && (
              <BadgeCheck size={15} />
            )}
          </div>

          <span className="chat-shop-status">
            {room.isOnline
              ? "Đang hoạt động"
              : "Không hoạt động"}
          </span>
        </div>
      </div>
    </div>
  );
}