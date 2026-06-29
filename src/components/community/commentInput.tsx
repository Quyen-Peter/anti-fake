import { SendHorizontal, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import "../../css/components/community/commentInput.css";
import { getUser } from "../../ultil/auth";

type ReplyTarget = {
  id: string;
  authorName: string;
};

type Props = {
  loading?: boolean;
  replyTo?: ReplyTarget | null;
  onCancelReply?: () => void;
  onSubmit: (
    content: string,
    replyTo?: ReplyTarget | null,
  ) => Promise<void | false> | void | false;
};

export default function CommentInput({
  loading = false,
  replyTo = null,
  onCancelReply,
  onSubmit,
}: Props) {
  const [content, setContent] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const user = getUser();

  useEffect(() => {
    if (replyTo) {
      textareaRef.current?.focus();
    }
  }, [replyTo]);

  const handleSubmit = async () => {
    const value = content.trim();

    if (!value || loading) return;

    const submitted = await onSubmit(value, replyTo);

    if (submitted === false) return;

    setContent("");
    onCancelReply?.();
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";

    const lineHeight = parseFloat(getComputedStyle(textarea).lineHeight);

    const maxHeight = lineHeight * 3;

    textarea.style.height = Math.min(textarea.scrollHeight, maxHeight) + "px";

    textarea.style.overflowY =
      textarea.scrollHeight > maxHeight ? "auto" : "hidden";
  }, [content]);

  return (
    <div className="comment-input-container">
      {replyTo && (
        <div className="comment-reply-preview">
          <span>
            Đang trả lời <strong>{replyTo.authorName}</strong>
          </span>

          <button
            type="button"
            onClick={onCancelReply}
            aria-label="Hủy trả lời"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="comment-input">
        <img
          src={user?.avatar || "https://i.pravatar.cc/100?img=12"}
          alt=""
          className="comment-input-avatar"
        />

        <div className="comment-input-box">
          <textarea
            ref={textareaRef}
            rows={1}
            placeholder={
              replyTo ? `Trả lời ${replyTo.authorName}...` : "Viết bình luận..."
            }
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <button onClick={handleSubmit} disabled={!content.trim() || loading}>
            <SendHorizontal size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
