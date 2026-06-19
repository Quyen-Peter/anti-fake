import { QrCode, ShieldCheck, ShoppingCart, Truck } from "lucide-react";
import { useState } from "react";
import { addToCart } from "../../services/cart.api";
import { toast } from "sonner";

export default function ProductInfo({ product }: any) {
  const [quantity, setQuantity] = useState(
    product.salesMode === "WHOLESALE" ? product.minWholesaleQty : 1,
  );

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN").format(price);

  const handleAddToCart = async () => {
    try {
      const result = await addToCart(product.id, quantity);

      console.log(result);

      toast.success("Đã thêm vào giỏ hàng");
    } catch (error) {
      console.error(error);
      toast.error("Thêm giỏ hàng thất bại");
    }
  };

  return (
    <div className="pd-info">
      <h1>{product.title}</h1>

      <div className="pd-price">{formatPrice(product.price)}đ</div>
      <div className="pd-info-row">
        <span>Đã bán:</span>
        <b className="pd-soldQuantity">{product.soldQuantity}</b>
      </div>

      <div className="pd-info-row">
        <span>Model:</span>
        <b className="pd-ModelName">{product.productModelName}</b>
      </div>

      <div className="pd-info-row">
        <span>Loại bán:</span>

        <span className="pd-badge">
          {product.salesMode === "WHOLESALE" ? "Bán sỉ" : "Bán lẻ"}
        </span>
      </div>

      {product.salesMode === "WHOLESALE" && (
        <div className="pd-info-row pd-min">
          <span>Mua tối thiểu:</span>

          <b>{product.minWholesaleQty}</b>
        </div>
      )}

      <div className="pd-quantity-box">
        <span>Số lượng</span>

        <div className="pd-quantity-control">
          <button
            onClick={() =>
              setQuantity(Math.max(product.minWholesaleQty, quantity - 1))
            }
          >
            -
          </button>

          <span>{quantity}</span>

          <button
            onClick={() =>
              setQuantity(Math.min(product.availableQuantity, quantity + 1))
            }
          >
            +
          </button>
        </div>

        <b className="pd-availableQuantity">{product.availableQuantity}</b>
        <span>sản phẩm có sẵn</span>
      </div>

      <div className="pd-shipping-box">
        <h4>Vận chuyển</h4>

        {product.shippingMethods.map((item: any) => (
          <div key={item.providerName}>
            <Truck size={20} /> {item.providerName} •{" "}
            {formatPrice(item.shippingFee)}đ • {item.estimatedDays}
          </div>
        ))}
      </div>

      <div className="pd-action-buttons">
        <button className="pd-cart-btn" onClick={handleAddToCart}>
          <ShoppingCart size={20} /> Thêm vào giỏ hàng
        </button>

        <button className="pd-buy-btn">Mua ngay</button>
      </div>

      <div className="pd-verify-box">
        <div className="pd-verify-header">
          <div className="pd-verify-icon">
            <ShieldCheck size={26} />
          </div>

          <div className="pd-verify-content">
            <h3>Xác thực sản phẩm chính hãng</h3>
            <p>
              Kiểm tra nguồn gốc, chứng nhận và thông tin chống hàng giả của sản
              phẩm.
            </p>
          </div>
        </div>

        <div className="pd-verify-features">
          <div className="pd-verify-feature">✓ Kiểm tra nhanh chóng</div>

          <div className="pd-verify-feature">✓ Nguồn gốc rõ ràng</div>

          <div className="pd-verify-feature">✓ Chứng nhận AntiFake</div>
        </div>

        <button className="pd-verify-btn">
          <QrCode size={18} />
          Kiểm tra ngay
        </button>
      </div>
    </div>
  );
}
