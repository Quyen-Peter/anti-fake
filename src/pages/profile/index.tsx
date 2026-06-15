import { Outlet } from "react-router-dom";
import ProfileSidebar from "../../components/layout/profileSidebar";
import "../../css/pages/profile/profile.css";

export default function ProfilePage() {
  return (
    <div className="profile-container">
      <div >
        <ProfileSidebar />
      </div>
      <div className="profile-content">
        <Outlet />
      </div>
    </div>
  );
}
