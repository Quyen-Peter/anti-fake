import { Heart } from "lucide-react";
import type { Comment } from "../../type/community";
import { formatCommunityTime } from "../../ultil/format";
import { useState } from "react";
import { getReplies } from "../../services/community.api";

type Props = {
  comment: Comment;
  onReply?: (comment: Comment) => void;
};

export default function CommentItem({ comment, onReply }: Props) {
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);

  const handleToggleReplies = async () => {
    if (showReplies) {
      setShowReplies(false);
      return;
    }

    if (replies.length === 0) {
      setLoading(true);

      const data = await getReplies(comment.id);

      setReplies(data.items);

      setLoading(false);
    }

    setShowReplies(true);
  };

  return (
    <div className="comment-item">
      <img
        src={comment?.author.avatar}
        alt={comment?.author.id}
        className="comment-avatar"
      />

      <div className="comment-content">
        <div className="comment-bubble">
          <strong>{comment?.author.name}</strong>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              flexWrap: "wrap",
            }}
          >
            {comment.replyToUser && (
              <span
                style={{
                  color: "#1677ff",
                  fontWeight: 600,
                }}
              >
                @{comment.replyToUser.userName}
              </span>
            )}

            <span>{comment.body}</span>
          </div>
        </div>

        <div className="comment-actions">
          <span>{formatCommunityTime(comment?.createdAt)}</span>

          <button>Thích </button>

          <button onClick={() => onReply?.(comment)}>Trả lời</button>

          <button>
            <Heart size={14} />
            {comment?.likeCount}
          </button>
        </div>
        {comment.replyCount > 0 && (
          <button
            className="comment-view-replies"
            onClick={handleToggleReplies}
          >
            {showReplies ? "Ẩn phản hồi" : `Xem ${comment.replyCount} phản hồi`}
          </button>
        )}

        {showReplies && (
          <div className="reply-list">
            {loading && <p>Đang tải...</p>}

            {replies.map((reply) => (
              <CommentItem key={reply.id} comment={reply} onReply={onReply} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
