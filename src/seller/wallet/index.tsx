import { useEffect, useState } from "react";
import { Building2, Plus, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import PayoutAccountModal from "../../components/wallet/payoutAccountModal";
import TransactionTable from "../../components/wallet/transactionTable";
import WalletBalance from "../../components/wallet/walletBalance";
import { getMyShop } from "../../services/shop.api";
import { completeEmailStepUpFromLink } from "../../services/withdrawal-step-up";
import {
  cancelShopWithdrawal,
  fetchShopPayoutAccounts,
  fetchShopWallet,
  fetchShopWalletTransactions,
  fetchShopWithdrawals,
  type PayoutAccount,
  type Wallet,
  type WalletTransaction,
  type WalletWithdrawal,
} from "../../services/wallet.api";
import { formatVnd } from "../../ultil/currency";
import "../../css/pages/sellerWallet.css";

type SellerShop = { id?: string; shopId?: string };

const payoutStatus: Record<string, string> = {
  PENDING: "Chờ admin xác minh",
  VERIFIED: "Đã xác minh",
  REJECTED: "Bị từ chối",
  DISABLED: "Đã vô hiệu hóa",
};

const withdrawalStatus: Record<string, string> = {
  PENDING: "Chờ duyệt",
  APPROVED: "Đã duyệt, chờ chuyển khoản",
  PROCESSING: "Đang xử lý",
  COMPLETED: "Đã chuyển khoản",
  REJECTED: "Đã từ chối",
  FAILED: "Thất bại",
  CANCELLED: "Đã hủy",
};

export default function SellerWallet() {
  const [shopId, setShopId] = useState("");
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [payoutAccounts, setPayoutAccounts] = useState<PayoutAccount[]>([]);
  const [withdrawals, setWithdrawals] = useState<WalletWithdrawal[]>([]);
  const [modalMode, setModalMode] = useState<"add-account" | "withdraw" | null>(null);
  const [loading, setLoading] = useState(true);

  const loadWallet = async (nextShopId: string) => {
    const [walletData, transactionData, accountData, withdrawalData] = await Promise.all([
      fetchShopWallet(nextShopId),
      fetchShopWalletTransactions(nextShopId, 1, 20),
      fetchShopPayoutAccounts(nextShopId),
      fetchShopWithdrawals(nextShopId),
    ]);
    setWallet(walletData);
    setTransactions(transactionData.data);
    setPayoutAccounts(accountData);
    setWithdrawals(withdrawalData);
  };

  useEffect(() => {
    completeEmailStepUpFromLink()
      .then((completed) => completed && toast.success("Email đã được xác thực. Hãy quay lại tab rút tiền ban đầu."))
      .catch((error) => toast.error(error instanceof Error ? error.message : "Không thể xác thực liên kết email"));
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const shop = (await getMyShop()) as SellerShop | null;
        const nextShopId = shop?.shopId || shop?.id;
        if (!nextShopId) throw new Error("Không tìm thấy shop của người bán");
        setShopId(String(nextShopId));
        await loadWallet(String(nextShopId));
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Không thể tải ví shop");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const refresh = async () => {
    if (!shopId) return;
    setLoading(true);
    try { await loadWallet(shopId); } finally { setLoading(false); }
  };

  const cancelWithdrawal = async (id: string) => {
    if (!shopId) return;
    try {
      setLoading(true);
      await cancelShopWithdrawal(shopId, id);
      toast.success("Đã hủy yêu cầu và hoàn lại số dư khả dụng");
      await loadWallet(shopId);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không thể hủy yêu cầu rút tiền");
    } finally { setLoading(false); }
  };

  return (
    <div className="seller-wallet-page">
      <div className="seller-wallet-top">
        <WalletBalance wallet={wallet} onWithdraw={() => setModalMode("withdraw")} />
      </div>

      <section className="seller-payout-section">
        <div className="seller-wallet-section-heading">
          <div><p>TÀI KHOẢN NHẬN TIỀN</p><h2>Ngân hàng đã liên kết</h2><span>Chỉ tài khoản trùng KYC hoặc pháp nhân đã xác minh mới được duyệt.</span></div>
          <button type="button" onClick={() => setModalMode("add-account")}><Plus size={16} /> Thêm tài khoản</button>
        </div>
        {payoutAccounts.length === 0 ? <div className="seller-wallet-empty">Chưa có tài khoản nhận tiền.</div> : (
          <div className="seller-payout-grid">{payoutAccounts.map((item) => {
            const coolingDown = item.verificationStatus === "VERIFIED" && new Date(item.availableAfter).getTime() > Date.now();
            return <article key={item.id} className="seller-payout-card">
              <div className="seller-payout-icon"><Building2 size={20} /></div>
              <div><strong>{item.bankName} ({item.bankCode})</strong><span>{item.accountNumberMasked}</span><small>{item.accountHolder}</small></div>
              <span className={`seller-payout-status ${item.verificationStatus.toLowerCase()}`}><ShieldCheck size={14} /> {coolingDown ? "Chờ bảo mật 24 giờ" : payoutStatus[item.verificationStatus] ?? item.verificationStatus}</span>
              {item.rejectionReason ? <p className="seller-payout-reason">{item.rejectionReason}</p> : null}
            </article>;
          })}</div>
        )}
      </section>

      <section className="seller-payout-section">
        <div className="seller-wallet-section-heading"><div><p>LỊCH SỬ RÚT TIỀN</p><h2>Yêu cầu gần đây</h2></div></div>
        {withdrawals.length === 0 ? <div className="seller-wallet-empty">Chưa có yêu cầu rút tiền.</div> : (
          <div className="seller-withdrawal-list">{withdrawals.map((item) => <article key={item.id}>
            <div><strong>{formatVnd(item.amount)}</strong><span>{item.bankName} · {item.accountNumberMasked}</span></div>
            <div><span className={`seller-withdrawal-status ${item.status.toLowerCase()}`}>{withdrawalStatus[item.status] ?? item.status}</span><small>{new Date(item.createdAt).toLocaleString("vi-VN")}</small>{item.status === "PENDING" ? <button className="seller-cancel-withdrawal" type="button" disabled={loading} onClick={() => cancelWithdrawal(item.id)}>Hủy yêu cầu</button> : null}</div>
          </article>)}</div>
        )}
      </section>

      <TransactionTable transactions={transactions} loading={loading} />

      <PayoutAccountModal
        open={Boolean(modalMode)}
        mode={modalMode ?? "withdraw"}
        shopId={shopId}
        payoutAccounts={payoutAccounts}
        onClose={() => setModalMode(null)}
        onSuccess={refresh}
      />
    </div>
  );
}
