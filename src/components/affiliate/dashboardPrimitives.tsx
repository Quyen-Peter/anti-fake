import type { ReactNode } from "react";
import { AlertCircle, Inbox, LoaderCircle } from "lucide-react";
import EmptyState from "../common/emptyState";
import "../../css/components/affiliate/dashboardPrimitives.css";

export function AffiliatePageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <header className="affiliate-dashboard-header">
      <div>
        <p>{eyebrow}</p>
        <h1>{title}</h1>
        <span>{description}</span>
      </div>
      {actions && <div className="affiliate-dashboard-actions">{actions}</div>}
    </header>
  );
}

export function AffiliateKpiGrid({
  items,
}: {
  items: Array<{
    label: string;
    value: string;
    icon: ReactNode;
    helper?: string;
  }>;
}) {
  return (
    <section className="affiliate-kpi-grid" aria-label="Chỉ số Affiliate">
      {items.map((item) => (
        <article className="affiliate-kpi-card" key={item.label}>
          <div className="affiliate-kpi-icon">{item.icon}</div>
          <div>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
            {item.helper && <small>{item.helper}</small>}
          </div>
        </article>
      ))}
    </section>
  );
}

const statusLabels: Record<string, string> = {
  DRAFT: "Bản nháp",
  ACTIVE: "Đang hoạt động",
  PAUSED: "Tạm dừng",
  CLOSED: "Đã đóng",
  PENDING: "Chờ hoàn tất",
  APPROVED: "Đã duyệt",
  LOCKED: "Đang giữ",
  PAID: "Đã trả",
  CANCELLED: "Đã hủy",
  SUSPENDED: "Tạm ngưng",
  BLOCKED: "Đã khóa",
};

export function AffiliateStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`affiliate-status affiliate-status-${status.toLowerCase()}`}
    >
      {statusLabels[status] ?? status}
    </span>
  );
}

export function AffiliatePagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;
  return (
    <nav className="affiliate-pagination" aria-label="Phân trang">
      <button type="button" disabled={page <= 1} onClick={() => onChange(page - 1)}>
        Trước
      </button>
      <span>
        Trang {page} / {totalPages}
      </span>
      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
      >
        Sau
      </button>
    </nav>
  );
}

export function AffiliateSectionState({
  loading,
  error,
  empty,
  emptyTitle = "Chưa có dữ liệu",
  emptyDescription,
  onRetry,
}: {
  loading?: boolean;
  error?: string;
  empty?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  onRetry?: () => void;
}) {
  if (loading) {
    return (
      <div className="affiliate-section-state" role="status" aria-busy="true">
        <LoaderCircle className="affiliate-spin" size={24} />
        <span>Đang tải dữ liệu...</span>
      </div>
    );
  }
  if (error) {
    return (
      <EmptyState
        icon={<AlertCircle size={28} />}
        title="Không thể tải dữ liệu"
        description={error}
        tone="warning"
        action={
          onRetry ? (
            <button type="button" onClick={onRetry}>
              Thử lại
            </button>
          ) : undefined
        }
      />
    );
  }
  if (empty) {
    return (
      <EmptyState
        icon={<Inbox size={28} />}
        title={emptyTitle}
        description={emptyDescription}
      />
    );
  }
  return null;
}
