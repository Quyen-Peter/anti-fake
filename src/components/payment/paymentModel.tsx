import {
  AlertTriangle,
  ArrowLeft,
  CircleHelp,
  ExternalLink,
  Landmark,
  Loader2,
  QrCode,
  RefreshCw,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { usePayOS, type PayOSConfig } from "@payos/payos-checkout";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

import "../../css/components/payment/paymentModel.css";
import { fetchOrderDetail } from "../../services/order.api";
import { formatVnd } from "../../ultil/currency";

type PaymentModelProps = {
  amount?: number;
  orderCode?: string | number;
  onBack?: () => void;
  onSupport?: () => void;
};

type CheckoutState = {
  orderId: string;
  orderCode: string | number;
  checkoutUrl: string;
};

const successStatuses = new Set(["PAID", "SUCCESS", "SUCCEEDED"]);
const failedStatuses = new Set(["FAILED", "CANCELLED", "CANCELED", "EXPIRED"]);

const firstValue = <T,>(...values: Array<T | undefined | null>) =>
  values.find((value) => value !== undefined && value !== null);

const isCheckoutState = (value: unknown): value is CheckoutState => {
  if (!value || typeof value !== "object") return false;

  const checkout = value as Partial<CheckoutState>;

  return Boolean(
    checkout.orderId &&
      checkout.orderCode &&
      typeof checkout.checkoutUrl === "string" &&
      checkout.checkoutUrl.startsWith("https://pay.payos.vn/"),
  );
};

export default function PaymentModel({
  amount,
  orderCode,
  onBack,
  onSupport,
}: PaymentModelProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const checkout = location.state?.checkout;
  const hasCheckout = isCheckoutState(checkout);
  const navigatedRef = useRef(false);
  const [embedError, setEmbedError] = useState("");
  const [checkingPayment, setCheckingPayment] = useState(false);
  const [openingPayos, setOpeningPayos] = useState(false);

  const displayAmount = Number(firstValue(amount, location.state?.amount, 0));
  const displayOrderCode = String(
    firstValue(
      orderCode,
      hasCheckout ? checkout.orderCode : undefined,
      hasCheckout ? checkout.orderId : undefined,
      "Đang tạo",
    ),
  );
  const checkoutUrl = hasCheckout ? checkout.checkoutUrl : "";

  const finishPayment = (
    result: "success" | "failed",
    paymentStatus: string,
    reason?: string,
  ) => {
    if (navigatedRef.current) return;
    navigatedRef.current = true;

    navigate(result === "success" ? "/payment-success" : "/payment-failed", {
      replace: true,
      state: {
        checkout: hasCheckout ? checkout : undefined,
        paymentMethod: "PAYOS",
        paymentStatus,
        reason,
      },
    });
  };

  const checkPaymentNow = async () => {
    if (!hasCheckout || checkingPayment) return;

    setCheckingPayment(true);

    try {
      const order = await fetchOrderDetail(checkout.orderId);
      const paymentStatus = String(order.paymentStatus ?? "").toUpperCase();

      if (successStatuses.has(paymentStatus)) {
        finishPayment("success", paymentStatus);
        return;
      }

      if (failedStatuses.has(paymentStatus)) {
        finishPayment("failed", paymentStatus, "Thanh toán không thành công");
        return;
      }
    } catch (error) {
      setEmbedError(
        error instanceof Error
          ? error.message
          : "Không thể kiểm tra trạng thái thanh toán",
      );
    } finally {
      setCheckingPayment(false);
    }
  };

  const openPayosPage = () => {
    if (!checkoutUrl) return;
    setOpeningPayos(true);
    window.open(checkoutUrl, "_blank", "noopener,noreferrer");
    window.setTimeout(() => setOpeningPayos(false), 900);
  };

  const payOSConfig = useMemo<PayOSConfig>(
    () => ({
      RETURN_URL: `${window.location.origin}/payment`,
      ELEMENT_ID: "payos-checkout-frame",
      CHECKOUT_URL: checkoutUrl,
      embedded: true,
      onSuccess: () => finishPayment("success", "PAID"),
      onCancel: () =>
        finishPayment("failed", "CANCELLED", "Người dùng đã hủy thanh toán"),
      onExit: () => {
        setEmbedError(
          "Cửa sổ thanh toán đã đóng. Nếu bạn đã thanh toán, hãy bấm kiểm tra lại trạng thái.",
        );
      },
    }),
    [checkoutUrl, hasCheckout],
  );

  const { open } = usePayOS(payOSConfig);

  useEffect(() => {
    if (!checkoutUrl) return;

    try {
      open();
    } catch (error) {
      setEmbedError(
        error instanceof Error
          ? error.message
          : "Không thể nhúng mã QR PayOS vào trang",
      );
    }
  }, [checkoutUrl, open]);

  useEffect(() => {
    const status =
      searchParams.get("status") ??
      searchParams.get("code") ??
      searchParams.get("paymentStatus");
    const cancel = searchParams.get("cancel");

    if (cancel === "true") {
      finishPayment("failed", "CANCELLED", "Người dùng đã hủy thanh toán");
      return;
    }

    if (!status) return;

    const normalizedStatus = status.toUpperCase();
    if (successStatuses.has(normalizedStatus) || normalizedStatus === "00") {
      finishPayment("success", "PAID");
      return;
    }

    if (failedStatuses.has(normalizedStatus)) {
      finishPayment("failed", normalizedStatus, "Thanh toán không thành công");
    }
  }, [searchParams]);

  useEffect(() => {
    if (!hasCheckout) return;

    const intervalId = window.setInterval(() => {
      if (!navigatedRef.current) {
        checkPaymentNow();
      }
    }, 3500);

    return () => window.clearInterval(intervalId);
  }, [hasCheckout, checkout?.orderId]);

  useEffect(() => {
    if (!checkoutUrl) return;

    const timeoutId = window.setTimeout(() => {
      const frame = document.querySelector("#payos-checkout-frame iframe");
      if (!frame && !navigatedRef.current) {
        setEmbedError(
          "Mã QR PayOS chưa hiển thị. Bạn có thể mở trang PayOS để tiếp tục thanh toán.",
        );
      }
    }, 4500);

    return () => window.clearTimeout(timeoutId);
  }, [checkoutUrl]);

  return (
    <section className="payment-model-page">
      <div className="payment-model-shell">
        <header className="payment-model-header">
          <div>
            <h1>Thanh toán đơn hàng</h1>
            <p>Quét mã QR PayOS bên dưới để hoàn tất giao dịch.</p>
          </div>

          <div className="payment-order-code">
            <span>Mã đơn hàng</span>
            <strong>{displayOrderCode}</strong>
          </div>
        </header>

        <div className="payment-model-content">
          <div className="payment-qr-card">
            <div className="payment-safe-badge">
              <ShieldCheck size={15} />
              Giao dịch an toàn
            </div>

            {checkoutUrl ? (
              <>
                <div id="payos-checkout-frame" className="payment-embed-frame" />
                {embedError ? (
                  <div className="payment-embed-alert" role="alert">
                    <AlertTriangle size={18} />
                    <div>
                      <strong>Không thể hiển thị QR ổn định</strong>
                      <p>{embedError}</p>
                    </div>
                  </div>
                ) : null}
              </>
            ) : (
              <div className="payment-qr-frame">
                <div className="payment-qr-placeholder">
                  <span>Chưa có thông tin thanh toán</span>
                </div>
              </div>
            )}

            <strong className="payment-amount">{formatVnd(displayAmount)}</strong>
            <p className="payment-auto-note">
              Hệ thống tự kiểm tra kết quả sau khi bạn thanh toán
            </p>

            {checkoutUrl ? (
              <div className="payment-link-actions">
                <button
                  type="button"
                  className="payment-open-link"
                  onClick={openPayosPage}
                  disabled={openingPayos}
                >
                  {openingPayos ? (
                    <Loader2 size={16} className="payment-spin" />
                  ) : (
                    <ExternalLink size={16} />
                  )}
                  Mở trang PayOS
                </button>
                <button
                  type="button"
                  className="payment-check-btn"
                  onClick={checkPaymentNow}
                  disabled={checkingPayment}
                >
                  {checkingPayment ? (
                    <Loader2 size={16} className="payment-spin" />
                  ) : (
                    <RefreshCw size={16} />
                  )}
                  Kiểm tra thanh toán
                </button>
              </div>
            ) : null}

            {checkingPayment ? (
              <div
                className="payment-checking-note"
                role="status"
                aria-live="polite"
              >
                Đang kiểm tra kết quả thanh toán từ đơn hàng...
              </div>
            ) : null}

            <div
              className="payment-method-icons"
              aria-label="Phương thức hỗ trợ"
            >
              <span>
                <Landmark size={20} />
              </span>
              <span>
                <Wallet size={20} />
              </span>
              <span>
                <QrCode size={20} />
              </span>
            </div>
          </div>

          <div className="payment-guide-area">
            <div className="payment-guide-card">
              <h2>Hướng dẫn thanh toán</h2>

              <ol>
                <li>
                  <span>1</span>
                  Mở ứng dụng Ngân hàng hoặc Ví điện tử.
                </li>
                <li>
                  <span>2</span>
                  Chọn chức năng "Quét mã QR".
                </li>
                <li>
                  <span>3</span>
                  Quét mã QR, xác nhận thanh toán và chờ hệ thống kiểm tra.
                </li>
              </ol>

              <div className="payment-guide-watermark" aria-hidden="true">
                <Wallet size={82} />
              </div>
            </div>

            <div className="payment-action-row">
              <button
                type="button"
                className="payment-back-btn"
                onClick={onBack ?? (() => navigate(-1))}
              >
                <ArrowLeft size={18} />
                Quay lại
              </button>

              <button
                type="button"
                className="payment-support-btn"
                onClick={onSupport ?? (() => navigate("/chat"))}
              >
                <CircleHelp size={18} />
                Cần hỗ trợ?
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
