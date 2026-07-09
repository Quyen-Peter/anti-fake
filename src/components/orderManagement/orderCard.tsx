import { Clock3, Eye, Loader2, MessageSquare } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import "../../css/components/orderManagement/orderCard.css";
import { createUserChatThread } from "../../services/chat.api";

interface Props {
  order: {
    id: string;
    customerId?: string;
    customer: string;
    email: string;
    date: string;
    total: string;
    status: string;
  };
}

const statusMap: Record<string, { text: string; className: string }> = {
  pending: { text: "Chờ xác nhận", className: "pending" },
  processing: { text: "Đang xử lý", className: "processing" },
  shipping: { text: "Đang giao", className: "shipping" },
  delivered: { text: "Đã giao", className: "delivered" },
  cancelled: { text: "Đã hủy", className: "cancelled" },
};

export default function OrderCard({ order }: Props) {
  const navigate = useNavigate();
  const [startingChat, setStartingChat] = useState(false);

  const status =
    statusMap[String(order.status ?? "").toLowerCase()] ?? {
      text: order.status || "Không rõ",
      className: "pending",
    };
  const orderId = encodeURIComponent(order.id.replace("#", ""));

  const startChatWithCustomer = async () => {
    if (!order.customerId || startingChat) return;

    setStartingChat(true);

    try {
      const response = await createUserChatThread(order.customerId);

      if (response.success && response.threadId) {
        navigate(`/seller/chat/${response.threadId}`);
        return;
      }

      toast.error("Không thể mở cuộc trò chuyện");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Không thể mở cuộc trò chuyện";
      toast.error(message);
    } finally {
      setStartingChat(false);
    }
  };

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
            aria-label="Xem chi tiết đơn hàng"
            onClick={() => navigate(`/seller/orders/${orderId}`)}
          >
            <Eye size={18} />
          </button>
          <button
            type="button"
            className="seller-mobile-chat-button"
            aria-label="Nhắn tin với khách hàng"
            disabled={!order.customerId || startingChat}
            onClick={startChatWithCustomer}
          >
            {startingChat ? (
              <Loader2 size={18} className="seller-order-chat-spin" />
            ) : (
              <MessageSquare size={18} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
