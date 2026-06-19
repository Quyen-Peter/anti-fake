import { Image, Video } from "lucide-react";

export default function CreatePostBox() {
  return (
    <div className="create-post">
      <input
        placeholder="Bạn đang nghĩ gì?"
      />

      <div className="create-actions">
        <button>
          <Image size={18} />
          Hình ảnh
        </button>

        <button>
          <Video size={18} />
          Video
        </button>
      </div>
    </div>
  );
}