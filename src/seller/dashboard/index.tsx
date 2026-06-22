

import SellerRecentOrders from "../../components/dashboard/sellerRecentOrders";
import SellerRevenueChart from "../../components/dashboard/sellerRevenueChart";
import SellerStats from "../../components/dashboard/sellerStats";
import SellerTopProducts from "../../components/dashboard/sellerTopProducts";
import "../../css/pages/sellerDashboard.css";

export default function SellerDashboard() {
  return (
    <div className="seller-dashboard">
      <SellerStats />

      <div className="seller-dashboard-middle">
        <SellerRevenueChart />
        <SellerTopProducts />
      </div>

      <SellerRecentOrders />
    </div>
  );
}