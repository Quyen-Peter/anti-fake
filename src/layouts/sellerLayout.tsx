import { Outlet } from "react-router-dom";
import SellerHeader from "../components/layout/sellerHeader";
import { SellerShopProvider } from "../contexts/sellerShopProvider";
import "../css/pages/sellerLayout.css";

export default function SellerLayout() {
  return (
    <SellerShopProvider>
      <SellerHeader />

      <div className="app-container">
        <Outlet />
      </div>
    </SellerShopProvider>
  );
}
