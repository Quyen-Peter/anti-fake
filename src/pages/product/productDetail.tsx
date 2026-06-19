import { useEffect, useState } from "react";
import ProductInfo from "../../components/product/productInfo";
import ProductSpecification from "../../components/product/productSpecification";
import "../../css/pages/productDetail.css";
import Review from "../../components/product/review";
import ShopCard from "../../components/shop/shopCard";
import { MessageCircle, Store } from "lucide-react";
import { fetchOfferDetail } from "../../services/product.api";
import { useParams } from "react-router-dom";
import { fetchShopByOffer } from "../../services/shop.api";
import LoadingOverlay from "../../components/loadingOverlay";

export default function ProductDetail() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("description");
  const [product, setProduct] = useState<any>();
  const [shop, setShop] = useState<any>();

  useEffect(() => {
    if (!id) return;

    const loadProduct = async () => {
      try {
        const data = await fetchOfferDetail(id);
        console.log(data);
        setProduct(data);
      } catch (error) {
        console.error(error);
      } finally {
      }
    };

    const loadShop = async () => {
      try {
        const shop = await fetchShopByOffer(id);

        console.log("shop:", shop);

        setShop(shop);
      } catch (error) {
        console.error(error);
      } finally {
      }
    };

    loadShop();
    loadProduct();
  }, [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!product) {
    return <div><LoadingOverlay /></div>;
  }

  return (
    <div className="product-detail-page">

      <div className="pd-top">
        {/* <ProductGallery images={product.thumbnailUrl} /> */}

        <ProductInfo product={product} />
      </div>

      <div className="pd-shop-box">
        <div className="pd-shop-left">
          <ShopCard shop={shop} />
        </div>

        <div className="pd-shop-right">
          <button className="pd-chat-btn">
            <MessageCircle size={18} />
            <span>Nhắn tin</span>
          </button>

          <button className="pd-view-shop-btn">
            <Store size={18} />
            <span>Xem Shop</span>
          </button>
        </div>
      </div>

      <div className="pd-content">
        <div>
          <div className="pd-tabs-header">
            <button
              className={`pd-tab ${activeTab === "description" ? "active" : ""}`}
              onClick={() => setActiveTab("description")}
            >
              Mô tả sản phẩm
            </button>

            <button
              className={`pd-tab ${activeTab === "review" ? "active" : ""}`}
              onClick={() => setActiveTab("review")}
            >
              Đánh giá
            </button>
          </div>
          <div className="pd-tabs-content">
            {activeTab === "description" && (
              <div className="pd-description">
                <h2>Mô tả sản phẩm</h2>
                <p>Tên đầy đủ sản phẩm: {product.title}</p>
                <p>{product.description}</p>
              </div>
            )}

            {activeTab === "review" && <Review productId={product.id} />}
          </div>
        </div>
        <ProductSpecification product={product} />
      </div>
    </div>
  );
}
