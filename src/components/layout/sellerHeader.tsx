import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Wallet,
  BarChart3,
  Bell,
  MessageSquareText,
} from "lucide-react";

import "../../css/components/layout/sellerHeader.css";
import { Link, NavLink, useNavigate } from "react-router-dom";

export default function SellerHeader() {
  const navigate = useNavigate();

  return (
    <header className="seller-header">
      <div className="seller-header-left">
        <div className="logo">
          <Link to="/">
            <img
              src="/brand/logo-antifake.png"
              alt="logo"
              className="logo-img"
            />
          </Link>
        </div>

        <nav className="seller-header-menu">
          <NavLink
            to="dashboard"
            className={({ isActive }) =>
              `seller-header-menu-item ${
                isActive ? "seller-header-menu-item-active" : ""
              }`
            }
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="products"
            className={({ isActive }) =>
              `seller-header-menu-item ${
                isActive ? "seller-header-menu-item-active" : ""
              }`
            }
          >
            <Package size={18} />
            <span>Sản phẩm</span>
          </NavLink>

          <NavLink
            to="orders"
            className={({ isActive }) =>
              `seller-header-menu-item ${
                isActive ? "seller-header-menu-item-active" : ""
              }`
            }
          >
            <ShoppingCart size={18} />
            <span>Đơn hàng</span>
          </NavLink>

          <NavLink
            to="wallet"
            className={({ isActive }) =>
              `seller-header-menu-item ${
                isActive ? "seller-header-menu-item-active" : ""
              }`
            }
          >
            <Wallet size={18} />
            <span>Ví</span>
          </NavLink>

          <NavLink
            to="statistics"
            className={({ isActive }) =>
              `seller-header-menu-item ${
                isActive ? "seller-header-menu-item-active" : ""
              }`
            }
          >
            <BarChart3 size={18} />
            <span>Thống kê</span>
          </NavLink>
        </nav>
      </div>

      <div className="seller-header-right">
        <div
          className="seller-header-icon"
          onClick={() => navigate("/messages")}
        >
          <MessageSquareText size={22} />
          <span className="seller-header-badge">3</span>
        </div>

        <div className="seller-header-icon">
          <Bell size={22} />
          <span className="seller-header-badge">1</span>
        </div>

        <img
          src="https://i.pravatar.cc/100?img=3"
          alt="avatar"
          className="seller-header-avatar"
        />
      </div>
    </header>
  );
}
