import { useMemo, useState } from "react";
import OrderFilters from "../../components/orderManagement/orderFilters";
import OrderPagination from "../../components/orderManagement/orderPagination";
import OrderStats from "../../components/orderManagement/orderStats";
import OrderTable from "../../components/orderManagement/orderTable";
import "../../css/pages/orderManagement.css";
import OrderCard from "../../components/orderManagement/orderCard";

export default function OrderManagement() {
  const [activeStatus, setActiveStatus] = useState("all");
  const [search, setSearch] = useState("");

  const orders = [
    {
      id: "#AF-12845",
      customer: "Nguyễn Hoàng Nam",
      email: "nam.n@gmail.com",
      date: "24/05/2024, 14:20",
      total: "2,450,000đ",
      status: "processing",
    },
    {
      id: "#AF-12844",
      customer: "Phạm Thu Thảo",
      email: "thao.p@gmail.com",
      date: "24/05/2024, 11:05",
      total: "1,120,000đ",
      status: "shipping",
    },
    {
      id: "#AF-12843",
      customer: "Lê Duy Anh",
      email: "duyanh@gmail.com",
      date: "23/05/2024, 18:45",
      total: "5,800,000đ",
      status: "completed",
    },
    {
      id: "#AF-12842",
      customer: "Mai Tuyết Nhi",
      email: "nhi.mt@gmail.com",
      date: "23/05/2024, 09:30",
      total: "890,000đ",
      status: "cancelled",
    },
  ];

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchStatus =
        activeStatus === "all" || order.status === activeStatus;

      const keyword = search.trim().toLowerCase();

      const matchSearch =
        keyword === "" ||
        order.id.toLowerCase().includes(keyword) ||
        order.customer.toLowerCase().includes(keyword);

      return matchStatus && matchSearch;
    });
  }, [orders, activeStatus, search]);

  return (
    <div className="seller-order-page">
      <div className="seller-order-top">
        <div>
          <h1>Quản lý đơn hàng</h1>
          <p>Theo dõi và xử lý đơn hàng của bạn với độ chính xác cao.</p>
        </div>
      </div>

      <OrderStats />

      <div className="seller-order-table-card">
        <OrderFilters
          activeStatus={activeStatus}
          setActiveStatus={setActiveStatus}
          search={search}
          setSearch={setSearch}
        />
        <div className="seller-laptop-orders-table">
          <OrderTable orders={filteredOrders} />
        </div>

        <div className="seller-mobile-orders-card">
          {filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
        <OrderPagination />
      </div>
    </div>
  );
}
