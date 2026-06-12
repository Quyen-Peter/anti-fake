import BannerSlider from "../../components/home/bannerSlider";
import FeaturedCategories from "../../components/home/featuredCategories";
import FlashSale from "../../components/home/flashSale";
import LiveShopCard from "../../components/live/liveShopCard";
import ShopCard from "../../components/shop/shopCard";
import "../../css/pages/home.css";
import type { shopCard } from "../../type/shop";

export default function HomePage() {
  const mockShops: shopCard[] = [
    {
      id: "shop-001",
      name: "TechWorld Official",
      avatarUrl: "https://i.pravatar.cc/150?img=1",
      isVerified: true,
      rating: 4.9,
      totalReviews: 12500,
      totalSale: 1200,
    },
    {
      id: "shop-002",
      name: "Beauty Care VN",
      avatarUrl: "https://i.pravatar.cc/150?img=2",
      isVerified: true,
      rating: 4.8,
      totalReviews: 9800,
      totalSale: 850,
    },
    {
      id: "shop-003",
      name: "Gia Dụng Thông Minh",
      avatarUrl: "https://i.pravatar.cc/150?img=3",
      isVerified: true,
      rating: 4.7,
      totalReviews: 7600,
      totalSale: 620,
    },
    {
      id: "shop-004",
      name: "Fresh Food Mart",
      avatarUrl: "https://i.pravatar.cc/150?img=4",
      isVerified: true,
      rating: 4.9,
      totalReviews: 15400,
      totalSale: 430,
    },
    {
      id: "shop-005",
      name: "Fashion House",
      avatarUrl: "https://i.pravatar.cc/150?img=5",
      isVerified: false,
      rating: 4.6,
      totalReviews: 5100,
      totalSale: 980,
    },
  ];

  const mockLiveShops = [
    {
      id: "1",
      shopName: "TechWorld Official",
      shopAvatar: "https://i.pravatar.cc/100?img=1",
      liveThumbnail: "https://picsum.photos/600/400?random=1",
      liveTitle: "Flash Sale điện thoại giảm đến 50%",
      viewerCount: 12400,
      isVerified: true,
    },
    {
      id: "2",
      shopName: "Beauty Care VN",
      shopAvatar: "https://i.pravatar.cc/100?img=2",
      liveThumbnail: "https://picsum.photos/600/400?random=2",
      liveTitle: "Livestream mỹ phẩm chính hãng",
      viewerCount: 8600,
      isVerified: true,
    },
    {
      id: "3",
      shopName: "Fresh Food Mart",
      shopAvatar: "https://i.pravatar.cc/100?img=3",
      liveThumbnail: "https://picsum.photos/600/400?random=3",
      liveTitle: "Nông sản sạch giá tốt hôm nay",
      viewerCount: 5200,
      isVerified: true,
    },
    {
      id: "9",
      shopName: "TechWorld Official",
      shopAvatar: "https://i.pravatar.cc/100?img=1",
      liveThumbnail: "https://picsum.photos/600/400?random=1",
      liveTitle: "Flash Sale điện thoại giảm đến 50%",
      viewerCount: 12400,
      isVerified: true,
    },
    {
      id: "7",
      shopName: "Beauty Care VN",
      shopAvatar: "https://i.pravatar.cc/100?img=2",
      liveThumbnail: "https://picsum.photos/600/400?random=2",
      liveTitle: "Livestream mỹ phẩm chính hãng",
      viewerCount: 8600,
      isVerified: true,
    },
    {
      id: "6",
      shopName: "Fresh Food Mart",
      shopAvatar: "https://i.pravatar.cc/100?img=3",
      liveThumbnail: "https://picsum.photos/600/400?random=3",
      liveTitle: "Nông sản sạch giá tốt hôm nay",
      viewerCount: 5200,
      isVerified: true,
    },
  ];

  return (
    <div className="home-container">
      <div className="home-layout">
        <FeaturedCategories />
        <BannerSlider />
      </div>
      <div>
        <FlashSale />
      </div>
      <div className="home-content">
        <div className="home-shop-card">
          <h2>Cửa hàng uy tín</h2>
          <div className="shop-list">   
            {mockShops.map((shop) => (
              <ShopCard key={shop.id} shop={shop} />
            ))}
          </div>
        </div>
        <div className="live-section">
          <h2>Đang livestream</h2>

          <div className="live-grid">
            {mockLiveShops.map((item) => (
              <LiveShopCard key={item.id} live={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
