import { useEffect, useMemo, useState } from "react";
import { ShieldCheck } from "lucide-react";

import "../../css/pages/checkout.css";

import { useLocation } from "react-router-dom";
import type { CheckoutShop, ShippingOption } from "../../type/checkout";
import CheckoutAddress from "../../components/checkout/checkoutAddress";
import CheckoutPayment from "../../components/checkout/checkoutPayment";
import CheckoutSummary from "../../components/checkout/checkoutSummary";
import CheckoutProducts from "../../components/checkout/checkoutProducts";
import CheckoutShipping from "../../components/checkout/checkoutShipping";
import { fetchShippingOptions } from "../../services/cart.api";
import type { Address } from "../../type/address";

export default function CheckoutPage() {
  const [payment, setPayment] = useState("bank");
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [selectedShippingCode, setSelectedShippingCode] = useState("");
  const [shippingLoading, setShippingLoading] = useState(false);
  const [shippingError, setShippingError] = useState("");
  const [shippingAddressKey, setShippingAddressKey] = useState("");
  const location = useLocation();

  const shops: CheckoutShop[] = useMemo(
    () => location.state?.shops ?? [],
    [location.state],
  );

  const cartItemIds = useMemo(
    () => shops.flatMap((shop) => shop.items).map((item) => item.id),
    [shops],
  );

  const handleAddressChange = (address?: Address) => {
    setShippingAddressKey(
      address ? `${address.id}-${address.wardCode ?? ""}` : "",
    );
  };

  useEffect(() => {
    if (cartItemIds.length === 0 || !shippingAddressKey) {
      setShippingOptions([]);
      setSelectedShippingCode("");
      return;
    }

    const loadShippingOptions = async () => {
      try {
        setShippingLoading(true);
        setShippingError("");

        const data = await fetchShippingOptions({ cartItemIds });

        setShippingOptions(data.options);
        setSelectedShippingCode((current) => {
          if (data.options.some((option) => option.optionCode === current)) {
            return current;
          }

          return data.options[0]?.optionCode ?? "";
        });
      } catch (error) {
        console.error(error);
        setShippingOptions([]);
        setSelectedShippingCode("");
        setShippingError(
          error instanceof Error
            ? error.message
            : "Không thể lấy phương thức vận chuyển",
        );
      } finally {
        setShippingLoading(false);
      }
    };

    loadShippingOptions();
  }, [cartItemIds, shippingAddressKey]);

  const subtotal = shops
    .flatMap((shop) => shop.items)
    .reduce((sum, item) => sum + item.unitPriceSnapshot * item.quantity, 0);

  const selectedShipping = shippingOptions.find(
    (option) => option.optionCode === selectedShippingCode,
  );

  const shippingFee = selectedShipping?.shippingFee ?? 0;

  const discount = 0;

  const total = subtotal + shippingFee - discount;

  return (
    <div className="checkout-page">
      <div className="checkout-left">
        {/* ADDRESS */}
        <CheckoutAddress onAddressChange={handleAddressChange} />

        {/* PRODUCTS */}
        <CheckoutProducts shops={shops} />

        {/* SHIPPING */}
        <CheckoutShipping
          error={shippingError}
          loading={shippingLoading}
          options={shippingOptions}
          selectedOptionCode={selectedShippingCode}
          setSelectedOptionCode={setSelectedShippingCode}
        />

        {/* PAYMENT */}
        <CheckoutPayment payment={payment} setPayment={setPayment} />
      </div>

      {/* SUMMARY */}
      <div className="checkout-right">
        <CheckoutSummary
          cartItemIds={cartItemIds}
          payment={payment}
          shippingOptionCode={selectedShippingCode}
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
