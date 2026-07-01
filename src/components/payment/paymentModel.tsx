import { ArrowLeft, CircleHelp, Landmark, QrCode, ShieldCheck, Wallet } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import "../../css/components/payment/paymentModel.css";

type PaymentModelProps = {
  amount?: number;
  orderCode?: string;
  onBack?: () => void;
  onSupport?: () => void;
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("vi-VN").format(value);

const firstValue = <T,>(...values: Array<T | undefined | null>) =>
  values.find((value) => value !== undefined && value !== null);

const toEmbeddedPayOSUrl = (checkoutUrl: string) => {
  if (!checkoutUrl) return "";

  const embeddedUrl = checkoutUrl.replace("/web/", "/embedded/");
  const separator = embeddedUrl.includes("?") ? "&" : "?";

  return `${embeddedUrl}${separator}redirect_uri=${encodeURIComponent(
    window.location.origin + "/payment-success",
  )}`;
};

export default function PaymentModel({
  amount,
  orderCode,
  onBack,
  onSupport,
}: PaymentModelProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const checkout = location.state?.checkout ?? {};

  const displayAmount = Number(
    firstValue(
      amount,
      location.state?.amount,
      checkout.amount,
      checkout.totalAmount,
      checkout.paymentAmount,
      0,
    ),
  );
  const displayOrderCode = String(
    firstValue(orderCode, checkout.orderCode, checkout.orderId, "Đang tạo"),
  );
  const checkoutUrl = String(
    firstValue(checkout.checkoutUrl, checkout.paymentUrl, "") ?? "",
  );
  const embeddedCheckoutUrl = toEmbeddedPayOSUrl(checkoutUrl);

  return (
    <section className="payment-model-page">
      <div className="payment-model-shell">
        <header className="payment-model-header">
          <div>
            <h1>Thanh toán đơn hàng</h1>
            <p>
              Quý khách vui lòng quét mã QR bên dưới để hoàn tất giao dịch.
            </p>
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

            {embeddedCheckoutUrl ? (
              <div className="payment-embed-frame">
                <iframe
                  title="QR thanh toán PayOS"
                  src={embeddedCheckoutUrl}
                  allow="clipboard-write"
                />
              </div>
            ) : (
              <div className="payment-qr-frame">
                <div className="payment-qr-placeholder">
                  <QrCode size={86} />
                  <span>Chưa có thông tin thanh toán</span>
                </div>
              </div>
            )}

            <strong className="payment-amount">
              {formatCurrency(displayAmount)} VNĐ
            </strong>
            <p className="payment-auto-note">Tự động cập nhật sau khi quét</p>

            {checkoutUrl ? (
              <a
                className="payment-open-link"
                href={checkoutUrl}
                target="_blank"
                rel="noreferrer"
              >
                Mở trang thanh toán
              </a>
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
                  Quét mã QR và xác nhận thanh toán.
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
                onClick={onSupport ?? (() => navigate("/messages"))}
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
