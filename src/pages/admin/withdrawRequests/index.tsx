import AdminPlaceholderPage from "../AdminPlaceholderPage";

export default function AdminWithdrawRequestsPage() {
  return (
    <AdminPlaceholderPage
      title="Quản lý yêu cầu rút tiền của shop"
      description="Theo dõi yêu cầu rút tiền, kiểm tra số dư và duyệt thanh toán."
      actions={[
        "Yêu cầu đang chờ xử lý",
        "Lịch sử duyệt rút tiền",
        "Đối soát ví người bán",
      ]}
    />
  );
}
