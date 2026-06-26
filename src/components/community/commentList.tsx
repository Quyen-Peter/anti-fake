import { useEffect, useState } from "react";
import "../../css/components/community/commentList.css";
import { getComments } from "../../services/community.api";
import CommentItem from "./commentItem";
import type { Comment, CommentResponse } from "../../type/community";

type Props = {
  postId: string;
  onReply?: (comment: Comment) => void;
};

export default function CommentList({ postId, onReply }: Props) {
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

  if (comments?.items.length === 0) {
    return <div className="comment-empty">Chưa có bình luận nào.</div>;
  }

  return (
    <div className="comment-list">
      {comments?.items.map((comment) => (
        <CommentItem key={comment.id} comment={comment} onReply={onReply} />
      ))}
    </div>
  );
}
