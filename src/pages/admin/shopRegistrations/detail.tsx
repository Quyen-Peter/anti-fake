import {
  ArrowLeft,
  BadgeCheck,
  Building2,
  CalendarDays,
  CheckCircle2,
  ExternalLink,
  FileText,
  IdCard,
  LoaderCircle,
  Mail,
  Phone,
  Store,
  Tags,
  UserRound,
  XCircle,
} from "lucide-react";
import "../../../css/components/dataSkeleton.css";
import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  fetchAdminShopVerificationDetail,
  reviewAdminShopDocuments,
  type AdminShopReviewStatus,
  type AdminShopVerificationDetail,
} from "../../../services/admin.api";

type StatusTone = "active" | "locked" | "pending";

const getStatusTone = (status?: string | null): StatusTone => {
  const value = String(status ?? "").toLowerCase();
  if (value === "verified" || value === "approved") return "active";
  if (value === "rejected" || value === "banned") return "locked";
  return "pending";
};

const getStatusLabel = (status?: string | null) => {
  if (status === "pending_kyc") return "Chờ KYC";
  if (status === "pending_verification") return "Chờ xét duyệt";
  if (status === "verified") return "Đã xác minh";
  if (status === "pending") return "Đang chờ";
  if (status === "approved") return "Đã duyệt";
  if (status === "rejected") return "Từ chối";
  return status || "Không rõ";
};

const formatDate = (value?: string) => {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const getFileName = (url: string, index: number) => {
  try {
    const pathname = new URL(url).pathname;
    return pathname.split("/").filter(Boolean).pop() || `Tệp ${index + 1}`;
  } catch {
    return `Tệp ${index + 1}`;
  }
};

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Store;
  label: string;
  value?: string | null;
}) {
  return (
    <div className="admin-detail-info-item">
      <Icon size={16} />
      <div>
        <small>{label}</small>
        <strong>{value || "--"}</strong>
      </div>
    </div>
  );
}

function DocumentImage({
  title,
  url,
  status,
}: {
  title: string;
  url?: string | null;
  status?: string | null;
}) {
  return (
    <article className="admin-document-preview">
      <div className="admin-document-preview-head">
        <strong>{title}</strong>
        <span className={`admin-status ${getStatusTone(status)}`}>
          {getStatusLabel(status)}
        </span>
      </div>
      {url ? (
        <a href={url} target="_blank" rel="noreferrer">
          <img src={url} alt={title} />
        </a>
      ) : (
        <div className="admin-document-empty">Chưa có ảnh</div>
      )}
    </article>
  );
}

export default function AdminShopVerificationDetailPage() {
  const { shopId } = useParams();
  const [detail, setDetail] = useState<AdminShopVerificationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviewNote, setReviewNote] = useState("");
  const [reviewingStatus, setReviewingStatus] =
    useState<AdminShopReviewStatus | null>(null);

  const refreshDetail = useCallback(async () => {
    if (!shopId) return;
    const data = await fetchAdminShopVerificationDetail(shopId);
    setDetail(data);
  }, [shopId]);

  const handleReview = async (reviewStatus: AdminShopReviewStatus) => {
    if (!shopId) return;

    const note = reviewNote.trim();
    if (reviewStatus === "rejected" && !note) {
      toast.error("Vui lòng nhập lý do từ chối hồ sơ");
      return;
    }

    setReviewingStatus(reviewStatus);

    try {
      await reviewAdminShopDocuments(shopId, {
        reviewStatus,
        reviewNote: note || "Hồ sơ hợp lệ",
      });
      toast.success(
        reviewStatus === "approved"
          ? "Đã duyệt hồ sơ shop"
          : "Đã từ chối hồ sơ shop",
      );
      setReviewNote("");
      await refreshDetail();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Không thể cập nhật hồ sơ shop";
      toast.error(message);
    } finally {
      setReviewingStatus(null);
    }
  };

  useEffect(() => {
    const loadDetail = async () => {
      if (!shopId) {
        setError("Thiếu mã shop");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const data = await fetchAdminShopVerificationDetail(shopId);
        setDetail(data);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Không thể tải hồ sơ pháp lý";
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    loadDetail();
  }, [shopId]);

  if (loading) {
    return (
      <section className="admin-page">
        <div className="admin-detail-state"><div className="data-skeleton data-skeleton-detail" role="status" aria-label="Đang tải hồ sơ pháp lý"><div className="data-skeleton-detail-hero"><span /><div><span /><span /><span /></div></div><div className="data-skeleton-detail-grid">{Array.from({ length: 6 }, (_, i) => <span key={i} />)}</div></div></div>
      </section>
    );
  }

  if (error || !detail) {
    return (
      <section className="admin-page">
        <Link className="admin-back-link" to="/admin/shop-registrations">
          <ArrowLeft size={16} />
          Quay lại danh sách
        </Link>
        <div className="admin-detail-state error">
          {error || "Không tìm thấy hồ sơ pháp lý"}
        </div>
      </section>
    );
  }

  const shopStatus = detail.shop.status ?? detail.shop.shopStatus;
  const ownerAvatar = detail.owner.avatarUrl ?? detail.owner.avatar;
  const address = detail.shop.physicalAddress ?? detail.shop.address;

  return (
    <section className="admin-page admin-detail-page">
      <div className="admin-page-heading">
        <div>
          <Link className="admin-back-link" to="/admin/shop-registrations">
            <ArrowLeft size={16} />
            Danh sách đăng ký shop
          </Link>
          <h1>Hồ sơ pháp lý shop</h1>
          <p>Kiểm tra KYC, giấy tờ pháp lý và thông tin chủ sở hữu.</p>
        </div>
      </div>

      <div className="admin-detail-grid">
        <div className="admin-detail-main">
          <section className="admin-detail-panel admin-shop-summary">
            <div className="admin-shop-summary-top">
              <div className="admin-shop-identity">
                <span>
                  <Store size={24} />
                </span>
                <div>
                  <h2>{detail.shop.shopName}</h2>
                  <small>ID: {detail.shop.id}</small>
                </div>
              </div>
              <span className={`admin-status ${getStatusTone(shopStatus)}`}>
                {getStatusLabel(shopStatus)}
              </span>
            </div>

            <div className="admin-detail-info-grid">
              <InfoItem
                icon={Building2}
                label="Loại đăng ký"
                value={detail.shop.registrationType}
              />
              <InfoItem
                icon={BadgeCheck}
                label="Loại kinh doanh"
                value={detail.shop.businessType}
              />
              <InfoItem
                icon={FileText}
                label="Mã số thuế"
                value={detail.shop.taxCode}
              />
              <InfoItem
                icon={CalendarDays}
                label="Ngày tạo"
                value={formatDate(detail.shop.createdAt)}
              />
              <InfoItem icon={Store} label="Địa chỉ" value={address} />
            </div>
          </section>

          <section className="admin-detail-section">
            <div className="admin-detail-section-head">
              <IdCard size={18} />
              <h2>Hồ sơ KYC</h2>
            </div>
            <div className="admin-document-grid">
              <DocumentImage
                title={`${detail.kyc?.type || "KYC"} - Mặt trước`}
                url={detail.kyc?.frontImage}
                status={detail.kyc?.status}
              />
              <DocumentImage
                title={`${detail.kyc?.type || "KYC"} - Mặt sau`}
                url={detail.kyc?.backImage}
                status={detail.kyc?.status}
              />
            </div>
          </section>

          <section className="admin-detail-section">
            <div className="admin-detail-section-head">
              <FileText size={18} />
              <h2>Hồ sơ pháp lý</h2>
            </div>
            <div className="admin-legal-list">
              {detail.documents.length === 0 && (
                <div className="admin-document-empty">Chưa có giấy tờ pháp lý</div>
              )}
              {detail.documents.map((document) => (
                <article className="admin-legal-item" key={document.id}>
                  <div className="admin-legal-icon">
                    <FileText size={18} />
                  </div>
                  <div className="admin-legal-content">
                    <div className="admin-legal-title">
                      <strong>{document.name}</strong>
                      <small>{document.required ? "Bắt buộc" : "Tùy chọn"}</small>
                    </div>
                    <span className={`admin-status ${getStatusTone(document.status)}`}>
                      {getStatusLabel(document.status)}
                    </span>
                    <div className="admin-legal-files">
                      {(document.files ?? []).length === 0 && (
                        <small>Chưa có tệp đính kèm</small>
                      )}
                      {(document.files ?? []).map((file, index) => (
                        <a
                          href={file}
                          key={file}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {getFileName(file, index)}
                          <ExternalLink size={14} />
                        </a>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>

        <aside className="admin-detail-side">
          <section className="admin-detail-panel admin-review-panel">
            <div className="admin-detail-section-head">
              <BadgeCheck size={18} />
              <h2>Duyệt hồ sơ</h2>
            </div>
            <label className="admin-review-note">
              <span>Ghi chú xét duyệt</span>
              <textarea
                rows={4}
                value={reviewNote}
                onChange={(event) => setReviewNote(event.target.value)}
                placeholder="Nhập ghi chú hoặc lý do từ chối..."
                disabled={Boolean(reviewingStatus)}
              />
            </label>
            <div className="admin-review-actions">
              <button
                type="button"
                className={`approve ${
                  reviewingStatus === "approved" ? "is-loading" : ""
                }`}
                disabled={Boolean(reviewingStatus)}
                onClick={() => handleReview("approved")}
              >
                {reviewingStatus === "approved" ? (
                  <LoaderCircle size={16} />
                ) : (
                  <CheckCircle2 size={16} />
                )}
                {reviewingStatus === "approved" ? "Đang duyệt..." : "Duyệt"}
              </button>
              <button
                type="button"
                className={`reject ${
                  reviewingStatus === "rejected" ? "is-loading" : ""
                }`}
                disabled={Boolean(reviewingStatus)}
                onClick={() => handleReview("rejected")}
              >
                {reviewingStatus === "rejected" ? (
                  <LoaderCircle size={16} />
                ) : (
                  <XCircle size={16} />
                )}
                {reviewingStatus === "rejected" ? "Đang từ chối..." : "Từ chối"}
              </button>
            </div>
          </section>

          <section className="admin-detail-panel">
            <div className="admin-detail-section-head">
              <UserRound size={18} />
              <h2>Chủ shop</h2>
            </div>
            <div className="admin-owner-card">
              {ownerAvatar ? (
                <img src={ownerAvatar} alt={detail.owner.displayName || "Owner"} />
              ) : (
                <span>{(detail.owner.displayName || "O").charAt(0)}</span>
              )}
              <strong>{detail.owner.displayName || "--"}</strong>
              <small>{detail.owner.id}</small>
            </div>
            <div className="admin-owner-meta">
              <InfoItem icon={Mail} label="Email" value={detail.owner.email} />
              <InfoItem icon={Phone} label="Số điện thoại" value={detail.owner.phone} />
            </div>
          </section>

          <section className="admin-detail-panel">
            <div className="admin-detail-section-head">
              <Tags size={18} />
              <h2>Danh mục</h2>
            </div>
            <div className="admin-category-tags">
              {detail.categories.length === 0 && <span>Chưa có danh mục</span>}
              {detail.categories.map((category) => (
                <span key={category.id}>{category.name}</span>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </section>
  );
}
