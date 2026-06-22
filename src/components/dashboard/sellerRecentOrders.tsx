import { Eye } from "lucide-react";

export default function SellerRecentOrders() {
  const orders = [
    {
      id: "#AF-9921",
      customer: "Nguyễn Văn A",
      amount: "15.800.000đ",
      status: "Chờ xử lý",
    },
    {
      id: "#AF-9918",
      customer: "Trần Thị B",
      amount: "2.450.000đ",
      status: "Chờ xử lý",
    },
  ];

  return (
    <div className="seller-orders-card">
      <h3>Đơn hàng mới</h3>

      <table className="seller-orders-table">
        <thead>
          <tr>
            <th>Mã đơn</th>
            <th>Khách hàng</th>
            <th>Giá trị</th>
            <th>Trạng thái</th>
            <th className="seller-action-recent-order"></th>
          </tr>
        </thead>

        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{o.customer}</td>
              <td>{o.amount}</td>
              <td>
                <span className="seller-status">{o.status}</span>
              </td>

              <td className="seller-action-recent-order">
                <Eye size={18} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
