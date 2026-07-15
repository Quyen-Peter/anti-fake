import { useEffect, useState } from "react";
import { toast } from "sonner";
import TransactionTable from "../../components/wallet/transactionTable";
import WalletBalance from "../../components/wallet/walletBalance";
import { getMyShop } from "../../services/shop.api";
import {
  createShopWithdrawal,
  fetchShopWallet,
  fetchShopWalletTransactions,
  type Wallet,
  type WalletTransaction,
} from "../../services/wallet.api";
import "../../css/pages/sellerWallet.css";

type SellerShop = {
  id?: string;
  shopId?: string;
};

export default function SellerWallet() {
  const [shopId, setShopId] = useState("");
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  const loadWallet = async (nextShopId: string) => {
    const [walletData, transactionData] = await Promise.all([
      fetchShopWallet(nextShopId),
      fetchShopWalletTransactions(nextShopId, 1, 20),
    ]);
    setWallet(walletData);
    setTransactions(transactionData.data);
  };

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const shop = (await getMyShop()) as SellerShop | null;
        const nextShopId = shop?.shopId || shop?.id;
        if (!nextShopId) {
          throw new Error("Không tìm thấy shop của seller");
        }

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

  const handleWithdraw = async () => {
    if (!shopId || !wallet) return;

    const amount = window.prompt("Nhập số tiền muốn rút");
    if (!amount) return;
    const bankName = window.prompt("Tên ngân hàng");
    const accountNumber = window.prompt("Số tài khoản");
    const accountHolder = window.prompt("Chủ tài khoản");

    if (!bankName || !accountNumber || !accountHolder) {
      toast.error("Vui lòng nhập đủ thông tin rút tiền");
      return;
    }

    try {
      setLoading(true);
      await createShopWithdrawal(shopId, {
        amount,
        bankName,
        accountNumber,
        accountHolder,
      });
      toast.success("Đã tạo yêu cầu rút tiền");
      await loadWallet(shopId);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không thể tạo yêu cầu rút tiền");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="seller-wallet-page">
      <div className="seller-wallet-top">
        <WalletBalance wallet={wallet} onWithdraw={handleWithdraw} />
      </div>

      <TransactionTable transactions={transactions} loading={loading} />
    </div>
  );
}
