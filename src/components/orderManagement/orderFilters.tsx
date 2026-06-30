import { Search } from "lucide-react";

import "../../css/components/orderManagement/orderFilters.css";

interface Props {
  activeStatus: string;
  setActiveStatus: (status: string) => void;
  search: string;
  setSearch: (value: string) => void;
}

export default function OrderFilters({
  activeStatus,
  setActiveStatus,
  search,
  setSearch,
}: Props) {
  const tabs = [
    {
      label: "Tất cả",
      value: "all",
    },
    {
      label: "Chờ xử lý",
      value: "pending",
    },
    {
      label: "Đang giao",
      value: "shipping",
    },
    {
      label: "Hoàn thành",
      value: "completed",
    },
    {
      label: "Đã hủy",
      value: "cancelled",
    },
  ];

  return (
    <div className="seller-order-filter">
      <div className="seller-order-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            className={
              activeStatus === tab.value ? "active" : ""
            }
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
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm theo mã đơn hàng hoặc tên khách hàng..."
        />
      </div>
    </div>
  );
}
