
import TransactionTable from "../../components/wallet/transactionTable";
import WalletBalance from "../../components/wallet/walletBalance";
import "../../css/pages/sellerWallet.css";

export default function SellerWallet() {
  return (
    <div className="seller-wallet-page">
      <div className="seller-wallet-top">
        <WalletBalance />
      </div>

      <TransactionTable />
    </div>
  );
}