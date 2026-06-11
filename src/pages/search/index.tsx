import { useSearchParams } from "react-router-dom";

export default function SearchPage() {
    const [searchParams] = useSearchParams();

  const keyword = searchParams.get("q") || "";
  return (
    <div>
      <h1>Tìm kiếm</h1>
      <p>Từ khóa: {keyword}</p>
    </div>
  );
}