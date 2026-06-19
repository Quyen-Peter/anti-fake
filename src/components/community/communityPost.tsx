import {
  Heart,
  MessageCircle,
  Share2,
} from "lucide-react";

export default function CommunityPost() {
  return (
    <div className="community-post">
      <div className="post-header">
        <img
          src="https://i.pravatar.cc/150?img=11"
          alt=""
        />

        <div>
          <h4>Lê Phương Thảo</h4>
          <span>1 giờ trước</span>
        </div>
      </div>

      <p>
        Vừa nhận được chiếc đồng hồ mới,
        quét QR xác thực thành công.
      </p>

      <img
        src="https://images.unsplash.com/photo-1523170335258-f5ed11844a49"
        alt=""
        className="post-image"
      />

      <div className="post-actions">
        <button>
          <Heart size={18} />
          128
        </button>

        <button>
          <MessageCircle size={18} />
          45
        </button>

        <button>
          <Share2 size={18} />
          12
        </button>
      </div>
    </div>
  );
}