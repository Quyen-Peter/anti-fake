import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, Phone, ShieldCheck, User } from "lucide-react";
import "../../css/components/order/orderDetail.css";
import type { OrderDetail } from "../../type/order";
import { fetchOrderDetail } from "../../services/order.api";

const statusLabels: Record<string, string> = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  processing: "Đang xử lý",
  shipping: "Đang giao hàng",
  completed: "Hoàn thành",
  cancelled: "Đã hủy",
};

const paymentStatusLabels: Record<string, string> = {
  pending: "Chờ thanh toán",
  paid: "Đã thanh toán",
  failed: "Thanh toán thất bại",
  cancelled: "Đã hủy",
};

const paymentMethodLabels: Record<string, string> = {
  COD: "Thanh toán khi nhận hàng",
  PAYOS: "Thanh toán PayOS",
};

const formatDate = (value?: string) => {
  if (!value) return "Đang cập nhật";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
};

const label = (map: Record<string, string>, value?: string) =>
  value ? map[value.toLowerCase()] ?? map[value.toUpperCase()] ?? value : "Đang cập nhật";

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!id) return;

    const loadOrder = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await fetchOrderDetail(id);
        setOrder(data);
      } catch (error) {
        console.error(error);
        setOrder(null);
        setError(
          error instanceof Error ? error.message : "Không thể tải chi tiết đơn hàng",
        );
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [id]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN").format(price);

  if (loading) return <div className="order-detail-page">Đang tải đơn hàng...</div>;
  if (error) return <div className="order-detail-page">{error}</div>;
  if (!order) return <div className="order-detail-page">Không tìm thấy đơn hàng.</div>;

  return (
    <div className="order-detail-page">
      <div className="od-section od-header">
        <button className="od-back-btn" onClick={() => navigate("/profile/orders")}>
          <ArrowLeft size={26} />
        </button>
        <div>
          <h1 className="od-order-code">Chi tiết đơn hàng: {order.orderCode}</h1>
          <p className="od-created">Ngày đặt hàng: {formatDate(order.createdAt)}</p>
        </div>
      </div>

      <div className="od-section">
        <h2>Tiến độ đơn hàng</h2>
        <div className="od-progress">
          {["pending", "confirmed", "processing", "shipping", "completed"].map(
            (status, index) => {
              const current = order.status.toLowerCase();
              const currentIndex = [
                "pending",
                "confirmed",
                "processing",
                "shipping",
                "completed",
              ].indexOf(current);
              const isActive = currentIndex >= index;

              return (
                <div className="od-step-wrap" key={status}>
                  {index > 0 && <div className={`od-line ${isActive ? "active" : ""}`} />}
                  <div className={`od-step ${isActive ? "active" : ""}`}>
                    <div className="od-step-icon">
                      <ShieldCheck size={16} />
                    </div>
                    <span>{statusLabels[status]}</span>
                  </div>
                </div>
              );
            },
          )}
        </div>
      </div>

      <div className="od-section">
        <h2>Địa chỉ nhận hàng</h2>
        <div className="od-info-item">
          <User size={18} />
          <span>{order.receiverName}</span>
        </div>
        <div className="od-info-item">
          <Phone size={18} />
          <span>{order.receiverPhone}</span>
        </div>
        <div className="od-info-item">
          <MapPin size={18} />
          <span>{order.shippingAddress}</span>
        </div>
      </div>

      <div className="od-section">
        <h2>Thông tin vận chuyển</h2>
        <div className="od-row">
          <span>Đơn vị vận chuyển</span>
          <b>{order.carrier ?? "Đang cập nhật"}</b>
        </div>
        <div className="od-row">
          <span>Mã vận đơn</span>
          <b>{order.trackingCode ?? "Đang cập nhật"}</b>
        </div>
        <div className="od-row">
          <span>Loại vận chuyển</span>
          <b>{order.shippingMethod ?? "Đang cập nhật"}</b>
        </div>
        <div className="od-row">
          <span>Dự kiến giao</span>
          <b>{order.estimatedDelivery ?? "Đang cập nhật"}</b>
        </div>
      </div>

      {order.shops.map((shop) => (
        <div key={shop.id ?? shop.shopId} className="od-section">
          <div className="od-shop-title">{shop.name ?? shop.shopName}</div>
          {shop.items.map((item) => (
            <div key={item.id} className="od-item">
              <img src={item.thumbnailUrl} alt={item.productName} />
              <div className="od-item-info">
                <h3>{item.productName}</h3>
                {item.variantName && <p>{item.variantName}</p>}
                <span>Số lượng: {item.quantity}</span>
              </div>
              <div className="od-item-price">{formatPrice(item.totalPrice)}đ</div>
            </div>
          ))}
        </div>
      ))}

      <div className="od-section">
        <h2>Tổng kết đơn hàng</h2>
        <div className="od-row">
          <span>Tạm tính</span>
          <b>{formatPrice(order.subtotal)}đ</b>
        </div>
        <div className="od-row">
          <span>Giảm giá</span>
          <b>-{formatPrice(order.discount)}đ</b>
        </div>
        <div className="od-row">
          <span>Phí vận chuyển</span>
          <b>{formatPrice(order.shippingFee)}đ</b>
        </div>
        <div className="od-row od-total">
          <span>Tổng thanh toán</span>
          <b>{formatPrice(order.totalAmount)}đ</b>
        </div>
        <div className="od-row">
          <span>Phương thức thanh toán</span>
          <b>{label(paymentMethodLabels, order.paymentMethod)}</b>
        </div>
        <div className="od-row">
          <span>Trạng thái thanh toán</span>
          <b>{label(paymentStatusLabels, order.paymentStatus)}</b>
        </div>
      </div>

      {order.histories.length > 0 && (
        <div className="od-section">
          <h2>Lịch sử đơn hàng</h2>
          {order.histories.map((history, index) => (
            <div key={`${history.status}-${index}`} className="od-history">
              <div className="od-dot" />
              <div>
                <b>{history.description}</b>
                <p>{formatDate(history.createdAt)}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="od-actions">
        <button className="od-btn primary">Mua lại</button>
      </div>
    </div>
  );
}
