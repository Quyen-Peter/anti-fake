import "../../css/components/common/confirmModal.css";

interface Props {
  /**
   * Điều khiển trạng thái hiển thị popup.
   * true  -> hiện modal
   * false -> ẩn modal
   */
  open: boolean;

  /**
   * Tiêu đề của popup.
   * Không truyền sẽ dùng giá trị mặc định "Xác nhận"
   *
   * Ví dụ:
   * "Xóa địa chỉ"
   * "Đăng xuất"
   * "Hủy đơn hàng"
   */
  title?: string;

  /**
   * Nội dung thông báo hiển thị cho người dùng.
   *
   * Ví dụ:
   * "Bạn có chắc muốn xóa địa chỉ này không?"
   */
  message: string;

  /**
   * Nội dung nút xác nhận.
   * Mặc định: "Xác nhận"
   *
   * Ví dụ:
   * "Xóa"
   * "Đăng xuất"
   * "Hủy đơn"
   */
  confirmText?: string;

  /**
   * Nội dung nút hủy.
   * Mặc định: "Hủy"
   */
  cancelText?: string;

  /**
   * Trạng thái loading khi đang xử lý.
   *
   * true:
   * - disable các nút
   * - hiện "Đang xử lý..."
   *
   * false:
   * - hoạt động bình thường
   */
  loading?: boolean;

  /**
   * Xác định hành động có nguy hiểm hay không.
   *
   * true:
   * - nút xác nhận màu đỏ
   * - dùng cho xóa, khóa, hủy,...
   *
   * false:
   * - nút xác nhận màu mặc định
   */
  danger?: boolean;

  /**
   * Hàm được gọi khi người dùng nhấn nút xác nhận.
   *
   * Ví dụ:
   * - Xóa địa chỉ
   * - Đăng xuất
   * - Hủy đơn hàng
   */
  onConfirm: () => void;

  /**
   * Hàm được gọi khi người dùng:
   * - nhấn nút Hủy
   * - nhấn ra ngoài popup
   * - nhấn nút đóng
   */
  onCancel: () => void;
}

export default function ConfirmModal({
  open,
  title = "Xác nhận",
  message,
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  loading = false,
  danger = false,
  onConfirm,
  onCancel,
}: Props) {
  if (!open) return null;

  return (
    <div
      className="confirm-modal-overlay"
      onClick={onCancel}
    >
      <div
        className="confirm-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="confirm-modal-header">
          <h3>{title}</h3>
        </div>

        <div className="confirm-modal-content">
          <p>{message}</p>
        </div>

        <div className="confirm-modal-footer">
          <button
            className="confirm-cancel-btn"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelText}
          </button>

          <button
            className={`confirm-submit-btn ${
              danger
                ? "confirm-submit-danger"
                : ""
            }`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading
              ? "Đang xử lý..."
              : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}