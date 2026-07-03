import AdminPlaceholderPage from "../AdminPlaceholderPage";

export default function AdminProductRegistrationsPage() {
  return (
    <AdminPlaceholderPage
      title="Quản lý đăng ký sản phẩm"
      description="Kiểm tra sản phẩm mới và hồ sơ xác thực sản phẩm của shop."
      actions={[
        "Sản phẩm chờ xác minh",
        "Thông tin nhà bán hàng",
        "Cập nhật trạng thái duyệt",
      ]}
    />
  );
}
