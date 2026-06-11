import { Link, useLocation, useNavigate } from "react-router-dom";
import "../../css/components/layout/header.css";
import {
  Bell,
  Handshake,
  Heart,
  Home,
  MessageSquareText,
  ScanLine,
  Search,
  ShoppingCart,
  User,
  UserCircle2,
  Users,
} from "lucide-react";
import { useState } from "react";

export default function Header() {
  const location = useLocation();
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!keyword.trim()) return;

    navigate(`/search?q=${encodeURIComponent(keyword)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const menus = [
    {
      label: "Trang chủ",
      path: "/",
    },
    {
      label: "Cộng đồng",
      path: "/community",
    },
    {
      label: "Affiliate",
      path: "/affiliate",
    },
    {
      label: "Xác thực QR",
      path: "/qr",
    },
  ];

  const mobileMenus = [
    {
      label: "Trang chủ",
      path: "/",
      icon: Home,
    },
    {
      label: "Cộng đồng",
      path: "/community",
      icon: Users,
    },
    {
      label: "Affiliate",
      path: "/affiliate",
      icon: Handshake,
    },
    {
      label: "QR",
      path: "/qr",
      icon: ScanLine,
    },
    {
      label: "Tôi",
      path: "/profile",
      icon: User,
    },
  ];

  return (
    <div className="sidebar">
      <div className="logo">
        <Link to="/">
          <img src="/brand/logo-antifake.png" alt="logo" className="logo-img" />
        </Link>
      </div>

      {/* menu */}
      <div className="menu">
        {menus.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={`menu-item ${
              location.pathname === item.path ? "active" : ""
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>

      {/* search  */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Tìm sản phẩm..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <button className="search-btn" onClick={handleSearch}>
          <Search size={22} />
        </button>
      </div>

      {/* action */}
      <div className="header-actions">
        <Link to="/wishlist" className="icon-btn wishlist-btn">
          <Heart size={22} />

          <span className="badge">4</span>
        </Link>
        <Link to="/messages" className="icon-btn">
          <MessageSquareText size={22} />
          <span className="badge">3</span>
        </Link>

        <Link to="/cart" className="icon-btn cart-btn">
          <ShoppingCart size={22} />
          <span className="badge">2</span>
        </Link>

        <Link to="/notification" className="icon-btn">
          <Bell size={22} />
          <span className="badge">1</span>
        </Link>

        <div className="divider" />

        <Link to="/profile" className="icon-btn profile-btn">
          <UserCircle2 size={24} />
        </Link>
      </div>

      <div className="mobile-bottom-nav">
        {mobileMenus.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`mobile-nav-item ${
                location.pathname === item.path ? "active" : ""
              }`}
            >
              <Icon size={20} />

              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
