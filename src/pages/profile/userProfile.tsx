import { useEffect } from "react";
import "../../css/pages/profile/userProfile.css";
import { getUser } from "../../ultil/auth";

export default function UserProfile() {
  const user = getUser();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="profile-card">
      <div className="profile-header">
        <h2>Hồ sơ cá nhân</h2>
        <p>Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
      </div>

      <div className="profile-body">
        <div className="profile-info">
          <div className="profile-item">
            <span className="profile-label">Tên tài khoản</span>
            <span>{user.displayName}</span>
          </div>

          <div className="profile-item">
            <span className="profile-label">Họ và tên</span>
            <span>{user.displayName}</span>
          </div>

          <div className="profile-item">
            <span className="profile-label">Email</span>
            <span>{user.email}</span>
          </div>

          <div className="profile-item">
            <span className="profile-label">Số điện thoại</span>
            <span>{user.phone}</span>
          </div>

          <div className="profile-item">
            <span className="profile-label">Giới tính</span>
            <span>{user.gender}</span>
          </div>

          <div className="profile-item">
            <span className="profile-label">Ngày sinh</span>
            <span>{user.birthday}</span>
          </div>

          <button className="profile-edit-btn">Chỉnh sửa hồ sơ</button>
        </div>

        <div className="profile-avatar-section">
          <img
            src={user.avatar}
            alt={user.fullName}
            className="profile-avatar"
          />
        </div>
      </div>
    </div>
  );
}
