import { Wallet } from "lucide-react";
import "../../css/components/wallet/walletBalance.css";
import { formatVnd } from "../../ultil/currency";

export default function WalletBalance() {
  return (
    <div className="wallet-balance-card">
      <p className="wallet-label">SỐ DƯ KHẢ DỤNG</p>

      <h2>{formatVnd(125000000)}</h2>

      <div className="wallet-actions">
        <button className="withdraw-btn">
          <Wallet size={16} />
          Rút tiền
        </button>
      </div>
    </div>
  );
}
