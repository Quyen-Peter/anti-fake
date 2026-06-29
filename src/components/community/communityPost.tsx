import { Heart, MessageCircle, Share2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { likePost, unLikePost } from "../../services/community.api";
import type { SocialPost } from "../../type/community";
import { getToken } from "../../ultil/auth";
import { formatCommunityTime } from "../../ultil/format";
import CommentBottomSheet from "./commentBottomSheet";

type Props = {
  post: SocialPost;
};

export default function CommunityPost({ post }: Props) {
  const navigate = useNavigate();
  const [openComment, setOpenComment] = useState(false);
  const [liked, setLiked] = useState(post.viewer.liked);
  const [reactionCount, setReactionCount] = useState(post.stats.reactions);
  const [loadingLike, setLoadingLike] = useState(false);

  const redirectToLogin = () => {
    toast.error("Vui lòng đăng nhập trước");
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

  const requireLogin = () => {
    if (getToken()) return true;

    redirectToLogin();
    return false;
  };

  const handleOpenComment = () => {
    if (!requireLogin()) return;

    setOpenComment(true);
  };

  const handleLike = async () => {
    if (loadingLike) return;
    if (!requireLogin()) return;

    setLoadingLike(true);

    const oldLiked = liked;
    const oldCount = reactionCount;

    setLiked(!oldLiked);
    setReactionCount(oldLiked ? oldCount - 1 : oldCount + 1);

    try {
      if (oldLiked) {
        await unLikePost(post.id, "LIKE");
      } else {
        await likePost(post.id, "LIKE");
      }
    } catch (err: any) {
      setLiked(oldLiked);
      setReactionCount(oldCount);

      if (isAuthError(err)) {
        redirectToLogin();
      } else {
        toast.error(err.message || "Thao tác thất bại");
      }
    } finally {
      setLoadingLike(false);
    }
  };

  return (
    <div className="community-post">
      <div className="post-header">
        <img
          src={post.author.avatar || "https://i.pravatar.cc/150?img=11"}
          alt=""
        />

        <div>
          <h4>{post.author.name}</h4>
          <span>{formatCommunityTime(post.createdAt)}</span>
        </div>
      </div>

      <p>{post.body}</p>

      {post.image && <img src={post.image} alt="" className="post-image" />}

      <div className="post-actions">
        <button onClick={handleLike} disabled={loadingLike}>
          <Heart
            size={18}
            fill={liked ? "#ef4444" : "none"}
            color={liked ? "#ef4444" : "currentColor"}
          />
          {reactionCount}
        </button>

        <button onClick={handleOpenComment}>
          <MessageCircle size={18} />
          {post.stats.comments}
        </button>

        <button>
          <Share2 size={18} />
          {post.stats.shares}
        </button>
      </div>

      <CommentBottomSheet
        open={openComment}
        onClose={() => setOpenComment(false)}
        postId={post.id}
      />
    </div>
  );
}
