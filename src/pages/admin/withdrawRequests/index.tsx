import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  approveWalletWithdrawal,
  completeWalletWithdrawal,
  fetchAdminWalletWithdrawals,
  rejectWalletWithdrawal,
  revealWalletWithdrawal,
  type WalletWithdrawal,
} from "../../../services/wallet.api";
import { formatVnd } from "../../../ultil/currency";
import "../../../css/pages/sellerWallet.css";

const statusLabels: Record<string, string> = {
  PENDING: "Đang chờ duyệt",
  APPROVED: "Đã duyệt, chờ chuyển khoản",
  PROCESSING: "Đang xử lý",
  COMPLETED: "Đã hoàn tất",
  REJECTED: "Đã từ chối",
  FAILED: "Thất bại",
  CANCELLED: "Đã hủy",
};

const formatDate = (value?: string | null) => {
  if (!value) return "--";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "short", timeStyle: "short",
  }).format(date);
};

export default function AdminWithdrawRequestsPage() {
  const [items, setItems] = useState<WalletWithdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState("");
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [action, setAction] = useState<{ id: string; type: "complete" | "reject" | "reveal" } | null>(null);
  const [actionValue, setActionValue] = useState("");
  const [revealed, setRevealed] = useState<Record<string, string>>({});
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });

  const loadWithdrawals = async () => {
    try {
      setLoading(true);
      setError("");
      const result = await fetchAdminWalletWithdrawals(page, 20, statusFilter);
      setItems(result.items);
      setPagination(result.pagination);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Không thể tải yêu cầu rút tiền";
      setError(message);
      toast.error(message);
    } finally { setLoading(false); }
  };

  useEffect(() => { loadWithdrawals(); }, [statusFilter, page]);

  const approve = async (id: string) => {
    try {
      setProcessingId(id);
      await approveWalletWithdrawal(id);
      toast.success("Đã duyệt yêu cầu. Tiền vẫn được giữ ở số dư khóa.");
      await loadWithdrawals();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không thể duyệt yêu cầu");
    } finally { setProcessingId(""); }
  };

  const submitAction = async () => {
    if (!action || !actionValue.trim()) return;
    try {
      setProcessingId(action.id);
      if (action.type === "complete") {
        await completeWalletWithdrawal(action.id, actionValue.trim());
        toast.success("Đã ghi mã chuyển khoản và hoàn tất yêu cầu");
      } else if (action.type === "reveal") {
        const detail = await revealWalletWithdrawal(action.id, actionValue.trim());
        setRevealed((current) => ({ ...current, [action.id]: detail.accountNumber }));
        toast.success("Đã ghi audit cho thao tác xem số tài khoản");
      } else {
        await rejectWalletWithdrawal(action.id, actionValue.trim());
        toast.success("Đã từ chối và hoàn lại số dư khả dụng");
      }
      setAction(null);
      setActionValue("");
      if (action.type !== "reveal") await loadWithdrawals();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Xử lý yêu cầu thất bại");
    } finally { setProcessingId(""); }
  };

  const openAction = (id: string, type: "complete" | "reject" | "reveal") => {
    setAction({ id, type });
    setActionValue("");
  };

  return (
    <div className="admin-page">
      <div className="admin-page-heading"><div><h1>Quản lý yêu cầu rút tiền</h1><p>Duyệt, đối chiếu chuyển khoản và chỉ hoàn tất sau khi có mã giao dịch ngân hàng.</p>
        <select value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value); setPage(1); }} aria-label="Lọc trạng thái yêu cầu rút tiền">
          <option value="">Tất cả trạng thái</option><option value="PENDING">Đang chờ</option><option value="APPROVED">Đã duyệt</option><option value="COMPLETED">Hoàn tất</option><option value="REJECTED">Từ chối</option>
        </select></div></div>

      <div className="admin-table-card">
        {loading ? <div className="admin-table-state">Đang tải yêu cầu...</div> : null}
        {!loading && error ? <div className="admin-table-state error">{error}</div> : null}
        {!loading && !error && items.length === 0 ? <div className="admin-table-state">Chưa có yêu cầu rút tiền.</div> : null}
        {!loading && !error && items.length > 0 ? <table className="admin-table"><thead><tr><th>Mã yêu cầu</th><th>Số tiền</th><th>Ngân hàng</th><th>Tài khoản</th><th>Trạng thái</th><th>Ngày tạo</th><th>Thao tác</th></tr></thead><tbody>
          {items.map((item) => <tr key={item.id}><td>{item.id}</td><td>{formatVnd(item.amount)}</td><td>{item.bankName}</td><td><strong>{item.accountHolder}</strong><br /><span>{revealed[item.id] ?? item.accountNumberMasked ?? "--"}</span></td><td>{statusLabels[item.status] ?? item.status}{item.rejectionReason ? <><br /><small>{item.rejectionReason}</small></> : null}</td><td>{formatDate(item.createdAt)}</td><td>
            {item.status === "PENDING" ? <div className="admin-table-actions"><button type="button" disabled={processingId === item.id} onClick={() => openAction(item.id, "reveal")}>Xem số TK</button><button type="button" disabled={processingId === item.id} onClick={() => approve(item.id)}>Duyệt</button><button type="button" disabled={processingId === item.id} onClick={() => openAction(item.id, "reject")}>Từ chối</button></div> : null}
            {item.status === "APPROVED" ? <div className="admin-table-actions"><button type="button" disabled={processingId === item.id} onClick={() => openAction(item.id, "reveal")}>Xem số TK</button><button type="button" disabled={processingId === item.id} onClick={() => openAction(item.id, "complete")}>Ghi nhận đã chuyển</button><button type="button" disabled={processingId === item.id} onClick={() => openAction(item.id, "reject")}>Từ chối</button></div> : null}
            {!["PENDING", "APPROVED"].includes(item.status) ? <span>{item.transferReference || formatDate(item.processedAt)}</span> : null}
          </td></tr>)}
        </tbody></table> : null}
        {!loading && !error && pagination.totalPages > 1 ? <div className="admin-pagination"><button disabled={page <= 1} onClick={() => setPage((value) => value - 1)}>Trước</button><span>Trang {page}/{pagination.totalPages}</span><button disabled={page >= pagination.totalPages} onClick={() => setPage((value) => value + 1)}>Sau</button></div> : null}
      </div>

      {action ? <div className="wallet-modal-backdrop" role="presentation"><section className="wallet-modal admin-wallet-action-modal" role="dialog" aria-modal="true"><header><div><p>{action.type === "complete" ? "HOÀN TẤT RÚT TIỀN" : action.type === "reveal" ? "DỮ LIỆU NGÂN HÀNG NHẠY CẢM" : "TỪ CHỐI RÚT TIỀN"}</p><h2>{action.type === "complete" ? "Nhập mã giao dịch ngân hàng" : action.type === "reveal" ? "Nhập lý do xem số tài khoản" : "Nhập lý do từ chối"}</h2></div></header><div className="wallet-modal-body"><label>{action.type === "complete" ? "Mã tham chiếu chuyển khoản" : "Lý do"}<input value={actionValue} onChange={(event) => setActionValue(event.target.value)} autoFocus maxLength={action.type === "complete" ? 150 : 500} /></label><p className="wallet-security-note">{action.type === "complete" ? "Chỉ xác nhận sau khi đã chuyển khoản thực tế. Khi hoàn tất, số tiền mới bị trừ khỏi số dư khóa." : action.type === "reveal" ? "Số tài khoản chỉ hiển thị trong phiên hiện tại và thao tác này được ghi audit." : "Từ chối sẽ trả số tiền đang khóa về số dư khả dụng."}</p></div><footer><button type="button" className="secondary" onClick={() => setAction(null)} disabled={Boolean(processingId)}>Hủy</button><button type="button" onClick={submitAction} disabled={!actionValue.trim() || Boolean(processingId)}>{processingId ? "Đang xử lý..." : "Xác nhận"}</button></footer></section></div> : null}
    </div>
  );
}
