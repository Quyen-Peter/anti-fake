import { useEffect, useState } from "react";
import OrderCard from "../../components/order/orderCard";
import { fetchMyOrders } from "../../services/order.api";
import type { Order } from "../../type/order";
import LoadingOverlay from "../../components/loadingOverlay";

export default function OrdersPage() {
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
    return <div><LoadingOverlay/></div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (orders.length === 0) {
    return <div>Ban chua co don hang nao.</div>;
  }

  return (
    <div>
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}
