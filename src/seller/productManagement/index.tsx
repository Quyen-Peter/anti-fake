import { Plus, Search } from "lucide-react";
import ProductTable from "../../components/productManagement/productTable";
import "../../css/pages/productManagement.css";
import { useMemo, useState } from "react";
import ProductCard from "../../components/productManagement/productCard";

export default function ProductManagement() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const products = [
    {
      id: 1,
      name: "Rolex Submariner Date",
      sku: "AF-W-00921",
      category: "Đồng hồ",
      price: "325.000.000đ",
      stock: 15,
      status: "active",
      image:
        "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=200",
    },
    {
      id: 2,
      name: "Rolex Daytona Panda",
      sku: "AF-W-00922",
      category: "Đồng hồ",
      price: "580.000.000đ",
      stock: 2,
      status: "low",
      image:
        "https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?w=200",
    },
    {
      id: 3,
      name: "Hermès Birkin 25 Gold",
      sku: "AF-B-00125",
      category: "Túi xách",
      price: "720.000.000đ",
      stock: 1,
      status: "low",
      image:
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=200",
    },
    {
      id: 4,
      name: "Louis Vuitton Neverfull MM",
      sku: "AF-B-00891",
      category: "Túi xách",
      price: "58.000.000đ",
      stock: 0,
      status: "review",
      image:
        "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=200",
    },
    {
      id: 5,
      name: "Gucci Marmont Small",
      sku: "AF-B-00752",
      category: "Túi xách",
      price: "65.000.000đ",
      stock: 0,
      status: "review",
      image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200",
    },
    {
      id: 6,
      name: "Nike Air Jordan 1 Chicago",
      sku: "AF-S-00212",
      category: "Giày",
      price: "24.500.000đ",
      stock: 20,
      status: "active",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200",
    },
    {
      id: 7,
      name: "Adidas Yeezy Boost 350",
      sku: "AF-S-00418",
      category: "Giày",
      price: "18.000.000đ",
      stock: 0,
      status: "failed",
      image:
        "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=200",
    },
    {
      id: 8,
      name: "Apple Watch Ultra 2",
      sku: "AF-E-00991",
      category: "Điện tử",
      price: "22.900.000đ",
      stock: 35,
      status: "active",
      image:
        "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=200",
    },
    {
      id: 9,
      name: "AirPods Pro 2 USB-C",
      sku: "AF-E-00221",
      category: "Điện tử",
      price: "5.990.000đ",
      stock: 3,
      status: "low",
      image:
        "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f37?w=200",
    },
    {
      id: 10,
      name: "Samsung Galaxy S25 Ultra Samsung Galaxy S25 Ultra Samsung Galaxy S25 Ultra",
      sku: "AF-E-01021",
      category: "Điện thoại",
      price: "31.990.000đ",
      stock: 0,
      status: "disabled",
      image:
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200",
    },
    {
      id: 11,
      name: "Dior Saddle Bag",
      sku: "AF-B-01088",
      category: "Túi xách",
      price: "95.000.000đ",
      stock: 0,
      status: "failed",
      image:
        "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=200",
    },
    {
      id: 12,
      name: "Omega Seamaster Diver 300M",
      sku: "AF-W-00881",
      category: "Đồng hồ",
      price: "168.000.000đ",
      stock: 0,
      status: "disabled",
      image:
        "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?w=200",
    },
  ];

  const categories = [...new Set(products.map((p) => p.category))];

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      let statusMatch = true;

      switch (activeTab) {
        case "active":
          statusMatch = product.status === "active";
          break;

        case "low":
          statusMatch = product.status === "low";
          break;

        case "review":
          statusMatch = product.status === "review";
          break;

        case "failed":
          statusMatch = product.status === "failed";
          break;

        case "disabled":
          statusMatch = product.status === "disabled";
          break;

        default:
          statusMatch = true;
      }

      const keyword = searchText.toLowerCase();

      const searchMatch =
        product.name.toLowerCase().includes(keyword) ||
        product.sku.toLowerCase().includes(keyword);

      const categoryMatch =
        categoryFilter === "all" ? true : product.category === categoryFilter;

      return statusMatch && searchMatch && categoryMatch;
    });
  }, [products, activeTab, searchText, categoryFilter]);

  return (
    <div className="seller-product-page">
      <div className="seller-product-header">
        <div>
          <h2>Quản lý sản phẩm</h2>
          <p>Theo dõi, chỉnh sửa và quản lý sản phẩm của cửa hàng.</p>
        </div>

        <button className="seller-product-add-btn">
          <Plus size={18} />
          Thêm sản phẩm mới
        </button>
      </div>

      <div className="seller-product-filter">
        <div className="seller-product-tabs">
          <button
            className={`seller-product-tab ${
              activeTab === "all" ? "active" : ""
            }`}
            onClick={() => setActiveTab("all")}
          >
            Tất cả ({products.length})
          </button>

          <button
            className={`seller-product-tab ${
              activeTab === "active" ? "active" : ""
            }`}
            onClick={() => setActiveTab("active")}
          >
            Trên kệ ({products.filter((p) => p.status === "active").length})
          </button>

          <button
            className={`seller-product-tab ${
              activeTab === "low" ? "active" : ""
            }`}
            onClick={() => setActiveTab("low")}
          >
            Còn ít ({products.filter((p) => p.status === "low").length})
          </button>

          <button
            className={`seller-product-tab ${
              activeTab === "review" ? "active" : ""
            }`}
            onClick={() => setActiveTab("review")}
          >
            Đang xét duyệt (
            {products.filter((p) => p.status === "review").length})
          </button>

          <button
            className={`seller-product-tab ${
              activeTab === "failed" ? "active" : ""
            }`}
            onClick={() => setActiveTab("failed")}
          >
            Không thành công (
            {products.filter((p) => p.status === "failed").length})
          </button>

          <button
            className={`seller-product-tab ${
              activeTab === "disabled" ? "active" : ""
            }`}
            onClick={() => setActiveTab("disabled")}
          >
            Đã vô hiệu hóa (
            {products.filter((p) => p.status === "disabled").length})
          </button>
        </div>
        <div className="seller-product-search-select">
          <div className="seller-product-search">
            <Search size={18} />

            <input
              placeholder="Tìm kiếm sản phẩm hoặc SKU..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">Tất cả danh mục</option>

            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="seller-product-table-section">
        {filteredProducts.length > 0 ? (
          <div>
            <div className="seller-product-management-destop">
              <ProductTable products={filteredProducts} />
            </div>
            <div className="seller-product-management-mobile">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        ) : (
          <div className="seller-empty-product">
            Không tìm thấy sản phẩm nào.
          </div>
        )}
      </div>
    </div>
  );
}
