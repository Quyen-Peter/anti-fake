import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import "../../css/components/community/commentBottomSheet.css";
import { createComment, createReply } from "../../services/community.api";
import type { Comment } from "../../type/community";
import { getToken, getUser } from "../../ultil/auth";
import CommentInput from "./commentInput";
import CommentList from "./commentList";

type Props = {
  open: boolean;
  onClose: () => void;
  postId: string;
};

type ReplyTarget = {
  id: string;
  authorName: string;
};

type CreateCommentResponse = Comment | { data?: Comment; comment?: Comment };

export default function CommentBottomSheet({ open, onClose, postId }: Props) {
  const navigate = useNavigate();
  const [replyTo, setReplyTo] = useState<ReplyTarget | null>(null);
  const [pendingComments, setPendingComments] = useState<Comment[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      setPendingComments([]);
      setReplyTo(null);
    }
  }, [open, postId]);

  if (!open) return null;

  const redirectToLogin = () => {
    toast.error("Vui lòng đăng nhập trước");
    onClose();
    navigate("/auth");
  };

  const isAuthError = (err: any) => {
    const message = String(err?.message || "").toLowerCase();
    return (
      message.includes("unauthorized") ||
      message.includes("401") ||
      message.includes("đăng nhập") ||
      message.includes("phiên")
    );
  };

  const buildOptimisticComment = (
    id: string,
    content: string,
    currentReplyTo?: ReplyTarget | null
  ): Comment => {
    const user = getUser();
    const authorName =
      user?.displayName || user?.fullName || user?.name || "Bạn";

    return {
      id,
      author: {
        id: user?.id || "me",
        name: authorName,
        avatar: user?.avatar || "https://i.pravatar.cc/100?img=12",
      },
      body: content,
      createdAt: new Date().toISOString(),
      likeCount: 0,
      viewerLiked: false,
      replyCount: 0,
      parentCommentId: currentReplyTo?.id,
      ...(currentReplyTo
        ? {
            depth: 1,
            replyToUser: {
              userId: currentReplyTo.id,
              userName: currentReplyTo.authorName,
            },
          }
        : {}),
    };
  };

  const normalizeCreatedComment = (data: CreateCommentResponse) => {
    if ("id" in data) return data;
    return data.data || data.comment;
  };

  const replacePendingComment = (tempId: string, createdComment: Comment) => {
    setPendingComments((currentComments) =>
      currentComments.map((comment) =>
        comment.id === tempId ? createdComment : comment
      )
    );
  };

  const removePendingComment = (tempId: string) => {
    setPendingComments((currentComments) =>
      currentComments.filter((comment) => comment.id !== tempId)
    );
  };

  const handleSubmit = (
    content: string,
    currentReplyTo?: ReplyTarget | null
  ) => {
    if (!getToken()) {
      redirectToLogin();
      return false;
    }

    const tempId = `pending-${Date.now()}`;
    const optimisticComment = buildOptimisticComment(
      tempId,
      content,
      currentReplyTo
    );

    setSubmitting(true);
    setPendingComments((currentComments) => [
      optimisticComment,
      ...currentComments,
    ]);

    const request = currentReplyTo
      ? createReply(currentReplyTo.id, content)
      : createComment(postId, content);

    request
      .then((data) => {
        const createdComment = normalizeCreatedComment(data);

        if (createdComment) {
          replacePendingComment(tempId, {
            ...createdComment,
            parentCommentId:
              createdComment.parentCommentId || currentReplyTo?.id,
            replyToUser:
              createdComment.replyToUser ||
              (currentReplyTo
                ? {
                    userId: currentReplyTo.id,
                    userName: currentReplyTo.authorName,
                  }
                : undefined),
          });
        }
      })
      .catch((err: any) => {
        removePendingComment(tempId);

        if (isAuthError(err)) {
          redirectToLogin();
        } else {
          toast.error(err.message || "Đăng bình luận thất bại");
        }
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <div className="comment-sheet-overlay" onClick={onClose}>
      <div className="comment-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="comment-sheet-drag" />
        <div className="comment-sheet-header">
          <h3>Bình luận</h3>

          <button onClick={onClose}>×</button>
        </div>

        <div className="comment-sheet-list">
          <CommentList
            postId={postId}
            pendingComments={pendingComments.filter(
              (comment) => !comment.parentCommentId
            )}
            pendingRepliesByParent={pendingComments.reduce<
              Record<string, Comment[]>
            >((repliesByParent, comment) => {
              if (comment.parentCommentId) {
                repliesByParent[comment.parentCommentId] = [
                  ...(repliesByParent[comment.parentCommentId] ?? []),
                  comment,
                ];
              }

              return repliesByParent;
            }, {})}
            onReply={(comment) => {
              if (!getToken()) {
                redirectToLogin();
                return;
              }

              setReplyTo({
                id: comment.parentCommentId || comment.id,
                authorName: comment.author.name,
              });
            }}
          />
        </div>

        <div className="comment-sheet-input">
          <CommentInput
            loading={submitting}
            onSubmit={handleSubmit}
            replyTo={replyTo}
            onCancelReply={() => setReplyTo(null)}
          />
        </div>
      </div>
    </div>
  );
}
