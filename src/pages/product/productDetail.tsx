import { useEffect, useState } from "react";
import ProductInfo from "../../components/product/productInfo";
import ProductSpecification from "../../components/product/productSpecification";
import "../../css/pages/productDetail.css";
import Review from "../../components/product/review";
import ShopCard from "../../components/shop/shopCard";
import { MessageCircle, Star, Store } from "lucide-react";
import { fetchOfferDetail } from "../../services/product.api";
import { useNavigate, useParams } from "react-router-dom";
import { fetchShopByOffer } from "../../services/shop.api";
import LoadingOverlay from "../../components/loadingOverlay";
import ProductGallery from "../../components/product/productGallery";
import { fetchOfferReviews } from "../../services/review.api";
import { getShopChatThread } from "../../services/chat.api";
import ProductCard from "../../components/product/productCard";
import { searchOffers } from "../../services/product.api";
import type { ProductView } from "../../type/product";

type ReviewItem = {
  id: string;
  authorName: string;
  rating: number;
  comment: string;
  createdAt: string;
  media: string[];
};

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("description");
  const [product, setProduct] = useState<any>();
  const [shop, setShop] = useState<any>();
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReview, setTotalReview] = useState(0);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<ProductView[]>([]);

  useEffect(() => {
    if (!id) return;

    const loadProduct = async () => {
      try {
        const data = await fetchOfferDetail(id);
        setProduct(data);
      } catch (error) {
        console.error(error);
      } finally {
      }
    };

    const loadShop = async () => {
      try {
        const shop = await fetchShopByOffer(id);
        setShop(shop);
      } catch (error) {
        console.error(error);
      } finally {
      }
    };

    const loadReviews = async () => {
      try {
        setLoadingReviews(true);

        const data = await fetchOfferReviews(id);

        setReviews(data.items || []);
        setAverageRating(data.averageRating || 0);
        setTotalReview(data.total || 0);
      } catch (error) {
        console.error(error);
        setReviews([]);
      } finally {
        setLoadingReviews(false);
      }
    };

    loadShop();
    loadReviews();
    loadProduct();
  }, [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (!product?.categoryId || !product?.id) {
      setRelatedProducts([]);
      return;
    }

    const loadRelatedProducts = async () => {
      try {
        const data = await searchOffers({
          categoryId: product.categoryId,
          page: 1,
          pageSize: 9,
        });
        const items = Array.isArray(data)
          ? data
          : Array.isArray(data.items)
            ? data.items
            : [];

        setRelatedProducts(
          items
            .filter((item: ProductView) => item.id !== product.id)
            .slice(0, 8),
        );
      } catch (error) {
        console.error(error);
        setRelatedProducts([]);
      }
    };

    loadRelatedProducts();
  }, [product?.categoryId, product?.id]);

  const getOrCreateChatThread = async (shopId: string) => {
    try {

      const response = await getShopChatThread(shopId);

      if (!response?.success || !response?.threadId) {
        throw new Error("Không thể tạo cuộc trò chuyện");
      }

      navigate(`/messages/${response.threadId}`);

      return;
    } catch (error: any) {
      console.error("Lỗi tạo chat thread:", error);

      throw new Error(
        error?.response?.data?.message ||
          error?.message ||
          "Đã xảy ra lỗi khi tạo cuộc trò chuyện",
      );
    }
  };

  if (!product) {
    return (
      <div>
        <LoadingOverlay />
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      <div className="pd-top">
        <ProductGallery images={product.imageUrls} />

        <ProductInfo product={product} shop={shop} />
      </div>

      <div className="pd-shop-box">
        <div className="pd-shop-left">
          <ShopCard shop={shop} />
        </div>

        <div className="pd-shop-right">
          <button
            className="pd-chat-btn"
            onClick={() => getOrCreateChatThread(shop.id)}
          >
            <MessageCircle size={18} />
            <span>Nhắn tin</span>
          </button>

          <button className="pd-view-shop-btn" onClick={() => navigate(`/shop/${shop.id}`)}>
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
              Đánh giá ({totalReview}){averageRating.toFixed(1)}
              <Star size={14} style={{ margin: "0 4px" }} />
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

            {activeTab === "review" && (
              <Review reviews={reviews} loading={loadingReviews} />
            )}
          </div>
        </div>
        <ProductSpecification product={product} />
      </div>


      {relatedProducts.length > 0 && (
        <section className="pd-related-section">
          <div className="pd-related-header">
            <h2>Có thể bạn sẽ thích</h2>
          </div>

          <div className="pd-related-grid">
            {relatedProducts.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
