import { useEffect, useRef, useState } from "react";
import { LockKeyhole, X } from "lucide-react";
import type { AffiliateProgram } from "../../services/affiliate.api";
import type { ShopOffer } from "../../services/shop.api";

type ProgramFormValue = {
  name: string;
  scopeType: "SHOP" | "OFFER";
  offerId: string;
  tier1Rate: string;
  tier2Rate: string;
  attributionWindowDays: string;
  startedAt: string;
  endedAt: string;
  programStatus: AffiliateProgram["programStatus"];
};

const toDateInput = (value?: string | null) =>
  value ? new Date(value).toISOString().slice(0, 10) : "";

const initialValue = (program?: AffiliateProgram | null): ProgramFormValue => ({
  name: program?.name ?? "",
  scopeType: program?.scopeType === "OFFER" ? "OFFER" : "SHOP",
  offerId: program?.offerId ?? "",
  tier1Rate: String(program?.tier1Rate ?? 6),
  tier2Rate: String(program?.tier2Rate ?? 2),
  attributionWindowDays: String(program?.attributionWindowDays ?? 30),
  startedAt: toDateInput(program?.startedAt),
  endedAt: toDateInput(program?.endedAt),
  programStatus: program?.programStatus ?? "ACTIVE",
});

export type AffiliateProgramFormSubmit = {
  name: string;
  scopeType: "SHOP" | "OFFER";
  offerId?: string;
  tier1Rate: number;
  tier2Rate: number;
  attributionWindowDays: number;
  startedAt?: string | null;
  endedAt?: string | null;
  programStatus?: AffiliateProgram["programStatus"];
};

export function AffiliateProgramFormModal({
  open,
  program,
  offers,
  submitting,
  onClose,
  onSubmit,
}: {
  open: boolean;
  program?: AffiliateProgram | null;
  offers: ShopOffer[];
  submitting: boolean;
  onClose: () => void;
  onSubmit: (value: AffiliateProgramFormSubmit) => Promise<void>;
}) {
  const [value, setValue] = useState(() => initialValue(program));
  const [validationError, setValidationError] = useState("");
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const locked = Boolean(program?.configurationLocked);
  const closed = program?.programStatus === "CLOSED";
  const statusOptions: AffiliateProgram["programStatus"][] =
    program?.programStatus === "DRAFT"
      ? ["DRAFT", "ACTIVE", "CLOSED"]
      : program?.programStatus === "PAUSED"
        ? ["PAUSED", "ACTIVE", "CLOSED"]
        : program?.programStatus === "ACTIVE"
          ? ["ACTIVE", "PAUSED", "CLOSED"]
          : ["CLOSED"];

  useEffect(() => {
    if (!open) return;
    queueMicrotask(() => {
      setValue(initialValue(program));
      setValidationError("");
    });
    previousFocusRef.current = document.activeElement as HTMLElement;
    const timer = window.setTimeout(() => {
      dialogRef.current?.querySelector<HTMLElement>("input, select, button")?.focus();
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not(:disabled), input:not(:disabled), select:not(:disabled), [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.classList.add("affiliate-modal-open");
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.classList.remove("affiliate-modal-open");
      previousFocusRef.current?.focus();
    };
  }, [onClose, open, program]);

  if (!open) return null;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const tier1Rate = Number(value.tier1Rate);
    const tier2Rate = Number(value.tier2Rate);
    const attributionWindowDays = Number(value.attributionWindowDays);
    if (tier1Rate <= 0 || tier2Rate < 0 || tier2Rate > tier1Rate || tier1Rate + tier2Rate > 100) {
      setValidationError(
        "Tầng 1 phải lớn hơn 0; Tầng 2 không vượt Tầng 1; tổng tỷ lệ không vượt 100%.",
      );
      return;
    }
    if (value.scopeType === "OFFER" && !value.offerId) {
      setValidationError("Vui lòng chọn sản phẩm áp dụng.");
      return;
    }
    if (value.startedAt && value.endedAt && value.endedAt < value.startedAt) {
      setValidationError("Ngày kết thúc phải sau ngày bắt đầu.");
      return;
    }
    setValidationError("");
    await onSubmit({
      name: value.name.trim(),
      scopeType: value.scopeType,
      offerId: value.scopeType === "OFFER" ? value.offerId : undefined,
      tier1Rate,
      tier2Rate,
      attributionWindowDays,
      startedAt: program ? (value.startedAt ? new Date(value.startedAt).toISOString() : null) : undefined,
      endedAt: program ? (value.endedAt ? new Date(value.endedAt).toISOString() : null) : undefined,
      programStatus: program ? value.programStatus : undefined,
    });
  };

  return (
    <div className="affiliate-modal-backdrop" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <div
        ref={dialogRef}
        className="affiliate-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="affiliate-program-dialog-title"
      >
        <div className="affiliate-modal-header">
          <div>
            <p>{closed ? "CHI TIẾT CHƯƠNG TRÌNH" : program ? "CHỈNH SỬA CHƯƠNG TRÌNH" : "CHƯƠNG TRÌNH MỚI"}</p>
            <h2 id="affiliate-program-dialog-title">
              {program ? program.name : "Tạo chương trình Affiliate"}
            </h2>
          </div>
          <button type="button" className="affiliate-icon-button" onClick={onClose} aria-label="Đóng">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={(event) => void submit(event)}>
          {locked && (
            <div className="affiliate-lock-note">
              <LockKeyhole size={18} />
              <span>
                Chương trình đã có thành viên hoặc chuyển đổi. Phạm vi và tỷ lệ hoa hồng đã khóa.
              </span>
            </div>
          )}
          <div className="affiliate-form-grid">
            <label className="affiliate-field affiliate-field-wide">
              <span>Tên chương trình</span>
              <input
                required
                maxLength={120}
                disabled={closed}
                value={value.name}
                onChange={(event) => setValue({ ...value, name: event.target.value })}
              />
            </label>
            <label className="affiliate-field">
              <span>Phạm vi</span>
              <select
                disabled={locked || closed}
                value={value.scopeType}
                onChange={(event) =>
                  setValue({ ...value, scopeType: event.target.value as "SHOP" | "OFFER" })
                }
              >
                <option value="SHOP">Toàn shop</option>
                <option value="OFFER">Một sản phẩm</option>
              </select>
            </label>
            <label className="affiliate-field">
              <span>Sản phẩm</span>
              <select
                disabled={locked || closed || value.scopeType !== "OFFER"}
                required={value.scopeType === "OFFER"}
                value={value.offerId}
                onChange={(event) => setValue({ ...value, offerId: event.target.value })}
              >
                <option value="">Chọn sản phẩm</option>
                {offers.map((offer) => (
                  <option key={offer.id} value={offer.id}>{offer.title}</option>
                ))}
              </select>
            </label>
            <label className="affiliate-field">
              <span>Hoa hồng Tầng 1 (%)</span>
              <input
                type="number"
                min="0.01"
                max="100"
                step="0.01"
                required
                disabled={locked || closed}
                value={value.tier1Rate}
                onChange={(event) => setValue({ ...value, tier1Rate: event.target.value })}
              />
            </label>
            <label className="affiliate-field">
              <span>Hoa hồng Tầng 2 (%)</span>
              <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                required
                disabled={locked || closed}
                value={value.tier2Rate}
                onChange={(event) => setValue({ ...value, tier2Rate: event.target.value })}
              />
            </label>
            <label className="affiliate-field">
              <span>Cửa sổ ghi nhận (ngày)</span>
              <input
                type="number"
                min="1"
                max="90"
                required
                disabled={locked || closed}
                value={value.attributionWindowDays}
                onChange={(event) =>
                  setValue({ ...value, attributionWindowDays: event.target.value })
                }
              />
            </label>
            {program && (
              <label className="affiliate-field">
                <span>Trạng thái</span>
                <select
                  disabled={closed}
                  value={value.programStatus}
                  onChange={(event) =>
                    setValue({
                      ...value,
                      programStatus: event.target.value as AffiliateProgram["programStatus"],
                    })
                  }
                >
                  {statusOptions.map((option) => (
                    <option key={option} value={option}>
                      {option === "DRAFT"
                        ? "Bản nháp"
                        : option === "ACTIVE"
                          ? "Đang hoạt động"
                          : option === "PAUSED"
                            ? "Tạm dừng"
                            : "Đóng vĩnh viễn"}
                    </option>
                  ))}
                </select>
              </label>
            )}
            {program && (
              <>
                <label className="affiliate-field">
                  <span>Ngày bắt đầu</span>
                  <input
                    type="date"
                    disabled={closed}
                    value={value.startedAt}
                    onChange={(event) => setValue({ ...value, startedAt: event.target.value })}
                  />
                </label>
                <label className="affiliate-field">
                  <span>Ngày kết thúc</span>
                  <input
                    type="date"
                    disabled={closed}
                    value={value.endedAt}
                    onChange={(event) => setValue({ ...value, endedAt: event.target.value })}
                  />
                </label>
              </>
            )}
          </div>
          <p className="affiliate-form-hint">
            Hoa hồng lấy từ phần shop thực nhận và được hệ thống tự động đối soát sau thời gian giữ.
          </p>
          {validationError && <p className="affiliate-form-error" role="alert">{validationError}</p>}
          <div className="affiliate-modal-footer">
            <button type="button" className="affiliate-button secondary" onClick={onClose}>
              {closed ? "Đóng" : "Hủy"}
            </button>
            {!closed && (
              <button type="submit" className="affiliate-button" disabled={submitting}>
                {submitting ? "Đang lưu..." : program ? "Lưu thay đổi" : "Tạo chương trình"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
