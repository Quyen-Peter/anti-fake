import { useNavigate } from "react-router-dom";

interface Props {
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
}

export default function CheckoutSummary({
  subtotal,
  shippingFee,
  discount,
  total,
}: Props) {
  const navigate = useNavigate();

  return (
    <div className="summary-card">
      <h3>Tóm tắt đơn hàng</h3>

      <div className="voucher-box">
        <input placeholder="Nhập mã ưu đãi..." />

        <button>Áp dụng</button>
      </div>

      <div className="summary-row">
        <span>Tổng tiền hàng</span>
        <span>{subtotal.toLocaleString()}đ</span>
      </div>

      <div className="summary-row">
        <span>Phí vận chuyển</span>
        <span>{shippingFee.toLocaleString()}đ</span>
      </div>

      <div className="summary-row discount">
        <span>Giảm giá</span>
        <span>-{discount.toLocaleString()}đ</span>
      </div>

      <div className="summary-total-checkout">
        <span>Tổng cộng</span>

        <strong>{total.toLocaleString()}đ</strong>
      </div>

      <button
        className="checkout-btn"
        onClick={() => navigate("/order-success")}
      >
        Đặt hàng
      </button>
    </div>
  );
}
