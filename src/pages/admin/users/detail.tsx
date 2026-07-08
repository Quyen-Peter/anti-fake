import {
  AlertCircle,
  ArrowLeft,
  BadgeCheck,
  Ban,
  ClipboardList,
  Edit3,
  MessageSquare,
  MoreVertical,
  Package,
  RotateCcw,
  Store,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import {
  fetchAdminUserDetail,
  type AdminUserDetail,
} from "../../../services/admin.api";
import { createUserChatThread } from "../../../services/chat.api";

const formatDate = (value?: string) => {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("vi-VN");
};

const formatNumber = (value?: number) => {
  if (typeof value !== "number") return "--";
  return new Intl.NumberFormat("vi-VN").format(value);
};

const formatMoney = (value?: number) => {
  if (typeof value !== "number") return "--";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
};

const displayValue = (value?: number | string | boolean | null) => {
  if (value === undefined || value === null || value === "") return "--";
  if (typeof value === "boolean")
    return value ? "Đã xác minh" : "Chưa xác minh";
  return String(value);
};

const getStatusType = (status?: string) => {
  const value = String(status ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d");
  if (
    value === "active" ||
    value === "verified" ||
    value.includes("dang hoat dong") ||
    value.includes("da xac minh")
  ) {
    return "active";
  }
  if (
    ["inactive", "blocked", "banned", "rejected"].includes(value) ||
    value.includes("bi cam") ||
    value.includes("tam khoa")
  ) {
    return "locked";
  }
  return "pending";
};

const getStatusLabel = (status?: string) => {
  const type = getStatusType(status);
  if (type === "active") return "Đang hoạt động";
  if (type === "locked") return "Bị cấm";
  if (type === "pending") return "Chờ xác minh";
  return status || "Không rõ";
};

const getMediaUrl = (media: unknown) => {
  if (typeof media === "string") return media;
  if (media && typeof media === "object") {
    const item = media as Record<string, unknown>;
    const value = item.url || item.secureUrl || item.src;
    return typeof value === "string" ? value : "";
  }
  return "";
};

export default function AdminUserDetailPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [detail, setDetail] = useState<AdminUserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [startingChat, setStartingChat] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      if (!userId) return;

      setLoading(true);
      setError("");

      try {
        const data = await fetchAdminUserDetail(userId);
        setDetail(data);
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : "Không thể tải chi tiết người dùng";
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [userId]);

  const user = detail?.user;
  const shop = detail?.shop;
  const avatar = user?.avatar || user?.avatarUrl || "";
  const shopLogo = getMediaUrl(shop?.logo);
  const shopBanner = getMediaUrl(shop?.banner);
  const joinedAt = user?.joinedAt || user?.createdAt;

  const startChatWithUser = async () => {
    if (!user?.id || startingChat) return;

    setStartingChat(true);

    try {
      const response = await createUserChatThread(user.id);

      if (response.success && response.threadId) {
        navigate(`/admin/chat/${response.threadId}`);
        return;
      }

      toast.error("Không thể mở cuộc trò chuyện");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Không thể mở cuộc trò chuyện";
      toast.error(message);
    } finally {
      setStartingChat(false);
    }
  };

  return (
    <section className="admin-page admin-detail-page">
      <Link className="admin-back-link" to="/admin/users">
        <ArrowLeft size={16} />
        Quay lại quản lý người dùng
      </Link>

      {loading && (
        <div className="admin-detail-state">
          Đang tải chi tiết người dùng...
        </div>
      )}

      {!loading && error && (
        <div className="admin-detail-state error">{error}</div>
      )}

      {!loading && !error && user && (
        <div className="admin-user-detail-stack">
          <section className="admin-detail-panel admin-user-profile-card">
            <div className="admin-user-media">
              <div className="admin-user-avatar">
                {avatar ? (
                  <img src={avatar} alt={user.displayName || user.email} />
                ) : (
                  <User size={34} />
                )}
              </div>
              <div className="admin-product-badges">
                <span
                  className={`admin-status ${getStatusType(user.accountStatus)}`}
                >
                  {getStatusLabel(user.accountStatus)}
                </span>
                {user.sellerVerified && (
                  <span className="admin-status active">
                    Người bán đã xác minh
                  </span>
                )}
              </div>
            </div>

            <div className="admin-user-profile-main">
              <div className="admin-user-profile-title">
                <h2>{user.displayName || user.email}</h2>
                <small>Mã người dùng: {user.id}</small>
              </div>

              <div className="admin-user-profile-divider" />

              <div className="admin-user-info-matrix">
                <div>
                  <small>Ngày tham gia</small>
                  <strong>{formatDate(joinedAt)}</strong>
                </div>
                <div>
                  <small>Email</small>
                  <strong>{user.email}</strong>
                </div>
                <div>
                  <small>Số điện thoại</small>
                  <strong>{displayValue(user.phone)}</strong>
                </div>
                <div>
                  <small>Cập nhật cuối</small>
                  <strong>{formatDate(user.updatedAt)}</strong>
                </div>
              </div>

              <div className="admin-user-actions">
                <button type="button" className="primary">
                  <Edit3 size={13} />
                  Chỉnh sửa
                </button>
                <button type="button">
                  <RotateCcw size={13} />
                  Đặt lại
                </button>
                <button type="button" className="danger">
                  <Ban size={13} />
                  Cấm
                </button>
                <button
                  type="button"
                  onClick={startChatWithUser}
                  disabled={startingChat}
                >
                  <MessageSquare size={13} />
                  {startingChat ? "Đang mở..." : "Nhắn tin"}
                </button>
              </div>
            </div>

            <div className="admin-user-stat-grid compact">
              <span>
                <strong>{formatNumber(user.statistics?.orders)}</strong>
                Đơn hàng
              </span>
              <span>
                <strong>{formatNumber(user.statistics?.posts)}</strong>
                Bài đăng
              </span>
              <span>
                <strong>{formatNumber(user.statistics?.reports)}</strong>
                Báo cáo
              </span>
              <span>
                <strong>{displayValue(user.statistics?.positiveRate)}%</strong>
                Phản hồi
              </span>
            </div>
          </section>

          {shop && (
            <div className="admin-user-shop-layout">
              <section className="admin-detail-panel admin-shop-profile-card">
                <div
                  className="admin-shop-banner"
                  style={
                    shopBanner
                      ? { backgroundImage: `url(${shopBanner})` }
                      : undefined
                  }
                />

                <div className="admin-shop-profile-body">
                  <div className="admin-shop-logo">
                    {shopLogo ? (
                      <img src={shopLogo} alt={shop.shopName} />
                    ) : (
                      <Store size={26} />
                    )}
                  </div>
                  <div className="admin-shop-title">
                    <h2>{shop.shopName}</h2>
                    <BadgeCheck size={14} />
                  </div>
                  <button
                    type="button"
                    className="admin-shop-more"
                    aria-label="Thao tác shop"
                  >
                    <MoreVertical size={16} />
                  </button>
                </div>

                <div className="admin-user-stat-grid admin-shop-stats">
                  <span>
                    <strong>{formatNumber(shop.productCount)}</strong>
                    Sản phẩm
                  </span>
                  <span>
                    <strong>{formatNumber(shop.rating)}</strong>
                    {formatNumber(shop.reviewCount)} đánh giá
                  </span>
                  <span>
                    <strong>{formatNumber(shop.totalSold)}</strong>
                    Tổng lượt bán
                  </span>
                  <span>
                    <strong>{formatMoney(shop.revenue)}</strong>
                    Doanh thu (VND)
                  </span>
                </div>

                <div className="admin-shop-meta-list">
                  <div>
                    <span>Ngày tạo shop:</span>
                    <strong>{formatDate(shop.createdAt)}</strong>
                  </div>
                  <div>
                    <span>Trạng thái shop:</span>
                    <strong className="success">
                      {displayValue(shop.shopStatus)}
                    </strong>
                  </div>
                  <div>
                    <span>Trạng thái xác minh:</span>
                    <strong>{displayValue(shop.verificationStatus)}</strong>
                  </div>
                  <div>
                    <span>Địa chỉ:</span>
                    <strong>{displayValue(shop.address)}</strong>
                  </div>
                  <div>
                    <span>Danh mục:</span>
                    <strong className="category">
                      {displayValue(shop.category)}
                    </strong>
                  </div>
                </div>
              </section>

              <aside className="admin-detail-panel admin-quick-panel">
                <h2>Quản lý nhanh</h2>
                <div className="admin-quick-actions">
                  <button type="button">
                    <ClipboardList size={16} />
                    Xem danh sách đơn hàng
                  </button>
                  <button type="button">
                    <MessageSquare size={16} />
                    Xem bài đăng cộng đồng
                  </button>
                  <button type="button">
                    <Package size={16} />
                    Quản lý danh sách sản phẩm
                  </button>
                  <button type="button">
                    <AlertCircle size={16} />
                    Xem báo cáo vi phạm
                  </button>
                </div>
              </aside>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
