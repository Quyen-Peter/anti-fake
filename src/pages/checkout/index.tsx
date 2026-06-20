import { useState } from "react";
import { ShieldCheck } from "lucide-react";

import "../../css/pages/checkout.css";
import CheckoutAddress from "../../components/checkout/checkoutAddress";
import CheckoutProducts from "../../components/checkout/CheckoutProducts";
import CheckoutShipping from "../../components/checkout/CheckoutShipping";
import CheckoutPayment from "../../components/checkout/checkoutPayment";
import CheckoutSummary from "../../components/checkout/checkoutSummary";
import { useLocation } from "react-router-dom";
import type { CheckoutShop } from "../../type/checkout";

export default function CheckoutPage() {
  const [shipping, setShipping] = useState("fast");
  const [payment, setPayment] = useState("wallet");
  const location = useLocation();

  const shops: CheckoutShop[] = location.state?.shops || [];

  const subtotal = shops
    .flatMap((shop) => shop.items)
    .reduce((sum, item) => sum + item.unitPriceSnapshot * item.quantity, 0);

  const shippingFee = shipping === "fast" ? 35000 : 15000;

  const discount = 0;

  const total = subtotal + shippingFee - discount;

  return (
    <div className="checkout-page">
      <div className="checkout-left">
        {/* ADDRESS */}
        <CheckoutAddress />

        {/* PRODUCTS */}
        <CheckoutProducts shops={shops} />

        {/* SHIPPING */}
        <CheckoutShipping shipping={shipping} setShipping={setShipping} />

        {/* PAYMENT */}
        <CheckoutPayment payment={payment} setPayment={setPayment} />
      </div>

      {/* SUMMARY */}
      <div className="checkout-right">
        <CheckoutSummary
          subtotal={subtotal}
          shippingFee={shippingFee}
          discount={discount}
          total={total}
        />

        <div className="security-box">
          <ShieldCheck size={18} />
          Giao dịch được bảo mật
        </div>
      </div>
    </div>
  );
}
