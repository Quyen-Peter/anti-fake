import { NavLink, useParams } from "react-router-dom";

export default function ShopTabs() {
  const { shopId } = useParams<{ shopId: string }>();
  const basePath = `/shop/${shopId}`;

  return (
    <div className="shop-tabs">
      <NavLink
        to={basePath}
        end
        className={({ isActive }) =>
          isActive ? "shop-tab active" : "shop-tab"
        }
      >
        Dạo shop
      </NavLink>

      <NavLink
        to={`${basePath}/products`}
        className={({ isActive }) =>
          isActive ? "shop-tab active" : "shop-tab"
        }
      >
        Tất cả sản phẩm
      </NavLink>

      <NavLink
        to={`${basePath}/categories`}
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
