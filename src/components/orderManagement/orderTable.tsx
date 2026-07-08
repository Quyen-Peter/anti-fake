import { ClipboardList, Eye, MessageSquare } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import "../../css/components/orderManagement/orderTable.css";
import EmptyState from "../common/emptyState";
import { createUserChatThread } from "../../services/chat.api";

interface Order {
  id: string;
  customerId?: string;
  customer: string;
  email: string;
  date: string;
  total: string;
  status: string;
}

interface Props {
  orders: Order[];
}

export default function OrderTable({ orders }: Props) {
  const navigate = useNavigate();
  const [startingChatUserId, setStartingChatUserId] = useState("");

  const startChatWithCustomer = async (customerId: string) => {
    if (!customerId || startingChatUserId) return;

    setStartingChatUserId(customerId);

    try {
      const response = await createUserChatThread(customerId);

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
      setStartingChatUserId("");
    }
  };

  const getStatus = (status: string) => {
    switch (status) {
      case "pending":
      case "processing":
        return {
          text: "Chờ xử lý",
          className: "seller-order-status-processing",
        };

      case "shipping":
        return {
          text: "Đang giao",
          className: "seller-order-status-shipping",
        };

      case "completed":
        return {
          text: "Hoàn thành",
          className: "seller-order-status-completed",
        };

      case "cancelled":
        return {
          text: "Đã hủy",
          className: "seller-order-status-cancelled",
        };

      default:
        return {
          text: status,
          className: "",
        };
    }
  };

  if (orders.length === 0) {
    return (
      <EmptyState
        icon={<ClipboardList size={30} />}
        title="Không tìm thấy đơn hàng nào"
        description="Thử đổi bộ lọc, từ khóa tìm kiếm hoặc kiểm tra lại trạng thái đơn hàng."
        className="seller-order-empty"
      />
    );
  }

  return (
    <table className="seller-order-table">
      <thead>
        <tr>
          <th>Mã đơn hàng</th>
          <th>Khách hàng</th>
          <th>Ngày đặt</th>
          <th>Tổng tiền</th>
          <th>Trạng thái</th>
          <th>Thao tác</th>
        </tr>
      </thead>

      <tbody>
        {orders.map((order) => {
          const status = getStatus(order.status);
          const orderId = encodeURIComponent(order.id.replace("#", ""));

          return (
            <tr key={order.id}>
              <td className="seller-order-id">{order.id}</td>

              <td>
                <div className="seller-order-customer">
                  <div className="avatar">{order.customer.charAt(0)}</div>

                  <div>
                    <h4>{order.customer}</h4>
                    <span>{order.email}</span>
                  </div>
                </div>
              </td>

              <td>{order.date}</td>

              <td>{order.total}</td>

              <td>
                <span className={status.className}>{status.text}</span>
              </td>

              <td>
                <div className="seller-order-table-actions">
                  <button
                    type="button"
                    aria-label="Xem chi tiet don hang"
                    onClick={() => navigate(`/seller/orders/${orderId}`)}
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    type="button"
                    aria-label="Nhắn tin với khách hàng"
                    disabled={
                      !order.customerId ||
                      startingChatUserId === order.customerId
                    }
                    onClick={() => {
                      if (order.customerId) {
                        startChatWithCustomer(order.customerId);
                      }
                    }}
                  >
                    <MessageSquare size={16} />
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
