import { useEffect, useState } from "react";
import "../../css/components/community/commentList.css";
import { getComments } from "../../services/community.api";
import CommentItem from "./commentItem";
import type { Comment, CommentResponse } from "../../type/community";
import "../../css/components/dataSkeleton.css";

type Props = {
  postId: string;
  pendingComments?: Comment[];
  pendingRepliesByParent?: Record<string, Comment[]>;
  onReply?: (comment: Comment) => void;
};

export default function CommentList({
  postId,
  pendingComments = [],
  pendingRepliesByParent = {},
  onReply,
}: Props) {
  const [comments, setComments] = useState<CommentResponse>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadComments = async () => {
      try {
        const data = await getComments(postId);
        console.log(data);
        setComments(data);
      } finally {
        setLoading(false);
      }
    };
    loadComments();
  }, [postId]);

  if (loading) {
    return <div className="data-skeleton data-skeleton-comments data-skeleton-compact" role="status" aria-label="Đang tải bình luận">{Array.from({ length: 3 }, (_, i) => <div className="data-skeleton-row" key={i}><span className="data-skeleton-thumbnail" /><span className="data-skeleton-lines"><span /><span /><span /></span></div>)}</div>;
  }

  if (comments?.items.length === 0 && pendingComments.length === 0) {
    return <div className="comment-empty">Chưa có bình luận nào.</div>;
  }

  const commentItems = [
    ...pendingComments,
    ...(comments?.items.filter(
      (comment) =>
        !pendingComments.some(
          (pendingComment) => pendingComment.id === comment.id
        )
    ) ?? []),
  ];

  return (
    <div className="comment-list">
      {commentItems.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          pendingRepliesByParent={pendingRepliesByParent}
          onReply={onReply}
        />
      ))}
    </div>
  );
}
