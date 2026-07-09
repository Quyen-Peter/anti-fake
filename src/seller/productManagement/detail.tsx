import {
  ArrowLeft,
  BadgeCheck,
  Barcode,
  Box,
  CalendarDays,
  ImageIcon,
  Layers,
  Package,
  Pencil,
  Ruler,
  Save,
  Tags,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import {
  fetchOfferDetail,
  updateOffer,
  type OfferDetail,
  type UpdateOfferPayload,
} from "../../services/product.api";
import { formatVnd } from "../../ultil/currency";
import "../../css/pages/productManagement.css";

const statusLabels: Record<string, string> = {
  active: "Trên kệ",
  inactive: "Đã vô hiệu hóa",
  draft: "Bản nháp",
  pending: "Đang xét duyệt",
  approved: "Đã duyệt",
  rejected: "Không thành công",
  banned: "Bị cấm",
};

const getStatusClass = (status?: string) => {
  const value = String(status ?? "").toLowerCase();
  if (value === "active" || value === "approved") return "active";
  if (value === "inactive" || value === "rejected" || value === "banned") {
    return "failed";
  }
  return "review";
};

const getStatusLabel = (status?: string) => {
  const value = String(status ?? "").toLowerCase();
  return statusLabels[value] ?? status ?? "Không rõ";
};

const formatDate = (value?: string) => {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("vi-VN");
};

const formatMoney = (value?: number, currency = "VND") => {
  if (typeof value !== "number") return "--";
  return formatVnd(value, currency);
};

const displayValue = (value?: number | string | null) => {
  if (value === undefined || value === null || value === "") return "--";
  return String(value);
};

const displayUnit = (value: number | string | null | undefined, unit: string) =>
  value === undefined || value === null || value === "" ? "--" : `${value} ${unit}`;

type UpdateOfferForm = Omit<
  UpdateOfferPayload,
  | "price"
  | "availableQuantity"
  | "parcelWeightGrams"
  | "parcelLengthCm"
  | "parcelWidthCm"
  | "parcelHeightCm"
> & {
  price: string;
  availableQuantity: string;
  parcelWeightGrams: string;
  parcelLengthCm: string;
  parcelWidthCm: string;
  parcelHeightCm: string;
};

const initialUpdateForm: UpdateOfferForm = {
  title: "",
  description: "",
  price: "",
  availableQuantity: "",
  parcelWeightGrams: "",
  parcelLengthCm: "",
  parcelWidthCm: "",
  parcelHeightCm: "",
  offerStatus: "active",
};

const toFormNumber = (value?: number | string | null) =>
  value === undefined || value === null ? "" : String(value);

const toPayloadNumber = (value: string) => Number(value || 0);

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
    <div className="seller-product-detail-info-item">
      {icon}
      <div>
        <small>{label}</small>
        <strong>{displayValue(value)}</strong>
      </div>
    </div>
  );
}

function ProductDetailLoading() {
  return (
    <div
      className="seller-product-detail-loading"
      role="status"
      aria-live="polite"
      aria-label="Dang tai chi tiet san pham"
    >
      <div className="seller-product-detail-loading-head">
        <span className="seller-product-loading-spinner" />
        <span>Dang tai day du du lieu san pham...</span>
      </div>

      <div className="seller-product-detail-loading-hero" aria-hidden="true">
        <span />
        <div>
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>

      <div className="seller-product-detail-loading-grid" aria-hidden="true">
        {Array.from({ length: 9 }, (_, index) => (
          <span key={index} />
        ))}
      </div>
    </div>
  );
}

export default function SellerProductDetail() {
  const { offerId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [offer, setOffer] = useState<OfferDetail | null>(null);
  const [form, setForm] = useState<UpdateOfferForm>(initialUpdateForm);
  const [editing, setEditing] = useState(searchParams.get("edit") === "1");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fillFormFromOffer = (data: OfferDetail) => {
    setForm({
      title: data.title ?? "",
      description: data.description ?? "",
      price: toFormNumber(data.price),
      availableQuantity: toFormNumber(data.availableQuantity),
      parcelWeightGrams: toFormNumber(data.parcelWeightGrams),
      parcelLengthCm: toFormNumber(data.parcelLengthCm),
      parcelWidthCm: toFormNumber(data.parcelWidthCm),
      parcelHeightCm: toFormNumber(data.parcelHeightCm),
      offerStatus:
        data.offerStatus === "inactive" || data.offerStatus === "draft"
          ? data.offerStatus
          : "active",
    });
  };

  useEffect(() => {
    const loadOffer = async () => {
      if (!offerId) {
        setError("Không tìm thấy mã sản phẩm");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const data = await fetchOfferDetail(offerId);
        setOffer(data);
        fillFormFromOffer(data);
      } catch (err: unknown) {
        setError(
          err instanceof Error
            ? err.message
            : "Không thể tải chi tiết sản phẩm",
        );
      } finally {
        setLoading(false);
      }
    };

    loadOffer();
  }, [offerId]);

  useEffect(() => {
    setEditing(searchParams.get("edit") === "1");
  }, [searchParams]);

  const imageUrls = useMemo(() => {
    const images = [offer?.thumbnailUrl, ...(offer?.imageUrls ?? [])].filter(
      Boolean,
    ) as string[];
    return Array.from(new Set(images));
  }, [offer]);

  const updateField = <K extends keyof UpdateOfferForm>(
    field: K,
    value: UpdateOfferForm[K],
  ) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const buildPayload = (): UpdateOfferPayload => ({
    ...form,
    title: form.title.trim(),
    description: form.description.trim(),
    price: toPayloadNumber(form.price),
    availableQuantity: toPayloadNumber(form.availableQuantity),
    parcelWeightGrams: toPayloadNumber(form.parcelWeightGrams),
    parcelLengthCm: toPayloadNumber(form.parcelLengthCm),
    parcelWidthCm: toPayloadNumber(form.parcelWidthCm),
    parcelHeightCm: toPayloadNumber(form.parcelHeightCm),
  });

  const validatePayload = (payload: UpdateOfferPayload) => {
    if (!payload.title) return "Vui lòng nhập tên sản phẩm";
    if (!payload.description) return "Vui lòng nhập mô tả sản phẩm";
    if (payload.price <= 0) return "Giá sản phẩm phải lớn hơn 0";
    if (payload.availableQuantity < 0) return "Số lượng không được âm";
    if (
      payload.parcelWeightGrams <= 0 ||
      payload.parcelLengthCm <= 0 ||
      payload.parcelWidthCm <= 0 ||
      payload.parcelHeightCm <= 0
    ) {
      return "Vui lòng nhập cân nặng và kích thước hợp lệ";
    }
    return "";
  };

  const closeEditMode = () => {
    setEditing(false);
    setSearchParams({});
    if (offer) fillFormFromOffer(offer);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!offerId || saving) return;

    const payload = buildPayload();
    const validationError = validatePayload(payload);

    if (validationError) {
      toast.error(validationError);
      return;
    }

    setSaving(true);

    try {
      const updatedOffer = await updateOffer(offerId, payload);
      const nextOffer = {
        ...offer,
        ...payload,
        ...updatedOffer,
      } as OfferDetail;

      setOffer(nextOffer);
      fillFormFromOffer(nextOffer);
      setEditing(false);
      setSearchParams({});
      toast.success("Cập nhật sản phẩm thành công");
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Không thể cập nhật sản phẩm",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="seller-product-page seller-product-detail-page">
        <ProductDetailLoading />
      </div>
    );
  }

  return (
    <div className="seller-product-page seller-product-detail-page">
      <Link className="seller-product-detail-back" to="/seller/products">
        <ArrowLeft size={16} />
        Quay lại quản lý sản phẩm
      </Link>

      {!loading && error && (
        <div className="seller-product-detail-state error">{error}</div>
      )}

      {!loading && !error && offer && (
        <>
          <section className="seller-product-detail-hero">
            <div className="seller-product-detail-cover">
              {offer.thumbnailUrl ? (
                <img src={offer.thumbnailUrl} alt={offer.title} />
              ) : (
                <ImageIcon size={36} />
              )}
            </div>

            <div className="seller-product-detail-summary">
              <div className="seller-product-detail-badges">
                <span
                  className={`seller-product-detail-status ${getStatusClass(
                    offer.offerStatus,
                  )}`}
                >
                  {getStatusLabel(offer.offerStatus)}
                </span>
                {/* <span
                  className={`seller-product-detail-status ${getStatusClass(
                    offer.moderationStatus,
                  )}`}
                >
                  {getStatusLabel(offer.moderationStatus)}
                </span> */}
              </div>

              <h1>{offer.title}</h1>
              <p>{offer.id}</p>
              <strong>{formatMoney(offer.price, offer.currency)}</strong>
              <button
                type="button"
                className="seller-product-detail-edit-btn"
                onClick={() => {
                  setEditing(true);
                  setSearchParams({ edit: "1" });
                }}
              >
                <Pencil size={16} />
                Cập nhật thông tin
              </button>
            </div>
          </section>

          {editing && (
            <section className="seller-product-detail-section">
              <div className="seller-product-detail-section-head">
                <Pencil size={18} />
                <h2>Cập nhật thông tin bán hàng</h2>
              </div>

              <form className="seller-product-update-form" onSubmit={handleSubmit}>
                <label className="seller-product-update-field wide">
                  <span>Tên sản phẩm</span>
                  <input
                    value={form.title}
                    disabled={saving}
                    onChange={(event) => updateField("title", event.target.value)}
                  />
                </label>

                <label className="seller-product-update-field wide">
                  <span>Mô tả</span>
                  <textarea
                    rows={4}
                    value={form.description}
                    disabled={saving}
                    onChange={(event) =>
                      updateField("description", event.target.value)
                    }
                  />
                </label>

                <label className="seller-product-update-field">
                  <span>Giá bán</span>
                  <input
                    type="number"
                    min="0"
                    value={form.price}
                    disabled={saving}
                    onChange={(event) => updateField("price", event.target.value)}
                  />
                </label>

                <label className="seller-product-update-field">
                  <span>Tồn kho</span>
                  <input
                    type="number"
                    min="0"
                    value={form.availableQuantity}
                    disabled={saving}
                    onChange={(event) =>
                      updateField("availableQuantity", event.target.value)
                    }
                  />
                </label>

                <label className="seller-product-update-field">
                  <span>Trạng thái bán</span>
                  <select
                    value={form.offerStatus}
                    disabled={saving}
                    onChange={(event) =>
                      updateField(
                        "offerStatus",
                        event.target.value as UpdateOfferForm["offerStatus"],
                      )
                    }
                  >
                    <option value="active">Đang bán</option>
                    <option value="inactive">Tạm ngưng</option>
                    <option value="draft">Bản nháp</option>
                  </select>
                </label>

                <label className="seller-product-update-field">
                  <span>Cân nặng (gram)</span>
                  <input
                    type="number"
                    min="0"
                    value={form.parcelWeightGrams}
                    disabled={saving}
                    onChange={(event) =>
                      updateField("parcelWeightGrams", event.target.value)
                    }
                  />
                </label>

                <label className="seller-product-update-field">
                  <span>Dài (cm)</span>
                  <input
                    type="number"
                    min="0"
                    value={form.parcelLengthCm}
                    disabled={saving}
                    onChange={(event) =>
                      updateField("parcelLengthCm", event.target.value)
                    }
                  />
                </label>

                <label className="seller-product-update-field">
                  <span>Rộng (cm)</span>
                  <input
                    type="number"
                    min="0"
                    value={form.parcelWidthCm}
                    disabled={saving}
                    onChange={(event) =>
                      updateField("parcelWidthCm", event.target.value)
                    }
                  />
                </label>

                <label className="seller-product-update-field">
                  <span>Cao (cm)</span>
                  <input
                    type="number"
                    min="0"
                    value={form.parcelHeightCm}
                    disabled={saving}
                    onChange={(event) =>
                      updateField("parcelHeightCm", event.target.value)
                    }
                  />
                </label>

                <div className="seller-product-update-actions">
                  <button type="button" className="ghost" onClick={closeEditMode}>
                    <X size={16} />
                    Hủy
                  </button>
                  <button type="submit" disabled={saving}>
                    <Save size={16} />
                    {saving ? "Đang lưu..." : "Lưu thay đổi"}
                  </button>
                </div>
              </form>
            </section>
          )}

          <section className="seller-product-detail-section">
            <div className="seller-product-detail-section-head">
              <Package size={18} />
              <h2>Thông tin sản phẩm</h2>
            </div>

            <p className="seller-product-detail-description">
              {offer.description || "Sản phẩm chưa có mô tả."}
            </p>

            <div className="seller-product-detail-info-grid">
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
              <InfoItem icon={<Barcode size={16} />} label="GTIN" value={offer.gtin} />
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
          </section>

          <section className="seller-product-detail-section">
            <div className="seller-product-detail-section-head">
              <ImageIcon size={18} />
              <h2>Hình ảnh sản phẩm</h2>
            </div>

            {imageUrls.length > 0 ? (
              <div className="seller-product-detail-gallery">
                {imageUrls.map((imageUrl) => (
                  <a key={imageUrl} href={imageUrl} target="_blank" rel="noreferrer">
                    <img src={imageUrl} alt={offer.title} />
                  </a>
                ))}
              </div>
            ) : (
              <div className="seller-product-detail-empty">
                Sản phẩm chưa có hình ảnh.
              </div>
            )}
          </section>

          <section className="seller-product-detail-section">
            <div className="seller-product-detail-section-head">
              <Ruler size={18} />
              <h2>Thông số vận chuyển</h2>
            </div>

            <div className="seller-product-detail-info-grid">
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
          </section>
        </>
      )}
    </div>
  );
}
