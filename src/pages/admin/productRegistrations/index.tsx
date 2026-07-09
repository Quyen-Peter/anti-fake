import { Eye, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  fetchAdminOffers,
  type AdminOffer,
} from "../../../services/admin.api";
import { formatVnd } from "../../../ultil/currency";

const PAGE_SIZE = 10;

const offerStatusOptions = [
  { value: "", label: "Trạng thái bán: Tất cả" },
  { value: "active", label: "Đang mở bán" },
  { value: "inactive", label: "Tạm ngừng bán" },
  { value: "draft", label: "Bản nháp" },
];

const moderationStatusOptions = [
  { value: "", label: "Trạng thái duyệt: Tất cả" },
  { value: "pending", label: "Chờ duyệt" },
  { value: "approved", label: "Đã duyệt" },
  { value: "rejected", label: "Từ chối" },
  { value: "banned", label: "Bị cấm" },
];

const getModerationStatusType = (status?: string) => {
  const value = String(status ?? "").toLowerCase();
  if (value === "approved") return "active";
  if (value === "rejected" || value === "banned") return "locked";
  return "pending";
};

const getModerationStatusLabel = (status?: string) => {
  if (status === "pending") return "Chờ duyệt";
  if (status === "approved") return "Đã duyệt";
  if (status === "rejected") return "Từ chối";
  if (status === "banned") return "Bị cấm";
  return status || "Không rõ";
};

const getOfferStatusLabel = (status?: string) => {
  if (status === "active") return "Đang mở bán";
  if (status === "inactive") return "Tạm ngừng bán";
  if (status === "draft") return "Bản nháp";
  return status || "Không rõ";
};

const formatDate = (value?: string) => {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("vi-VN");
};

const formatPrice = (value?: number, currency = "VND") =>
  typeof value === "number" ? formatVnd(value, currency) : "--";

export default function AdminProductRegistrationsPage() {
  const [offers, setOffers] = useState<AdminOffer[]>([]);
  const [keyword, setKeyword] = useState("");
  const [offerStatus, setOfferStatus] = useState("");
  const [moderationStatus, setModerationStatus] = useState("pending");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOffers = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await fetchAdminOffers({
          offerStatus,
          moderationStatus,
          page,
          pageSize: PAGE_SIZE,
        });
        setOffers(data.items);
        setTotalItems(data.totalItems);
        setTotalPages(Math.max(data.totalPages, 1));
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Không thể tải danh sách sản phẩm";
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    loadOffers();
  }, [moderationStatus, offerStatus, page]);

  const handleFilterChange = (setter: (value: string) => void) => (value: string) => {
    setter(value);
    setPage(1);
  };

  const filteredOffers = useMemo(() => {
    const searchValue = keyword.trim().toLowerCase();
    if (!searchValue) return offers;

    return offers.filter((offer) =>
      [offer.title, offer.shop?.name]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(searchValue)),
    );
  }, [keyword, offers]);

  return (
    <section className="admin-page">
      <div className="admin-page-heading">
        <div>
          <h1>Quản lý đăng ký sản phẩm</h1>
          <p>Kiểm tra sản phẩm mới và trạng thái kiểm duyệt của shop.</p>
        </div>
      </div>

      <div className="admin-table-card">
        <div className="admin-table-toolbar">
          <label className="admin-table-search">
            <Search size={16} />
            <input
              placeholder="Tìm tên sản phẩm hoặc tên cửa hàng..."
              value={keyword}
              onChange={(event) =>
                handleFilterChange(setKeyword)(event.target.value)
              }
            />
          </label>
          <select
            value={offerStatus}
            onChange={(event) =>
              handleFilterChange(setOfferStatus)(event.target.value)
            }
          >
            {offerStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <select
            value={moderationStatus}
            onChange={(event) =>
              handleFilterChange(setModerationStatus)(event.target.value)
            }
          >
            {moderationStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Shop</th>
                <th>Danh mục</th>
                <th>Giá</th>
                <th>Trạng thái bán</th>
                <th>Trạng thái duyệt</th>
                <th>Ngày tạo</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={8} className="admin-table-state">
                    Đang tải danh sách sản phẩm...
                  </td>
                </tr>
              )}

              {!loading && error && (
                <tr>
                  <td colSpan={8} className="admin-table-state error">
                    {error}
                  </td>
                </tr>
              )}

              {!loading && !error && filteredOffers.length === 0 && (
                <tr>
                  <td colSpan={8} className="admin-table-state">
                    Chưa có sản phẩm phù hợp.
                  </td>
                </tr>
              )}

              {!loading &&
                !error &&
                filteredOffers.map((offer) => {
                  const moderationType = getModerationStatusType(
                    offer.moderationStatus,
                  );

                  return (
                    <tr key={offer.id}>
                      <td>
                        <div className="admin-user-cell">
                          {offer.thumbnail ? (
                            <img src={offer.thumbnail} alt={offer.title} />
                          ) : (
                            <span>{offer.title.charAt(0).toUpperCase()}</span>
                          )}
                          <div>
                            <strong>{offer.title}</strong>
                            <small>{offer.id}</small>
                          </div>
                        </div>
                      </td>
                      <td>{offer.shop?.name || "--"}</td>
                      <td>{offer.category?.name || "--"}</td>
                      <td>{formatPrice(offer.price, offer.currency)}</td>
                      <td>{getOfferStatusLabel(offer.offerStatus)}</td>
                      <td>
                        <span className={`admin-status ${moderationType}`}>
                          {getModerationStatusLabel(offer.moderationStatus)}
                        </span>
                      </td>
                      <td>{formatDate(offer.createdAt)}</td>
                      <td>
                        <div className="admin-table-actions">
                          <Link
                            to={`/admin/product-registrations/${offer.id}`}
                            aria-label={`Xem chi tiết ${offer.title}`}
                          >
                            <Eye size={16} />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        <div className="admin-pagination">
          <span>
            Hiển thị {filteredOffers.length}/{totalItems} sản phẩm • Trang {page}/{totalPages}
          </span>
          <div>
            <button
              type="button"
              disabled={page <= 1 || loading}
              onClick={() => setPage((current) => Math.max(current - 1, 1))}
            >
              Trước
            </button>
            <button
              type="button"
              disabled={page >= totalPages || loading}
              onClick={() =>
                setPage((current) => Math.min(current + 1, totalPages))
              }
            >
              Sau
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
