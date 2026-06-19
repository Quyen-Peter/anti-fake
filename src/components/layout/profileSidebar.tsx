import {
  User,
  MapPin,
  ShoppingBag,
  QrCode,
  ShieldAlert,
  Settings,
  LogOut,
  Menu,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import "../../css/components/layout/profileSidebar.css";
import { useState } from "react";
import { logout } from "../../services/auth.api";

const menus = [
  {
    label: "Hồ sơ cá nhân",
    path: "/profile",
    icon: User,
  },
  {
    label: "Địa chỉ giao hàng",
    path: "/profile/address",
    icon: MapPin,
  },
  {
    label: "Đơn mua",
    path: "/profile/orders",
    icon: ShoppingBag,
  },
  {
    label: "Lịch sử xác thực QR",
    path: "/profile/verify-history",
    icon: QrCode,
  },
  {
    label: "Báo cáo hàng giả",
    path: "/profile/report",
    icon: ShieldAlert,
  },
  {
    label: "Cài đặt tài khoản",
    path: "/profile/settings",
    icon: Settings,
  },
  {
    label: "Đăng xuất",
    path: "/logout",
    icon: LogOut,
  },
];

export default function ProfileSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && (
        <div
          className="profile-sidebar-overlay"
          onClick={() => setOpen(false)}
        />
      )}
      <aside className="profile-sidebar">
        <div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div className="profile-sidebar-header">
              <h3>Cá nhân</h3>
              <p>Quản lý bảo mật & hồ sơ</p>
            </div>
            <button className="profile-menu-btn" onClick={() => setOpen(!open)}>
              <Menu size={20} />
            </button>
          </div>
          <div className="profile-sidebar-divider" />

          <nav
            className={`profile-sidebar-menu ${
              open ? "profile-sidebar-menu-open" : ""
            }`}
          >
            {menus.map((item) => {
              const Icon = item.icon;
              if (item.path === "/logout") {
                return (
                  <button
                    key={item.path}
                    className="profile-sidebar-link profile-logout-link"
                    onClick={logout}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </button>
                );
              }
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/profile"}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    isActive
                      ? "profile-sidebar-link active"
                      : "profile-sidebar-link"
                  }
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}
