import { Heart, MessageCircle, Share2 } from "lucide-react";
import type { SocialPost } from "../../type/community";
import { formatCommunityTime } from "../../ultil/format";
import { useState } from "react";
import CommentBottomSheet from "./commentBottomSheet";

type Props = {
  post: SocialPost;
};

export default function CommunityPost({ post }: Props) {
  const [openComment, setOpenComment] = useState(false);

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
        <button>
          <Heart
            size={18}
            fill={post.viewer.liked ? "#ef4444" : "none"}
            color={post.viewer.liked ? "#ef4444" : "currentColor"}
          />
          {post.stats.reactions}
        </button>

        <button onClick={() => setOpenComment(true)}>
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
