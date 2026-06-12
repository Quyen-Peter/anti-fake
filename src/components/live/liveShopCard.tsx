import "../../css/components/live/liveShopCard.css";
import { BadgeCheck, Eye } from "lucide-react";
import type { LiveShop } from "../../type/live";

type Props = {
  live: LiveShop;
};

export default function LiveShopCard({ live }: Props) {
  return (
    <div className="live-card">
      <div className="live-image-wrapper">
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
