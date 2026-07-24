import { Radio, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { LiveSession } from "../../services/live.api";

const statusText = {
  SCHEDULED: "Sắp diễn ra",
  LIVE: "Đang phát",
  ENDED: "Phát lại",
  CANCELLED: "Đã hủy",
} as const;

export default function LivePlayer({ session }: { session: LiveSession }) {
  const navigate = useNavigate();
  const source =
    session.status === "ENDED"
      ? session.recordingUrl || session.playbackUrl
      : session.playbackUrl;

  return (
    <section className="live-player" aria-label="Video livestream">
      {source ? (
        <iframe
          src={source}
          title={session.title}
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <div className="live-player-placeholder">
          {session.coverUrl ? (
            <img src={session.coverUrl} alt="" />
          ) : (
            <Radio size={44} />
          )}
          <strong>
            {session.status === "SCHEDULED"
              ? "Livestream chưa bắt đầu"
              : "Video chưa sẵn sàng"}
          </strong>
          <span>
            {new Date(session.startAt).toLocaleString("vi-VN")}
          </span>
        </div>
      )}

      <div className="stream-live-header">
        <button
          className="stream-live-close-btn"
          onClick={() => navigate(-1)}
          aria-label="Quay lại"
        >
          <X size={16} />
        </button>
        <div className={`stream-live-badge ${session.status.toLowerCase()}`}>
          {session.status === "LIVE" && (
            <span className="stream-live-dot" />
          )}
          <div className="stream-live-info">
            {statusText[session.status]}
          </div>
        </div>
      </div>
    </section>
  );
}
