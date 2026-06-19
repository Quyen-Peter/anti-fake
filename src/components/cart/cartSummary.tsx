import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  subtotal: number;
  discount: number;
  total: number;
};

export default function CartSummary({ subtotal, discount, total }: Props) {
  const [showDetail, setShowDetail] = useState(false);
  const navigate = useNavigate();
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN").format(price);
  return (
    <div className="cart-summary">
      <button className="detail-btn" onClick={() => setShowDetail(!showDetail)}>
        {showDetail ? <ChevronUp size={22} /> : <ChevronDown size={22} />}
      </button>
      <h2>Tóm tắt đơn hàng</h2>
      <div className={`summary-detail ${showDetail ? "show" : ""}`}>
        <div className="summary-row">
          <span>Tạm tính</span>
          <b>{formatPrice(subtotal)}đ</b>
        </div>

        <div className="summary-row">
          <span>Giảm giá sản phẩm</span>
          <span className="discount">-{formatPrice(discount)}đ</span>
        </div>

        <div className="summary-row">
          <span>Phí vận chuyển</span>
          <span className="free">Miễn phí</span>
        </div>

        <hr />
      </div>
      <div className="summary-total">
        <span>Tổng cộng</span>
        <b>{formatPrice(total)}đ</b>
      </div>
      <div className={`summary-detail ${showDetail ? "show" : ""}`}>
        <div className="cart-bnt-payment">
          <div className="coupon-box">
            <label>MÃ GIẢM GIÁ</label>

            <div className="coupon-input">
              <input placeholder="Nhập mã..." />
              <button>Áp dụng</button>
            </div>
          </div>
        </div>
      </div>
      <button className="checkout-btn" onClick={() => navigate("/checkout")}>
        Tiến hành thanh toán
      </button>
    </div>
  );
}
