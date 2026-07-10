import { QrCode, ShieldCheck, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../../services/cart.api";
import { fetchBuyNowPreview } from "../../services/product.api";
import { toast } from "sonner";
import { useCartStore } from "../../store/cartStore";
import { useGlobalLoadingStore } from "../../store/globalLoadingStore";
import { formatVnd } from "../../ultil/currency";

type ProductInfoData = {
  id: string | number;
  title: string;
  price: number;
  currency?: string;
  salesMode?: string;
  minWholesaleQty?: number;
  soldQuantity?: number;
  productModelName?: string;
  availableQuantity: number;
  selectedVariantId?: string | number;
  variantId?: string | number;
  variants?: Array<{ id?: string | number }>;
};

export default function ProductInfo({ product }: { product: ProductInfoData }) {
  const navigate = useNavigate();
  const minQuantity =
    product.salesMode === "WHOLESALE" ? (product.minWholesaleQty ?? 1) : 1;
  const [quantity, setQuantity] = useState(minQuantity);
  const [buyLoading, setBuyLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const showLoading = useGlobalLoadingStore((state) => state.showLoading);
  const hideLoading = useGlobalLoadingStore((state) => state.hideLoading);
    const refreshCart = useCartStore((state) => state.refreshCart);

  const handleAddToCart = async () => {
    try {
      setCartLoading(true);
      showLoading("Đang thêm vào giỏ hàng...");
      const result = await addToCart(String(product.id), quantity);

      console.log(result);
      refreshCart();

      toast.success("Đã thêm vào giỏ hàng");
    } catch (error) {
      console.error(error);
      toast.error("Thêm giỏ hàng thất bại");
    } finally {
      setCartLoading(false);
      hideLoading();
    }
  };

  const handleBuyNow = async () => {
    try {
      setBuyLoading(true);
      showLoading("Đang chuẩn bị đơn hàng...");

      const variantId =
        product.selectedVariantId ??
        product.variantId ??
        product.variants?.[0]?.id;
      const preview = await fetchBuyNowPreview({
        offerId: String(product.id),
        variantId: variantId ? String(variantId) : undefined,
        quantity,
      });

      navigate("/checkout", {
        state: {
          source: "buy-now",
          buyNowSelection: {
            offerId: preview.offerId,
            variantId: preview.variantId,
            quantity: preview.quantity,
          },
          shippingOptions: preview.shippingOptions,
          shops: [
            {
              shopId: preview.shopId,
              shopName: preview.shopName,
              items: [
                {
                  id: preview.variantId ?? preview.offerId,
                  thumbnailUrl: preview.thumbnailUrl ?? "",
                  offerTitleSnapshot: preview.modelName,
                  unitPriceSnapshot: preview.price,
                  currencySnapshot: "VND",
                  quantity: preview.quantity,
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
      hideLoading();
    }
  };

  return (
    <div className="pd-info">
      <h1>{product.title}</h1>

      <div className="pd-price">{formatVnd(product.price, product.currency)}</div>
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
        <button
          className="pd-cart-btn"
          disabled={cartLoading || buyLoading}
          onClick={handleAddToCart}
        >
          <ShoppingCart size={20} /> Thêm vào giỏ hàng
        </button>

        <button
          className="pd-buy-btn"
          disabled={buyLoading || cartLoading}
          onClick={handleBuyNow}
        >
          Mua ngay
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
