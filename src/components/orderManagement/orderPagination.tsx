import "../../css/components/orderManagement/orderPagination.css";

interface Props {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function OrderPagination({
  page,
  totalPages,
  onPageChange,
}: Props) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="seller-pagination">
      <button
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        {"<"}
      </button>

      {pages.map((item) => (
        <button
          key={item}
          className={page === item ? "active" : ""}
          onClick={() => onPageChange(item)}
        >
          {item}
        </button>
      ))}

      <button
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        {">"}
      </button>
    </div>
  );
}
