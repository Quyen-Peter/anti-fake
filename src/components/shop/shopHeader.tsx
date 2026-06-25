import {
  BadgeCheck,
  Star,
  MessageSquare,
  Package,
  History,
} from "lucide-react";

import type { shopCard } from "../../type/shop";
import { formatJoinTime, formatSale } from "../../ultil/format";

type Props = {
  shop: shopCard;
};

export default function ShopHeader({ shop }: Props) {
  return (
    <div className="shop-header-card-view">
      <div className="shop-header-left-view">
        <img
          src={shop.shopAvatar || "https://i.pravatar.cc/150?img=3"}
          alt=""
          className="shop-avatar-view"
        />

        <div className="shop-header-info-view">
          <div className="shop-name-row-view">
            <h2>{shop.shopName}</h2>

            <BadgeCheck size={18} className="shop-verified-view" />
          </div>
          <div className="shop-content-view-buttom">
            <div>
              <div className="shop-meta-view">
                <span>
                  <Star size={15} fill="#f59e0b" color="#f59e0b" />
                  <b>{shop.rating}</b>
                </span>

                <span>{formatSale(shop.totalReview)} đánh giá</span>

                <div className="shop-divider-view" />

                <span>
                  <Package size={15} />
                  <b>{formatSale(shop.totalSale)}</b> Sản phẩm
                </span>
              </div>

              <div className="shop-join-view">
                <History size={15} />
                <span>
                  Tham gia <b>{formatJoinTime(shop.createdAt)}</b>
                </span>
              </div>
            </div>
            <div className="shop-header-actions-view">
              <button className="chat-btn-view">
                <MessageSquare size={18} />
                Chat
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
