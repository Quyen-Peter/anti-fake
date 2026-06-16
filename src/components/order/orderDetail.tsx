import { useParams } from "react-router-dom";
import "../../css/components/order/orderDetail.css";
import type { OrderDetail } from "../../type/order";
import { ArrowLeft, MapPin, Phone, ShieldCheck, User } from "lucide-react";

export default function OrderDetailPage() {
  const { id } = useParams();
  console.log(id);
  const mockOrderDetail: OrderDetail = {
    id: "1",

    orderCode: "DH250615001",

    status: "SHIPPING",

    createdAt: "15/06/2026 14:30",

    receiverName: "Nguyễn Văn A",

    receiverPhone: "0987654321",

    shippingAddress: "123 Nguyễn Huệ, Quận 1, TP.HCM",

    carrier: "Giao Hàng Nhanh",

    trackingCode: "GHN250615001",

    shippingMethod: "Giao hàng nhanh",

    estimatedDelivery: "18/06/2026",

    paymentMethod: "VNPay",

    subtotal: 28970000,

    discount: 980000,

    shippingFee: 30000,

    totalAmount: 28020000,

    note: "Liên hệ trước khi giao.",

    shops: [
      {
        id: "shop-1",

        name: "Apple Flagship Store",

        items: [
          {
            id: "1",

            productId: "iphone-15",

            productName: "iPhone 15 Pro Max 256GB",

            thumbnailUrl: "https://picsum.photos/200?1",

            variantName: "Titan Tự Nhiên, 256GB",

            quantity: 1,

            unitPrice: 27490000,

            totalPrice: 27490000,
          },

          {
            id: "2",

            productId: "magsafe",

            productName: "Ốp lưng MagSafe",

            thumbnailUrl: "https://picsum.photos/200?2",

            variantName: "Trong suốt",

            quantity: 1,

            unitPrice: 990000,

            totalPrice: 990000,
          },
        ],
      },

      {
        id: "shop-2",

        name: "Anker Official Store",

        items: [
          {
            id: "3",

            productId: "anker",

            productName: "Cáp USB-C Anker",

            thumbnailUrl: "https://picsum.photos/200?3",

            quantity: 1,

            unitPrice: 490000,

            totalPrice: 490000,
          },
        ],
      },
    ],

    histories: [
      {
        status: "PENDING",
        description: "Đặt hàng thành công",
        createdAt: "15/06/2026 14:30",
      },

      {
        status: "CONFIRMED",
        description: "Người bán xác nhận",
        createdAt: "15/06/2026 15:00",
      },

      {
        status: "PROCESSING",
        description: "Đang đóng gói",
        createdAt: "15/06/2026 16:30",
      },

      {
        status: "SHIPPING",
        description: "Đang giao hàng",
        createdAt: "16/06/2026 09:15",
      },
    ],
  };
  const order = mockOrderDetail;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN").format(price);

  return (
    <div className="order-detail-page">
      {/* Header */}
      <div className="od-section od-header">
        <ArrowLeft size={26} />
        <div>
          <h1 className="od-order-code">Chi tiết đơn hàng: #{order.orderCode}</h1>
          <p className="od-created">Ngày đặt hàng: {order.createdAt}</p>
        </div>
      </div>

      {/* Progress */}
      <div className="od-section">
        <h2>Tiến độ đơn hàng</h2>

        <div className="od-progress">
          <div className="od-step active">
            <div className="od-step-icon">
              <ShieldCheck size={16} />
            </div>
            <span>Đặt hàng</span>
          </div>

          <div className="od-line active"></div>

          <div className="od-step active">
            <div className="od-step-icon">
              <ShieldCheck size={16} />
            </div>
            <span>Xác nhận</span>
          </div>

          <div className="od-line active"></div>

          <div className="od-step active">
            <div className="od-step-icon">
              <ShieldCheck size={16} />
            </div>
            <span>Đóng gói</span>
          </div>

          <div className="od-line active"></div>

          <div className="od-step current">
            <div className="od-step-icon">
              <ShieldCheck size={16} />
            </div>
            <span>Đang giao</span>
          </div>

          <div className="od-line"></div>

          <div className="od-step">
            <div className="od-step-icon">
              <ShieldCheck size={16} />
            </div>
            <span>Hoàn thành</span>
          </div>
        </div>
      </div>

      {/* Địa chỉ */}
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

      {/* Vận chuyển */}
      <div className="od-section">
        <h2>Thông tin vận chuyển</h2>

        <div className="od-row">
          <span>Đơn vị vận chuyển</span>
          <b>{order.carrier}</b>
        </div>

        <div className="od-row">
          <span>Mã vận đơn</span>
          <b>{order.trackingCode}</b>
        </div>

        <div className="od-row">
          <span>Loại vận chuyển</span>
          <b>{order.shippingMethod}</b>
        </div>

        <div className="od-row">
          <span>Dự kiến giao</span>
          <b>{order.estimatedDelivery}</b>
        </div>
      </div>

      {/* Shop */}
      {order.shops.map((shop) => (
        <div key={shop.id} className="od-section">
          <div className="od-shop-title">{shop.name}</div>

          {shop.items.map((item) => (
            <div key={item.id} className="od-item">
              <img src={item.thumbnailUrl} alt="" />

              <div className="od-item-info">
                <h3>{item.productName}</h3>

                {item.variantName && <p>{item.variantName}</p>}

                <span>Số lượng: {item.quantity}</span>
              </div>

              <div className="od-item-price">
                {formatPrice(item.totalPrice)}đ
              </div>
            </div>
          ))}
        </div>
      ))}

      {/* Thanh toán */}
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
          <b>{order.paymentMethod}</b>
        </div>
      </div>

      {/* Timeline */}
      <div className="od-section">
        <h2>Lịch sử đơn hàng</h2>

        {order.histories.map((history, index) => (
          <div key={index} className="od-history">
            <div className="od-dot"></div>

            <div>
              <b>{history.description}</b>
              <p>{history.createdAt}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="od-actions">
        <button className="od-btn">Xác thực QR</button>

        <button className="od-btn primary">Mua lại</button>
      </div>
    </div>
  );
}
