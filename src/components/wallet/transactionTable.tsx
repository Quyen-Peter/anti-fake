import {
  ArrowUpCircle,
  Calendar,
  Download,
  RotateCcw,
  ShoppingBag,
} from "lucide-react";
import type { WalletTransaction } from "../../services/wallet.api";
import "../../css/components/wallet/transactionTable.css";
import { formatVnd } from "../../ultil/currency";

type Props = {
  transactions?: WalletTransaction[];
  loading?: boolean;
};

const transactionLabels: Record<string, string> = {
  PAYMENT: "Thanh toán đơn hàng",
  REFUND: "Hoàn tiền đơn hàng",
  AFFILIATE_COMMISSION: "Hoa hồng Affiliate",
  DISPUTE_HOLD: "Tiền bị tạm khóa do tranh chấp",
  DISPUTE_RELEASE: "Tiền tranh chấp đã được mở khóa",
  DISPUTE_REFUND: "Hoàn tiền tranh chấp",
  SETTLEMENT: "Đối soát thành công",
  WITHDRAWAL_REQUEST: "Đã tạo yêu cầu rút tiền",
  WITHDRAWAL: "Rút tiền",
};

const statusLabels: Record<string, string> = {
  PENDING: "Đang xử lý",
  COMPLETED: "Hoàn thành",
  SUCCESS: "Hoàn thành",
  FAILED: "Thất bại",
  REJECTED: "Đã từ chối",
};

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
};

export default function TransactionTable({
  transactions = [],
  loading = false,
}: Props) {
  const renderType = (type: string) => {
    if (type === "WITHDRAWAL" || type === "WITHDRAWAL_REQUEST") {
      return (
        <>
          <ArrowUpCircle size={14} />
          {transactionLabels[type]}
        </>
      );
    }

    if (type === "PAYMENT" || type === "SETTLEMENT") {
      return (
        <>
          <ShoppingBag size={14} />
          {transactionLabels[type]}
        </>
      );
    }

    return (
      <>
        <RotateCcw size={14} />
        {transactionLabels[type] ?? type}
      </>
    );
  };

  return (
    <div className="wallet-table-card">
      <div className="wallet-table-header">
        <h3>Lịch sử giao dịch</h3>

        <div className="wallet-filters">
          <button type="button">Tất cả loại</button>

          <button type="button">
            <Calendar size={14} />
            Chọn ngày
          </button>

          <button type="button">
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
          {loading ? (
            <tr>
              <td colSpan={5}>Đang tải giao dịch...</td>
            </tr>
          ) : null}

          {!loading && transactions.length === 0 ? (
            <tr>
              <td colSpan={5}>Chưa có giao dịch ví.</td>
            </tr>
          ) : null}

          {!loading
            ? transactions.map((item) => (
                <tr key={item.transactionCode}>
                  <td>{item.transactionCode}</td>
                  <td>{formatDate(item.createdAt)}</td>
                  <td>{renderType(item.transactionType)}</td>
                  <td>
                    {item.direction === "CREDIT" ? "+" : "-"}
                    {formatVnd(item.amount)}
                  </td>

                  <td>
                    <span className={`status ${item.status.toLowerCase()}`}>
                      {statusLabels[item.status] ?? item.status}
                    </span>
                  </td>
                </tr>
              ))
            : null}
        </tbody>
      </table>
    </div>
  );
}
