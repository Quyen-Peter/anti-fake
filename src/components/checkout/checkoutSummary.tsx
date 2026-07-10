import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { checkoutCart } from "../../services/cart.api";
import { checkoutBuyNow } from "../../services/product.api";
import { useGlobalLoadingStore } from "../../store/globalLoadingStore";
import type { BuyNowSelection, CheckoutSource } from "../../type/checkout";
import { formatVnd } from "../../ultil/currency";

interface Props {
  source: CheckoutSource;
  buyNowSelection?: BuyNowSelection;
  cartItemIds: string[];
  payment: string;
  shippingOptionCode: string;
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
}

const toPaymentMethod = (payment: string) => {
  if (payment === "cod") return "COD";
  return "PAYOS";
};

export default function CheckoutSummary({
  source,
  buyNowSelection,
  cartItemIds,
  payment,
  shippingOptionCode,
  subtotal,
  shippingFee,
  discount,
  total,
}: Props) {
  const navigate = useNavigate();
  const [affiliateCode, setAffiliateCode] = useState("");
  const [loading, setLoading] = useState(false);
  const showLoading = useGlobalLoadingStore((state) => state.showLoading);
  const hideLoading = useGlobalLoadingStore((state) => state.hideLoading);

  const handleCheckout = async () => {
    if (source === "cart" && cartItemIds.length === 0) {
      toast.error("Vui lòng chọn sản phẩm trước khi thanh toán");
      return;
    }

    if (source === "buy-now" && !buyNowSelection) {
      toast.error("Không tìm thấy thông tin sản phẩm mua ngay");
      return;
    }

    if (!shippingOptionCode) {
      toast.error("Vui lòng chọn phương thức vận chuyển");
      return;
    }

    try {
      setLoading(true);
      showLoading("Đang tạo thanh toán...");

      const paymentMethod = toPaymentMethod(payment);
      const checkout =
        source === "buy-now" && buyNowSelection
          ? await checkoutBuyNow({
              ...buyNowSelection,
              paymentMethod,
              shippingOptionCode,
            })
          : await checkoutCart({
              cartItemIds,
              paymentMethod,
              shippingOptionCode,
              affiliateCode: affiliateCode.trim() || undefined,
            });

      if (paymentMethod === "COD") {
        navigate("/payment-success", {
          replace: true,
          state: {
            checkout,
            paymentMethod,
            paymentStatus: "COD_PENDING",
          },
        });
        return;
      }

      navigate("/payment", {
        state: {
          checkout,
          amount: total,
        },
      });
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : "Không thể tạo thanh toán",
      );
    } finally {
      setLoading(false);
      hideLoading();
    }
  };

  return (
    <div className="summary-card">
      <h3>Tóm tắt đơn hàng</h3>

      <div className="voucher-box">
        <input
          placeholder="Nhập mã ưu đãi..."
          value={affiliateCode}
          onChange={(event) => setAffiliateCode(event.target.value)}
        />

        <button type="button">Áp dụng</button>
      </div>

      <div className="summary-row">
        <span>Tổng tiền hàng</span>
        <span>{formatVnd(subtotal)}</span>
      </div>

      <div className="summary-row">
        <span>Phí vận chuyển</span>
        <span>{formatVnd(shippingFee)}</span>
      </div>

      <div className="summary-row discount">
        <span>Giảm giá</span>
        <span>-{formatVnd(discount)}</span>
      </div>

      <div className="summary-total-checkout">
        <span>Tổng cộng</span>
        <strong>{formatVnd(total)}</strong>
      </div>

      <button
        type="button"
        className="checkout-btn"
        disabled={loading}
        onClick={handleCheckout}
      >
        Đặt hàng
      </button>
    </div>
  );
}
