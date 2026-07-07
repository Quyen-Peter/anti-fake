import { Plus, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import ProductTable from "../../components/productManagement/productTable";
import "../../css/pages/productManagement.css";
import ProductCard from "../../components/productManagement/productCard";
import CreateProduct from "../../components/productManagement/createProduct";
import {
  fetchShopCategories,
  fetchShopOffers,
  getMyShop,
  type ShopCategory,
  type ShopOffer,
} from "../../services/shop.api";

type Product = {
  id: string;
  name: string;
  sku: string;
  category: string;
  categoryId: string;
  price: string;
  stock: number;
  status: string;
  image: string;
};

const PAGE_SIZE = 20;

const normalizeMyShop = (data: unknown) => {
  if (!data || typeof data !== "object") return null;
  const record = data as Record<string, unknown>;
  const payload = record.data ?? record.items ?? data;

  if (Array.isArray(payload)) return payload[0] ?? null;
  return payload && typeof payload === "object"
    ? (payload as Record<string, unknown>)
    : null;
};

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

const formatCurrency = (value?: number, currency = "VND") =>
  typeof value === "number"
    ? new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency,
      }).format(value)
    : "";

const normalizeStatus = (offer: ShopOffer) => {
  const status = offer.offerStatus?.toLowerCase() || "active";
  const stock = offer.availableQuantity ?? 0;

  if (status === "pending") return "review";
  if (status === "rejected") return "failed";
  if (status === "inactive") return "disabled";
  if (status === "active" && stock > 0 && stock <= 5) return "low";

  return status;
};

const mapOfferToProduct = (
  offer: ShopOffer,
  categories: ShopCategory[],
): Product => {
  const categoryId = offer.categoryId || "";
  const category = categories.find(
    (item) => String(item.id) === String(categoryId),
  );

  return {
    id: offer.id,
    name: offer.title,
    sku: offer.id,
    category: category?.name || "Chua phan loai",
    categoryId,
    price: formatCurrency(offer.price, offer.currency || "VND"),
    stock: offer.availableQuantity ?? 0,
    status: normalizeStatus(offer),
    image: offer.thumbnailUrl || "/vite.svg",
  };
};

function ProductLoading() {
  return (
    <div
      className="seller-product-loading"
      role="status"
      aria-live="polite"
      aria-label="Dang tai san pham"
    >
      <div className="seller-product-loading-head">
        <span className="seller-product-loading-spinner" />
        <span>Dang tai san pham...</span>
      </div>

      <div className="seller-product-loading-list" aria-hidden="true">
        {Array.from({ length: 4 }, (_, index) => (
          <div className="seller-product-loading-row" key={index}>
            <span />
            <span />
            <span />
            <span />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ProductManagement() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [openCreateProduct, setOpenCreateProduct] = useState(false);
  const [shopId, setShopId] = useState("");
  const [categories, setCategories] = useState<ShopCategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [createVersion, setCreateVersion] = useState(0);

  useEffect(() => {
    const loadShop = async () => {
      try {
        const shopData = await getMyShop();
        const shop = normalizeMyShop(shopData);
        const nextShopId = shop?.shopId || shop?.id;

        if (!nextShopId) {
          setError("Khong tim thay cua hang cua ban");
          setLoading(false);
          return;
        }

        setShopId(String(nextShopId));
      } catch (err: unknown) {
        setError(getErrorMessage(err, "Khong the tai thong tin cua hang"));
        setLoading(false);
      }
    };

    loadShop();
  }, []);

  useEffect(() => {
    if (!shopId) return;

    const loadProducts = async () => {
      setLoading(true);
      setError("");

      try {
        const [categoryData, offerData] = await Promise.all([
          fetchShopCategories(shopId),
          fetchShopOffers(shopId, 1, PAGE_SIZE),
        ]);

        setCategories(categoryData);
        setProducts(
          offerData.items.map((offer) =>
            mapOfferToProduct(offer, categoryData),
          ),
        );
      } catch (err: unknown) {
        setCategories([]);
        setProducts([]);
        setError(getErrorMessage(err, "Khong the tai danh sach san pham"));
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [shopId, createVersion]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const statusMatch =
        activeTab === "all" ? true : product.status === activeTab;

      const keyword = searchText.trim().toLowerCase();

      const searchMatch =
        keyword === "" ||
        product.name.toLowerCase().includes(keyword) ||
        product.sku.toLowerCase().includes(keyword);

      const categoryMatch =
        categoryFilter === "all"
          ? true
          : String(product.categoryId) === String(categoryFilter);

      return statusMatch && searchMatch && categoryMatch;
    });
  }, [products, activeTab, searchText, categoryFilter]);

  const countByStatus = (status: string) =>
    products.filter((product) => product.status === status).length;

  return (
    <div className="seller-product-page">
      <div className="seller-product-header">
        <div>
          <h2>Quản lý sản phẩm</h2>
          <p>Theo dõi, chỉnh sửa và quản lý sản phẩm của cửa hàng.</p>
        </div>

        <button
          className="seller-product-add-btn"
          onClick={() => setOpenCreateProduct(true)}
        >
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
            Trên kệ ({countByStatus("active")})
          </button>

          <button
            className={`seller-product-tab ${
              activeTab === "low" ? "active" : ""
            }`}
            onClick={() => setActiveTab("low")}
          >
            Còn ít ({countByStatus("low")})
          </button>

          <button
            className={`seller-product-tab ${
              activeTab === "review" ? "active" : ""
            }`}
            onClick={() => setActiveTab("review")}
          >
            Đang xét duyệt ({countByStatus("review")})
          </button>

          <button
            className={`seller-product-tab ${
              activeTab === "failed" ? "active" : ""
            }`}
            onClick={() => setActiveTab("failed")}
          >
            Không thành công ({countByStatus("failed")})
          </button>

          <button
            className={`seller-product-tab ${
              activeTab === "disabled" ? "active" : ""
            }`}
            onClick={() => setActiveTab("disabled")}
          >
            Đã vô hiệu hóa ({countByStatus("disabled")})
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
              <option key={category.id} value={String(category.id)}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="seller-product-table-section">
        {loading ? (
          <ProductLoading />
        ) : error ? (
          <div className="seller-empty-product">{error}</div>
        ) : filteredProducts.length > 0 ? (
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
      {openCreateProduct && (
        <div
          className="create-product-overlay"
          role="presentation"
          onClick={() => setOpenCreateProduct(false)}
        >
          <div
            className="create-product-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-product-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="create-product-header">
              <h2 id="create-product-title">Tạo sản phẩm mới</h2>

              <button
                type="button"
                aria-label="Dong form tao san pham"
                onClick={() => setOpenCreateProduct(false)}
              >
                x
              </button>
            </div>

            <div className="create-product-body">
              <CreateProduct
                onCancel={() => setOpenCreateProduct(false)}
                onCreated={() => setCreateVersion((current) => current + 1)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
