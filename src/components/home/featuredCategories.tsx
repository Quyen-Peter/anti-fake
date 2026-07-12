import "../../css/components/featuredCategories.css";
import { useEffect, useState } from "react";
import { fetchCategories, type Category } from "../../services/category.api";
import { useNavigate } from "react-router-dom";
import "../../css/components/dataSkeleton.css";

export default function FeaturedCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="featured-categories">
      <h3>Danh mục nổi bật</h3>

      <div className="category-list">
        {loading ? (
          <div className="data-skeleton data-skeleton-compact home-category-skeleton" aria-busy="true" aria-label="Đang tải danh mục">
            {Array.from({ length: 7 }, (_, index) => (
              <div className="data-skeleton-row" key={index}>
                <span className="data-skeleton-lines"><span /><span /></span>
              </div>
            ))}
          </div>
        ) : (
          categories
          // .filter((item) => item.riskTier === "high" )
          .slice(0, 10)
          .map((item) => (
            <div key={item.id} className="category-item" onClick={() =>
            navigate(`/search?categoryId=${item.id}`)
          }>
              <span>{item.name}</span>
            </div>
          ))
        )}
      </div>

      <div className="category-footer">
        <button type="button" onClick={() => navigate("/categories")}>
          Xem tất cả danh mục
        </button>
      </div>
    </div>
  );
}
