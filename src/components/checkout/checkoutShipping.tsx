// components/checkout/CheckoutShipping.tsx

import { Truck } from "lucide-react";

interface Props {
  shipping: string;
  setShipping: (value: string) => void;
}

export default function CheckoutShipping({ shipping, setShipping }: Props) {
  return (
    <div className="checkout-card">
      <div className="section-title">
        <Truck size={18} />
        Phương thức vận chuyển
      </div>

      <div className="shipping-list">
        <label
          className={`shipping-item ${shipping === "fast" ? "active" : ""}`}
        >
          <input
            type="radio"
            checked={shipping === "fast"}
            onChange={() => setShipping("fast")}
          />

          <div>
            <strong>Giao hàng nhanh</strong>

            <p>Nhận hàng trong 24-48h</p>
          </div>

          <span>35.000đ</span>
        </label>

        <label
          className={`shipping-item ${shipping === "save" ? "active" : ""}`}
        >
          <input
            type="radio"
            checked={shipping === "save"}
            onChange={() => setShipping("save")}
          />

          <div>
            <strong>Tiết kiệm</strong>

            <p>Nhận hàng trong 3-5 ngày</p>
          </div>

          <span>15.000đ</span>
        </label>
      </div>
    </div>
  );
}
