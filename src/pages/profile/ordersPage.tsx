import { useEffect, useState } from "react";
import { AlertCircle, PackageOpen, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import OrderCard from "../../components/order/orderCard";
import { fetchMyOrders } from "../../services/order.api";
import type { Order } from "../../type/order";
import LoadingOverlay from "../../components/loadingOverlay";
import "../../css/pages/ordersPage.css";

export default function OrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);

    const loadOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await fetchMyOrders();
        setOrders(data);
      } catch (error) {
        console.error(error);
        setOrders([]);
        setError(
          error instanceof Error
            ? error.message
            : "Khong the tai danh sach don hang",
        );
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  if (loading) {
    return (
      <div className="profile-orders-page">
        <LoadingOverlay />
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-orders-page">
        <div className="profile-orders-state is-error" role="alert">
          <div className="profile-orders-state-icon">
            <AlertCircle size={30} />
          </div>
          <h2>Không thể tải đơn hàng</h2>
          <p>{error}</p>
          <button type="button" onClick={() => window.location.reload()}>
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="profile-orders-page">
        <div className="profile-orders-state" role="status">
          <div className="profile-orders-state-icon">
            <PackageOpen size={34} />
          </div>
          <h2>Bạn chưa có đơn hàng nào</h2>
          <p>
            Các đơn hàng bạn đặt trên AntiFake sẽ xuất hiện tại đây để theo dõi
            trạng thái giao hàng và thanh toán.
          </p>
          <button type="button" onClick={() => navigate("/search")}>
            <ShoppingBag size={18} />
            Khám phá sản phẩm
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-orders-page">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}
