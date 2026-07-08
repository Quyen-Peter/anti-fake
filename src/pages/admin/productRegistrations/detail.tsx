import {
  ArrowLeft,
  BadgeCheck,
  Barcode,
  Box,
  CalendarDays,
  ImageIcon,
  Layers,
  Package,
  Ruler,
  Tags,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  fetchOfferDetail,
  type OfferDetail,
} from "../../../services/product.api";
import {
  updateAdminOfferModerationStatus,
  type AdminOfferModerationStatus,
} from "../../../services/admin.api";

const statusOptions: Array<{ value: AdminOfferModerationStatus; label: string }> = [
  { value: "pending", label: "Chờ duyệt" },
  { value: "approved", label: "Đã duyệt" },
  { value: "rejected", label: "Từ chối" },
  { value: "banned", label: "Bị cấm" },
];

const getStatusType = (status?: string) => {
  const value = String(status ?? "").toLowerCase();
  if (value === "active" || value === "approved") return "active";
  if (value === "inactive" || value === "banned" || value === "rejected") {
    return "locked";
  }
  return "pending";
};

const getStatusLabel = (status?: string) => {
  const option = statusOptions.find((item) => item.value === status);
  return option?.label ?? status ?? "Không rõ";
};

const formatDate = (value?: string) => {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("vi-VN");
};

const formatMoney = (value?: number, currency = "VND") => {
  if (typeof value !== "number") return "--";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
};

const displayValue = (value?: number | string | null) => {
  if (value === undefined || value === null || value === "") return "--";
  return String(value);
};

const displayUnit = (value: number | string | null | undefined, unit: string) => {
  if (value === undefined || value === null || value === "") return "--";
  return `${value} ${unit}`;
};

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value?: number | string | null;
}) {
  return (
    <div className="admin-detail-info-item">
      {icon}
      <div>
        <small>{label}</small>
        <strong>{displayValue(value)}</strong>
      </div>
    </div>
  );
}

export default function AdminProductDetailPage() {
  const { offerId } = useParams();
  const [offer, setOffer] = useState<OfferDetail | null>(null);
  const [nextStatus, setNextStatus] =
    useState<AdminOfferModerationStatus>("pending");
  const [moderationReason, setModerationReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOffer = async () => {
      if (!offerId) return;

      setLoading(true);
      setError("");

      try {
        const data = await fetchOfferDetail(offerId);
        setOffer(data);
        setNextStatus(
          (data.moderationStatus as AdminOfferModerationStatus | undefined) ||
            "pending",
        );
        setModerationReason(data.moderationReason || "");
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : "Không thể tải chi tiết sản phẩm";
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    loadOffer();
  }, [offerId]);

  const imageUrls = useMemo(() => {
    const images = [offer?.thumbnailUrl, ...(offer?.imageUrls ?? [])].filter(
      Boolean,
    ) as string[];
    return Array.from(new Set(images));
  }, [offer]);

  const handleStatusUpdate = async () => {
    if (!offerId || updatingStatus) return;

    const reason = moderationReason.trim();
    if ((nextStatus === "rejected" || nextStatus === "banned") && !reason) {
      toast.error("Vui lòng nhập lý do khi từ chối hoặc cấm sản phẩm");
      return;
    }

    setUpdatingStatus(true);

    try {
      const updatedOffer = await updateAdminOfferModerationStatus(offerId, {
        moderationStatus: nextStatus,
        moderationReason: reason,
      });

      setOffer((currentOffer) =>
        currentOffer
          ? {
              ...currentOffer,
              ...updatedOffer,
              moderationStatus: updatedOffer.moderationStatus ?? nextStatus,
              moderationReason: reason,
            }
          : currentOffer,
      );
      toast.success("Cập nhật trạng thái kiểm duyệt thành công");
    } catch (err: unknown) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Không thể cập nhật trạng thái kiểm duyệt",
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <section className="admin-page admin-detail-page">
      <Link className="admin-back-link" to="/admin/product-registrations">
        <ArrowLeft size={16} />
        Quay lại quản lý sản phẩm
      </Link>

      <div className="admin-page-heading">
        <div>
          <h1>Chi tiết sản phẩm</h1>
          <p>Xem thông tin offer, hình ảnh, tồn kho và dữ liệu xác minh.</p>
        </div>
      </div>

      {loading && (
        <div className="admin-detail-state">Đang tải chi tiết sản phẩm...</div>
      )}

      {!loading && error && (
        <div className="admin-detail-state error">{error}</div>
      )}

      {!loading && !error && offer && (
        <div className="admin-detail-grid">
          <div className="admin-detail-main">
            <div className="admin-detail-panel admin-product-summary">
              <div className="admin-product-hero">
                <div className="admin-product-cover">
                  {offer.thumbnailUrl ? (
                    <img src={offer.thumbnailUrl} alt={offer.title} />
                  ) : (
                    <ImageIcon size={34} />
                  )}
                </div>

                <div className="admin-product-title">
                  <div className="admin-product-badges">
                    <span className={`admin-status ${getStatusType(offer.offerStatus)}`}>
                      {displayValue(offer.offerStatus)}
                    </span>
                    <span
                      className={`admin-status ${getStatusType(
                        offer.moderationStatus,
                      )}`}
                    >
                      {getStatusLabel(offer.moderationStatus)}
                    </span>
                  </div>
                  <h2>{offer.title}</h2>
                  <small>{offer.id}</small>
                  <strong>{formatMoney(offer.price, offer.currency)}</strong>
                </div>
              </div>

              <p className="admin-product-description">
                {offer.description || "Chưa có mô tả sản phẩm."}
              </p>

              <div className="admin-detail-info-grid">
                <InfoItem
                  icon={<Tags size={16} />}
                  label="Danh mục"
                  value={offer.categoryName || offer.categoryId}
                />
                <InfoItem
                  icon={<Package size={16} />}
                  label="Model"
                  value={offer.productModelName}
                />
                <InfoItem
                  icon={<Barcode size={16} />}
                  label="GTIN"
                  value={offer.gtin}
                />
                <InfoItem
                  icon={<Box size={16} />}
                  label="Tồn kho"
                  value={offer.availableQuantity}
                />
                <InfoItem
                  icon={<BadgeCheck size={16} />}
                  label="Đã bán"
                  value={offer.soldQuantity}
                />
                <InfoItem
                  icon={<CalendarDays size={16} />}
                  label="Ngày tạo"
                  value={formatDate(offer.createdAt)}
                />
              </div>
            </div>

            <div className="admin-detail-section">
              <div className="admin-detail-section-head">
                <ImageIcon size={17} />
                <h2>Hình ảnh sản phẩm</h2>
              </div>

              {imageUrls.length > 0 ? (
                <div className="admin-product-gallery">
                  {imageUrls.map((imageUrl) => (
                    <a
                      key={imageUrl}
                      href={imageUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <img src={imageUrl} alt={offer.title} />
                    </a>
                  ))}
                </div>
              ) : (
                <div className="admin-document-empty">
                  Sản phẩm chưa có hình ảnh.
                </div>
              )}
            </div>

            <div className="admin-detail-section">
              <div className="admin-detail-section-head">
                <Ruler size={17} />
                <h2>Thông số vận chuyển</h2>
              </div>
              <div className="admin-detail-info-grid admin-product-specs">
                <InfoItem
                  icon={<Box size={16} />}
                  label="Cân nặng"
                  value={displayUnit(offer.parcelWeightGrams, "gram")}
                />
                <InfoItem
                  icon={<Ruler size={16} />}
                  label="Dài"
                  value={displayUnit(offer.parcelLengthCm, "cm")}
                />
                <InfoItem
                  icon={<Ruler size={16} />}
                  label="Rộng"
                  value={displayUnit(offer.parcelWidthCm, "cm")}
                />
                <InfoItem
                  icon={<Ruler size={16} />}
                  label="Cao"
                  value={displayUnit(offer.parcelHeightCm, "cm")}
                />
                <InfoItem
                  icon={<Layers size={16} />}
                  label="Tình trạng"
                  value={offer.itemCondition}
                />
                <InfoItem
                  icon={<BadgeCheck size={16} />}
                  label="Chính sách xác minh"
                  value={offer.verificationPolicy}
                />
              </div>
            </div>
          </div>

          <aside className="admin-detail-side">
            <div className="admin-detail-panel admin-status-panel">
              <div className="admin-detail-section-head">
                <BadgeCheck size={17} />
                <h2>Cập nhật trạng thái</h2>
              </div>
              <div className="admin-status-form">
                <label>
                  <span>Trạng thái kiểm duyệt</span>
                  <select
                    value={nextStatus}
                    disabled={updatingStatus}
                    onChange={(event) =>
                      setNextStatus(
                        event.target.value as AdminOfferModerationStatus,
                      )
                    }
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  <span>Lý do kiểm duyệt</span>
                  <textarea
                    rows={4}
                    value={moderationReason}
                    disabled={updatingStatus}
                    onChange={(event) =>
                      setModerationReason(event.target.value)
                    }
                    placeholder="Nhập lý do nếu cần..."
                  />
                </label>
                <button
                  type="button"
                  disabled={updatingStatus}
                  onClick={handleStatusUpdate}
                >
                  {updatingStatus ? "Đang cập nhật..." : "Cập nhật trạng thái"}
                </button>
              </div>
            </div>

            <div className="admin-detail-panel">
              <div className="admin-detail-section-head">
                <Layers size={17} />
                <h2>Dữ liệu hệ thống</h2>
              </div>
              <div className="admin-owner-meta">
                <InfoItem
                  icon={<Tags size={16} />}
                  label="Category ID"
                  value={offer.categoryId}
                />
                <InfoItem
                  icon={<Package size={16} />}
                  label="Brand ID"
                  value={offer.brandId}
                />
                <InfoItem
                  icon={<Layers size={16} />}
                  label="Distribution node"
                  value={offer.distributionNodeId}
                />
                <InfoItem
                  icon={<Layers size={16} />}
                  label="Distribution network"
                  value={offer.distributionNetworkId}
                />
              </div>
            </div>
          </aside>
        </div>
      )}
    </section>
  );
}
