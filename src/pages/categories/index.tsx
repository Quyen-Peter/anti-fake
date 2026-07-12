import { ImageOff, RefreshCw, Shapes } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/pages/categories.css";
import { fetchCategories, type Category } from "../../services/category.api";

export default function CategoriesPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [requestVersion, setRequestVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;

    fetchCategories()
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
              : "Không thể tải danh sách thể loại",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [requestVersion]);

  const selectCategory = (category: Category) => {
    const params = new URLSearchParams({
      categoryId: category.id,
      category: category.name,
    });
    navigate(`/search?${params.toString()}`);
  };

  const retry = () => {
    setLoading(true);
    setRequestVersion((version) => version + 1);
  };

  return (
    <main className="categories-page">
      <header className="categories-header">
        <span><Shapes size={18} /> Khám phá sản phẩm</span>
        <h1>Tất cả thể loại</h1>
        <p>Chọn một thể loại để xem các sản phẩm phù hợp.</p>
      </header>

      {loading ? (
        <div className="categories-grid" aria-busy="true" aria-label="Đang tải thể loại">
          {Array.from({ length: 12 }, (_, index) => (
            <div className="category-card category-card-skeleton" key={index} />
          ))}
        </div>
      ) : error ? (
        <div className="categories-state" role="alert">
          <strong>Không thể tải thể loại</strong>
          <p>{error}</p>
          <button type="button" onClick={retry}><RefreshCw size={16} /> Thử lại</button>
        </div>
      ) : categories.length === 0 ? (
        <div className="categories-state">
          <Shapes size={32} />
          <strong>Chưa có thể loại</strong>
          <p>Danh sách thể loại hiện đang trống.</p>
        </div>
      ) : (
        <div className="categories-grid">
          {categories.map((category) => (
            <button
              className="category-card"
              key={category.id}
              type="button"
              onClick={() => selectCategory(category)}
            >
              <span className="category-card-image">
                {category.imageUrl ? (
                  <img src={category.imageUrl} alt="" loading="lazy" />
                ) : (
                  <ImageOff size={30} aria-hidden="true" />
                )}
              </span>
              <span className="category-card-name">{category.name}</span>
            </button>
          ))}
        </div>
      )}
    </main>
  );
}
