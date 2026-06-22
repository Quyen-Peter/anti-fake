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
import { Link, useNavigate } from "react-router-dom";

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
          <a className="seller-header-menu-item seller-header-menu-item-active">
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </a>

          <a className="seller-header-menu-item">
            <Package size={18} />
            <span>Sản phẩm</span>
          </a>

          <a className="seller-header-menu-item">
            <ShoppingCart size={18} />
            <span>Đơn hàng</span>
          </a>

          <a className="seller-header-menu-item">
            <Wallet size={18} />
            <span>Ví</span>
          </a>

          <a className="seller-header-menu-item">
            <BarChart3 size={18} />
            <span>Thống kê</span>
          </a>
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
