import { SendHorizonal, Wifi, WifiOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { LiveComment } from "../../services/live.api";

type Props = {
  comments: LiveComment[];
  connected: boolean;
  canInteract: boolean;
  onSend: (body: string) => Promise<void>;
};

export default function LiveChat({
  comments,
  connected,
  canInteract,
  onSend,
}: Props) {
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "nearest" });
  }, [comments.length]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const message = body.trim();
    if (!message || sending) return;
    setSending(true);
    try {
      await onSend(message);
      setBody("");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Không thể gửi bình luận",
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="live-chat" aria-label="Trò chuyện trực tiếp">
      <header className="live-chat-header">
        <div>
          <h3>Trò chuyện trực tiếp</h3>
          <span>
            {connected ? <Wifi size={13} /> : <WifiOff size={13} />}
            {connected ? " Đã kết nối" : " Đang kết nối lại"}
          </span>
        </div>
      </header>

      <div className="live-chat-messages" aria-live="polite">
        {comments.length === 0 ? (
          <p className="live-chat-empty">
            Chưa có bình luận. Hãy bắt đầu cuộc trò chuyện.
          </p>
        ) : (
          comments.map((comment) => (
            <article key={comment.id} className="chat-message">
              <b>{comment.authorName}</b>
              <p>{comment.body}</p>
            </article>
          ))
        )}
        <div ref={endRef} />
      </div>

      <form className="live-chat-input" onSubmit={submit}>
        <input
          value={body}
          maxLength={1000}
          disabled={!canInteract || sending}
          onChange={(event) => setBody(event.target.value)}
          placeholder={
            canInteract ? "Gửi bình luận..." : "Đăng nhập để bình luận"
          }
          aria-label="Bình luận livestream"
        />
        <button
          className="send-btn"
          disabled={!canInteract || !body.trim() || sending}
          aria-label="Gửi bình luận"
        >
          <SendHorizonal size={18} />
        </button>
      </form>
    </section>
  );
}
