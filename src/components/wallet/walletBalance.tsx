import { Wallet } from "lucide-react";
import type { Wallet as WalletInfo } from "../../services/wallet.api";
import "../../css/components/wallet/walletBalance.css";
import { formatVnd } from "../../ultil/currency";

type Props = {
  wallet?: WalletInfo | null;
  onWithdraw?: () => void;
  disabled?: boolean;
};

export default function WalletBalance({
  wallet,
  onWithdraw,
  disabled = false,
}: Props) {
  const currency = wallet?.currency ?? "VND";

  return (
    <div className="wallet-balance-card">
      <p className="wallet-label">Số dư khả dụng</p>

      <h2>{formatVnd(wallet?.availableBalance ?? "0", currency)}</h2>

      <div className="wallet-balance-breakdown">
        <span>Chờ đối soát: {formatVnd(wallet?.pendingBalance ?? "0", currency)}</span>
        <span>Đang khóa: {formatVnd(wallet?.lockedBalance ?? "0", currency)}</span>
      </div>

      {wallet?.status && wallet.status !== "ACTIVE" ? (
        <p className="wallet-status-warning">Ví đang bị hạn chế: {wallet.status}</p>
      ) : null}

      <div className="wallet-actions">
        <button
          className="withdraw-btn"
          disabled={disabled || !wallet || wallet.status !== "ACTIVE"}
          onClick={onWithdraw}
          type="button"
        >
          <Wallet size={16} />
          Rút tiền
        </button>
      </div>
    </div>
  );
}
