import { Outlet } from "react-router-dom";
import ShopTabs from "../../components/layout/shopTabs";
import ShopHeader from "../../components/shop/shopHeader";
import "../../css/components/shop/shop.css";

export default function ShopPage() {
  return (
    <div className="shop-page">
      <div className="shop-banner">
        <img
          src="https://images.unsplash.com/photo-1523170335258-f5ed11844a49"
          alt=""
        />
      </div>

      <ShopHeader />

      <ShopTabs />

      <div className="shop-content">
        <Outlet />
      </div>
    </div>
  );
}
