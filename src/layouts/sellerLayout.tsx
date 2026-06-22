import { Outlet } from "react-router-dom";
import SellerHeader from "../components/layout/sellerHeader";


export default function SellerLayout() {
  return (
    <>
      <SellerHeader />

      <div className="app-container">
        <Outlet />
      </div>
    </>
  );
}
