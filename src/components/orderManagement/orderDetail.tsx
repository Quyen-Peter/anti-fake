import {
  BadgeCheck,
  Clock3,
  Mail,
  MapPin,
  PackageCheck,
  Phone,
  Truck,
} from "lucide-react";
import "../../css/components/orderManagement/orderDetail.css";

type SellerOrderDetailItem = {
  id: string;
  name: string;
  variant: string;
  image: string;
  unitPrice: number;
  quantity: number;
};

type SellerOrderDetailData = {
  orderCode: string;
  statusText: string;
  createdAt: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  shipping: {
    address: string;
    method: string;
    estimate: string;
  };
  payment: {
    method: string;
    status: string;
  };
  summary: {
    subtotal: number;
    shippingFee: number;
    discount: number;
    total: number;
  };
  items: SellerOrderDetailItem[];
};

type OrderDetailProps = {
  order?: SellerOrderDetailData;
};

const defaultOrder: SellerOrderDetailData = {
  orderCode: "#AF-992834-2024",
  statusText: "Đang chờ xác nhận",
  createdAt: "24 Tháng 5, 2024 - 14:30",
  customer: {
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    phone: "+84 901 234 567",
  },
  shipping: {
    address:
      "123 Đường Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh, 70000, Việt Nam",
    method: "Giao hàng tiêu chuẩn (3-5 ngày)",
    estimate: "3-5 ngày",
  },
  payment: {
    method: "Thẻ tín dụng",
    status: "Thanh toán đã được xác thực",
  },
  summary: {
    subtotal: 3350000,
    shippingFee: 35000,
    discount: 100000,
    total: 3285000,
  },
  items: [
    {
      id: "item-1",
      name: "Cặp Da Công Sở Cao Cấp - Heritage Edition",
      variant: "Màu sắc: Nâu đậm | Size: L",
      image:
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&auto=format&fit=crop",
      unitPrice: 2500000,
      quantity: 1,
    },
    {
      id: "item-2",
      name: "Khăn Lụa Tơ Tằm Họa Tiết Hình Học",
      variant: "Màu sắc: Đỏ Ruby",
      image:
        "https://images.unsplash.com/photo-1601379329542-31c59347e782?w=200&auto=format&fit=crop",
      unitPrice: 850000,
      quantity: 1,
    },
  ],
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("vi-VN").format(value) + "đ";

export default function OrderDetail({ order = defaultOrder }: OrderDetailProps) {
  return (
    <div className="seller-order-detail">
      <div className="seller-order-detail-breadcrumb">
        Đơn hàng <span>/</span> Chi tiết đơn hàng
      </div>

      <div className="seller-order-detail-header">
        <div>
          <h1>Đơn hàng {order.orderCode}</h1>
        </div>

        <div className="seller-order-detail-actions">
          <button type="button" className="seller-order-action ghost">
            <Truck size={16} />
            In nhãn vận chuyển
          </button>
          <button type="button" className="seller-order-action ghost">
            Hủy đơn hàng
          </button>
          <button type="button" className="seller-order-action danger">
            Xác nhận đơn hàng
          </button>
        </div>
      </div>

      <div className="seller-order-detail-grid">
        <main className="seller-order-detail-main">
          <section className="seller-order-status-card">
            <div className="seller-order-status-left">
              <div className="seller-order-status-icon">
                <PackageCheck size={22} />
              </div>
              <div>
                <span>Trạng thái hiện tại</span>
                <strong>{order.statusText}</strong>
              </div>
            </div>

            <div className="seller-order-status-date">
              <span>Ngày đặt hàng</span>
              <strong>{order.createdAt}</strong>
            </div>
          </section>

          <section className="seller-order-info-grid">
            <article className="seller-order-card">
              <div className="seller-order-card-title">
                <h2>Khách hàng</h2>
                <span>Nhắn tin</span>
              </div>

              <div className="seller-order-customer-block">
                <div className="seller-order-avatar">NV</div>
                <div>
                  <strong>{order.customer.name}</strong>
                  <p>Customer_id: #992834</p>
                </div>
              </div>

              <p className="seller-order-muted-line">
                <Mail size={14} />
                {order.customer.email}
              </p>
              <p className="seller-order-muted-line">
                <Phone size={14} />
                {order.customer.phone}
              </p>
            </article>

            <article className="seller-order-card">
              <div className="seller-order-card-title">
                <h2>Giao hàng</h2>
                <Truck size={16} />
              </div>

              <p className="seller-order-label">Địa chỉ giao hàng</p>
              <p className="seller-order-address">
                <MapPin size={14} />
                {order.shipping.address}
              </p>

              <div className="seller-order-delivery-note">
                <Clock3 size={16} />
                <span>{order.shipping.method}</span>
              </div>
            </article>
          </section>

          <section className="seller-order-products-card">
            <h2>Danh sách sản phẩm ({order.items.length})</h2>

            <div className="seller-order-product-head">
              <span>Sản phẩm</span>
              <span>Đơn giá</span>
              <span>Số lượng</span>
              <span>Thành tiền</span>
            </div>

            {order.items.map((item) => (
              <div key={item.id} className="seller-order-product-row">
                <div className="seller-order-product-info">
                  <img src={item.image} alt={item.name} />
                  <div>
                    <strong>{item.name}</strong>
                    <p>{item.variant}</p>
                    <button type="button">Chi tiết sản phẩm</button>
                  </div>
                </div>
                <span>{formatCurrency(item.unitPrice)}</span>
                <span>{item.quantity}</span>
                <strong>{formatCurrency(item.unitPrice * item.quantity)}</strong>
              </div>
            ))}
          </section>
        </main>

        <aside className="seller-order-summary-card">
          <h2>Tổng cộng</h2>
          <div className="seller-order-summary-row">
            <span>Tạm tính ({order.items.length} sản phẩm)</span>
            <strong>{formatCurrency(order.summary.subtotal)}</strong>
          </div>
          <div className="seller-order-summary-row">
            <span>Phí vận chuyển</span>
            <strong>{formatCurrency(order.summary.shippingFee)}</strong>
          </div>
          <div className="seller-order-summary-row discount">
            <span>Giảm giá từ shop</span>
            <strong>-{formatCurrency(order.summary.discount)}</strong>
          </div>
          <div className="seller-order-summary-row total">
            <span>Tổng thanh toán</span>
            <strong>{formatCurrency(order.summary.total)}</strong>
          </div>

          <div className="seller-order-payment-box">
            <div>
              <span>Phương thức thanh toán</span>
              <strong>{order.payment.method}</strong>
              <p>{order.payment.status}</p>
            </div>
            <BadgeCheck size={20} />
          </div>
        </aside>
      </div>

      <section className="seller-order-note-card">
        <label htmlFor="seller-order-note">Ghi chú nội bộ (chỉ người bán thấy)</label>
        <textarea
          id="seller-order-note"
          placeholder="Nhập ghi chú cho nhân viên kho hoặc lưu ý cá nhân..."
        />
        <button type="button">Lưu ghi chú</button>
      </section>
    </div>
  );
}
