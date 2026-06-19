import { useNavigate } from "react-router-dom";
import "../../css/components/live/liveShopCard.css";
import type { LiveShop } from "../../type/live";

type Props = {
  live: LiveShop;
};

export default function LiveShopCard({ live }: Props) {
  const navigate = useNavigate();
  return (
    <div className="live-card">
      <div
        className="live-image-wrapper"
        onClick={() => navigate(`/live/${live.id}`)}
      >
        <img
          src={live.liveThumbnail}
          alt={live.shopName}
          className="live-image"
        />

        <span className="live-badge">Đang diễn ra</span>
        <p className="live-title">{live.liveTitle}</p>
      </div>
    </div>
  );
}
