import { Image, SendHorizonal, X } from "lucide-react";
import { useRef, useState } from "react";
import { sendMessage } from "../../services/chat.api";

type Props = {
  roomId: string;
  connected?: boolean;
  error?: string | null;
  onSendMessage?: (
    body: string,
    clientMessageId: string
  ) => Promise<{ thread: unknown; clientMessageId: string } | null>;
  onTyping?: (isTyping: boolean) => void;
};

export default function ChatInput({
  roomId,
  connected = false,
  error,
  onSendMessage,
  onTyping,
}: Props) {
  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState<string>();

  const fileRef = useRef<HTMLInputElement>(null);

  const handleSend = async () => {
    if (!message.trim()) return;

    try {
      const body = message.trim();
      const clientMessageId = crypto.randomUUID();
      const realtimeResult = await onSendMessage?.(body, clientMessageId);

      if (!realtimeResult) {
        await sendMessage(roomId, body, clientMessageId);
      }

      setMessage("");
      onTyping?.(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
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

        <input
          type="text"
          value={message}
          placeholder="Nhập tin nhắn..."
          onChange={(e) => {
            setMessage(e.target.value);
            onTyping?.(Boolean(e.target.value.trim()));
          }}
          onBlur={() => onTyping?.(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSend();
            }
          }}
        />

        <button className="chat-send-btn" onClick={handleSend}>
          <SendHorizonal size={18} />
        </button>
      </div>
      {error && !connected && <p className="chat-input-error">{error}</p>}
    </>
  );
}
