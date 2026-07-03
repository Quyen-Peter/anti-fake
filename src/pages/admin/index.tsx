import { ArrowRight, BarChart3, FileCheck2, ShieldCheck, Users } from "lucide-react";
import { Link } from "react-router-dom";

const quickLinks = [
  {
    title: "Người dùng",
    desc: "Theo dõi tài khoản, vai trò và trạng thái hoạt động.",
    path: "/admin/users",
    icon: Users,
  },
  {
    title: "Đăng ký cửa hàng",
    desc: "Duyệt hồ sơ pháp lý và trạng thái xác minh shop.",
    path: "/admin/shop-registrations",
    icon: ShieldCheck,
  },
  {
    title: "Đăng ký sản phẩm",
    desc: "Kiểm tra sản phẩm đang chờ xác thực.",
    path: "/admin/product-registrations",
    icon: FileCheck2,
  },
];

export default function AdminDashboardPage() {
  return (
    <section className="admin-page">
      <div className="admin-page-heading">
        <div>
          <h1>Dashboard quản trị</h1>
          <p>Tổng quan hoạt động hệ thống AntiFake.</p>
        </div>
      </div>

      <div className="admin-overview">
        <div>
          <BarChart3 size={34} />
          <h2>Trung tâm điều phối</h2>
          <p>
            Theo dõi các luồng xét duyệt quan trọng: người dùng, shop, sản phẩm,
            mã giảm giá và yêu cầu rút tiền.
          </p>
        </div>
      </div>

      <div className="admin-management-grid">
        {quickLinks.map((item) => {
          const Icon = item.icon;

          return (
            <Link to={item.path} className="admin-management-card" key={item.path}>
              <span>
                <Icon size={22} />
              </span>
              <strong>{item.title}</strong>
              <p>{item.desc}</p>
              <small>
                Mở trang <ArrowRight size={14} />
              </small>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
