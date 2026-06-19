import { SendHorizonal, Smile } from "lucide-react";

const messages = [
  {
    user: "Minh_Khang92",
    text: "Check giúp em chiếc Hermes này có chuẩn không?",
  },
  {
    user: "SHOP PHÂN HỒI",
    text: "Đã chiếc túi này hiện bên mình còn duy nhất size 30.",
  },
  {
    user: "Luxury_Lover",
    text: "Sản phẩm đẹp quá.",
  },
    {
    user: "Luxury_Lover",
    text: "Sản phẩm đẹp quá.",
  },
    {
    user: "Luxury_Lover",
    text: "Sản phẩm đẹp quá.",
  },
    {
    user: "Luxury_Lover",
    text: "Sản phẩm đẹp quá.",
  },
    {
    user: "Luxury_Lover",
    text: "Sản phẩm đẹp quá.",
  },
];

export default function LiveChat() {
  return (
    <div className="live-chat">
      <div className="live-chat-header">
        <h3>TRÒ CHUYỆN TRỰC TIẾP</h3>
      </div>

      <div className="live-chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className="chat-message">
            <b>{msg.user}</b>
            <p>{msg.text}</p>
          </div>
        ))}
      </div>

      <div className="live-chat-input">
        <input placeholder="Gửi tin nhắn..." />

        <button>
          <Smile size={18} />
        </button>

        <button className="send-btn">
          <SendHorizonal size={18} />
        </button>
      </div>
    </div>
  );
}