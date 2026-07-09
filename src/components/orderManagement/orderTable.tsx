import { ClipboardList, Eye, Loader2, MessageSquare } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import "../../css/components/orderManagement/orderTable.css";
import { createUserChatThread } from "../../services/chat.api";
import EmptyState from "../common/emptyState";

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

const statusMap: Record<string, { text: string; className: string }> = {
  pending: {
    text: "Chờ xác nhận",
    className: "seller-order-status-pending",
  },
  processing: {
    text: "Đang xử lý",
    className: "seller-order-status-processing",
  },
  shipping: {
    text: "Đang giao",
    className: "seller-order-status-shipping",
  },
  delivered: {
    text: "Đã giao",
    className: "seller-order-status-delivered",
  },
  cancelled: {
    text: "Đã hủy",
    className: "seller-order-status-cancelled",
  },
};

const getStatus = (status: string) => {
  const value = String(status ?? "").toLowerCase();
  return (
    statusMap[value] ?? {
      text: status || "Không rõ",
      className: "seller-order-status-pending",
    }
  );
};

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
          const isStartingChat = startingChatUserId === order.customerId;

          return (
            <tr key={order.id}>
              <td className="seller-order-id">{order.id}</td>

              <td>
                <div className="seller-order-customer">
                  <div className="avatar">{order.customer.charAt(0)}</div>

                  <div>
                    <h4>{order.customer}</h4>
                    <span>{order.email || "Chưa có email"}</span>
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
                    className="seller-order-action-icon"
                    aria-label="Xem chi tiết đơn hàng"
                    onClick={() => navigate(`/seller/orders/${orderId}`)}
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    type="button"
                    className="seller-order-chat-button"
                    disabled={!order.customerId || isStartingChat}
                    onClick={() => {
                      if (order.customerId) {
                        startChatWithCustomer(order.customerId);
                      }
                    }}
                  >
                    {isStartingChat ? (
                      <Loader2 size={15} className="seller-order-chat-spin" />
                    ) : (
                      <MessageSquare size={15} />
                    )}
                    <span>{isStartingChat ? "Đang mở..." : "Nhắn tin"}</span>
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
