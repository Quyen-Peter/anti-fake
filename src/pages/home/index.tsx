import BannerSlider from "../../components/home/bannerSlider";
import FeaturedCategories from "../../components/home/featuredCategories";
import FlashSale from "../../components/home/flashSale";
import LiveShopCard from "../../components/live/liveShopCard";
import ShopCard from "../../components/shop/shopCard";
import "../../css/pages/home.css";
import type { shopCard } from "../../type/shop";
import type { ProductView } from "../../type/product";
import ProductCard from "../../components/product/productCard";
import Footer from "../../components/layout/footer";
import { useEffect, useState } from "react";
import { fetchOffers } from "../../services/product.api";
import { fetchShops } from "../../services/shop.api";

export default function HomePage() {
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

  const [products, setProducts] = useState<ProductView[]>([]);
  const [shop, setShop] = useState<shopCard[]>([]);
  const [page, setPage] = useState(1);
  const pageSize = 20;

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchOffers(page, pageSize);

        setProducts((prev) => {
          const existingIds = new Set(prev.map((p) => p.id));

          const newItems = ((data.items as ProductView[]) || []).filter(
            (item) => !existingIds.has(item.id),
          );

          return [...prev, ...newItems];
        });
      } catch (error) {
        console.error("Load products error:", error);
      }
    };

    loadProducts();
  }, [page, pageSize]);

  useEffect(() => {
    const loadShops = async () => {
      try {
        const data = await fetchShops(1, 5);
        setShop(data.items || []);
      } catch (error) {
        console.error(error);
      }
    };

    loadShops();
  }, []);

  return (
    <div className="home-container">
      <div className="home-layout">
        <FeaturedCategories />
        <BannerSlider />
      </div>
      <div className="home-flash-sale">
        <FlashSale />
      </div>
      <div className="home-content">
        <div className="home-shop-card">
          <h2>Cửa hàng uy tín</h2>
          <div className="shop-list">
            {shop.map((shop) => (
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

      <div className="home-product">
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="load-more-wrapper">
          <button
            className="load-more-btn"
            onClick={() => setPage((prev) => prev + 1)}
          >
            Xem thêm sản phẩm
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
