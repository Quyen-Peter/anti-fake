import { useState } from "react";
import "../../css/components/community/commentBottomSheet.css";
import CommentInput from "./commentInput";
import CommentList from "./commentList";

type Props = {
  open: boolean;
  onClose: () => void;
  postId: string;
};

export default function CommentBottomSheet({ open, onClose, postId }: Props) {
  if (!open) return null;
  const [replyTo, setReplyTo] = useState<{
    id: string;
    authorName: string;
  } | null>(null);

  return (
    <div className="comment-sheet-overlay" onClick={onClose}>
      <div className="comment-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="comment-sheet-drag" />
        <div className="comment-sheet-header">
          <h3>Bình luận</h3>

          <button onClick={onClose}>✕</button>
        </div>

        <div className="comment-sheet-list">
          <CommentList
            postId={postId}
            onReply={(comment) => {
              setReplyTo({
                id: comment.id,
                authorName: comment.author.name,
              });
            }}
          />
        </div>

        <div className="comment-sheet-input">
          <CommentInput
            onSubmit={async (content) => {
              // TODO: Gọi API tạo bình luận
              console.log(content);
            }}
            replyTo={replyTo}
            onCancelReply={() => setReplyTo(null)}
          />
        </div>
      </div>
    </div>
  );
}
