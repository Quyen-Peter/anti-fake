import {
  DollarSign,
  ShoppingBag,
  Package,
} from "lucide-react";

export default function SellerStats() {
  const stats = [
    {
      title: "Doanh thu",
      value: "128.500.000đ",
      icon: DollarSign,
      change: "+12.5%",
    },
    {
      title: "Đơn hàng",
      value: "432",
      icon: ShoppingBag,
      change: "+9.2%",
    },
    {
      title: "Sản phẩm",
      value: "1,024",
      icon: Package,
      change: "-2.1%",
    },
  ];

  return (
    <div className="seller-stats-grid">
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            className="seller-stat-card"
          >
            <div className="seller-stat-top">
              <div className="seller-stat-icon">
                <Icon size={18} />
              </div>

              <span className="seller-stat-change">
                {item.change}
              </span>
            </div>

            <p>{item.title}</p>
            <h3>{item.value}</h3>
          </div>
        );
      })}
    </div>
  );
}