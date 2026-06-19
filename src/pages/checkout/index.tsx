import { useState } from "react";
import {
  MapPin,
  ShieldCheck,
  Truck,
  Wallet,
  CreditCard,
  Landmark,
  ArrowRight,
} from "lucide-react";

import "../../css/pages/checkout.css";

export default function CheckoutPage() {
  const [shipping, setShipping] = useState("fast");
  const [payment, setPayment] = useState("wallet");

  const products = [
    {
      id: "1",
      name: "AntiFake Elite Stealth Runner",
      image: "https://i.pravatar.cc/300?img=1",
      variant: "Red/White, Size 42",
      price: 2450000,
    },
    {
      id: "2",
      name: "AntiFake Guard Watch Series 5",
      image: "https://i.pravatar.cc/300?img=2",
      variant: "Silver/Platinum",
      price: 5200000,
    },
  ];

  const subtotal = products.reduce(
    (sum, item) => sum + item.price,
    0
  );

  const shippingFee =
    shipping === "fast" ? 35000 : 15000;

  const discount = 200000;

  const total =
    subtotal + shippingFee - discount;

  return (
    <div className="checkout-page">
      <div className="checkout-left">
        {/* ADDRESS */}
        <div className="checkout-card">
          <div className="section-title">
            <MapPin size={18} />
            Địa chỉ nhận hàng
          </div>

          <div className="address-box">
            <div className="address-header">
              <strong>
                Nguyễn Văn A | 0901234567
              </strong>

              <button>Thay đổi</button>
            </div>

            <p>
              123 Đường Lê Lợi, Phường Bến Thành,
              Quận 1, TP Hồ Chí Minh
            </p>

            <span className="verified-address">
              <ShieldCheck size={14} />
              Địa chỉ đã xác thực
            </span>
          </div>
        </div>

        {/* PRODUCTS */}
        <div className="checkout-card">
          <div className="section-title">
            Sản phẩm đã chọn
          </div>

          {products.map((item) => (
            <div
              className="checkout-product"
              key={item.id}
            >
              <img
                src={item.image}
                alt={item.name}
              />

              <div className="product-info">
                <h4>{item.name}</h4>

                <span>{item.variant}</span>

                <small>
                  CHÍNH HÃNG 100%
                </small>
              </div>

              <div className="product-price">
                {item.price.toLocaleString()}đ
              </div>
            </div>
          ))}
        </div>

        {/* SHIPPING */}
        <div className="checkout-card">
          <div className="section-title">
            <Truck size={18} />
            Phương thức vận chuyển
          </div>

          <div className="shipping-list">
            <label
              className={`shipping-item ${
                shipping === "fast"
                  ? "active"
                  : ""
              }`}
            >
              <input
                type="radio"
                checked={
                  shipping === "fast"
                }
                onChange={() =>
                  setShipping("fast")
                }
              />

              <div>
                <strong>
                  Giao hàng nhanh
                </strong>

                <p>
                  Nhận hàng trong 24-48h
                </p>
              </div>

              <span>35.000đ</span>
            </label>

            <label
              className={`shipping-item ${
                shipping === "save"
                  ? "active"
                  : ""
              }`}
            >
              <input
                type="radio"
                checked={
                  shipping === "save"
                }
                onChange={() =>
                  setShipping("save")
                }
              />

              <div>
                <strong>Tiết kiệm</strong>

                <p>
                  Nhận hàng trong 3-5 ngày
                </p>
              </div>

              <span>15.000đ</span>
            </label>
          </div>
        </div>

        {/* PAYMENT */}
        <div className="checkout-card">
          <div className="section-title">
            <Wallet size={18} />
            Phương thức thanh toán
          </div>

          <label
            className={`payment-item ${
              payment === "cod"
                ? "active"
                : ""
            }`}
          >
            <input
              type="radio"
              checked={
                payment === "cod"
              }
              onChange={() =>
                setPayment("cod")
              }
            />

            <CreditCard size={18} />
            Thanh toán khi nhận hàng
          </label>

          <label
            className={`payment-item ${
              payment === "bank"
                ? "active"
                : ""
            }`}
          >
            <input
              type="radio"
              checked={
                payment === "bank"
              }
              onChange={() =>
                setPayment("bank")
              }
            />

            <Landmark size={18} />
            Chuyển khoản ngân hàng
          </label>

          <label
            className={`payment-item ${
              payment === "wallet"
                ? "active"
                : ""
            }`}
          >
            <input
              type="radio"
              checked={
                payment === "wallet"
              }
              onChange={() =>
                setPayment("wallet")
              }
            />

            <Wallet size={18} />
            Ví điện tử (MoMo, ZaloPay)
          </label>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="checkout-right">
        <div className="summary-card">
          <h3>Tóm tắt đơn hàng</h3>

          <div className="voucher-box">
            <input
              placeholder="Nhập mã ưu đãi..."
            />

            <button>Áp dụng</button>
          </div>

          <div className="summary-row">
            <span>Tổng tiền hàng</span>
            <span>
              {subtotal.toLocaleString()}đ
            </span>
          </div>

          <div className="summary-row">
            <span>Phí vận chuyển</span>
            <span>
              {shippingFee.toLocaleString()}đ
            </span>
          </div>

          <div className="summary-row discount">
            <span>Giảm giá</span>
            <span>
              -{discount.toLocaleString()}đ
            </span>
          </div>

          <div className="summary-total">
            <span>Tổng cộng</span>

            <strong>
              {total.toLocaleString()}đ
            </strong>
          </div>

          <button className="checkout-btn">
            Đặt hàng
            <ArrowRight size={18} />
          </button>
        </div>

        <div className="security-box">
          <ShieldCheck size={18} />
          Giao dịch được bảo mật
        </div>
      </div>
    </div>
  );
}