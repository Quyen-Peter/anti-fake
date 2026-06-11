import BannerSlider from "../../components/home/bannerSlider";
import FeaturedCategories from "../../components/home/featuredCategories";
import FlashSale from "../../components/home/flashSale";
import "../../css/pages/home.css";

export default function HomePage() {
  return (
    <div className="home-container">
      <div className="home-layout">
        <FeaturedCategories />
        <BannerSlider />
      </div>
      <div>
        <FlashSale />
      </div>
    </div>
  );
}
