import BannerSlider from "../../components/home/bannerSlider";
import FeaturedCategories from "../../components/home/featuredCategories";
import FlashSale from "../../components/home/flashSale";
import LiveShopCard from "../../components/live/liveShopCard";
import ShopCard from "../../components/shop/shopCard";
import "../../css/pages/home.css";
import type { shopCard } from "../../type/shop";
import type { ProductView } from "../../type/product";
import ProductCard from "../../components/product/productCard";

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

  const mockProducts: ProductView[] = [
    {
      id: "product-001",
      title: "Kem chống nắng SPF50+ PA++++",
      price: 150000,
      currency: "VND",
      thumbnailUrl: "https://picsum.photos/400/400?random=1",
      soldQuantity: 120,
      categoryName: "Mỹ phẩm",
      salesMode: "WHOLESALE",
      verificationLevel: "standard",
      offerStatus: "active",
      brandId: "brand-001",
      shopId: "shop-001",
    },
    {
      id: "product-002",
      title: "Serum Vitamin C dưỡng sáng da",
      price: 289000,
      currency: "VND",
      thumbnailUrl: "https://picsum.photos/400/400?random=2",
      soldQuantity: 356,
      categoryName: "Mỹ phẩm",
      salesMode: "RETAIL",
      verificationLevel: "standard",
      offerStatus: "active",
      brandId: "brand-002",
      shopId: "shop-002",
    },
    {
      id: "product-003",
      title: "Nồi chiên không dầu 6L",
      price: 1290000,
      currency: "VND",
      thumbnailUrl: "https://picsum.photos/400/400?random=3",
      soldQuantity: 520,
      categoryName: "Gia dụng",
      salesMode: "RETAIL",
      verificationLevel: "standard",
      offerStatus: "active",
      brandId: "brand-003",
      shopId: "shop-003",
    },
    {
      id: "product-004",
      title: "Tai nghe Bluetooth chống ồn",
      price: 790000,
      currency: "VND",
      thumbnailUrl: "https://picsum.photos/400/400?random=4",
      soldQuantity: 890,
      categoryName: "Điện tử",
      salesMode: "RETAIL",
      verificationLevel: "standard",
      offerStatus: "active",
      brandId: "brand-004",
      shopId: "shop-001",
    },
    {
      id: "product-005",
      title: "Laptop Gaming RTX 4060",
      price: 25990000,
      currency: "VND",
      thumbnailUrl: "https://picsum.photos/400/400?random=5",
      soldQuantity: 45,
      categoryName: "Máy tính",
      salesMode: "RETAIL",
      verificationLevel: "standard",
      offerStatus: "active",
      brandId: "brand-005",
      shopId: "shop-004",
    },
    {
      id: "product-006",
      title: "Áo thun nam cotton cao cấp",
      price: 189000,
      currency: "VND",
      thumbnailUrl: "https://picsum.photos/400/400?random=6",
      soldQuantity: 1350,
      categoryName: "Thời trang",
      salesMode: "WHOLESALE",
      verificationLevel: "standard",
      offerStatus: "active",
      brandId: "brand-006",
      shopId: "shop-005",
    },
    {
      id: "product-007",
      title: "Bàn phím cơ RGB Gaming",
      price: 650000,
      currency: "VND",
      thumbnailUrl: "https://picsum.photos/400/400?random=7",
      soldQuantity: 710,
      categoryName: "Phụ kiện",
      salesMode: "RETAIL",
      verificationLevel: "standard",
      offerStatus: "active",
      brandId: "brand-007",
      shopId: "shop-006",
    },
    {
      id: "product-008",
      title: "Chuột không dây Logitech",
      price: 420000,
      currency: "VND",
      thumbnailUrl: "https://picsum.photos/400/400?random=8",
      soldQuantity: 980,
      categoryName: "Phụ kiện",
      salesMode: "RETAIL",
      verificationLevel: "standard",
      offerStatus: "active",
      brandId: "brand-008",
      shopId: "shop-006",
    },
    {
      id: "product-009",
      title: "Yến mạch nguyên chất 1kg",
      price: 115000,
      currency: "VND",
      thumbnailUrl: "https://picsum.photos/400/400?random=9",
      soldQuantity: 2400,
      categoryName: "Thực phẩm",
      salesMode: "WHOLESALE",
      verificationLevel: "standard",
      offerStatus: "active",
      brandId: "brand-009",
      shopId: "shop-007",
    },
    {
      id: "product-010",
      title: "Nước giặt thiên nhiên 3.8L",
      price: 215000,
      currency: "VND",
      thumbnailUrl: "https://picsum.photos/400/400?random=10",
      soldQuantity: 670,
      categoryName: "Gia dụng",
      salesMode: "RETAIL",
      verificationLevel: "standar",
      offerStatus: "active",
      brandId: "brand-010",
      shopId: "shop-008",
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

     <div>
      <div className="product-grid">
        {mockProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
     </div>
      
    </div>
  );
}
