import { useNavigate } from "react-router-dom";
import "../../css/components/order/orderCard.css";
import type { Order } from "../../type/order";

type Props = {
  order: Order;
};

export default function OrderCard({ order }: Props) {
  const navigate = useNavigate();
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN").format(price);

  return (
    <div className="order-card-user">
      <div className="order-header-user">
        <span className="order-code">#{order.orderCode}</span>

        <span className="order-status">{order.status}</span>
      </div>

      <div className="order-shop">{order.shopName}</div>

      <div className="order-product">
        <img
          src={order.firstProduct.image}
          alt=""
          className="order-product-image"
        />

        <div className="order-product-info">
          <h3>{order.firstProduct.name}</h3>

          <p>{order.firstProduct.variant}</p>

          <span>x{order.firstProduct.quantity}</span>
          {order.otherProducts > 0 && (
            <div className="order-other-products">
              +{order.otherProducts} sản phẩm khác
            </div>
          )}
        </div>

        <div className="order-product-price">
          <strong>{formatPrice(order.firstProduct.price)}đ</strong>

          <small>Giá sản phẩm</small>
        </div>
      </div>
      <div className="order-footer">
        <div className="order-payment-info">
          <div>
            <span>Tổng thanh toán</span>
            <b>{formatPrice(order.totalAmount)}đ</b>
          </div>

          <div>
            <span>Hình thức thanh toán</span>
            <b>{order.paymentMethod}</b>
          </div>
        </div>

        <button
          className="order-detail-btn"
          onClick={() => navigate(`/profile/orders/${order.id}`)}
        >
          Xem chi tiết
        </button>
      </div>
    </div>
  );
}
