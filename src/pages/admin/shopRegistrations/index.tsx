import AdminPlaceholderPage from "../AdminPlaceholderPage";

export default function AdminShopRegistrationsPage() {
  return (
    <AdminPlaceholderPage
      title="Quản lý đăng ký cửa hàng"
      description="Duyệt hồ sơ pháp lý, KYC và trạng thái xác minh của shop."
      actions={[
        "Danh sách shop chờ duyệt",
        "Chi tiết hồ sơ pháp lý",
        "Phê duyệt hoặc từ chối",
      ]}
    />
  );
}
