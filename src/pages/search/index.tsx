import { useSearchParams } from "react-router-dom";
import SearchSidebar from "../../components/layout/searchSidebar";
import "../../css/pages/search.css";
import SearchHeader from "../../components/layout/searchHeader";

export default function SearchPage() {
  const [searchParams] = useSearchParams();

  const keyword = searchParams.get("q") || "";
  return (
    <div className="search-page">
      <div className="s-sidebar-page">
        <SearchSidebar />
      </div>

      <div className="search-content">
        <SearchHeader />
        <div className="s-product-grid">
          <p>{keyword}</p>
        </div>
      </div>
    </div>
  );
}
