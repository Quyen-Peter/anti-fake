import { useEffect, useMemo, useState } from "react";
import {
  BadgeDollarSign,
  CheckCircle2,
  Clock3,
  Copy,
  Link2,
  MousePointerClick,
  RefreshCw,
  Store,
  WalletCards,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import {
  AffiliateKpiGrid,
  AffiliatePageHeader,
  AffiliatePagination,
  AffiliateSectionState,
  AffiliateStatusBadge,
} from "../../components/affiliate/dashboardPrimitives";
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
import "../../css/pages/affiliateCenter.css";

type Tab = "marketplace" | "member";
const PROGRAM_PAGE_SIZE = 12;
const COMMISSION_PAGE_SIZE = 15;

const scopeLabel: Record<AffiliateProgram["scopeType"], string> = {
  PLATFORM: "Nền tảng",
  SHOP: "Toàn shop",
  BRAND: "Thương hiệu",
  OFFER: "Sản phẩm",
};

const errorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

const formatDate = (value?: string | null) =>
  value ? new Date(value).toLocaleDateString("vi-VN") : "—";

export default function AffiliatePage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab: Tab = searchParams.get("tab") === "member" ? "member" : "marketplace";
  const loggedIn = Boolean(getToken());
  const [programs, setPrograms] = useState<AffiliateProgram[]>([]);
  const [programPage, setProgramPage] = useState(1);
  const [programTotalPages, setProgramTotalPages] = useState(0);
  const [programLoading, setProgramLoading] = useState(true);
  const [programError, setProgramError] = useState("");
  const [accounts, setAccounts] = useState<AffiliateAccount[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState("");
  const [accountsLoading, setAccountsLoading] = useState(false);
  const [accountsError, setAccountsError] = useState("");
  const [summary, setSummary] = useState<AffiliateAccountSummary | null>(null);
  const [codes, setCodes] = useState<AffiliateCode[]>([]);
  const [workspaceLoading, setWorkspaceLoading] = useState(false);
  const [workspaceError, setWorkspaceError] = useState("");
  const [commissions, setCommissions] = useState<AffiliateCommission[]>([]);
  const [commissionPage, setCommissionPage] = useState(1);
  const [commissionTotalPages, setCommissionTotalPages] = useState(0);
  const [commissionLoading, setCommissionLoading] = useState(false);
  const [commissionError, setCommissionError] = useState("");
  const [referralCodes, setReferralCodes] = useState<Record<string, string>>({});
  const [newCode, setNewCode] = useState("");
  const [landingPath, setLandingPath] = useState("");
  const [submittingId, setSubmittingId] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const selectTab = (nextTab: Tab) => {
    const nextParams = new URLSearchParams(searchParams);
    if (nextTab === "member") nextParams.set("tab", "member");
    else nextParams.delete("tab");
    setSearchParams(nextParams);
  };

  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      setProgramLoading(true);
      setProgramError("");
    });
    void fetchActiveAffiliatePrograms(programPage, PROGRAM_PAGE_SIZE)
      .then((result) => {
        if (!active) return;
        setPrograms(result.items);
        setProgramTotalPages(result.totalPages);
      })
      .catch((error) => {
        if (active) setProgramError(errorMessage(error, "Không thể tải chương trình Affiliate."));
      })
      .finally(() => {
        if (active) setProgramLoading(false);
      });
    return () => {
      active = false;
    };
  }, [programPage, refreshKey]);

  useEffect(() => {
    if (!loggedIn) return;
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      setAccountsLoading(true);
      setAccountsError("");
    });
    void fetchMyAffiliateAccounts()
      .then((result) => {
        if (!active) return;
        setAccounts(result);
        setSelectedAccountId((current) =>
          result.some((account) => account.id === current) ? current : (result[0]?.id ?? ""),
        );
        const firstProgram = result[0]?.program;
        setLandingPath((current) =>
          current ||
          (firstProgram?.scopeType === "OFFER" && firstProgram.offerId
            ? `/product/${firstProgram.offerId}`
            : firstProgram?.ownerShopId
              ? `/shop/${firstProgram.ownerShopId}`
              : "/"),
        );
      })
      .catch((error) => {
        if (active) setAccountsError(errorMessage(error, "Không thể tải tài khoản Affiliate."));
      })
      .finally(() => {
        if (active) setAccountsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [loggedIn, refreshKey]);

  useEffect(() => {
    if (!selectedAccountId) {
      queueMicrotask(() => {
        setSummary(null);
        setCodes([]);
      });
      return;
    }
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      setWorkspaceLoading(true);
      setWorkspaceError("");
    });
    void Promise.all([
      fetchAffiliateAccountSummary(selectedAccountId),
      fetchAffiliateCodes(selectedAccountId),
    ])
      .then(([nextSummary, nextCodes]) => {
        if (!active) return;
        setSummary(nextSummary);
        setCodes(nextCodes);
      })
      .catch((error) => {
        if (active) setWorkspaceError(errorMessage(error, "Không thể tải dữ liệu Affiliate."));
      })
      .finally(() => {
        if (active) setWorkspaceLoading(false);
      });
    return () => {
      active = false;
    };
  }, [selectedAccountId, refreshKey]);

  useEffect(() => {
    if (!selectedAccountId) {
      queueMicrotask(() => setCommissions([]));
      return;
    }
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      setCommissionLoading(true);
      setCommissionError("");
    });
    void fetchAffiliateCommissions(selectedAccountId, commissionPage, COMMISSION_PAGE_SIZE)
      .then((result) => {
        if (!active) return;
        setCommissions(result.items);
        setCommissionTotalPages(result.totalPages);
      })
      .catch((error) => {
        if (active) setCommissionError(errorMessage(error, "Không thể tải lịch sử hoa hồng."));
      })
      .finally(() => {
        if (active) setCommissionLoading(false);
      });
    return () => {
      active = false;
    };
  }, [selectedAccountId, commissionPage, refreshKey]);

  const selectedAccount = useMemo(
    () => accounts.find((account) => account.id === selectedAccountId),
    [accounts, selectedAccountId],
  );
  const joinedProgramIds = useMemo(
    () => new Set(accounts.map((account) => account.programId)),
    [accounts],
  );

  const refresh = () => setRefreshKey((current) => current + 1);

  const joinProgram = async (programId: string) => {
    if (!loggedIn) {
      navigate("/auth");
      return;
    }
    setSubmittingId(programId);
    try {
      await joinAffiliateProgram(programId, referralCodes[programId]?.trim());
      toast.success("Đã tham gia chương trình Affiliate.");
      refresh();
      selectTab("member");
    } catch (error) {
      toast.error(errorMessage(error, "Không thể tham gia chương trình."));
    } finally {
      setSubmittingId("");
    }
  };

  const submitCode = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedAccountId || !newCode.trim()) return;
    setSubmittingId("code");
    try {
      const absoluteLandingUrl = new URL(landingPath || "/", window.location.origin).toString();
      await createAffiliateCode(selectedAccountId, newCode.trim().toLowerCase(), {
        landingUrl: absoluteLandingUrl,
        isDefault: codes.length === 0,
      });
      setCodes(await fetchAffiliateCodes(selectedAccountId));
      setNewCode("");
      toast.success("Đã tạo mã Affiliate.");
    } catch (error) {
      toast.error(errorMessage(error, "Không thể tạo mã Affiliate."));
    } finally {
      setSubmittingId("");
    }
  };

  const copyLink = async (code: AffiliateCode) => {
    const destination = code.landingUrl || `${window.location.origin}${landingPath || "/"}`;
    const url = new URL(destination, window.location.origin);
    url.searchParams.set("aff", code.code);
    await navigator.clipboard.writeText(url.toString());
    toast.success("Đã sao chép link Affiliate.");
  };

  return (
    <main className="affiliate-dashboard affiliate-center">
      <div className="affiliate-dashboard-inner">
        <AffiliatePageHeader
          eyebrow="AFFILIATE CENTER"
          title="Quản lý hoạt động giới thiệu"
          description="Tham gia chương trình, tạo link và theo dõi hoa hồng tại một nơi."
          actions={
            <button type="button" className="affiliate-button secondary" onClick={refresh}>
              <RefreshCw size={16} /> Làm mới
            </button>
          }
        />

        <nav className="affiliate-center-tabs" aria-label="Khu vực Affiliate">
          <button
            type="button"
            className={tab === "marketplace" ? "active" : ""}
            onClick={() => selectTab("marketplace")}
          >
            <Store size={17} /> Khám phá chương trình
          </button>
          <button
            type="button"
            className={tab === "member" ? "active" : ""}
            onClick={() => selectTab("member")}
          >
            <WalletCards size={17} /> Affiliate của tôi
          </button>
        </nav>

        {tab === "marketplace" ? (
          <MarketplacePrograms
            programs={programs}
            loading={programLoading}
            error={programError}
            page={programPage}
            totalPages={programTotalPages}
            joinedProgramIds={joinedProgramIds}
            referralCodes={referralCodes}
            submittingId={submittingId}
            onReferralCodeChange={(programId, code) =>
              setReferralCodes((current) => ({ ...current, [programId]: code }))
            }
            onJoin={(programId) => void joinProgram(programId)}
            onPageChange={setProgramPage}
            onRetry={refresh}
          />
        ) : !loggedIn ? (
          <section className="affiliate-panel affiliate-login-panel">
            <WalletCards size={32} />
            <h2>Đăng nhập để quản lý Affiliate</h2>
            <p>Theo dõi hoa hồng, chương trình đã tham gia và link giới thiệu của bạn.</p>
            <button type="button" className="affiliate-button" onClick={() => navigate("/auth")}>
              Đăng nhập
            </button>
          </section>
        ) : (
          <MemberDashboard
            accounts={accounts}
            selectedAccount={selectedAccount}
            selectedAccountId={selectedAccountId}
            accountsLoading={accountsLoading}
            accountsError={accountsError}
            summary={summary}
            codes={codes}
            workspaceLoading={workspaceLoading}
            workspaceError={workspaceError}
            commissions={commissions}
            commissionPage={commissionPage}
            commissionTotalPages={commissionTotalPages}
            commissionLoading={commissionLoading}
            commissionError={commissionError}
            newCode={newCode}
            landingPath={landingPath}
            submitting={submittingId === "code"}
            onSelectAccount={(accountId) => {
              setSelectedAccountId(accountId);
              setCommissionPage(1);
              const program = accounts.find((account) => account.id === accountId)?.program;
              setLandingPath(
                program?.scopeType === "OFFER" && program.offerId
                  ? `/product/${program.offerId}`
                  : program?.ownerShopId
                    ? `/shop/${program.ownerShopId}`
                    : "/",
              );
            }}
            onExplore={() => selectTab("marketplace")}
            onNewCodeChange={setNewCode}
            onSubmitCode={submitCode}
            onCopyCode={(code) => void copyLink(code)}
            onCommissionPageChange={setCommissionPage}
            onRetry={refresh}
          />
        )}
      </div>
    </main>
  );
}

function MarketplacePrograms({
  programs,
  loading,
  error,
  page,
  totalPages,
  joinedProgramIds,
  referralCodes,
  submittingId,
  onReferralCodeChange,
  onJoin,
  onPageChange,
  onRetry,
}: {
  programs: AffiliateProgram[];
  loading: boolean;
  error: string;
  page: number;
  totalPages: number;
  joinedProgramIds: Set<string>;
  referralCodes: Record<string, string>;
  submittingId: string;
  onReferralCodeChange: (programId: string, code: string) => void;
  onJoin: (programId: string) => void;
  onPageChange: (page: number) => void;
  onRetry: () => void;
}) {
  return (
    <section className="affiliate-panel">
      <div className="affiliate-panel-header">
        <div>
          <h2>Chương trình đang mở</h2>
          <p>So sánh phạm vi, tỷ lệ và thời gian giữ trước khi tham gia.</p>
        </div>
      </div>
      <AffiliateSectionState
        loading={loading}
        error={error}
        empty={!loading && !error && programs.length === 0}
        emptyTitle="Chưa có chương trình đang hoạt động"
        emptyDescription="Các chương trình mới sẽ xuất hiện tại đây."
        onRetry={onRetry}
      />
      {!loading && !error && programs.length > 0 && (
        <div className="affiliate-program-list">
          {programs.map((program) => {
            const joined = joinedProgramIds.has(program.id);
            return (
              <article className="affiliate-marketplace-row" key={program.id}>
                <div className="affiliate-program-main">
                  <div>
                    <span className="affiliate-scope">{scopeLabel[program.scopeType]}</span>
                    <small>{program.ownerShopName ?? "Nền tảng"}</small>
                  </div>
                  <h3>{program.name}</h3>
                  <p>{program.offerTitle ?? program.brandName ?? "Áp dụng cho sản phẩm của shop"}</p>
                </div>
                <dl className="affiliate-program-rates">
                  <div><dt>Tầng 1</dt><dd>{program.tier1Rate}%</dd></div>
                  <div><dt>Tầng 2</dt><dd>{program.tier2Rate}%</dd></div>
                  <div><dt>Thời gian giữ</dt><dd>{program.commissionHoldDays} ngày</dd></div>
                </dl>
                <div className="affiliate-join-control">
                  {joined ? (
                    <span className="affiliate-joined"><CheckCircle2 size={16} /> Đã tham gia</span>
                  ) : (
                    <>
                      <input
                        aria-label={`Mã người giới thiệu cho ${program.name}`}
                        value={referralCodes[program.id] ?? ""}
                        onChange={(event) => onReferralCodeChange(program.id, event.target.value)}
                        placeholder="Mã giới thiệu (nếu có)"
                      />
                      <button
                        type="button"
                        className="affiliate-button"
                        disabled={Boolean(submittingId)}
                        onClick={() => onJoin(program.id)}
                      >
                        {submittingId === program.id ? "Đang tham gia..." : "Tham gia"}
                      </button>
                    </>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
      <AffiliatePagination page={page} totalPages={totalPages} onChange={onPageChange} />
    </section>
  );
}

function MemberDashboard({
  accounts,
  selectedAccount,
  selectedAccountId,
  accountsLoading,
  accountsError,
  summary,
  codes,
  workspaceLoading,
  workspaceError,
  commissions,
  commissionPage,
  commissionTotalPages,
  commissionLoading,
  commissionError,
  newCode,
  landingPath,
  submitting,
  onSelectAccount,
  onExplore,
  onNewCodeChange,
  onSubmitCode,
  onCopyCode,
  onCommissionPageChange,
  onRetry,
}: {
  accounts: AffiliateAccount[];
  selectedAccount?: AffiliateAccount;
  selectedAccountId: string;
  accountsLoading: boolean;
  accountsError: string;
  summary: AffiliateAccountSummary | null;
  codes: AffiliateCode[];
  workspaceLoading: boolean;
  workspaceError: string;
  commissions: AffiliateCommission[];
  commissionPage: number;
  commissionTotalPages: number;
  commissionLoading: boolean;
  commissionError: string;
  newCode: string;
  landingPath: string;
  submitting: boolean;
  onSelectAccount: (accountId: string) => void;
  onExplore: () => void;
  onNewCodeChange: (value: string) => void;
  onSubmitCode: (event: React.FormEvent) => void;
  onCopyCode: (code: AffiliateCode) => void;
  onCommissionPageChange: (page: number) => void;
  onRetry: () => void;
}) {
  if (accountsLoading || accountsError || accounts.length === 0) {
    return (
      <section className="affiliate-panel">
        <AffiliateSectionState
          loading={accountsLoading}
          error={accountsError}
          empty={!accountsLoading && !accountsError && accounts.length === 0}
          emptyTitle="Bạn chưa tham gia chương trình nào"
          emptyDescription="Khám phá chương trình phù hợp để bắt đầu tạo link giới thiệu."
          onRetry={accountsError ? onRetry : undefined}
        />
        {!accountsLoading && !accountsError && accounts.length === 0 && (
          <div className="affiliate-empty-action">
            <button type="button" className="affiliate-button" onClick={onExplore}>
              Khám phá chương trình
            </button>
          </div>
        )}
      </section>
    );
  }

  return (
    <div className="affiliate-member-dashboard">
      <div className="affiliate-account-bar">
        <label>
          <span>Chương trình đang xem</span>
          <select value={selectedAccountId} onChange={(event) => onSelectAccount(event.target.value)}>
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>{account.programName}</option>
            ))}
          </select>
        </label>
        {selectedAccount && (
          <div>
            <AffiliateStatusBadge status={selectedAccount.accountStatus} />
            <span>{selectedAccount.program?.ownerShopName ?? "Chương trình Affiliate"}</span>
          </div>
        )}
      </div>

      <AffiliateSectionState loading={workspaceLoading} error={workspaceError} onRetry={onRetry} />
      {!workspaceLoading && !workspaceError && summary && (
        <>
          <AffiliateKpiGrid
            items={[
              { label: "Lượt chuyển đổi", value: String(summary.totalConversions), icon: <MousePointerClick size={19} /> },
              { label: "Tổng hoa hồng", value: formatVnd(summary.totalCommissionAmount), icon: <BadgeDollarSign size={19} /> },
              { label: "Chờ hoàn tất", value: formatVnd(summary.pendingCommissionAmount), icon: <Clock3 size={19} /> },
              { label: "Đang giữ", value: formatVnd(summary.lockedCommissionAmount), icon: <Clock3 size={19} /> },
              { label: "Đã trả", value: formatVnd(summary.paidCommissionAmount), icon: <WalletCards size={19} /> },
            ]}
          />

          <div className="affiliate-member-grid">
            <section className="affiliate-panel affiliate-program-overview">
              <div className="affiliate-panel-header">
                <div><h2>Chương trình đang tham gia</h2><p>Điều kiện thương mại do shop thiết lập.</p></div>
              </div>
              <dl>
                <div><dt>Chương trình</dt><dd>{selectedAccount?.programName}</dd></div>
                <div><dt>Phạm vi</dt><dd>{selectedAccount?.program ? scopeLabel[selectedAccount.program.scopeType] : "—"}</dd></div>
                <div><dt>Tầng 1 / Tầng 2</dt><dd>{selectedAccount?.program ? `${selectedAccount.program.tier1Rate}% / ${selectedAccount.program.tier2Rate}%` : "—"}</dd></div>
                <div><dt>Thời gian giữ</dt><dd>{selectedAccount?.program ? `${selectedAccount.program.commissionHoldDays} ngày` : "—"}</dd></div>
                <div><dt>Ngày tham gia</dt><dd>{formatDate(selectedAccount?.joinedAt)}</dd></div>
              </dl>
            </section>

            <section className="affiliate-panel affiliate-link-tool">
              <div className="affiliate-panel-header">
                <div><h2>Công cụ tạo link</h2><p>Tạo mã dễ nhớ và chọn đúng trang đích.</p></div>
              </div>
              <form className="affiliate-link-form" onSubmit={onSubmitCode}>
                <label>
                  <span>Mã giới thiệu</span>
                  <input
                    required
                    minLength={3}
                    maxLength={40}
                    pattern="[a-zA-Z0-9-]+"
                    value={newCode}
                    onChange={(event) => onNewCodeChange(event.target.value)}
                    placeholder="vd: minh-anh-01"
                  />
                </label>
                <label>
                  <span>Trang đích</span>
                  <input
                    required
                    readOnly
                    value={landingPath}
                    placeholder="/product/... hoặc /shop/..."
                  />
                </label>
                <button className="affiliate-button" disabled={submitting}>
                  <Link2 size={16} /> {submitting ? "Đang tạo..." : "Tạo mã"}
                </button>
              </form>
              <div className="affiliate-code-list">
                {codes.map((code) => (
                  <div key={code.id}>
                    <span><Link2 size={15} /><strong>{code.code}</strong>{code.isDefault && <small>Mặc định</small>}</span>
                    <button type="button" onClick={() => onCopyCode(code)}><Copy size={15} /> Sao chép</button>
                  </div>
                ))}
                {codes.length === 0 && <p>Chưa có mã giới thiệu. Tạo mã đầu tiên để chia sẻ.</p>}
              </div>
            </section>
          </div>
        </>
      )}

      <section className="affiliate-panel affiliate-commission-panel">
        <div className="affiliate-panel-header">
          <div><h2>Lịch sử hoa hồng</h2><p>Trạng thái và thời điểm khả dụng do backend đối soát.</p></div>
        </div>
        <AffiliateSectionState
          loading={commissionLoading}
          error={commissionError}
          empty={!commissionLoading && !commissionError && commissions.length === 0}
          emptyTitle="Chưa có hoa hồng"
          emptyDescription="Chuyển đổi hợp lệ sẽ được ghi nhận tại đây."
          onRetry={onRetry}
        />
        {!commissionLoading && !commissionError && commissions.length > 0 && (
          <div className="affiliate-table-wrap">
            <table className="affiliate-data-table">
              <thead><tr><th>Ghi nhận</th><th>Tầng</th><th>Trạng thái</th><th>Khả dụng</th><th className="numeric">Số tiền</th></tr></thead>
              <tbody>
                {commissions.map((entry) => (
                  <tr key={entry.id}>
                    <td data-label="Ghi nhận">{formatDate(entry.createdAt)}</td>
                    <td data-label="Tầng">Tầng {entry.tierLevel ?? "—"}</td>
                    <td data-label="Trạng thái"><AffiliateStatusBadge status={entry.commissionStatus} /></td>
                    <td data-label="Khả dụng">{formatDate(entry.availableAt)}</td>
                    <td data-label="Số tiền" className="numeric"><strong>{formatVnd(entry.amount, entry.currency)}</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <AffiliatePagination page={commissionPage} totalPages={commissionTotalPages} onChange={onCommissionPageChange} />
      </section>
    </div>
  );
}
