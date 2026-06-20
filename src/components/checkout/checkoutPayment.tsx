import { Wallet, CreditCard, Landmark } from "lucide-react";

interface Props {
  payment: string;
  setPayment: (value: string) => void;
}

export default function CheckoutPayment({ payment, setPayment }: Props) {
  return (
    <div className="checkout-card">
      <div className="section-title">
        <Wallet size={18} />
        Phương thức thanh toán
      </div>

      <label className={`payment-item ${payment === "cod" ? "active" : ""}`}>
        <input
          type="radio"
          checked={payment === "cod"}
          onChange={() => setPayment("cod")}
        />
        <CreditCard size={18} />
        Thanh toán khi nhận hàng
      </label>

      <label className={`payment-item ${payment === "bank" ? "active" : ""}`}>
        <input
          type="radio"
          checked={payment === "bank"}
          onChange={() => setPayment("bank")}
        />
        <Landmark size={18} />
        Chuyển khoản ngân hàng
      </label>

      <label className={`payment-item ${payment === "wallet" ? "active" : ""}`}>
        <input
          type="radio"
          checked={payment === "wallet"}
          onChange={() => setPayment("wallet")}
        />
        <Wallet size={18} />
        Ví điện tử (MoMo, ZaloPay)
      </label>
    </div>
  );
}
