import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  fetchAdminPayoutAccounts,
  fetchPlatformWallets,
  fetchWalletReconciliation,
  rejectPayoutAccount,
  revealPayoutAccount,
  verifyPayoutAccount,
  type PayoutAccount,
  type PlatformWalletSnapshot,
} from "../../../services/wallet.api";
import { formatVnd } from "../../../ultil/currency";
import "../../../css/pages/adminWallet.css";
import "../../../css/pages/sellerWallet.css";

type AccountAction = { id: string; type: "reveal" | "verify" | "reject" };

export default function AdminWalletPage() {
  const [wallets, setWallets] = useState<PlatformWalletSnapshot[]>([]);
  const [reconciliation, setReconciliation] = useState<any>(null);
  const [payoutAccounts, setPayoutAccounts] = useState<PayoutAccount[]>([]);
  const [payoutStatus, setPayoutStatus] = useState("PENDING");
  const [revealed, setRevealed] = useState<Record<string, string>>({});
  const [action, setAction] = useState<AccountAction | null>(null);
  const [actionValue, setActionValue] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [walletData, report, accounts] = await Promise.all([
        fetchPlatformWallets(), fetchWalletReconciliation(), fetchAdminPayoutAccounts(payoutStatus),
      ]);
      setWallets(walletData);
      setReconciliation(report);
      setPayoutAccounts(accounts);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không thể tải dữ liệu ví hệ thống");
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [payoutStatus]);

  const submitAction = async () => {
    if (!action || !actionValue.trim()) return;
    try {
      setLoading(true);
      if (action.type === "reveal") {
        const account = await revealPayoutAccount(action.id, actionValue.trim());
        setRevealed((current) => ({ ...current, [action.id]: account.accountNumber }));
        toast.success("Đã ghi audit cho thao tác xem số tài khoản");
      } else if (action.type === "verify") {
        await verifyPayoutAccount(action.id, actionValue.trim());
        toast.success("Đã xác minh tên người thụ hưởng");
      } else {
        await rejectPayoutAccount(action.id, actionValue.trim());
        toast.success("Đã từ chối tài khoản nhận tiền");
      }
      setAction(null);
      setActionValue("");
      if (action.type !== "reveal") await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không thể xử lý tài khoản nhận tiền");
    } finally { setLoading(false); }
  };

  return <section className="admin-wallet-page">
    <div className="admin-wallet-heading"><div><p className="eyebrow">TÀI CHÍNH HỆ THỐNG</p><h1>Ví platform</h1><p>Theo dõi doanh thu, escrow và ledger của hệ thống.</p></div><button onClick={load} disabled={loading}>Làm mới</button></div>
    <div className="admin-wallet-grid">{wallets.map(({ wallet }) => <article className="admin-platform-card" key={wallet.walletCode}><span>{wallet.platformCode}</span><strong>{formatVnd(wallet.availableBalance, wallet.currency)}</strong><dl><div><dt>Chờ xử lý</dt><dd>{formatVnd(wallet.pendingBalance, wallet.currency)}</dd></div><div><dt>Đang khóa</dt><dd>{formatVnd(wallet.lockedBalance, wallet.currency)}</dd></div></dl></article>)}</div>
    <article className="admin-reconcile-card"><h2>Đối soát wallet</h2>{reconciliation?.summary ? <div className="admin-reconcile-grid">{Object.entries(reconciliation.summary).map(([key, value]) => <div key={key}><span>{key}</span><strong>{String(value)}</strong></div>)}</div> : <p>{loading ? "Đang tải..." : "Chưa có dữ liệu đối soát."}</p>}<p className="admin-wallet-note">Duyệt yêu cầu rút tiền không làm tiền rời ví. Chỉ thao tác hoàn tất kèm mã chuyển khoản mới trừ số dư khóa.</p></article>

    <article className="admin-reconcile-card admin-payout-review">
      <div className="admin-wallet-heading"><div><p className="eyebrow">ĐỐI CHIẾU NGÂN HÀNG</p><h2>Tài khoản nhận tiền</h2><p>Kiểm tra tên người thụ hưởng trong ứng dụng ngân hàng. Không chấp nhận tài khoản bên thứ ba.</p></div><select value={payoutStatus} onChange={(event) => setPayoutStatus(event.target.value)}><option value="PENDING">Chờ xác minh</option><option value="VERIFIED">Đã xác minh</option><option value="REJECTED">Đã từ chối</option><option value="">Tất cả</option></select></div>
      {payoutAccounts.length === 0 ? <p>Không có tài khoản ở trạng thái này.</p> : <div className="admin-payout-list">{payoutAccounts.map((item) => <div key={item.id} className="admin-payout-row"><div><strong>{item.bankName} ({item.bankCode})</strong><span>{revealed[item.id] ?? item.accountNumberMasked}</span><small>Khai báo: {item.accountHolder}</small></div><div><span>{item.verificationStatus}</span>{item.rejectionReason ? <small>{item.rejectionReason}</small> : null}</div><div className="admin-table-actions"><button type="button" onClick={() => { setAction({ id: item.id, type: "reveal" }); setActionValue(""); }}>Xem số TK</button>{item.verificationStatus === "PENDING" ? <><button type="button" onClick={() => { setAction({ id: item.id, type: "verify" }); setActionValue(""); }}>Xác minh</button><button type="button" onClick={() => { setAction({ id: item.id, type: "reject" }); setActionValue(""); }}>Từ chối</button></> : null}</div></div>)}</div>}
    </article>

    {action ? <div className="wallet-modal-backdrop" role="presentation"><section className="wallet-modal admin-wallet-action-modal" role="dialog" aria-modal="true"><header><div><p>KIỂM SOÁT DỮ LIỆU NGÂN HÀNG</p><h2>{action.type === "verify" ? "Tên người thụ hưởng từ ngân hàng" : action.type === "reject" ? "Lý do từ chối" : "Lý do xem đầy đủ số tài khoản"}</h2></div></header><div className="wallet-modal-body"><label>{action.type === "verify" ? "Tên hiển thị trong ứng dụng ngân hàng" : "Lý do"}<input value={actionValue} onChange={(event) => setActionValue(event.target.value)} autoFocus /></label><p className="wallet-security-note">{action.type === "verify" ? "Tên này phải trùng KYC chủ shop hoặc tên pháp nhân đã xác minh. shopName không phải bằng chứng." : "Thao tác được ghi vào audit log."}</p></div><footer><button type="button" className="secondary" onClick={() => setAction(null)} disabled={loading}>Hủy</button><button type="button" onClick={submitAction} disabled={loading || !actionValue.trim()}>{loading ? "Đang xử lý..." : "Xác nhận"}</button></footer></section></div> : null}
  </section>;
}
