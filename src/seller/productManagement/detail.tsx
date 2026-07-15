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
  fetchOfferVariants,
  fetchOfferDetail,
  updateOfferVariant,
  updateOffer,
  type OfferDetail,
  type OfferVariant,
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

const getVariantDisplayName = (offer: OfferDetail, variant: OfferVariant) => {
  if (variant.optionValues?.length) {
    return variant.optionValues.map((value) => value.text).join(" - ");
  }

  const valueIds = variant.optionValueIds ?? [];
  const values = (offer.optionGroups ?? []).flatMap((group) =>
    group.values
      .filter((value) => valueIds.includes(value.id))
      .map((value) => value.text),
  );

  return values.join(" - ") || "--";
};

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

function OfferOptionsAndVariants({ offer }: { offer: OfferDetail }) {
  const optionGroups = offer.optionGroups ?? [];
  const variants = offer.variants ?? [];

  if (optionGroups.length === 0 && variants.length === 0) return null;

  return (
    <section className="seller-product-detail-section">
      <div className="seller-product-detail-section-head">
        <Layers size={18} />
        <h2>Phân loại sản phẩm</h2>
      </div>

      {optionGroups.length > 0 && (
        <div className="seller-product-option-groups">
          {optionGroups.map((group) => (
            <div className="seller-product-option-group" key={group.id}>
              <strong>{group.displayName}</strong>
              <div>
                {group.values.map((value) => (
                  <span key={value.id}>
                    {value.mediaAsset?.secureUrl && (
                      <img src={value.mediaAsset.secureUrl} alt={value.text} />
                    )}
                    {value.text}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {variants.length > 0 && (
        <div className="seller-product-variant-table">
          {variants.map((variant) => (
            <div className="seller-product-variant-row" key={variant.id}>
              <span>{getVariantDisplayName(offer, variant)}</span>
              <span>
                {formatMoney(
                  variant.priceOverride ?? variant.price ?? offer.price,
                  offer.currency,
                )}
              </span>
              <span>Tồn kho: {variant.availableQuantity}</span>
              <span>{variant.isActive ? "Đang bán" : "Ngừng bán"}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

type VariantForm = {
  priceOverride: string;
  availableQuantity: string;
};

const toVariantForm = (variant: OfferVariant): VariantForm => ({
  priceOverride: toFormNumber(variant.priceOverride ?? variant.price),
  availableQuantity: toFormNumber(variant.availableQuantity),
});

const getVariantComboName = (offer: OfferDetail, variant: OfferVariant) => {
  if (variant.optionValues?.length) {
    return variant.optionValues.map((value) => value.text).join(" - ");
  }

  return (offer.optionGroups ?? [])
    .flatMap((group) =>
      group.values
        .filter((value) => (variant.optionValueIds ?? []).includes(value.id))
        .map((value) => value.text),
    )
    .join(" - ");
};

function VariantUpdatePanel({
  offer,
  onVariantUpdated,
}: {
  offer: OfferDetail;
  onVariantUpdated: (variant: OfferVariant) => void;
}) {
  const [variants, setVariants] = useState<OfferVariant[]>([]);
  const [forms, setForms] = useState<Record<string, VariantForm>>({});
  const [loading, setLoading] = useState(false);
  const [savingId, setSavingId] = useState("");
  const [loadError, setLoadError] = useState("");
  const [showOnlyActive, setShowOnlyActive] = useState(true);

  const loadVariants = async (isActive?: boolean) => {
    if (!offer.id) return;

    setLoading(true);
    setLoadError("");
    try {
      const data = await fetchOfferVariants(offer.id, isActive);
      setVariants(data);
      setForms(
        data.reduce<Record<string, VariantForm>>((result, variant) => {
          result[variant.id] = toVariantForm(variant);
          return result;
        }, {}),
      );
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Không thể tải variants";
      setLoadError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVariants(showOnlyActive ? true : undefined);
  }, [offer.id, showOnlyActive]);

  const updateVariantField = <K extends keyof VariantForm>(
    variantId: string,
    field: K,
    value: VariantForm[K],
  ) => {
    setForms((current) => ({
      ...current,
      [variantId]: {
        ...current[variantId],
        [field]: value,
      },
    }));
  };

  const saveVariant = async (variantId: string) => {
    const form = forms[variantId];
    if (!form || savingId) return;

    const availableQuantity = Number(form.availableQuantity || 0);
    const priceOverride =
      form.priceOverride.trim() === "" ? null : Number(form.priceOverride);

    if (Number.isNaN(availableQuantity) || availableQuantity < 0) {
      toast.error("Tồn kho variant không hợp lệ");
      return;
    }

    if (priceOverride !== null && (Number.isNaN(priceOverride) || priceOverride < 0)) {
      toast.error("Giá variant không hợp lệ");
      return;
    }

    setSavingId(variantId);
    try {
      const updatedVariant = await updateOfferVariant(offer.id, variantId, {
        priceOverride,
        availableQuantity,
      });

      setVariants((current) =>
        current.map((variant) =>
          variant.id === variantId ? { ...variant, ...updatedVariant } : variant,
        ),
      );
      onVariantUpdated(updatedVariant);
      toast.success("Cập nhật variant thành công");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Không thể cập nhật variant");
    } finally {
      setSavingId("");
    }
  };

  return (
    <section className="seller-product-detail-section">
      <div className="seller-product-detail-section-head seller-product-variant-edit-head">
        <Layers size={18} />
        <h2>Cập nhật variant</h2>
        <label>
          <input
            type="checkbox"
            checked={showOnlyActive}
            onChange={(event) => setShowOnlyActive(event.target.checked)}
          />
          Chỉ variant đang bán
        </label>
      </div>

      {loading && <div className="seller-product-detail-state">Đang tải variants...</div>}

      {!loading && loadError && (
        <div className="seller-product-detail-state error">
          {loadError}
          <button
            type="button"
            onClick={() => loadVariants(showOnlyActive ? true : undefined)}
          >
            Tải lại
          </button>
        </div>
      )}

      {!loading && !loadError && variants.length === 0 && (
        <div className="seller-product-detail-empty">Chưa có variant để cập nhật.</div>
      )}

      {!loading && !loadError && variants.length > 0 && (
        <div className="seller-product-variant-edit-list">
          {variants.map((variant) => {
            const form = forms[variant.id] ?? toVariantForm(variant);
            const comboName = getVariantComboName(offer, variant);
            return (
              <div className="seller-product-variant-edit-row" key={variant.id}>
                <div className="seller-product-variant-edit-media">
                  {variant.mediaAsset?.secureUrl ? (
                    <img
                      src={variant.mediaAsset.secureUrl}
                      alt={comboName || "Anh variant"}
                    />
                  ) : (
                    <ImageIcon size={24} />
                  )}
                </div>
                <div className="seller-product-variant-combo">
                  <strong>{comboName || "Chưa có cặp phân loại"}</strong>
                  {false ? (
                    <div>
                      {[].map((pair) => (
                        <span key={pair}>{pair}</span>
                      ))}
                    </div>
                  ) : (
                    <small>Chưa có cặp phân loại</small>
                  )}
                </div>

                <label className="seller-product-variant-sku-input">
                  <span>SKU</span>
                  <input
                    value=""
                    disabled={savingId === variant.id}
                    onChange={(event) =>
                      event.currentTarget.blur()
                    }
                  />
                </label>

                <label>
                  <span>Giá variant</span>
                  <input
                    type="number"
                    min="0"
                    value={form.priceOverride}
                    disabled={savingId === variant.id}
                    placeholder={formatMoney(offer.price, offer.currency)}
                    onChange={(event) =>
                      updateVariantField(
                        variant.id,
                        "priceOverride",
                        event.target.value,
                      )
                    }
                  />
                </label>

                <label>
                  <span>Tồn kho</span>
                  <input
                    type="number"
                    min="0"
                    value={form.availableQuantity}
                    disabled={savingId === variant.id}
                    onChange={(event) =>
                      updateVariantField(
                        variant.id,
                        "availableQuantity",
                        event.target.value,
                      )
                    }
                  />
                </label>

                <label className="seller-product-variant-active">
                  <input
                    type="checkbox"
                    checked={variant.isActive}
                    disabled={savingId === variant.id}
                    onChange={(event) =>
                      event.currentTarget.blur()
                    }
                  />
                  Đang bán
                </label>

                <button
                  type="button"
                  disabled={savingId === variant.id}
                  onClick={() => saveVariant(variant.id)}
                >
                  {savingId === variant.id ? "Đang lưu..." : "Lưu variant"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default function SellerProductDetail() {
  const { offerId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [offer, setOffer] = useState<OfferDetail | null>(null);
  const [form, setForm] = useState<UpdateOfferForm>(initialUpdateForm);
  const [editing, setEditing] = useState(searchParams.get("edit") === "1");
  const [editingVariants, setEditingVariants] = useState(false);
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

  const canUpdateVariants =
    String(offer?.moderationStatus ?? "").toLowerCase() === "approved" ||
    String(offer?.offerStatus ?? "").toLowerCase() === "active";

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

  const handleVariantUpdated = (updatedVariant: OfferVariant) => {
    setOffer((currentOffer) =>
      currentOffer
        ? {
            ...currentOffer,
            variants: (currentOffer.variants ?? []).map((variant) =>
              variant.id === updatedVariant.id
                ? { ...variant, ...updatedVariant }
                : variant,
            ),
          }
        : currentOffer,
    );
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
              {canUpdateVariants && (
                <button
                  type="button"
                  className="seller-product-detail-edit-btn"
                  onClick={() => setEditingVariants((current) => !current)}
                >
                  <Layers size={16} />
                  {editingVariants ? "Ẩn cập nhật variant" : "Cập nhật variant"}
                </button>
              )}
            </div>
          </section>

          {editingVariants && (
            <VariantUpdatePanel
              offer={offer}
              onVariantUpdated={handleVariantUpdated}
            />
          )}

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

          <OfferOptionsAndVariants offer={offer} />

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
