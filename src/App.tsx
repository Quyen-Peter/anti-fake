import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/layout/header";
import HomePage from "./pages/home";
import CommunityPage from "./pages/community";
import ProfilePage from "./pages/profile";
import AffiliatePage from "./pages/affiliate";
import CartPage from "./pages/cart";
import NotificationPage from "./pages/notification";
import MessagePage from "./pages/message";
import QRPage from "./pages/qr";
import SearchPage from "./pages/search";
import WishlistPage from "./pages/wishlish";
import "../src/App.css";
import ProductDetail from "./pages/product/productDetail";
import OrdersPage from "./pages/profile/ordersPage";
import SettingsPage from "./pages/profile/settingsPage";
import UserProfile from "./pages/profile/userProfile";
import OrderDetailPage from "./components/order/orderDetail";
import ShopPage from "./pages/shop";
import ShopProducts from "./components/shop/shopProducts";
import ShopCategories from "./components/shop/shopCategories";
import ShopReviews from "./components/shop/shopReviews";

function App() {
  return (
    <BrowserRouter>
      <div>
        <Header />

        <div className="app-container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/profile" element={<ProfilePage />}>
              <Route index element={<UserProfile />} />
              <Route path="orders" element={<OrdersPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="/profile/orders/:id" element={<OrderDetailPage />} />
            </Route>
            <Route path="/affiliate" element={<AffiliatePage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/notification" element={<NotificationPage />} />
            <Route path="/messages" element={<MessagePage />} />
            <Route path="/qr" element={<QRPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/shop/:id" element={<ShopPage />}>
              <Route index element={<ShopReviews />} />
              <Route path="products" element={<ShopProducts />} />
              <Route path="categories" element={<ShopCategories />} />
            </Route>
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
