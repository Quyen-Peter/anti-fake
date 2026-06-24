import "../../css/components/layout/searchSidebar.css";
import { useEffect, useState } from "react";
import { fetchCategories } from "../../services/category.api";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function SearchSidebar() {
  const [categories, setCategories] = useState<any[]>([]);
  const [fromPrice, setFromPrice] = useState("");
  const [toPrice, setToPrice] = useState("");

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const selectedCategoryId = searchParams.get("categoryId");

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

  const handleCategoryClick = (categoryId: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("categoryId", categoryId);
    navigate(`/search?${params.toString()}`);
  };

  const handlePriceRange = (minPrice?: number, maxPrice?: number) => {
    const params = new URLSearchParams(searchParams);

    if (minPrice !== undefined) {
      params.set("minPrice", String(minPrice));
    } else {
      params.delete("minPrice");
    }

    if (maxPrice !== undefined) {
      params.set("maxPrice", String(maxPrice));
    } else {
      params.delete("maxPrice");
    }

    navigate(`/search?${params.toString()}`);
  };

  const handleApplyPrice = () => {
    const params = new URLSearchParams(searchParams);

    if (fromPrice.trim()) {
      params.set("minPrice", fromPrice);
    } else {
      params.delete("minPrice");
    }

    if (toPrice.trim()) {
      params.set("maxPrice", toPrice);
    } else {
      params.delete("maxPrice");
    }

    navigate(`/search?${params.toString()}`);
  };

  return (
    <aside className="search-sidebar">
      {/* Danh mục */}

      <div className="filter-section">
        <h4>DANH MỤC</h4>

        <div className="s-category-list">
          {categories.map((item) => (
            <div
              key={item.id}
              className={`s-category-item ${
                selectedCategoryId === String(item.id) ? "active" : ""
              }`}
              onClick={() => handleCategoryClick(String(item.id))}
            >
              <span>{item.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Khoảng giá */}

      <div className="filter-section">
        <h4>KHOẢNG GIÁ</h4>

        <label>
          <input
            type="radio"
            checked={
              searchParams.get("minPrice") === "0" &&
              searchParams.get("maxPrice") === "2000000"
            }
            onChange={() => handlePriceRange(0, 2000000)}
          />
          Dưới 2 triệu
        </label>

        <label>
          <input
            type="radio"
            checked={
              searchParams.get("minPrice") === "2000000" &&
              searchParams.get("maxPrice") === "5000000"
            }
            onChange={() => handlePriceRange(2000000, 5000000)}
          />
          2 triệu - 5 triệu
        </label>

        <label>
          <input
            type="radio"
            checked={
              searchParams.get("minPrice") === "5000000" &&
              searchParams.get("maxPrice") === "10000000"
            }
            onChange={() => handlePriceRange(5000000, 10000000)}
          />
          5 triệu - 10 triệu
        </label>

        <label>
          <input
            type="radio"
            checked={
              searchParams.get("minPrice") === "10000000" &&
              searchParams.get("maxPrice") === "20000000"
            }
            onChange={() => handlePriceRange(10000000, 20000000)}
          />
          10 triệu - 20 triệu
        </label>

        <label>
          <input
            type="radio"
            checked={
              searchParams.get("minPrice") === "20000000" &&
              !searchParams.get("maxPrice")
            }
            onChange={() => handlePriceRange(20000000)}
          />
          Trên 20 triệu
        </label>

        <div className="price-range">
          <input
            type="number"
            placeholder="Từ"
            className="price-range-from"
            value={fromPrice}
            onChange={(e) => setFromPrice(e.target.value)}
          />
          <input
            type="number"
            placeholder="Đến"
            className="price-range-to"
            value={toPrice}
            onChange={(e) => setToPrice(e.target.value)}
          />
        </div>

        <button className="apply-btn" onClick={handleApplyPrice}>
          Áp dụng
        </button>
      </div>
    </aside>
  );
}
