import AdminPlaceholderPage from "../AdminPlaceholderPage";

export default function AdminVouchersPage() {
  return (
    <AdminPlaceholderPage
      title="Quản lý mã giảm giá"
      description="Tạo, giám sát và khóa các chương trình ưu đãi trên hệ thống."
      actions={[
        "Danh sách mã giảm giá",
        "Tạo mã mới",
        "Theo dõi hiệu lực và lượt dùng",
      ]}
    />
  );
}
