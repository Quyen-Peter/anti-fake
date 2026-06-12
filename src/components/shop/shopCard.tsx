import "../../css/components/shop/shopCard.css";
import { BadgeCheck, Package, Star } from "lucide-react";
import type { shopCard } from "../../type/shop";
import { formatSale } from "../../ultil/format";

type Props = {
  shop: shopCard;
};



export default function ShopCard({ shop }: Props) {
  return (
    <div className="shop-card">
      <div className="shop-info">
        <img src={shop.avatarUrl} alt="shop" className="shop-avatar" />

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
