import { Outlet, useParams } from "react-router-dom";
import ShopTabs from "../../components/layout/shopTabs";
import ShopHeader from "../../components/shop/shopHeader";
import "../../css/components/shop/shop.css";
import { useEffect, useState } from "react";
import type { shopCard } from "../../type/shop";
import { getShopDetail } from "../../services/shop.api";

export default function ShopPage() {
  const { shopId } = useParams<{ shopId: string }>();

  const [shop, setShop] = useState<shopCard | null>(null);

  useEffect(() => {
    if (!shopId) return;

    const loadShop = async () => {
      try {
        const data = await getShopDetail(shopId);
        setShop(data);
      } catch (error) {
        console.error(error);
      }
    };

    loadShop();
  }, [shopId]);

  return (
    <div className="shop-page">
      <div className="shop-banner">
        <img
          src="https://images.unsplash.com/photo-1523170335258-f5ed11844a49"
          alt=""
        />
      </div>

      {shop && <ShopHeader shop={shop} />}

      <ShopTabs />

      <div className="shop-content">
        <Outlet />
      </div>
    </div>
  );
}
