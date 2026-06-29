import { Heart } from "lucide-react";
import { useState } from "react";
import { getReplies } from "../../services/community.api";
import type { Comment } from "../../type/community";
import { formatCommunityTime } from "../../ultil/format";

type Props = {
  comment: Comment;
  isReply?: boolean;
  pendingRepliesByParent?: Record<string, Comment[]>;
  onReply?: (comment: Comment) => void;
};

export default function CommentItem({
  comment,
  isReply = false,
  pendingRepliesByParent = {},
  onReply,
}: Props) {
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);

  const pendingReplies = isReply ? [] : pendingRepliesByParent[comment.id] ?? [];
  const visibleReplies = [
    ...pendingReplies,
    ...replies.filter(
      (reply) =>
        !pendingReplies.some((pendingReply) => pendingReply.id === reply.id)
    ),
  ];
  const repliesVisible = showReplies || pendingReplies.length > 0;
  const replyCount = Math.max(comment.replyCount, visibleReplies.length);

  const handleToggleReplies = async () => {
    if (repliesVisible) {
      setShowReplies(false);
      return;
    }

    if (replies.length === 0) {
      setLoading(true);

      try {
        const data = await getReplies(comment.id);
        setReplies(data.items);
      } finally {
        setLoading(false);
      }
    }

    setShowReplies(true);
  };

  return (
    <div className="comment-item">
      <img
        src={comment.author.avatar}
        alt={comment.author.id}
        className="comment-avatar"
      />

      <div className="comment-content">
        <div className="comment-bubble">
          <strong>{comment.author.name}</strong>

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
          <span>{formatCommunityTime(comment.createdAt)}</span>

          <button>Thích</button>

          <button onClick={() => onReply?.(comment)}>Trả lời</button>

          <button>
            <Heart size={14} />
            {comment.likeCount}
          </button>
        </div>

        {!isReply && replyCount > 0 && (
          <button
            className="comment-view-replies"
            onClick={handleToggleReplies}
          >
            {repliesVisible ? "Ẩn phản hồi" : `Xem ${replyCount} phản hồi`}
          </button>
        )}

        {!isReply && repliesVisible && (
          <div className="reply-list">
            {loading && <p>Đang tải...</p>}

            {visibleReplies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                isReply
                pendingRepliesByParent={pendingRepliesByParent}
                onReply={onReply}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
