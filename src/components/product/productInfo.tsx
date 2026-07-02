import { QrCode, ShieldCheck, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCart } from "../../services/cart.api";
import { toast } from "sonner";

const getCartItemId = (value: any) =>
  value?.id ??
  value?.cartItemId ??
  value?.cartItem?.id ??
  value?.item?.id ??
  value?.data?.id ??
  value?.data?.cartItemId ??
  value?.data?.cartItem?.id ??
  value?.data?.item?.id;

const findCartItem = (cart: any, product: any, shopId?: string | number) => {
  const shops = Array.isArray(cart?.shops) ? cart.shops : [];
  const targetShopId = shopId ? String(shopId) : "";
  const productId = String(product.id);

  for (const cartShop of shops) {
    if (
      targetShopId &&
      String(cartShop.shopId ?? cartShop.id) !== targetShopId
    ) {
      continue;
    }

    const items = Array.isArray(cartShop.items) ? cartShop.items : [];
    const item = items.find((cartItem: any) => {
      const offerId = cartItem.offerId ?? cartItem.productId ?? cartItem.offer?.id;

      if (offerId && String(offerId) === productId) return true;

      return (
        cartItem.offerTitleSnapshot === product.title &&
        Number(cartItem.unitPriceSnapshot) === Number(product.price)
      );
    });

    if (item) return item;
  }

  return null;
};

export default function ProductInfo({ product, shop }: any) {
  const navigate = useNavigate();
  const minQuantity =
    product.salesMode === "WHOLESALE" ? product.minWholesaleQty : 1;
  const [quantity, setQuantity] = useState(minQuantity);
  const [buyLoading, setBuyLoading] = useState(false);

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

  const handleBuyNow = async () => {
    try {
      setBuyLoading(true);

      const shopId = shop?.shopId ?? shop?.id ?? product.shopId;
      const shopName = shop?.shopName ?? product.shopName ?? "Shop";
      const cartItem = await addToCart(product.id, quantity);
      const cart = await fetchCart();
      const cartItemFromCart = findCartItem(cart, product, shopId);
      const cartItemId = getCartItemId(cartItem) ?? cartItemFromCart?.id;

      if (!cartItemId) {
        throw new Error("Khong tim thay san pham trong gio hang");
      }

      if (!shopId) {
        throw new Error("Khong tim thay thong tin shop");
      }

      navigate("/checkout", {
        state: {
          shops: [
            {
              shopId: String(shopId),
              shopName,
              items: [
                {
                  id: String(cartItemId),
                  thumbnailUrl:
                    product.thumbnailUrl ?? product.imageUrls?.[0] ?? "",
                  offerTitleSnapshot: product.title,
                  unitPriceSnapshot: product.price,
                  currencySnapshot: product.currency ?? "VND",
                  quantity,
                },
              ],
            },
          ],
        },
      });
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : "Khong the mua ngay",
      );
    } finally {
      setBuyLoading(false);
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
              setQuantity(Math.max(minQuantity, quantity - 1))
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

      <div className="pd-action-buttons">
        <button className="pd-cart-btn" onClick={handleAddToCart}>
          <ShoppingCart size={20} /> Thêm vào giỏ hàng
        </button>

        <button
          className="pd-buy-btn"
          disabled={buyLoading}
          onClick={handleBuyNow}
        >
          {buyLoading ? "Dang xu ly..." : "Mua ngay"}
        </button>
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
