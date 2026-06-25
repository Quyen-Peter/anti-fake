import { useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
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
import { Toaster } from "sonner";
import ProtectedRoute from "./routes/protectedRoute";
import AuthPage from "./pages/auth";
import LiveRoomPage from "./pages/live";
import CheckoutPage from "./pages/checkout";
import OrderSuccessPage from "./components/checkout/orderSuccessPage";
import MainLayout from "./layouts/mainLayout";
import SellerLayout from "./layouts/sellerLayout";
import SellerDashboard from "./seller/dashboard";
import ProductManagement from "./seller/productManagement";
import OrderManagement from "./seller/orderManagement";
import SellerWallet from "./seller/wallet";
import ProfileAddress from "./pages/profile/addressPage";

function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    // Scroll ve dau trang moi khi nguoi dung vao route hoac query moi.
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, search]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <div>
        <Toaster richColors position="top-center" />
        <ScrollToTop />
        <div className="app-container">
          <Routes>
            {/* USER */}
            <Route element={<MainLayout />}>
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/" element={<HomePage />} />
              <Route path="/community" element={<CommunityPage />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              >
                <Route index element={<UserProfile />} />
                <Route path="address" element={<ProfileAddress />} />
                <Route path="orders" element={<OrdersPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route
                  path="/profile/orders/:id"
                  element={<OrderDetailPage />}
                />
              </Route>
              <Route path="/affiliate" element={<AffiliatePage />} />
              <Route
                path="/cart"
                element={
                  <ProtectedRoute>
                    <CartPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/notification" element={<NotificationPage />} />
              <Route
                path="/messages"
                element={
                  <ProtectedRoute>
                    <MessagePage />
                  </ProtectedRoute>
                }
              />
              <Route path="/messages/:roomId" element={<MessagePage />} />
              <Route path="/qr" element={<QRPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/shop/:shopId" element={<ShopPage />}>
                <Route index element={<ShopReviews />} />
                <Route path="products" element={<ShopProducts />} />
                <Route path="categories" element={<ShopCategories />} />
              </Route>
              <Route path="/live/:id" element={<LiveRoomPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order-success" element={<OrderSuccessPage />} />
            </Route>

            {/* seller */}
            <Route path="/seller" element={<SellerLayout />}>
              <Route path="dashboard" element={<SellerDashboard />} />
              <Route path="products" element={<ProductManagement />} />
              <Route path="orders" element={<OrderManagement />} />
              <Route path="wallet" element={<SellerWallet />} />
            </Route>
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
