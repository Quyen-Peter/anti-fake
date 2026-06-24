import { Wallet } from "lucide-react";
import "../../css/components/wallet/walletBalance.css";

export default function WalletBalance() {
  return (
    <div className="wallet-balance-card">
      <p className="wallet-label">SỐ DƯ KHẢ DỤNG</p>

      <h2>125.000.000 ₫</h2>

      <div className="wallet-actions">
        <button className="withdraw-btn">
          <Wallet size={16} />
          Rút tiền
        </button>
      </div>
    </div>
  );
}