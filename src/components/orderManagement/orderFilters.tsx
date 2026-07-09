import { Search } from "lucide-react";

import "../../css/components/orderManagement/orderFilters.css";

interface Props {
  activeStatus: string;
  setActiveStatus: (status: string) => void;
  search: string;
  setSearch: (value: string) => void;
}

const tabs = [
  { label: "Tất cả", value: "all" },
  { label: "Chờ xác nhận", value: "pending" },
  { label: "Đang xử lý", value: "processing" },
  { label: "Đang giao", value: "shipping" },
  { label: "Đã giao", value: "delivered" },
  { label: "Đã hủy", value: "cancelled" },
];

export default function OrderFilters({
  activeStatus,
  setActiveStatus,
  search,
  setSearch,
}: Props) {
  return (
    <div className="seller-order-filter">
      <div className="seller-order-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            className={activeStatus === tab.value ? "active" : ""}
            onClick={() => setActiveStatus(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="seller-order-search">
        <Search size={18} />

        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Tìm theo mã đơn hàng hoặc tên khách hàng..."
        />
      </div>
    </div>
  );
}
