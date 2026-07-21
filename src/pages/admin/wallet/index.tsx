import { useEffect, useState } from "react";
import { toast } from "sonner";
import { fetchPlatformWallets, fetchWalletReconciliation, type PlatformWalletSnapshot } from "../../../services/wallet.api";
import { formatVnd } from "../../../ultil/currency";
import "../../../css/pages/adminWallet.css";

export default function AdminWalletPage() {
  const [wallets, setWallets] = useState<PlatformWalletSnapshot[]>([]);
  const [reconciliation, setReconciliation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try { const [walletData, report] = await Promise.all([fetchPlatformWallets(), fetchWalletReconciliation()]); setWallets(walletData); setReconciliation(report); }
    catch (error) { toast.error(error instanceof Error ? error.message : "Không thể tải dữ liệu ví hệ thống"); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  return <section className="admin-wallet-page"><div className="admin-wallet-heading"><div><p className="eyebrow">TÀI CHÍNH HỆ THỐNG</p><h1>Ví platform</h1><p>Theo dõi doanh thu, escrow và ledger của hệ thống.</p></div><button onClick={load} disabled={loading}>Làm mới</button></div><div className="admin-wallet-grid">{wallets.map(({ wallet }) => <article className="admin-platform-card" key={wallet.walletCode}><span>{wallet.platformCode}</span><strong>{formatVnd(wallet.availableBalance, wallet.currency)}</strong><dl><div><dt>Chờ xử lý</dt><dd>{formatVnd(wallet.pendingBalance, wallet.currency)}</dd></div><div><dt>Đang khóa</dt><dd>{formatVnd(wallet.lockedBalance, wallet.currency)}</dd></div></dl></article>)}</div><article className="admin-reconcile-card"><h2>Đối soát wallet</h2>{reconciliation?.summary ? <div className="admin-reconcile-grid">{Object.entries(reconciliation.summary).map(([key, value]) => <div key={key}><span>{key}</span><strong>{String(value)}</strong></div>)}</div> : <p>{loading ? "Đang tải..." : "Chưa có dữ liệu đối soát."}</p>}<p className="admin-wallet-note">Approve withdrawal hiện là xác nhận admin đã xử lý chuyển khoản thủ công.</p></article></section>;
}
