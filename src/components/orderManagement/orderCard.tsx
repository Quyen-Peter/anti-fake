import { Eye, Clock3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../../css/components/orderManagement/orderCard.css";

interface Props {
  order: {
    id: string;
    customer: string;
    email: string;
    date: string;
    total: string;
    status: string;
  };
}

export default function OrderCard({ order }: Props) {
  const navigate = useNavigate();

  const getStatus = () => {
    switch (order.status) {
      case "processing":
        return {
          text: "Đang xử lý",
          className: "processing",
        };

      case "shipping":
        return {
          text: "Đang giao",
          className: "shipping",
        };

      case "completed":
        return {
          text: "Hoàn thành",
          className: "completed",
        };

      case "cancelled":
        return {
          text: "Đã hủy",
          className: "cancelled",
        };

      default:
        return {
          text: order.status,
          className: "",
        };
    }
  };

  const status = getStatus();
  const orderId = encodeURIComponent(order.id.replace("#", ""));

  return (
    <div className="seller-mobile-order-card">
      <div className="seller-mobile-order-header">
        <span className="seller-mobile-order-id">{order.id}</span>

        <span className={`seller-mobile-order-status ${status.className}`}>
          {status.text}
        </span>
      </div>
      <h3>{order.customer}</h3>

      <div className="seller-mobile-order-date">
        <Clock3 size={14} />
        {order.date}
      </div>

      <div className="seller-mobile-order-footer">
        <div className="seller-mobile-order-price">{order.total}</div>

        <div className="seller-mobile-order-actions">
          <button
            type="button"
            aria-label="Xem chi tiet don hang"
            onClick={() => navigate(`/seller/orders/${orderId}`)}
          >
            <Eye size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
