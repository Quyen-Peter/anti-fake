import { NavLink } from "react-router-dom";

export default function ShopTabs() {
  return (
    <div className="shop-tabs">
      <NavLink
        to="/shop/1"
        end
        className={({ isActive }) =>
          isActive ? "shop-tab active" : "shop-tab"
        }
      >
        Dạo shop
      </NavLink>

      <NavLink
        to="/shop/1/products"
        className={({ isActive }) =>
          isActive ? "shop-tab active" : "shop-tab"
        }
      >
        Tất cả sản phẩm
      </NavLink>

      <NavLink
        to="/shop/1/categories"
        className={({ isActive }) =>
          isActive ? "shop-tab active" : "shop-tab"
        }
      >
        Danh mục
      </NavLink>

      {/* <NavLink
        to="/shop/1/reviews"
        className={({ isActive }) =>
          isActive ? "shop-tab active" : "shop-tab"
        }
      >
        Đánh giá
      </NavLink> */}
    </div>
  );
}