import "../../css/components/featuredCategories.css";
import { useEffect, useState } from "react";
import { fetchCategories } from "../../services/category.api";
import { useNavigate } from "react-router-dom";

export default function FeaturedCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error(error);
      }
    };

    loadData();
  }, []);

  return (
    <div className="featured-categories">
      <h3>Danh mục nổi bật</h3>

      <div className="category-list">
        {categories
          // .filter((item) => item.riskTier === "high" )
          .slice(0, 10)
          .map((item) => (
            <div key={item.id} className="category-item" onClick={() =>
            navigate(`/search?categoryId=${item.id}`)
          }>
              <span>{item.name}</span>
            </div>
          ))}
      </div>

      <div className="category-footer">
        <button>Xem tất cả danh mục</button>
      </div>
    </div>
  );
}
