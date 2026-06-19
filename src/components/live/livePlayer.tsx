import { Eye, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LivePlayer() {
  const navigate = useNavigate();
  return (
    <div className="live-player">
      <img
        src="https://images.unsplash.com/photo-1547996160-81dfa63595aa"
        alt=""
      />

      <div className="stream-live-header">
        <button className="stream-live-close-btn" onClick={() => navigate(-1)}>
          <X size={16} />
        </button>

        <div className="stream-live-badge">
          <span className="stream-live-dot"></span>
          <div className="stream-live-info">
            Đang diễn ra
            <span className="stream-live-viewers">
              <Eye size={14} />
              1.2K
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
