import { BadgeCheck, Star, MessageSquare, Plus, Eye } from "lucide-react";

export default function ShopHeader() {
  return (
    <div className="shop-header-card-view">
      <div className="shop-left-view">
        <img
          src="https://i.pravatar.cc/200"
          alt=""
          className="shop-avatar-view"
        />

        <div className="shop-info-view">
          <div className="shop-name-row-view">
            <h2>Luxury Leather Goods</h2>

            <BadgeCheck size={16} className="shop-verified-view" />
          </div>
          <div className="shop-info-buttom-view">
            <div>
              <div className="shop-rating-view">
                <span>
                  <Star size={16} />
                  4.9
                </span>

                <span>2.4k đánh giá</span>

                <span>•</span>

                <span>15k người theo dõi</span>

                <span>•</span>

                <span className="shop-view-count-view">
                  <Eye size={16} />
                  120k lượt xem
                </span>
              </div>

              <div className="shop-actions-view">
                <button className="follow-btn-view">
                  <Plus size={16} />
                  Theo dõi
                </button>

                <button className="chat-btn-view">
                  <MessageSquare size={16} />
                  Chat
                </button>
              </div>
            </div>
            <div className="shop-stats-view">
              <div className="shop-stat-view">
                <span>Sản phẩm</span>
                <b>158</b>
              </div>

              <div className="shop-stat-view">
                <span>Tỉ lệ phản hồi</span>
                <b>98%</b>
              </div>

              <div className="shop-stat-view">
                <span>Tham gia</span>
                <b>2 năm</b>
              </div>

              <div className="shop-stat-view">
                <span>Thời gian phản hồi</span>
                <b>Trong vài giờ</b>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
