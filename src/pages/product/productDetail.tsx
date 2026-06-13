import { useEffect, useState } from "react";
import ProductGallery from "../../components/product/productGallery";
import ProductInfo from "../../components/product/productInfo";
import ProductSpecification from "../../components/product/productSpecification";
import "../../css/pages/productDetail.css";
import Review from "../../components/product/review";
import type { shopCard } from "../../type/shop";
import ShopCard from "../../components/shop/shopCard";
import { MessageCircle, Store } from "lucide-react";

export default function ProductDetail() {
  const [activeTab, setActiveTab] = useState("description");

  const product = {
    id: "06b5f15b",
    title:
      "Kem chống nắng SPF50 - Lô 2026 Kem chống nắng SPF50 - Lô 2026 Kem chống nắng SPF50 - Lô 2026",
    description:
      "Kem chống nắng SPF50 giúp bảo vệ da khỏi tia UV, dưỡng ẩm và chống lão hóa.",

    price: 150000,
    currency: "VND",

    salesMode: "WHOLESALE",
    minWholesaleQty: 50,

    itemCondition: "new",

    availableQuantity: 500,
    soldQuantity: 120,

    parcelWeightGrams: 500,
    parcelLengthCm: 20,
    parcelWidthCm: 12,
    parcelHeightCm: 8,

    verificationLevel: "standard",
    verificationPolicy: "manual_review",

    categoryName: "Mỹ phẩm",

    gtin: 8938505970012,

    productModelName: "Kem chống nắng SPF50",

    thumbnailUrl: [
      "https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?w=800",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800",
      "https://images.unsplash.com/photo-1619451334792-150fd785ee74?w=800",
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800",
    ],

    shippingMethods: [
      {
        providerName: "Giao Hàng Nhanh",
        shippingFee: 25000,
        estimatedDays: "2-3 ngày",
      },
    ],
  };

  const mockShops: shopCard = {
    id: "shop-001",
    name: "TechWorld Official",
    avatarUrl: "https://i.pravatar.cc/150?img=1",
    isVerified: true,
    rating: 4.9,
    totalReviews: 12500,
    totalSale: 1200,
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="product-detail-page">
      <div className="pd-top">
        <ProductGallery images={product.thumbnailUrl} />

        <ProductInfo product={product} />
      </div>

      <div className="pd-shop-box">
        <div className="pd-shop-left">
          <ShopCard shop={mockShops} />
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
