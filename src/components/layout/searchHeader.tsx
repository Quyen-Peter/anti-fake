import { SlidersHorizontal } from "lucide-react";
import "../../css/components/layout/searchHeader.css";
import SearchSidebar from "./searchSidebar";
import { useState } from "react";

interface Props {
  sortType: string;
  setSortType: (value: string) => void;
}

export default function SearchHeader({ sortType, setSortType }: Props) {
  const [showFilter, setShowFilter] = useState(false);
  const [priceSort, setPriceSort] = useState<"none" | "asc" | "desc">("none");
  
  const handlePriceSort = () => {
    if (priceSort === "none") {
      setPriceSort("asc");
      setSortType("priceAsc");
    } else if (priceSort === "asc") {
      setPriceSort("desc");
      setSortType("priceDesc");
    } else {
      setPriceSort("none");
      setSortType("all");
    }
  };


  return (
    <div className="search-header">
      <button className="filter-btn" onClick={() => setShowFilter(true)}>
        <SlidersHorizontal size={18} />
      </button>
      <div className="search-sort">
        <button
          className={sortType === "all" ? "active" : ""}
          onClick={() => setSortType("all")}
        >
          Tất cả
        </button>
        <button
          className={sortType === "newest" ? "active" : ""}
          onClick={() => setSortType("newest")}
        >
          Mới nhất
        </button>

        <button
          className={sortType === "bestSelling" ? "active" : ""}
          onClick={() => setSortType("bestSelling")}
        >
          Bán chạy
        </button>
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
          <button
            className={sortType === "priceAsc" ? "active" : ""}
            onClick={() => setSortType("priceAsc")}
          >
            Giá ↑
          </button>
          <button
            className={sortType === "priceDesc" ? "active" : ""}
            onClick={() => setSortType("priceDesc")}
          >
            Giá ↓
          </button>
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
