import { SlidersHorizontal } from "lucide-react";
import "../../css/components/layout/searchHeader.css";
import SearchSidebar from "./searchSidebar";
import { useState } from "react";

export default function SearchHeader() {
  const [showFilter, setShowFilter] = useState(false);
  const [priceSort, setPriceSort] = useState<"none" | "asc" | "desc">("none");
  const handlePriceSort = () => {
    setPriceSort((prev) => {
      if (prev === "none") return "asc";
      if (prev === "asc") return "desc";
      return "none";
    });
  };
  //   const handleNewest = () => {
  //   setPriceSort("none");
  //   setSortType("newest");
  // };
  return (
    <div className="search-header">
      <button className="filter-btn" onClick={() => setShowFilter(true)}>
        <SlidersHorizontal size={18} />
      </button>
      <div className="search-sort">
        <button className="active">Tất cả</button>
        <button>Mới nhất</button>

        <button>Bán chạy</button>
        <div className="price-sort">
          <button
            className={priceSort !== "none" ? "active" : ""}
            onClick={handlePriceSort}
          >
            Giá
            {priceSort === "asc" && " ↑"}
            {priceSort === "desc" && " ↓"}
          </button>
        </div>

        <div className="price-dropdown">
          <button>Giá thấp → cao</button>
          <button>Giá cao → thấp</button>
        </div>
      </div>
      {showFilter && (
        <>
          <div
            className="filter-overlay"
            onClick={() => setShowFilter(false)}
          />

          <aside className="mobile-filter">
            <SearchSidebar />

            <button
              className="close-filter"
              onClick={() => setShowFilter(false)}
            >
              Đóng
            </button>
          </aside>
        </>
      )}
    </div>
  );
}
