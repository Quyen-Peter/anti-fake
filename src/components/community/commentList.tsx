import { useEffect, useState } from "react";
import "../../css/components/community/commentList.css";
import { getComments } from "../../services/community.api";
import CommentItem from "./commentItem";
import type { Comment, CommentResponse } from "../../type/community";

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
    return <div>Đang tải bình luận...</div>;
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
