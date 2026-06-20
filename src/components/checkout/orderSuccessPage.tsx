import { CheckCircle } from "lucide-react";
import "../../css/components/orderSuccess.css";
import { useNavigate } from "react-router-dom";

export default function OrderSuccessPage() {
  const navigate = useNavigate();
  return (
    <div className="order-success-page">
      <div className="success-header">
        <div className="success-icon">
          <CheckCircle size={38} />
        </div>

        <h1>Cảm ơn bạn đã đặt hàng!</h1>

        <p>
          Đơn hàng của bạn đã được hệ thống xác nhận và đang trong quá trình
          kiểm tra tính xác thực trước khi vận chuyển.
        </p>
      </div>

      <div className="order-card">
        <div className="order-info">
          <div className="info-group">
            <span className="label">MÃ ĐƠN HÀNG</span>
            <h3>#AF-992834-2024</h3>
          </div>

          <div className="info-group">
            <span className="label">NGÀY GIAO DỰ KIẾN</span>
            <p>Thứ Sáu, 15 Tháng 11, 2024</p>
          </div>
        </div>

        <div className="order-actions">
          <div className="button-group">
            <button className="btn-primary">Xem đơn hàng</button>

            <button className="btn-secondary"  onClick={() => navigate("/")}>
              Tiếp tục mua sắm
            </button>
          </div>

          <p className="email-note">
            Một email xác nhận đã được gửi đến địa chỉ example@email.com
          </p>
        </div>
      </div>
    </div>
  );
}
