import { ImageOff, RefreshCw, Shapes } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchShopCategories, type ShopCategory } from "../../services/shop.api";
import "../../css/components/shop/shopCategory.css";

export default function ShopCategories() {
  const { shopId } = useParams<{ shopId: string }>();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<ShopCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [requestVersion, setRequestVersion] = useState(0);

  useEffect(() => {
    if (!shopId) return;

    let cancelled = false;
    fetchShopCategories(shopId)
      .then((items) => {
        if (!cancelled) {
          setCategories(items);
          setError("");
        }
      })
      .catch((requestError: unknown) => {
        if (!cancelled) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Không thể tải danh mục của cửa hàng",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [shopId, requestVersion]);

  const selectCategory = (category: ShopCategory) => {
    if (!shopId) return;
    const params = new URLSearchParams({
      categoryId: String(category.id),
      categoryName: category.name,
    });
    navigate(`/shop/${shopId}/products?${params.toString()}`);
  };

  const retry = () => {
    setLoading(true);
    setRequestVersion((version) => version + 1);
  };

  return (
    <section className="shop-categories" aria-labelledby="shop-categories-title">
      <header className="shop-categories-header">
        <h2 id="shop-categories-title">Danh mục của cửa hàng</h2>
        <p>Chọn danh mục để xem các sản phẩm tương ứng.</p>
      </header>

      {loading ? (
        <div className="shop-category-grid" aria-busy="true" aria-label="Đang tải danh mục">
          {Array.from({ length: 8 }, (_, index) => (
            <div className="shop-category-card shop-category-skeleton" key={index} />
          ))}
        </div>
      ) : error ? (
        <div className="shop-category-state" role="alert">
          <strong>Không thể tải danh mục</strong>
          <p>{error}</p>
          <button type="button" onClick={retry}><RefreshCw size={16} /> Thử lại</button>
        </div>
      ) : categories.length === 0 ? (
        <div className="shop-category-state">
          <Shapes size={32} aria-hidden="true" />
          <strong>Chưa có danh mục</strong>
          <p>Cửa hàng chưa đăng sản phẩm theo danh mục nào.</p>
        </div>
      ) : (
        <div className="shop-category-grid">
          {categories.map((category) => (
            <button
              className="shop-category-card"
              key={String(category.id)}
              type="button"
              onClick={() => selectCategory(category)}
            >
              <span className="shop-category-image">
                {category.imageUrl ? (
                  <img src={category.imageUrl} alt="" loading="lazy" />
                ) : (
                  <ImageOff size={28} aria-hidden="true" />
                )}
              </span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
