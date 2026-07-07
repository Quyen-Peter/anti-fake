import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Wallet,
  BarChart3,
  Bell,
  Building2,
  CircleHelp,
  Info,
  MessageSquareText,
  ReceiptText,
  Store,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import "../../css/components/layout/sellerHeader.css";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { getMyShop } from "../../services/shop.api";

const SELLER_SHOP_CACHE_KEY = "sellerShop";

type SellerShop = {
  id?: string;
  shopId?: string;
  shopName?: string;
  shopAvatar?: string;
  avatarUrl?: string;
  logoUrl?: string;
  registrationType?: string;
  businessType?: string;
  taxCode?: string;
  shopStatus?: string;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value && typeof value === "object");

const normalizeMyShop = (data: unknown): SellerShop | null => {
  const payload = isRecord(data)
    ? data.data ?? data.items ?? data
    : data;
  if (Array.isArray(payload)) return (payload[0] as SellerShop | undefined) ?? null;
  return isRecord(payload) ? (payload as SellerShop) : null;
};

const readCachedShop = () => {
  try {
    const cached = localStorage.getItem(SELLER_SHOP_CACHE_KEY);
    return cached ? (JSON.parse(cached) as SellerShop) : null;
  } catch {
    return null;
  }
};

const getShopAvatar = (shop: SellerShop | null) =>
  shop?.shopAvatar || shop?.avatarUrl || shop?.logoUrl || "";

export default function SellerHeader() {
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);
  const [shop, setShop] = useState<SellerShop | null>(() => readCachedShop());
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const loadShop = async () => {
      try {
        const data = await getMyShop();
        const nextShop = normalizeMyShop(data);
        setShop(nextShop);

        if (nextShop) {
          localStorage.setItem(SELLER_SHOP_CACHE_KEY, JSON.stringify(nextShop));
        } else {
          localStorage.removeItem(SELLER_SHOP_CACHE_KEY);
        }
      } catch (error) {
        console.error(error);
      }
    };

    loadShop();
  }, []);

  useEffect(() => {
    const closeMenu = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", closeMenu);
    return () => document.removeEventListener("mousedown", closeMenu);
  }, []);

  const avatar = getShopAvatar(shop);
  const shopName = shop?.shopName || "Cửa hàng của tôi";
  const shopInitial = shopName.trim().charAt(0).toUpperCase() || "S";
  const shopInfoItems = [
    {
      label: "Thông tin cửa hàng",
      icon: Store,
      onClick: () => navigate("/seller/shop-info"),
    },
    {
      label: "Thông tin doanh nghiệp",
      icon: Building2,
    },
    {
      label: "Thông tin thuế",
      icon: ReceiptText,
    },
    {
      label: "Hỗ trợ",
      icon: CircleHelp,
    },
    {
      label: "Giới thiệu",
      icon: Info,
    },
  ];

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
          
        >
          <MessageSquareText size={22} />
          <span className="seller-header-badge">3</span>
        </div>

        <div className="seller-header-icon">
          <Bell size={22} />
          <span className="seller-header-badge">1</span>
        </div>

        <div className="seller-header-shop" ref={menuRef}>
          <button
            type="button"
            className="seller-header-avatar-btn"
            onClick={() => setMenuOpen((current) => !current)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
          >
            {avatar ? (
              <img
                src={avatar}
                alt={shopName}
                className="seller-header-avatar"
              />
            ) : (
              <span className="seller-header-avatar seller-header-avatar-fallback">
                {shopInitial}
              </span>
            )}
          </button>

          {menuOpen && (
            <div className="seller-header-shop-menu" role="menu">
              <div className="seller-header-shop-menu-head">
                {avatar ? (
                  <img src={avatar} alt={shopName} />
                ) : (
                  <span>{shopInitial}</span>
                )}
                <div>
                  <strong>{shopName}</strong>
                  {shop?.shopStatus && <small>{shop.shopStatus}</small>}
                </div>
              </div>

              <div className="seller-header-shop-menu-list">
                {shopInfoItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.label}
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        item.onClick?.();
                        setMenuOpen(false);
                      }}
                    >
                      <Icon size={17} />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
