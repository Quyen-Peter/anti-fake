import {
  Ban,
  Eye,
  LoaderCircle,
  Lock,
  Search,
  ShieldCheck,
  Store,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import ConfirmModal from "../../../components/common/confirmModal";
import {
  banAdminUser,
  fetchAdminUsers,
  type AdminUser,
} from "../../../services/admin.api";

const NO_SHOP_LABEL = "Chưa có cửa hàng";

const getShopName = (user: AdminUser) =>
  user.shopName ||
  user.shop?.shopName ||
  user.shops?.find((shop) => shop.shopName)?.shopName ||
  NO_SHOP_LABEL;

const hasShop = (user: AdminUser) => getShopName(user) !== NO_SHOP_LABEL;

const getAvatar = (user: AdminUser) => user.avatar || user.avatarUrl || "";

const formatDate = (value?: string) => {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("vi-VN");
};

const normalizeStatus = (status?: string) =>
  String(status ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d");

const getStatusType = (status?: string) => {
  const value = normalizeStatus(status);
  if (
    value === "active" ||
    value.includes("dang hoat dong")
  ) {
    return "active";
  }
  if (
    ["inactive", "locked", "blocked", "banned", "disabled"].includes(value) ||
    value.includes("bi cam") ||
    value.includes("tam khoa") ||
    value.includes("ngung hoat dong")
  ) {
    return "banned";
  }
  if (value.includes("pending") || value.includes("cho xac minh")) {
    return "pending";
  }
  return "unknown";
};

const getStatusLabel = (status?: string) => {
  const type = getStatusType(status);
  if (type === "active") return "Đang hoạt động";
  if (type === "banned") return "Bị cấm";
  if (type === "pending") return "Chờ xác minh";
  return status || "Không rõ";
};

const PAGE_SIZE = 10;

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [roleFilter, setRoleFilter] = useState("user");
  const [shopFilter, setShopFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalUser, setTotalUser] = useState(0);
  const [totalShop, setTotalShop] = useState(0);
  const [activeUser, setActiveUser] = useState(0);
  const [bannedUser, setBannedUser] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userToBan, setUserToBan] = useState<AdminUser | null>(null);
  const [banningUserId, setBanningUserId] = useState("");

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await fetchAdminUsers({
          role: roleFilter || undefined,
          status: statusFilter === "all" ? undefined : statusFilter,
          page,
          pageSize: PAGE_SIZE,
        });
        setUsers(data.items);
        setPage(data.page);
        setTotalPages(Math.max(data.totalPages, 1));
        setTotalItems(data.totalItems);
        setTotalUser(data.totalUser);
        setTotalShop(data.totalShop);
        setActiveUser(data.activeUser);
        setBannedUser(data.bannedUser);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Không thể tải danh sách user";
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [page, roleFilter, statusFilter]);

  const handleApiFilterChange = (setter: (value: string) => void) => (
    value: string,
  ) => {
    setter(value);
    setPage(1);
  };

  const filteredUsers = useMemo(() => {
    const value = keyword.trim().toLowerCase();

    return users.filter((user) => {
      const matchesKeyword =
        !value ||
        [user.id, user.email, user.phone, user.displayName, getShopName(user)]
          .filter(Boolean)
          .some((item) => String(item).toLowerCase().includes(value));

      const matchesShop =
        !shopFilter ||
        (shopFilter === "has_shop" ? hasShop(user) : !hasShop(user));

      return matchesKeyword && matchesShop;
    });
  }, [keyword, shopFilter, users]);

  const stats = [
    {
      title: "Tổng người dùng",
      value: String(totalUser),
      note: "Hệ thống",
      icon: Users,
      tone: "blue",
    },
    {
      title: "Có cửa hàng",
      value: String(totalShop),
      note: "Cửa hàng",
      icon: Store,
      tone: "green",
    },
    {
      title: "Đang hoạt động",
      value: String(activeUser),
      note: "Hoạt động",
      icon: ShieldCheck,
      tone: "gray",
    },
    {
      title: "Bị cấm",
      value: String(bannedUser),
      note: "Đã cấm",
      icon: Lock,
      tone: "red",
    },
  ];

  const handleBanUser = async () => {
    if (!userToBan || banningUserId) return;

    setBanningUserId(userToBan.id);
    try {
      const bannedUser = await banAdminUser(userToBan.id);
      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user.id === userToBan.id
            ? { ...user, ...bannedUser, accountStatus: "Bị cấm" }
            : user,
        ),
      );
      toast.success("Đã cấm người dùng");
      setUserToBan(null);
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Không thể cấm người dùng",
      );
    } finally {
      setBanningUserId("");
    }
  };

  return (
    <section className="admin-page">
      <div className="admin-page-heading">
        <div>
          <h1>Quản lý người dùng</h1>
          <p>Giám sát người dùng và cửa hàng liên kết trong hệ sinh thái AntiFake.</p>
        </div>
      </div>

      <div className="admin-stat-grid">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <article className="admin-stat-card" key={item.title}>
              <div className="admin-stat-top">
                <span className={`admin-stat-icon ${item.tone}`}>
                  <Icon size={18} />
                </span>
                <small>{item.note}</small>
              </div>
              <p>{item.title}</p>
              <strong>{item.value}</strong>
            </article>
          );
        })}
      </div>

      <div className="admin-table-card">
        <div className="admin-table-toolbar">
          <label className="admin-table-search">
            <Search size={16} />
            <input
              placeholder="Tìm tên, email, số điện thoại, cửa hàng..."
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
            />
          </label>
          <select
            value={roleFilter}
            onChange={(event) =>
              handleApiFilterChange(setRoleFilter)(event.target.value)
            }
          >
            <option value="">Vai trò: Tất cả</option>
            <option value="user">Người dùng</option>
            <option value="seller">Người bán</option>
            <option value="admin">Quản trị viên</option>
          </select>
          <select
            value={shopFilter}
            onChange={(event) => setShopFilter(event.target.value)}
          >
            <option value="">Cửa hàng: Tất cả</option>
            <option value="has_shop">Có cửa hàng</option>
            <option value="no_shop">Không có cửa hàng</option>
          </select>
          <select
            value={statusFilter}
            onChange={(event) =>
              handleApiFilterChange(setStatusFilter)(event.target.value)
            }
          >
            <option value="all">Trạng thái: Tất cả</option>
            <option value="active">Đang hoạt động</option>
            <option value="inactive">Không hoạt động</option>
            <option value="blocked">Đã khóa</option>
            <option value="banned">Bị cấm</option>
          </select>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Mã</th>
                <th>Người dùng</th>
                <th>Tên cửa hàng</th>
                <th>Trạng thái</th>
                <th>Ngày tham gia</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={6} className="admin-table-state">
                    Đang tải danh sách người dùng...
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

              {!loading && !error && filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="admin-table-state">
                    Chưa có người dùng phù hợp.
                  </td>
                </tr>
              )}

              {!loading &&
                !error &&
                filteredUsers.map((user) => {
                  const avatar = getAvatar(user);
                  const name = user.displayName || user.email || "Người dùng";
                  const statusType = getStatusType(user.accountStatus);
                  const statusLabel = getStatusLabel(user.accountStatus);
                  const isBanned = statusType === "banned";
                  const isBanning = banningUserId === user.id;

                  return (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>
                        <div className="admin-user-cell">
                          {avatar ? (
                            <img src={avatar} alt={name} />
                          ) : (
                            <span>{name.charAt(0).toUpperCase()}</span>
                          )}
                          <div>
                            <strong>{name}</strong>
                            <small>{user.email}</small>
                          </div>
                        </div>
                      </td>
                      <td>{getShopName(user)}</td>
                      <td>
                        <span
                          className={`admin-status ${
                            statusType === "active"
                              ? "active"
                              : statusType === "banned"
                                ? "locked"
                                : "pending"
                          }`}
                        >
                          {statusLabel}
                        </span>
                      </td>
                      <td>{formatDate(user.createdAt)}</td>
                      <td>
                        <div className="admin-table-actions">
                          <Link
                            to={`/admin/users/${user.id}`}
                            aria-label="Xem chi tiết"
                          >
                            <Eye size={16} />
                          </Link>
                          <button
                            type="button"
                            aria-label="Cấm người dùng"
                            className={isBanning ? "is-loading" : undefined}
                            disabled={isBanned || isBanning}
                            onClick={() => setUserToBan(user)}
                          >
                            {isBanning ? (
                              <LoaderCircle size={16} />
                            ) : (
                              <Ban size={16} />
                            )}
                          </button>
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
            Tổng {totalItems} người dùng - Trang {page}/{totalPages}
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

      <ConfirmModal
        open={Boolean(userToBan)}
        title="Cấm người dùng"
        message={`Bạn có chắc muốn cấm ${
          userToBan?.displayName || userToBan?.email || "người dùng này"
        } không?`}
        confirmText="Cấm"
        danger
        loading={Boolean(banningUserId)}
        onConfirm={handleBanUser}
        onCancel={() => {
          if (!banningUserId) setUserToBan(null);
        }}
      />
    </section>
  );
}

