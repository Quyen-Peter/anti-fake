import { MessageCircle, Store } from "lucide-react";
import LiveChat from "../../components/live/liveChat";
import LivePlayer from "../../components/live/livePlayer";
import LiveProducts from "../../components/live/liveProducts";
import ShopCard from "../../components/shop/shopCard";
import "../../css/components/live/liveRoom.css";
import { useEffect } from "react";

export default function LiveRoomPage() {
  const mockShop = {
    shopId: "shop-1",
    shopName: "TechWorld Official",
    shopAvatar: "https://i.pravatar.cc/150?img=1",
    shopBanner: "https://i.pravatar.cc/150?img=1",
    rating: 4.9,
    totalReview: 125000,
    totalOffer: 356,
    totalSale: 356,
    verify: true,
    createdAt: "20/3",
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="live-room-page">
      <div className="live-main">
        <LivePlayer />
        <div className="live-chat-buttom">
        <LiveChat />
      </div>
        <div
          className="pd-shop-box"
          style={{ marginTop: "0px", border: "1px solid #eee" }}
        >
          <div className="pd-shop-left">
            <ShopCard shop={mockShop} />
          </div>

          <div className="pd-shop-right">
            <button className="pd-chat-btn">
              <MessageCircle size={18} />
              <span>Nhắn tin</span>
            </button>

            <button className="pd-view-shop-btn">
              <Store size={18} />
              <span>Xem Shop</span>
            </button>
          </div>
        </div>
        <LiveProducts />
      </div>
      <div className="live-chat-right">
        <LiveChat />
      </div>
    </div>
  );
}
