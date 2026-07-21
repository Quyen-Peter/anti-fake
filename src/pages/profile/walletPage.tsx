import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Wallet as WalletIcon, ArrowDownToLine, RefreshCw } from "lucide-react";
import { createWalletTopUp, fetchMyWallet, fetchMyWalletTransactions, type Wallet, type WalletTransaction } from "../../services/wallet.api";
import { formatVnd } from "../../ultil/currency";
import "../../css/pages/profile/walletPage.css";

const labels: Record<string, string> = { TOP_UP: "Nạp tiền", PAYMENT: "Thanh toán", REFUND: "Hoàn tiền", WITHDRAWAL: "Rút tiền", ESCROW_RELEASE: "Đối soát" };

export default function WalletPage() {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchParams] = useSearchParams();

  const load = async () => {
    setLoading(true);
    try {
      const [walletData, transactionData] = await Promise.all([fetchMyWallet(), fetchMyWalletTransactions(1, 20)]);
      setWallet(walletData);
      setTransactions(transactionData.data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không thể tải ví user");
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);
  useEffect(() => { if (searchParams.get("topUp") === "returned") toast.info("Đã quay lại từ PayOS. Số dư sẽ cập nhật sau khi webhook xác nhận."); }, [searchParams]);

  const submitTopUp = async (event: React.FormEvent) => {
    event.preventDefault();
    const numericAmount = Number(amount);
    if (!Number.isSafeInteger(numericAmount) || numericAmount <= 0) { toast.error("Nhập số tiền nguyên VND lớn hơn 0"); return; }
    setSubmitting(true);
    try {
      const result = await createWalletTopUp(String(numericAmount), crypto.randomUUID());
      window.location.assign(result.checkoutUrl);
    } catch (error) { toast.error(error instanceof Error ? error.message : "Không thể tạo link nạp tiền"); } finally { setSubmitting(false); }
  };

  return <section className="wallet-page">
    <div className="wallet-page-heading"><div><p className="eyebrow">TÀI CHÍNH CÁ NHÂN</p><h1>Ví AntiFake</h1><p>Quản lý số dư và lịch sử giao dịch của bạn.</p></div><button className="wallet-refresh" onClick={load} disabled={loading}><RefreshCw size={16} /> Làm mới</button></div>
    <div className="wallet-page-grid">
      <div className="wallet-user-card"><WalletIcon size={22} /><span>Số dư khả dụng</span><strong>{loading ? "Đang tải..." : formatVnd(wallet?.availableBalance, wallet?.currency)}</strong><div><span>Chờ xử lý: {formatVnd(wallet?.pendingBalance, wallet?.currency)}</span><span>Đang khóa: {formatVnd(wallet?.lockedBalance, wallet?.currency)}</span></div></div>
      <form className="wallet-topup-card" onSubmit={submitTopUp}><div className="wallet-card-title"><ArrowDownToLine size={20} /><h2>Nạp tiền qua PayOS</h2></div><label>Số tiền (VND)<input inputMode="numeric" min="1" step="1" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="Ví dụ: 100000" /></label><button type="submit" disabled={submitting}>{submitting ? "Đang tạo link..." : "Nạp tiền"}</button><small>Bạn chỉ được cộng tiền sau khi PayOS gửi webhook xác nhận thành công.</small></form>
    </div>
    <div className="wallet-history-card"><h2>Lịch sử giao dịch</h2>{transactions.length === 0 && !loading ? <p className="wallet-empty">Chưa có giao dịch ví.</p> : <div className="wallet-history-list">{transactions.map((item) => <div className="wallet-history-row" key={`${item.transactionCode}-${item.createdAt}`}><div><strong>{labels[item.transactionType] ?? item.transactionType}</strong><small>{item.description ?? item.transactionCode}</small></div><span className={item.direction === "CREDIT" ? "credit" : "debit"}>{item.direction === "CREDIT" ? "+" : "-"}{formatVnd(item.amount, wallet?.currency)}</span></div>)}</div>}</div>
  </section>;
}
