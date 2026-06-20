import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

type Props = {
  subtotal: number;
  discount: number;
  total: number;
  selectedShops: any[];
};

export default function CartSummary({ subtotal, discount, total, selectedShops, }: Props) {
  const [showDetail, setShowDetail] = useState(false);
  const navigate = useNavigate();
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN").format(price);

  
    const handleCheckout = () => {
    if (selectedShops.length === 0) {
      toast.error("vui lòng chọn ít nhất một sản phẩm");
      return;
    }

    navigate("/checkout", {
      state: {
        shops: selectedShops,
      },
    });
  };


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

      </div>
      <div className="summary-total">
        <span>Tổng cộng</span>
        <b>{formatPrice(total)}đ</b>
      </div>
      <button className="checkout-btn" onClick={handleCheckout}>
        Tiến hành thanh toán
      </button>
    </div>
  );
}
