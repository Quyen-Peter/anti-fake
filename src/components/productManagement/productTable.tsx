import { Eye, Pencil, Trash2 } from "lucide-react";

import "../../css/components/productManagement/productTable.css";

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
  products: Product[];
}

export default function ProductTable({ products }: Props) {
  const getStatus = (status: string) => {
    switch (status) {
      case "active":
        return {
          text: "Trên kệ",
          className: "status-active",
        };

      case "low":
        return {
          text: "Còn ít",
          className: "status-low",
        };

      case "review":
        return {
          text: "Đang xét duyệt",
          className: "status-review",
        };

      case "failed":
        return {
          text: "Không thành công",
          className: "status-failed",
        };

      case "disabled":
        return {
          text: "Đã vô hiệu hóa",
          className: "status-disabled",
        };

      default:
        return {
          text: "Không xác định",
          className: "",
        };
    }
  };

  return (
    <div className="seller-product-table-wrapper">
      <table className="seller-product-table">
        <thead>
          <tr>
            <th>Sản phẩm</th>
            <th>SKU</th>
            <th>Danh mục</th>
            <th>Giá bán</th>
            <th>Kho</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => {
            const status = getStatus(product.status);

            return (
              <tr key={product.id}>
                <td>
                  <div className="seller-product-info">
                    <img src={product.image} alt={product.name} />

                    <div className="seller-product-info-content">
                      <h4>{product.name}</h4>
                    </div>
                  </div>
                </td>

                <td className="seller-product-sku">
                  {product.sku}
                </td>

                <td className="seller-product-category">
                  {product.category}
                </td>

                <td className="seller-product-price">
                  {product.price}
                </td>

                <td
                  className={"seller-product-stock" }
                >
                  {product.stock}
                </td>

                <td>
                  <span
                    className={`seller-product-status ${status.className}`}
                  >
                    {status.text}
                  </span>
                </td>

                <td>
                  <div className="seller-product-actions">
                    <button className="seller-product-action-btn view">
                      <Eye size={18} />
                    </button>

                    <button className="seller-product-action-btn edit">
                      <Pencil size={18} />
                    </button>

                    <button className="seller-product-action-btn delete">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {products.length === 0 && (
        <div className="seller-product-empty">
          Không có sản phẩm nào
        </div>
      )}
    </div>
  );
}
