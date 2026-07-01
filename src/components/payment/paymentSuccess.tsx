import { CheckCircle, Clock, CreditCard, ReceiptText } from "lucide-react";
import "../../css/components/payment/paymentSuccess.css";
import { useNavigate } from "react-router-dom";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  return (
    <main className="payment-success-page">
      <section className="payment-success-card">
        <div className="payment-success-icon">
          <CheckCircle size={42} />
        </div>

        <h1>Thanh toán thành công!</h1>

        <p className="payment-success-subtitle">
          Giao dịch của bạn đã được xác nhận. Đơn hàng sẽ được xử lý và chuẩn
          bị vận chuyển trong thời gian sớm nhất.
        </p>

        <div className="payment-success-info">
          <article>
            <ReceiptText size={22} />
            <div>
              <span>Mã giao dịch</span>
              <strong>#AF-992834-2024</strong>
            </div>
          </article>

          <article>
            <CreditCard size={22} />
            <div>
              <span>Phương thức</span>
              <strong>Thanh toán QR</strong>
            </div>
          </article>

          <article>
            <Clock size={22} />
            <div>
              <span>Trạng thái</span>
              <strong>Đã thanh toán</strong>
            </div>
          </article>
        </div>

        <div className="payment-success-actions">
          <button
            type="button"
            className="payment-success-primary"
            onClick={() => navigate("/profile/orders")}
          >
            Xem đơn hàng
          </button>

          <button
            type="button"
            className="payment-success-secondary"
            onClick={() => navigate("/")}
          >
            Tiếp tục mua sắm
          </button>
        </div>

        <p className="payment-success-note">
          Biên nhận thanh toán và thông tin đơn hàng sẽ được cập nhật trong tài
          khoản của bạn.
        </p>
      </section>
    </main>
  );
}
