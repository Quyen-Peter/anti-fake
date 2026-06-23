import SellerRevenueChart from "../../components/dashboard/sellerRevenueChart";
import SellerStats from "../../components/dashboard/sellerStats";
import SellerTopProducts from "../../components/dashboard/sellerTopProducts";
import OrderCard from "../../components/orderManagement/orderCard";
import OrderTable from "../../components/orderManagement/orderTable";
import "../../css/pages/sellerDashboard.css";

export default function SellerDashboard() {
  const orders = [
    {
      id: "#AF-12845",
      customer: "Nguyễn Hoàng Nam",
      email: "nam.n@gmail.com",
      date: "24/05/2024, 14:20",
      total: "2,450,000đ",
      status: "processing",
    },
    {
      id: "#AF-12844",
      customer: "Phạm Thu Thảo",
      email: "thao.p@gmail.com",
      date: "24/05/2024, 11:05",
      total: "1,120,000đ",
      status: "shipping",
    },
    {
      id: "#AF-12843",
      customer: "Lê Duy Anh",
      email: "duyanh@gmail.com",
      date: "23/05/2024, 18:45",
      total: "5,800,000đ",
      status: "completed",
    },
    {
      id: "#AF-12842",
      customer: "Mai Tuyết Nhi",
      email: "nhi.mt@gmail.com",
      date: "23/05/2024, 09:30",
      total: "890,000đ",
      status: "cancelled",
    },
  ];
  return (
    <div className="seller-dashboard">
      <SellerStats />

      <div className="seller-dashboard-middle">
        <SellerRevenueChart />
        <SellerTopProducts />
      </div>
      <div className="seller-orders-card">

        <h3>Đơn đặt hàng mới</h3>

        <div className="seller-laptop-orders-table">
          <OrderTable orders={orders} />
        </div>

        <div className="seller-mobile-orders-card">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      </div>
    </div>
  );
}
