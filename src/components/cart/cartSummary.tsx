import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { formatVnd } from "../../ultil/currency";

type Props = {
  subtotal: number;
  discount: number;
  total: number;
  selectedShops: any[];
};

export default function CartSummary({ subtotal, discount, total, selectedShops, }: Props) {
  const [showDetail, setShowDetail] = useState(false);
  const navigate = useNavigate();
  
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
          <b>{formatVnd(subtotal)}</b>
        </div>

        <div className="summary-row">
          <span>Giảm giá sản phẩm</span>
          <span className="discount">-{formatVnd(discount)}</span>
        </div>

      </div>
      <div className="summary-total">
        <span>Tổng cộng</span>
        <b>{formatVnd(total)}</b>
      </div>
      <button className="checkout-btn" onClick={handleCheckout}>
        Tiến hành thanh toán
      </button>
    </div>
  );
}
