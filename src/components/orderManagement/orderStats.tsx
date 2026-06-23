import {
  Package,
  Clock3,
  Truck,
  CheckCircle2,
} from "lucide-react";
import "../../css/components/orderManagement/orderStats.css";

export default function OrderStats() {
  return (
    <div className="seller-order-stats">
      <div className="seller-order-stat-card">
        <div className="icon">
          <Package size={20} />
        </div>

        <span>Tổng đơn hàng</span>
        <h2>1,284</h2>
      </div>

      <div className="seller-order-stat-card">
        <div className="icon processing">
          <Clock3 size={20} />
        </div>

        <span>Đang xử lý</span>
        <h2>42</h2>
      </div>

      <div className="seller-order-stat-card">
        <div className="icon shipping">
          <Truck size={20} />
        </div>

        <span>Đang giao</span>
        <h2>156</h2>
      </div>

      <div className="seller-order-stat-card">
        <div className="icon completed">
          <CheckCircle2 size={20} />
        </div>

        <span>Đã hoàn thành</span>
        <h2>1,086</h2>
      </div>
    </div>
  );
}