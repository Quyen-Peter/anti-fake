import { ShieldCheck, BadgeCheck, Star } from "lucide-react";
import "../../css/components/layout/searchSidebar.css";
import { useEffect, useState } from "react";
import { fetchCategories } from "../../services/category.api";

export default function SearchSidebar() {
  const [categories, setCategories] = useState<any[]>([]);

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
    <aside className="search-sidebar">
      {/* Danh mục */}

      <div className="filter-section">
        <h4>DANH MỤC</h4>

        <div className="s-category-list">
          {categories.map((item) => (
            <div key={item.id} className="s-category-item">
              <span>{item.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Khoảng giá */}

      <div className="filter-section">
        <h4>KHOẢNG GIÁ</h4>

        <label>
          <input type="checkbox" />
          Dưới 2 triệu
        </label>

        <label>
          <input type="checkbox" defaultChecked />2 triệu - 5 triệu
        </label>

        <label>
          <input type="checkbox" />5 triệu - 10 triệu
        </label>

        <label>
          <input type="checkbox" />
          10 triệu - 20 triệu
        </label>

        <label>
          <input type="checkbox" />
          Trên 20 triệu
        </label>

        <div className="price-range">
          <input placeholder="Từ" className="price-range-from" />
          <input placeholder="Đến" className="price-range-to" />
        </div>

        <button className="apply-btn">Áp dụng</button>
      </div>
    </aside>
  );
}
