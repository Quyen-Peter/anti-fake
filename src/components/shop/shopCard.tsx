import "../../css/components/shop/shopCard.css";
import { BadgeCheck, Package, Star } from "lucide-react";
import type { shopCard } from "../../type/shop";
import { formatSale } from "../../ultil/format";
import { useNavigate } from "react-router-dom";

type Props = {
  shop: shopCard;
};

export default function ShopCard({ shop }: Props) {
  const navigate = useNavigate();
  return (
    <div className="shop-card" >
      <div className="shop-info" onClick={() => navigate(`/shop/${shop.id}`)}>
        <img src={shop.avatarUrl || "https://i.pravatar.cc/100?img=3"} alt="shop" className="shop-avatar" />

        <div className="shop-content">
          <div className="shop-name-row">
            <h3>{shop.name}</h3>
            {shop.isVerified && (
              <BadgeCheck size={15} className="verify-icon" />
            )}
          </div>

          <div className="shop-meta">
            <span>
              <Star size={16} />
              {shop.rating} ( {formatSale(shop.totalReviews)})
            </span>

            <span>
              <Package size={16} />
              {formatSale(shop.totalSale)} sản phẩm bán ra
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
