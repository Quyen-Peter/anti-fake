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

function App() {
  return (
    <BrowserRouter>
      <div>
        <Header/>

        <div className="app-container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/affiliate" element={<AffiliatePage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/notification" element={<NotificationPage />} />
            <Route path="/messages" element={<MessagePage />} />
            <Route path="/qr" element={<QRPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
