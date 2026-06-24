import {
  Download,
  Calendar,
  ArrowUpCircle,
  ShoppingBag,
  RotateCcw,
} from "lucide-react";
import "../../css/components/wallet/transactionTable.css";

const transactions = [
  {
    id: "#AF-77291",
    date: "15:30 - 24/10/2023",
    type: "withdraw",
    amount: "-10.000.000₫",
    status: "success",
  },
  {
    id: "#AF-77285",
    date: "09:12 - 24/10/2023",
    type: "order",
    amount: "+2.450.000₫",
    status: "success",
  },
  {
    id: "#AF-77280",
    date: "18:45 - 23/10/2023",
    type: "withdraw",
    amount: "-5.000.000₫",
    status: "processing",
  },
  {
    id: "#AF-77272",
    date: "10:00 - 23/10/2023",
    type: "refund",
    amount: "-1.200.000₫",
    status: "failed",
  },
];

export default function TransactionTable() {
  const renderType = (type: string) => {
    switch (type) {
      case "withdraw":
        return (
          <>
            <ArrowUpCircle size={14} />
            Rút tiền
          </>
        );

      case "order":
        return (
          <>
            <ShoppingBag size={14} />
            Doanh thu đơn hàng
          </>
        );

      default:
        return (
          <>
            <RotateCcw size={14} />
            Hoàn tiền
          </>
        );
    }
  };

  return (
    <div className="wallet-table-card">
      <div className="wallet-table-header">
        <h3>Lịch sử giao dịch</h3>

        <div className="wallet-filters">
          <button>Tất cả loại</button>

          <button>
            <Calendar size={14} />
            Chọn ngày
          </button>

          <button>
            <Download size={14} />
          </button>
        </div>
      </div>

      <table className="wallet-table">
        <thead>
          <tr>
            <th>Mã giao dịch</th>
            <th>Ngày & Giờ</th>
            <th>Loại</th>
            <th>Số tiền</th>
            <th>Trạng thái</th>
          </tr>
        </thead>

        <tbody>
          {transactions.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.date}</td>
              <td>{renderType(item.type)}</td>
              <td>{item.amount}</td>

              <td>
                <span className={`status ${item.status}`}>
                  {item.status === "success" && "Hoàn thành"}
                  {item.status === "processing" && "Đang xử lý"}
                  {item.status === "failed" && "Thất bại"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="wallet-pagination">
        <button>‹</button>
        <button className="active">1</button>
        <button>2</button>
        <button>3</button>
        <button>›</button>
      </div>
    </div>
  );
}