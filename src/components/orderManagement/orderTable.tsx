import { Eye } from "lucide-react";
import "../../css/components/orderManagement/orderTable.css";

interface Order {
  id: string;
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
  const getStatus = (status: string) => {
    switch (status) {
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
      <div className="seller-order-empty">Không tìm thấy đơn hàng nào</div>
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
                  <button>
                    <Eye size={16} />
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
