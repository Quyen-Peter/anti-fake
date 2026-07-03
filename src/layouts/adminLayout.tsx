import { Outlet } from "react-router-dom";
import AdminHeader from "../components/layout/adminHeader";
import AdminSidebar from "../components/layout/adminSidebar";
import "../css/pages/admin.css";

export default function AdminLayout() {
  return (
    <div className="admin-layout">
      <AdminHeader />
      <div className="admin-shell">
        <AdminSidebar />
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
