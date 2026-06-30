import {
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

import "../../css/components/productManagement/productCard.css";

interface Product {
  id: number | string;
  name: string;
  sku: string;
  category: string;
  price: string;
  stock: number;
  status: string;
  image: string;
}

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const getStatus = (status: string) => {
    switch (status) {
      case "active":
        return {
          text: "Trên kệ",
          className: "seller-product-status-active",
        };

      case "low":
        return {
          text: "Còn ít",
          className: "seller-product-status-low",
        };

      case "review":
        return {
          text: "Đang xét duyệt",
          className: "seller-product-status-review",
        };

      case "failed":
        return {
          text: "Không thành công",
          className: "seller-product-status-failed",
        };

      case "disabled":
        return {
          text: "Đã vô hiệu hóa",
          className: "seller-product-status-disabled",
        };

      default:
        return {
          text: status,
          className: "",
        };
    }
  };

  const status = getStatus(product.status);

  return (
    <div className="seller-product-card">
      <div className="seller-product-card-top">
        <img
          src={product.image}
          alt={product.name}
          className="seller-product-card-image"
        />

        <div className="seller-product-card-content">
          <div className="seller-product-card-header">
            <h3>{product.name}</h3>
          </div>

          <div className="seller-product-card-meta">
            <span className="seller-product-card-sku">
              SKU: {product.sku}
            </span>

            <span className="seller-product-card-category">
              • {product.category}
            </span>
          </div>

          <div className="seller-product-card-price">
            {product.price}
          </div>

          <div className="seller-product-card-footer">
            <span
              className={`seller-product-status ${status.className}`}
            >
              {status.text}
            </span>

            <span className="seller-product-card-stock">
              Kho: {product.stock}
            </span>
          </div>
        </div>
      </div>

      <div className="seller-product-card-actions">
        <button className="seller-product-action-btn">
          <Eye size={18} />
          <span>Xem</span>
        </button>

        <button className="seller-product-action-btn">
          <Pencil size={18} />
          <span>Sửa</span>
        </button>

        <button className="seller-product-delete-btn">
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}
