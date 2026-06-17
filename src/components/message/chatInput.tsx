import {
  Image,
  Paperclip,
  SendHorizonal,
  Smile,
  X,
} from "lucide-react";
import { useRef, useState } from "react";

export default function ChatInput() {
  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState<string>();

  const fileRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (!message.trim() && !preview) return;

    console.log({
      message,
      image: preview,
    });

    setMessage("");
    setPreview(undefined);
  };

  return (
    <>
      {/* Preview ảnh */}

      {preview && (
        <div className="image-preview">
          <img src={preview} alt="" />

          <button
            className="remove-preview-btn"
            onClick={() => setPreview(undefined)}
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Input file ẩn */}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];

          if (!file) return;

          setPreview(URL.createObjectURL(file));
        }}
      />

      <div className="chat-input-container">
        <button
          className="chat-input-icon"
          onClick={() => fileRef.current?.click()}
        >
          <Image size={20} />
        </button>

        <button className="chat-input-icon">
          <Smile size={20} />
        </button>

        <input
          type="text"
          value={message}
          placeholder="Nhập tin nhắn..."
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSend();
            }
          }}
        />

        <button
          className="chat-send-btn"
          onClick={handleSend}
        >
          <SendHorizonal size={18} />
        </button>
      </div>
    </>
  );
}