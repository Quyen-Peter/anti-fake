import { Eye, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  fetchAdminShopRegistrations,
  type AdminShopRegistration,
} from "../../../services/admin.api";

const PAGE_SIZE = 10;

const statusOptions = [
  { value: "", label: "Trạng thái: Tất cả" },
  { value: "pending_kyc", label: "Chờ KYC" },
  { value: "pending_verification", label: "Chờ xét duyệt" },
  { value: "verified", label: "Đã xác minh" },
];

const registrationTypeOptions = [
  { value: "", label: "Loại đăng ký: Tất cả" },
  { value: "NORMAL", label: "Thường" },
  { value: "HANDMADE", label: "Thủ công" },
  { value: "MANUFACTURER", label: "Nhà sản xuất" },
  { value: "DISTRIBUTOR", label: "Nhà phân phối" },
];

const getStatusType = (status?: string) => {
  const value = String(status ?? "").toLowerCase();
  if (value === "verified") return "active";
  if (value.includes("pending")) return "pending";
  return "unknown";
};

const getStatusLabel = (status?: string) => {
  if (status === "pending_kyc") return "Chờ KYC";
  if (status === "pending_verification") return "Chờ xét duyệt";
  if (status === "verified") return "Đã xác minh";
  return status || "Không rõ";
};

const formatDate = (value?: string) => {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("vi-VN");
};

export default function AdminShopRegistrationsPage() {
  const [shops, setShops] = useState<AdminShopRegistration[]>([]);
  const [shopStatus, setShopStatus] = useState("pending_verification");
  const [registrationType, setRegistrationType] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadShops = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await fetchAdminShopRegistrations({
          shopStatus,
          registrationType,
          search: search.trim(),
          page,
          pageSize: PAGE_SIZE,
        });
        setShops(data.items);
        setTotalItems(data.totalItems);
        setTotalPages(Math.max(data.totalPages, 1));
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Không thể tải danh sách shop";
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    loadShops();
  }, [page, registrationType, search, shopStatus]);

  const handleFilterChange = (setter: (value: string) => void) => (value: string) => {
    setter(value);
    setPage(1);
  };

  return (
    <section className="admin-page">
      <div className="admin-page-heading">
        <div>
          <h1>Quản lý đăng ký cửa hàng</h1>
          <p>Duyệt hồ sơ pháp lý, KYC và trạng thái xác minh của shop.</p>
        </div>
      </div>

      <div className="admin-table-card">
        <div className="admin-table-toolbar">
          <label className="admin-table-search">
            <Search size={16} />
            <input
              placeholder="Tìm tên shop, chủ shop, email..."
              value={search}
              onChange={(event) =>
                handleFilterChange(setSearch)(event.target.value)
              }
            />
          </label>
          <select
            value={shopStatus}
            onChange={(event) =>
              handleFilterChange(setShopStatus)(event.target.value)
            }
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <select
            value={registrationType}
            onChange={(event) =>
              handleFilterChange(setRegistrationType)(event.target.value)
            }
          >
            {registrationTypeOptions.map((option) => (
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
                <th>Shop</th>
                <th>Chủ shop</th>
                <th>Loại đăng ký</th>
                <th>Trạng thái</th>
                <th>Ngày tạo</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={6} className="admin-table-state">
                    Đang tải danh sách shop...
                  </td>
                </tr>
              )}

              {!loading && error && (
                <tr>
                  <td colSpan={6} className="admin-table-state error">
                    {error}
                  </td>
                </tr>
              )}

              {!loading && !error && shops.length === 0 && (
                <tr>
                  <td colSpan={6} className="admin-table-state">
                    Chưa có shop phù hợp.
                  </td>
                </tr>
              )}

              {!loading &&
                !error &&
                shops.map((shop) => {
                  const statusType = getStatusType(shop.shopStatus);

                  return (
                    <tr key={shop.id}>
                      <td>
                        <div className="admin-user-cell">
                          {shop.avatar ? (
                            <img src={shop.avatar} alt={shop.shopName} />
                          ) : (
                            <span>{shop.shopName.charAt(0).toUpperCase()}</span>
                          )}
                          <div>
                            <strong>{shop.shopName}</strong>
                            <small>{shop.id}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <strong>{shop.owner?.displayName || "--"}</strong>
                        <small className="admin-cell-muted">
                          {shop.owner?.email || "--"}
                        </small>
                      </td>
                      <td>{shop.registrationType || shop.businessType || "--"}</td>
                      <td>
                        <span
                          className={`admin-status ${
                            statusType === "active" ? "active" : "pending"
                          }`}
                        >
                          {getStatusLabel(shop.shopStatus)}
                        </span>
                      </td>
                      <td>{formatDate(shop.createdAt)}</td>
                      <td>
                        <div className="admin-table-actions">
                          <Link
                            to={`/admin/shop-registrations/${shop.id}`}
                            aria-label={`Xem chi tiết ${shop.shopName}`}
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
            Tổng {totalItems} shop • Trang {page}/{totalPages}
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
