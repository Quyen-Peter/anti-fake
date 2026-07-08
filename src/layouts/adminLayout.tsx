import { Outlet, useLocation } from "react-router-dom";
import AdminHeader from "../components/layout/adminHeader";
import AdminSidebar from "../components/layout/adminSidebar";
import "../css/pages/admin.css";

export default function AdminLayout() {
  const { pathname } = useLocation();
  const isChatPage =
    pathname === "/admin/chat" || pathname.startsWith("/admin/chat/");

  return (
    <div className="admin-layout">
      <AdminHeader />
      <div className="admin-shell">
        <AdminSidebar />
        <main
          className={`admin-content ${isChatPage ? "admin-content-chat" : ""}`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
