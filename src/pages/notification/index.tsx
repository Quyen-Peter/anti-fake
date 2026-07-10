import {
  Bell,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Inbox,
  RefreshCw,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  fetchNotifications,
  type NotificationFilter,
  type NotificationPage as NotificationPageData,
} from "../../services/notification.api";
import "../../css/pages/notification.css";

const PAGE_SIZE = 20;

const filters: Array<{ value: NotificationFilter; label: string }> = [
  { value: "all", label: "Tất cả" },
  { value: "unread", label: "Chưa đọc" },
  { value: "readed", label: "Đã đọc" },
];

const initialPage: NotificationPageData = {
  items: [],
  page: 1,
  pageSize: PAGE_SIZE,
  totalItems: 0,
  totalPages: 1,
};

const formatTime = (value?: string) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
};

export default function NotificationPage() {
  const [filter, setFilter] = useState<NotificationFilter>("all");
  const [page, setPage] = useState(1);
  const [requestVersion, setRequestVersion] = useState(0);
  const [data, setData] = useState<NotificationPageData>(initialPage);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    fetchNotifications({ filter, page, pageSize: PAGE_SIZE })
      .then((result) => {
        if (cancelled) return;
        setData(result);
        setError("");
      })
      .catch((requestError: unknown) => {
        if (cancelled) return;
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Không thể tải danh sách thông báo",
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [filter, page, requestVersion]);

  const selectFilter = (nextFilter: NotificationFilter) => {
    setLoading(true);
    setFilter(nextFilter);
    setPage(1);
  };

  const changePage = (nextPage: number) => {
    setLoading(true);
    setPage(nextPage);
  };

  const retry = () => {
    setLoading(true);
    setRequestVersion((current) => current + 1);
  };

  return (
    <main className="notification-page">
      <section className="notification-shell">
        <header className="notification-header">
          <div>
            <span className="notification-eyebrow">Trung tâm thông báo</span>
            <h1>Thông báo</h1>
            <p>Theo dõi các cập nhật mới nhất liên quan đến tài khoản của bạn.</p>
          </div>
          <div className="notification-total">
            <Bell size={18} />
            <span>{data.totalItems} thông báo</span>
          </div>
        </header>

        <div className="notification-filters" role="tablist" aria-label="Lọc thông báo">
          {filters.map((item) => (
            <button
              key={item.value}
              type="button"
              role="tab"
              aria-selected={filter === item.value}
              className={filter === item.value ? "active" : ""}
              onClick={() => selectFilter(item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="notification-state" aria-busy="true">
            <RefreshCw className="notification-spin" size={24} />
            <strong>Đang tải thông báo...</strong>
          </div>
        ) : error ? (
          <div className="notification-state notification-error" role="alert">
            <Inbox size={28} />
            <strong>Không thể tải thông báo</strong>
            <p>{error}</p>
            <button type="button" onClick={retry}>Thử lại</button>
          </div>
        ) : data.items.length === 0 ? (
          <div className="notification-state">
            <CheckCircle2 size={30} />
            <strong>Không có thông báo</strong>
            <p>Bạn đã xem hết các cập nhật trong mục này.</p>
          </div>
        ) : (
          <div className="notification-list">
            {data.items.map((notification) => {
              const unread = !notification.readAt;
              return (
                <article
                  key={notification.id}
                  className={`notification-item ${unread ? "unread" : ""}`}
                >
                  <div className="notification-icon" aria-hidden="true">
                    <Bell size={18} />
                  </div>
                  <div className="notification-content">
                    <div className="notification-title-row">
                      <h2>{notification.title}</h2>
                      {unread && <span>Chưa đọc</span>}
                    </div>
                    {notification.message && <p>{notification.message}</p>}
                    <time dateTime={notification.createdAt}>
                      {formatTime(notification.createdAt)}
                    </time>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {!loading && !error && data.totalPages > 1 && (
          <nav className="notification-pagination" aria-label="Phân trang thông báo">
            <button
              type="button"
              disabled={data.page <= 1}
              onClick={() => changePage(data.page - 1)}
              aria-label="Trang trước"
            >
              <ChevronLeft size={18} />
            </button>
            <span>Trang {data.page} / {data.totalPages}</span>
            <button
              type="button"
              disabled={data.page >= data.totalPages}
              onClick={() => changePage(data.page + 1)}
              aria-label="Trang sau"
            >
              <ChevronRight size={18} />
            </button>
          </nav>
        )}
      </section>
    </main>
  );
}
