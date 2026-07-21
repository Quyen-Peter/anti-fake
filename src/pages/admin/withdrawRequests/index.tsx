import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  approveWalletWithdrawal,
  fetchAdminWalletWithdrawals,
  rejectWalletWithdrawal,
  type WalletWithdrawal,
} from "../../../services/wallet.api";
import { formatVnd } from "../../../ultil/currency";

const statusLabels: Record<string, string> = {
  PENDING: "Đang chờ xử lý",
  COMPLETED: "Đã hoàn tất",
  REJECTED: "Đã từ chối",
};

const formatDate = (value?: string | null) => {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
};

export default function AdminWithdrawRequestsPage() {
  const [items, setItems] = useState<WalletWithdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState("");
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });

  const loadWithdrawals = async () => {
    try {
      setLoading(true);
      setError("");
      const result = await fetchAdminWalletWithdrawals(page, 20, statusFilter);
      setItems(result.items);
      setPagination(result.pagination);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Không thể tải yêu cầu rút tiền";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWithdrawals();
  }, [statusFilter, page]);

  const changeStatus = (value: string) => { setStatusFilter(value); setPage(1); };

  const handleProcess = async (
    item: WalletWithdrawal,
    action: "approve" | "reject",
  ) => {
    try {
      setProcessingId(item.id);
      if (action === "approve") {
        await approveWalletWithdrawal(item.id);
        toast.success("Đã duyệt yêu cầu rút tiền");
      } else {
        await rejectWalletWithdrawal(item.id);
        toast.success("Đã từ chối yêu cầu rút tiền");
      }
      await loadWithdrawals();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Xử lý yêu cầu thất bại");
    } finally {
      setProcessingId("");
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-heading">
        <div>
          <h1>Quản lý yêu cầu rút tiền</h1>
          <p>Theo dõi và xử lý yêu cầu rút tiền từ ví shop.</p>
          <select value={statusFilter} onChange={(event) => changeStatus(event.target.value)} aria-label="Lọc trạng thái yêu cầu rút tiền">
            <option value="">Tất cả trạng thái</option><option value="PENDING">Đang chờ</option><option value="COMPLETED">Đã hoàn tất</option><option value="REJECTED">Đã từ chối</option>
          </select>
        </div>
      </div>

      <div className="admin-table-card">
        {loading ? <div className="admin-table-state">Đang tải yêu cầu...</div> : null}
        {!loading && error ? <div className="admin-table-state error">{error}</div> : null}
        {!loading && !error && items.length === 0 ? (
          <div className="admin-table-state">Chưa có yêu cầu rút tiền.</div>
        ) : null}

        {!loading && !error && items.length > 0 ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Mã yêu cầu</th>
                <th>Số tiền</th>
                <th>Ngân hàng</th>
                <th>Tài khoản</th>
                <th>Trạng thái</th>
                <th>Ngày tạo</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{formatVnd(item.amount)}</td>
                  <td>{item.bankName}</td>
                  <td>
                    <strong>{item.accountHolder}</strong>
                    <br />
                    <span>{item.accountNumber}</span>
                  </td>
                  <td>{statusLabels[item.status] ?? item.status}</td>
                  <td>{formatDate(item.createdAt)}</td>
                  <td>
                    {item.status === "PENDING" ? (
                      <div className="admin-table-actions">
                        <button
                          type="button"
                          disabled={processingId === item.id}
                          onClick={() => handleProcess(item, "approve")}
                        >
                          Duyệt
                        </button>
                        <button
                          type="button"
                          disabled={processingId === item.id}
                          onClick={() => handleProcess(item, "reject")}
                        >
                          Từ chối
                        </button>
                      </div>
                    ) : (
                      formatDate(item.processedAt)
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
        {!loading && !error && pagination.totalPages > 1 ? <div className="admin-pagination"><button disabled={page <= 1} onClick={() => setPage((value) => value - 1)}>Trước</button><span>Trang {page}/{pagination.totalPages}</span><button disabled={page >= pagination.totalPages} onClick={() => setPage((value) => value + 1)}>Sau</button></div> : null}
      </div>
    </div>
  );
}
