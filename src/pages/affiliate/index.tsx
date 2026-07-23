import { useEffect, useMemo, useState } from "react";
import { Copy, Link2, RefreshCw, Store, WalletCards } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import {
  createAffiliateCode,
  fetchActiveAffiliatePrograms,
  fetchAffiliateAccountSummary,
  fetchAffiliateCodes,
  fetchAffiliateCommissions,
  fetchMyAffiliateAccounts,
  joinAffiliateProgram,
  type AffiliateAccount,
  type AffiliateAccountSummary,
  type AffiliateCode,
  type AffiliateCommission,
  type AffiliateProgram,
} from "../../services/affiliate.api";
import { getToken } from "../../ultil/auth";
import { formatVnd } from "../../ultil/currency";
import "../../css/pages/affiliate.css";

type Tab = "marketplace" | "member";

const PROGRAM_PAGE_SIZE = 12;
const COMMISSION_PAGE_SIZE = 15;

const statusLabel: Record<string, string> = {
  PENDING: "Chờ đơn hoàn tất",
  APPROVED: "Đã duyệt",
  LOCKED: "Đang giữ",
  PAID: "Đã trả",
  CANCELLED: "Đã hủy",
  ACTIVE: "Đang hoạt động",
  SUSPENDED: "Tạm dừng",
  BLOCKED: "Đã khóa",
};

const scopeLabel: Record<AffiliateProgram["scopeType"], string> = {
  PLATFORM: "Nền tảng",
  SHOP: "Toàn shop",
  BRAND: "Thương hiệu",
  OFFER: "Sản phẩm",
};

export default function AffiliatePage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedTab = searchParams.get("tab");
  const tab: Tab = requestedTab === "member" ? "member" : "marketplace";
  const loggedIn = Boolean(getToken());
  const [programs, setPrograms] = useState<AffiliateProgram[]>([]);
  const [programPage, setProgramPage] = useState(1);
  const [programTotalPages, setProgramTotalPages] = useState(0);
  const [accounts, setAccounts] = useState<AffiliateAccount[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState("");
  const [summary, setSummary] = useState<AffiliateAccountSummary | null>(null);
  const [codes, setCodes] = useState<AffiliateCode[]>([]);
  const [commissions, setCommissions] = useState<AffiliateCommission[]>([]);
  const [commissionPage, setCommissionPage] = useState(1);
  const [commissionTotalPages, setCommissionTotalPages] = useState(0);
  const [referralCodes, setReferralCodes] = useState<Record<string, string>>({});
  const [newCode, setNewCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const selectTab = (nextTab: Tab) => {
    const nextParams = new URLSearchParams(searchParams);
    if (nextTab === "member") {
      nextParams.set("tab", "member");
    } else {
      nextParams.delete("tab");
    }
    setSearchParams(nextParams);
  };

  useEffect(() => {
    let active = true;
    void fetchActiveAffiliatePrograms(programPage, PROGRAM_PAGE_SIZE)
      .then((result) => {
        if (!active) return;
        setPrograms(result.items);
        setProgramTotalPages(result.totalPages);
      })
      .catch((requestError) => {
        if (active) {
          toast.error(
            requestError instanceof Error
              ? requestError.message
              : "Không thể tải chương trình affiliate",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [programPage, refreshKey]);

  useEffect(() => {
    let active = true;
    if (!loggedIn) {
      return () => {
        active = false;
      };
    }

    void fetchMyAffiliateAccounts()
      .then((myAccounts) => {
        if (!active) return;
        setAccounts(myAccounts);
        setSelectedAccountId((current) =>
          myAccounts.some((account) => account.id === current)
            ? current
            : (myAccounts[0]?.id ?? ""),
        );
        if (myAccounts.length === 0) {
          setSummary(null);
          setCodes([]);
          setCommissions([]);
        }
      })
      .catch((requestError) => {
        if (active) {
          toast.error(
            requestError instanceof Error
              ? requestError.message
              : "Không thể tải Affiliate của bạn",
          );
        }
      });

    return () => {
      active = false;
    };
  }, [loggedIn, refreshKey]);

  useEffect(() => {
    let active = true;
    if (!selectedAccountId) {
      return () => {
        active = false;
      };
    }

    void Promise.all([
      fetchAffiliateAccountSummary(selectedAccountId),
      fetchAffiliateCodes(selectedAccountId),
    ])
      .then(([nextSummary, nextCodes]) => {
        if (!active) return;
        setSummary(nextSummary);
        setCodes(nextCodes);
      })
      .catch((requestError) => {
        if (active) {
          toast.error(
            requestError instanceof Error
              ? requestError.message
              : "Không thể tải dữ liệu affiliate",
          );
        }
      });

    return () => {
      active = false;
    };
  }, [selectedAccountId, refreshKey]);

  useEffect(() => {
    let active = true;
    if (!selectedAccountId) {
      return () => {
        active = false;
      };
    }

    void fetchAffiliateCommissions(
      selectedAccountId,
      commissionPage,
      COMMISSION_PAGE_SIZE,
    )
      .then((result) => {
        if (!active) return;
        setCommissions(result.items);
        setCommissionTotalPages(result.totalPages);
      })
      .catch((requestError) => {
        if (active) {
          toast.error(
            requestError instanceof Error
              ? requestError.message
              : "Không thể tải lịch sử hoa hồng",
          );
        }
      });

    return () => {
      active = false;
    };
  }, [selectedAccountId, commissionPage, refreshKey]);

  const joinedProgramIds = useMemo(
    () => new Set(accounts.map((account) => account.programId)),
    [accounts],
  );

  const refresh = () => {
    setLoading(true);
    setRefreshKey((current) => current + 1);
  };

  const selectAccount = (accountId: string) => {
    setSelectedAccountId(accountId);
    setCommissionPage(1);
    setSummary(null);
    setCodes([]);
    setCommissions([]);
  };

  const joinProgram = async (programId: string) => {
    if (!loggedIn) {
      navigate("/auth");
      return;
    }
    setSubmitting(true);
    try {
      await joinAffiliateProgram(programId, referralCodes[programId]?.trim());
      toast.success("Đã tham gia chương trình affiliate");
      refresh();
      selectTab("member");
    } catch (requestError) {
      toast.error(
        requestError instanceof Error
          ? requestError.message
          : "Không thể tham gia chương trình",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const submitCode = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedAccountId || !newCode.trim()) return;
    setSubmitting(true);
    try {
      await createAffiliateCode(
        selectedAccountId,
        newCode.trim().toLowerCase(),
      );
      setCodes(await fetchAffiliateCodes(selectedAccountId));
      setNewCode("");
      toast.success("Đã tạo mã affiliate");
    } catch (requestError) {
      toast.error(
        requestError instanceof Error
          ? requestError.message
          : "Không thể tạo mã",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const copyLink = async (code: string) => {
    await navigator.clipboard.writeText(
      `${window.location.origin}/?aff=${encodeURIComponent(code)}`,
    );
    toast.success("Đã sao chép link affiliate");
  };

  return (
    <main className="affiliate-page" style={{ paddingTop: 82 }}>
      <section className="affiliate-hero">
        <div>
          <p className="affiliate-eyebrow">AFFILIATE CENTER</p>
          <h1>
            Chia sẻ đúng sản phẩm.
            <br />
            Nhận hoa hồng minh bạch.
          </h1>
          <p>
            Shop đã xác minh tạo và chi trả chương trình. Chủ mã nhận Tầng 1;
            người giới thiệu trực tiếp chủ mã nhận Tầng 2.
          </p>
        </div>
        <div className="affiliate-flow">
          <span>Khách đặt hàng</span>
          <b>→</b>
          <span>Giữ theo cấu hình shop</span>
          <b>→</b>
          <span>Ví affiliate</span>
        </div>
      </section>

      <nav className="affiliate-tabs" aria-label="Khu vực affiliate">
        <button
          className={tab === "marketplace" ? "active" : ""}
          onClick={() => selectTab("marketplace")}
        >
          <Store size={17} /> Chương trình
        </button>
        <button
          className={tab === "member" ? "active" : ""}
          onClick={() => selectTab("member")}
        >
          <WalletCards size={17} /> Kiếm tiền
        </button>
        <button
          className="affiliate-refresh"
          onClick={refresh}
          aria-label="Làm mới"
        >
          <RefreshCw size={17} />
        </button>
      </nav>

      {loading && (
        <div className="affiliate-empty">Đang tải Affiliate Center...</div>
      )}

      {!loading && tab === "marketplace" && (
        <>
          <section className="affiliate-program-grid">
            {programs.map((program) => (
              <article className="affiliate-program-card" key={program.id}>
                <div className="affiliate-card-top">
                  <span>{scopeLabel[program.scopeType]}</span>
                  <small>{program.ownerShopName ?? "Nền tảng"}</small>
                </div>
                <h2>{program.name}</h2>
                <p>
                  {program.offerTitle ??
                    program.brandName ??
                    "Áp dụng cho sản phẩm của shop"}
                </p>
                <div className="affiliate-rate-row">
                  <div>
                    <strong>{program.tier1Rate}%</strong>
                    <span>Tầng 1</span>
                  </div>
                  <div>
                    <strong>{program.tier2Rate}%</strong>
                    <span>Tầng 2</span>
                  </div>
                  <div>
                    <strong>{program.commissionHoldDays} ngày</strong>
                    <span>Thời gian giữ</span>
                  </div>
                </div>
                {!joinedProgramIds.has(program.id) ? (
                  <div className="affiliate-join">
                    <input
                      value={referralCodes[program.id] ?? ""}
                      onChange={(event) =>
                        setReferralCodes((current) => ({
                          ...current,
                          [program.id]: event.target.value,
                        }))
                      }
                      placeholder="Mã người giới thiệu (nếu có)"
                    />
                    <button
                      disabled={submitting}
                      onClick={() => void joinProgram(program.id)}
                    >
                      Tham gia
                    </button>
                  </div>
                ) : (
                  <span className="affiliate-joined">Đã tham gia</span>
                )}
              </article>
            ))}
            {programs.length === 0 && (
              <div className="affiliate-empty">
                Chưa có chương trình đang hoạt động.
              </div>
            )}
          </section>
          <Pagination
            page={programPage}
            totalPages={programTotalPages}
            onChange={(page) => {
              setLoading(true);
              setProgramPage(page);
            }}
          />
        </>
      )}

      {!loading &&
        tab === "member" &&
        (!loggedIn ? (
          <LoginPrompt onLogin={() => navigate("/auth")} />
        ) : (
          <section className="affiliate-workspace">
            <aside className="affiliate-sidebar">
              <h2>Tài khoản của tôi</h2>
              {accounts.map((account) => (
                <button
                  key={account.id}
                  className={
                    selectedAccountId === account.id ? "active" : ""
                  }
                  onClick={() => selectAccount(account.id)}
                >
                  <strong>{account.programName}</strong>
                  <span>
                    {account.parentAccountId
                      ? "Có người giới thiệu"
                      : "Tham gia trực tiếp"}
                  </span>
                </button>
              ))}
              {accounts.length === 0 && (
                <p>Bạn chưa tham gia chương trình nào.</p>
              )}
            </aside>
            <div className="affiliate-content">
              {summary && (
                <div className="affiliate-metrics">
                  <Metric
                    label="Lượt ghi nhận"
                    value={String(summary.totalConversions)}
                  />
                  <Metric
                    label="Chờ hoàn tất"
                    value={formatVnd(summary.pendingCommissionAmount)}
                  />
                  <Metric
                    label="Đang giữ"
                    value={formatVnd(summary.lockedCommissionAmount)}
                  />
                  <Metric
                    label="Đã trả"
                    value={formatVnd(summary.paidCommissionAmount)}
                  />
                  <Metric
                    label="Đã hủy"
                    value={formatVnd(summary.cancelledCommissionAmount)}
                  />
                </div>
              )}
              <div className="affiliate-panel">
                <div className="affiliate-panel-title">
                  <div>
                    <h2>Link và mã của bạn</h2>
                    <p>
                      Mã của bạn nhận Tầng 1; cha trực tiếp nhận Tầng 2.
                    </p>
                  </div>
                </div>
                <form className="affiliate-inline-form" onSubmit={submitCode}>
                  <input
                    pattern="[a-z0-9-]+"
                    value={newCode}
                    onChange={(event) => setNewCode(event.target.value)}
                    placeholder="vd: minh-anh-01"
                  />
                  <button disabled={submitting}>Tạo mã</button>
                </form>
                <div className="affiliate-code-list">
                  {codes.map((code) => (
                    <div key={code.id}>
                      <div>
                        <Link2 size={16} />
                        <strong>{code.code}</strong>
                      </div>
                      <button onClick={() => void copyLink(code.code)}>
                        <Copy size={15} /> Sao chép link
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="affiliate-panel">
                <h2>Lịch sử hoa hồng</h2>
                <div className="affiliate-table">
                  <div className="affiliate-table-head">
                    <span>Ghi nhận</span>
                    <span>Tầng</span>
                    <span>Trạng thái</span>
                    <span>Khả dụng</span>
                    <span>Số tiền</span>
                  </div>
                  {commissions.map((entry) => (
                    <div className="affiliate-table-row" key={entry.id}>
                      <span>{formatDate(entry.createdAt)}</span>
                      <span>Tầng {entry.tierLevel ?? "-"}</span>
                      <span
                        className={`status-${entry.commissionStatus.toLowerCase()}`}
                      >
                        {statusLabel[entry.commissionStatus] ??
                          entry.commissionStatus}
                      </span>
                      <span>
                        {entry.availableAt
                          ? formatDate(entry.availableAt)
                          : "—"}
                      </span>
                      <strong>{formatVnd(entry.amount)}</strong>
                    </div>
                  ))}
                  {selectedAccountId && commissions.length === 0 && (
                    <p>Chưa có hoa hồng.</p>
                  )}
                </div>
                <Pagination
                  page={commissionPage}
                  totalPages={commissionTotalPages}
                  onChange={setCommissionPage}
                />
              </div>
            </div>
          </section>
        ))}
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function Pagination({
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
    <div className="affiliate-pagination" aria-label="Phân trang">
      <button disabled={page <= 1} onClick={() => onChange(page - 1)}>
        Trước
      </button>
      <span>
        Trang {page} / {totalPages}
      </span>
      <button
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
      >
        Sau
      </button>
    </div>
  );
}

function LoginPrompt({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="affiliate-empty">
      <h2>Đăng nhập để tiếp tục</h2>
      <p>Theo dõi hoa hồng và tạo mã affiliate của bạn.</p>
      <button onClick={onLogin}>Đăng nhập</button>
    </div>
  );
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("vi-VN");
}
