import "../../css/components/orderManagement/orderPagination.css";

export default function OrderPagination() {
  return (
    <div className="seller-pagination">
      <button>{"<"}</button>

      <button className="active">
        1
      </button>

      <button>2</button>

      <button>3</button>

      <span>...</span>

      <button>129</button>

      <button>{">"}</button>
    </div>
  );
}