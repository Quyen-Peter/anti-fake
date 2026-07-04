import {
  Ban,
  Eye,
  Lock,
  Mail,
  Search,
  ShieldCheck,
  Store,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
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

const getStatusType = (status?: string) => {
  const value = String(status ?? "").toLowerCase();
  if (
    value === "active" ||
    value.includes("dang hoat dong") ||
    value.includes("đang hoạt động")
  ) {
    return "active";
  }
  if (
    ["inactive", "locked", "blocked", "banned", "disabled"].includes(value) ||
    value.includes("ngung hoat dong") ||
    value.includes("ngừng hoạt động")
  ) {
    return "banned";
  }
  if (value.includes("pending")) return "pending";
  return "unknown";
};

const getStatusLabel = (status?: string) => {
  const type = getStatusType(status);
  if (type === "active") return "Đang hoạt động";
  if (type === "banned") return "Bị cấm";
  if (type === "pending") return "Chờ xác minh";
  return status || "Không rõ";
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [shopFilter, setShopFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userToBan, setUserToBan] = useState<AdminUser | null>(null);
  const [banningUserId, setBanningUserId] = useState("");

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      setError("");

      try {
        setUsers(await fetchAdminUsers());
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
  }, []);

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

      const matchesStatus =
        !statusFilter || getStatusType(user.accountStatus) === statusFilter;

      return matchesKeyword && matchesShop && matchesStatus;
    });
  }, [keyword, shopFilter, statusFilter, users]);

  const activeCount = users.filter(
    (user) => getStatusType(user.accountStatus) === "active",
  ).length;
  const bannedCount = users.filter(
    (user) => getStatusType(user.accountStatus) === "banned",
  ).length;
  const shopCount = users.filter(hasShop).length;

  const stats = [
    {
      title: "Tổng người dùng",
      value: String(users.length),
      note: "Hệ thống",
      icon: Users,
      tone: "blue",
    },
    {
      title: "Có cửa hàng",
      value: String(shopCount),
      note: "Shop",
      icon: Store,
      tone: "green",
    },
    {
      title: "Đang hoạt động",
      value: String(activeCount),
      note: "Active",
      icon: ShieldCheck,
      tone: "gray",
    },
    {
      title: "Bị cấm",
      value: String(bannedCount),
      note: "Banned",
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
            ? { ...user, ...bannedUser, accountStatus: "inactive" }
            : user,
        ),
      );
      toast.success("Da khoa nguoi dung");
      setUserToBan(null);
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Khong the khoa nguoi dung",
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
            value={shopFilter}
            onChange={(event) => setShopFilter(event.target.value)}
          >
            <option value="">Cửa hàng: Tất cả</option>
            <option value="has_shop">Có shop</option>
            <option value="no_shop">Không có shop</option>
          </select>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="">Trạng thái: Tất cả</option>
            <option value="active">Đang hoạt động</option>
            <option value="banned">Bị cấm</option>
            <option value="pending">Chờ xác minh</option>
          </select>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
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
                          <button type="button" aria-label="Xem chi tiết">
                            <Eye size={16} />
                          </button>
                          <button
                            type="button"
                            aria-label="Cấm người dùng"
                            disabled={isBanned || isBanning}
                            onClick={() => setUserToBan(user)}
                          >
                            <Ban size={16} />
                          </button>
                          <button type="button" aria-label="Gửi email">
                            <Mail size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal
        open={Boolean(userToBan)}
        title="Khoa nguoi dung"
        message={`Ban co chac muon khoa ${
          userToBan?.displayName || userToBan?.email || "nguoi dung nay"
        } khong?`}
        confirmText="Khoa"
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
