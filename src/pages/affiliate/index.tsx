import { useEffect, useMemo, useState } from "react";
import { Copy, Link2, RefreshCw, Store, Users, WalletCards } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  createAffiliateCode,
  createAffiliateProgram,
  fetchActiveAffiliatePrograms,
  fetchAffiliateAccountSummary,
  fetchAffiliateCodes,
  fetchAffiliateCommissions,
  fetchAffiliateProgramMembers,
  fetchMyAffiliateAccounts,
  fetchMyAffiliatePrograms,
  joinAffiliateProgram,
  type AffiliateAccount,
  type AffiliateAccountSummary,
  type AffiliateCode,
  type AffiliateCommission,
  type AffiliateProgram,
  type AffiliateProgramMember,
} from "../../services/affiliate.api";
import {
  fetchShopBrandAuthorizations,
  fetchShopOffers,
  getMyShop,
  type ShopBrandAuthorization,
  type ShopOffer,
} from "../../services/shop.api";
import { getToken } from "../../ultil/auth";
import { formatVnd } from "../../ultil/currency";
import "../../css/pages/affiliate.css";

type Tab = "marketplace" | "member" | "shop";

const PROGRAM_PAGE_SIZE = 12;
const COMMISSION_PAGE_SIZE = 15;
const MEMBER_PAGE_SIZE = 20;

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
  const loggedIn = Boolean(getToken());
  const [tab, setTab] = useState<Tab>("marketplace");
  const [programs, setPrograms] = useState<AffiliateProgram[]>([]);
  const [programPage, setProgramPage] = useState(1);
  const [programTotalPages, setProgramTotalPages] = useState(0);
  const [accounts, setAccounts] = useState<AffiliateAccount[]>([]);
  const [ownedPrograms, setOwnedPrograms] = useState<AffiliateProgram[]>([]);
  const [shopId, setShopId] = useState("");
  const [brands, setBrands] = useState<ShopBrandAuthorization[]>([]);
  const [offers, setOffers] = useState<ShopOffer[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState("");
  const [summary, setSummary] = useState<AffiliateAccountSummary | null>(null);
  const [codes, setCodes] = useState<AffiliateCode[]>([]);
  const [commissions, setCommissions] = useState<AffiliateCommission[]>([]);
  const [commissionPage, setCommissionPage] = useState(1);
  const [commissionTotalPages, setCommissionTotalPages] = useState(0);
  const [selectedProgramId, setSelectedProgramId] = useState("");
  const [members, setMembers] = useState<AffiliateProgramMember[]>([]);
  const [memberPage, setMemberPage] = useState(1);
  const [memberTotalPages, setMemberTotalPages] = useState(0);
  const [referralCodes, setReferralCodes] = useState<Record<string, string>>({});
  const [newCode, setNewCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [programForm, setProgramForm] = useState({
    name: "",
    slug: "",
    scopeType: "SHOP" as "SHOP" | "BRAND" | "OFFER",
    brandId: "",
    offerId: "",
    tier1Rate: "6",
    tier2Rate: "2",
    attributionWindowDays: "30",
    commissionHoldDays: "7",
  });

  useEffect(() => {
    let active = true;
    void fetchActiveAffiliatePrograms(programPage, PROGRAM_PAGE_SIZE)
      .then((result) => {
        if (!active) return;
        setPrograms(result.items);
        setProgramTotalPages(result.totalPages);
      })
      .catch((error) => {
        if (active) toast.error(error instanceof Error ? error.message : "Không thể tải chương trình affiliate");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [programPage, refreshKey]);

  useEffect(() => {
    let active = true;
    if (!loggedIn) {
      return () => { active = false; };
    }

    void Promise.all([
      fetchMyAffiliateAccounts(),
      fetchMyAffiliatePrograms(),
      getMyShop().catch(() => null),
    ]).then(([myAccounts, myPrograms, shops]) => {
      if (!active) return;
      setAccounts(myAccounts);
      setOwnedPrograms(myPrograms);
      setSelectedAccountId((current) =>
        myAccounts.some((account) => account.id === current) ? current : myAccounts[0]?.id ?? "",
      );
      setSelectedProgramId((current) =>
        myPrograms.some((program) => program.id === current) ? current : myPrograms[0]?.id ?? "",
      );
      const verifiedShop = shops?.find((shop) => shop.shopStatus === "verified");
      setShopId(verifiedShop?.id ?? "");
      if (!verifiedShop) {
        setBrands([]);
        setOffers([]);
      }
      if (myAccounts.length === 0) {
        setSummary(null);
        setCodes([]);
        setCommissions([]);
      }
    }).catch((error) => {
      if (active) toast.error(error instanceof Error ? error.message : "Không thể tải Affiliate Center");
    });

    return () => { active = false; };
  }, [loggedIn, refreshKey]);

  useEffect(() => {
    let active = true;
    if (!shopId) {
      return () => { active = false; };
    }

    void Promise.all([
      fetchShopBrandAuthorizations(shopId),
      fetchShopOffers(shopId, {
        page: 1,
        pageSize: 100,
        offerStatus: "active",
        moderationStatus: "approved",
      }),
    ]).then(([authorizations, shopOffers]) => {
      if (!active) return;
      setBrands(authorizations.filter((authorization) => authorization.verificationStatus === "approved"));
      setOffers(shopOffers.items);
    }).catch((error) => {
      if (active) toast.error(error instanceof Error ? error.message : "Không thể tải phạm vi bán hàng của shop");
    });

    return () => { active = false; };
  }, [shopId, refreshKey]);

  useEffect(() => {
    let active = true;
    if (!selectedAccountId) {
      return () => { active = false; };
    }

    void Promise.all([
      fetchAffiliateAccountSummary(selectedAccountId),
      fetchAffiliateCodes(selectedAccountId),
    ]).then(([nextSummary, nextCodes]) => {
      if (!active) return;
      setSummary(nextSummary);
      setCodes(nextCodes);
    }).catch((error) => {
      if (active) toast.error(error instanceof Error ? error.message : "Không thể tải dữ liệu affiliate");
    });

    return () => { active = false; };
  }, [selectedAccountId, refreshKey]);

  useEffect(() => {
    let active = true;
    if (!selectedAccountId) {
      return () => { active = false; };
    }

    void fetchAffiliateCommissions(selectedAccountId, commissionPage, COMMISSION_PAGE_SIZE)
      .then((result) => {
        if (!active) return;
        setCommissions(result.items);
        setCommissionTotalPages(result.totalPages);
      })
      .catch((error) => {
        if (active) toast.error(error instanceof Error ? error.message : "Không thể tải lịch sử hoa hồng");
      });

    return () => { active = false; };
  }, [selectedAccountId, commissionPage, refreshKey]);

  useEffect(() => {
    let active = true;
    if (!selectedProgramId) {
      return () => { active = false; };
    }

    void fetchAffiliateProgramMembers(selectedProgramId, memberPage, MEMBER_PAGE_SIZE)
      .then((result) => {
        if (!active) return;
        setMembers(result.items);
        setMemberTotalPages(result.totalPages);
      })
      .catch((error) => {
        if (active) toast.error(error instanceof Error ? error.message : "Không thể tải mạng lưới affiliate");
      });

    return () => { active = false; };
  }, [selectedProgramId, memberPage, refreshKey]);

  const joinedProgramIds = useMemo(
    () => new Set(accounts.map((account) => account.programId)),
    [accounts],
  );

  const refresh = () => {
    setLoading(true);
    setRefreshKey((current) => current + 1);
  };

  const changeProgramPage = (page: number) => {
    setLoading(true);
    setProgramPage(page);
  };

  const selectAccount = (accountId: string) => {
    setSelectedAccountId(accountId);
    setCommissionPage(1);
    setSummary(null);
    setCodes([]);
    setCommissions([]);
  };

  const selectProgram = (programId: string) => {
    setSelectedProgramId(programId);
    setMemberPage(1);
    setMembers([]);
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
      setTab("member");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không thể tham gia chương trình");
    } finally {
      setSubmitting(false);
    }
  };

  const submitProgram = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!shopId) {
      toast.error("Bạn cần một shop đã được phê duyệt");
      return;
    }
    const tier1Rate = Number(programForm.tier1Rate);
    const tier2Rate = Number(programForm.tier2Rate);
    if (tier1Rate <= 0 || tier2Rate > tier1Rate || tier1Rate + tier2Rate > 100) {
      toast.error("Tầng 1 phải lớn hơn 0; Tầng 2 không vượt Tầng 1; tổng tỷ lệ không vượt 100%");
      return;
    }

    setSubmitting(true);
    try {
      await createAffiliateProgram({
        ownerShopId: shopId,
        scopeType: programForm.scopeType,
        name: programForm.name,
        slug: programForm.slug,
        brandId: programForm.scopeType === "BRAND" ? programForm.brandId : undefined,
        offerId: programForm.scopeType === "OFFER" ? programForm.offerId : undefined,
        tier1Rate,
        tier2Rate,
        attributionWindowDays: Number(programForm.attributionWindowDays),
        commissionHoldDays: Number(programForm.commissionHoldDays),
      });
      toast.success("Đã tạo chương trình affiliate");
      setProgramForm((current) => ({ ...current, name: "", slug: "" }));
      refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không thể tạo chương trình");
    } finally {
      setSubmitting(false);
    }
  };

  const submitCode = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedAccountId || !newCode.trim()) return;
    setSubmitting(true);
    try {
      await createAffiliateCode(selectedAccountId, newCode.trim().toLowerCase());
      setCodes(await fetchAffiliateCodes(selectedAccountId));
      setNewCode("");
      toast.success("Đã tạo mã affiliate");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không thể tạo mã");
    } finally {
      setSubmitting(false);
    }
  };

  const copyLink = async (code: string) => {
    await navigator.clipboard.writeText(`${window.location.origin}/?aff=${encodeURIComponent(code)}`);
    toast.success("Đã sao chép link affiliate");
  };

  return (
    <main className="affiliate-page" style={{ paddingTop: 82 }}>
      <section className="affiliate-hero">
        <div>
          <p className="affiliate-eyebrow">AFFILIATE CENTER</p>
          <h1>Chia sẻ đúng sản phẩm.<br />Nhận hoa hồng minh bạch.</h1>
          <p>Shop đã xác minh tạo và chi trả chương trình. Chủ mã nhận Tầng 1; người giới thiệu trực tiếp chủ mã nhận Tầng 2.</p>
        </div>
        <div className="affiliate-flow">
          <span>Khách đặt hàng</span><b>→</b>
          <span>Giữ theo cấu hình shop</span><b>→</b>
          <span>Ví affiliate</span>
        </div>
      </section>

      <nav className="affiliate-tabs" aria-label="Khu vực affiliate">
        <button className={tab === "marketplace" ? "active" : ""} onClick={() => setTab("marketplace")}><Store size={17} /> Chương trình</button>
        <button className={tab === "member" ? "active" : ""} onClick={() => setTab("member")}><WalletCards size={17} /> Kiếm tiền</button>
        <button className={tab === "shop" ? "active" : ""} onClick={() => setTab("shop")}><Users size={17} /> Dành cho shop</button>
        <button className="affiliate-refresh" onClick={refresh} aria-label="Làm mới"><RefreshCw size={17} /></button>
      </nav>

      {loading && <div className="affiliate-empty">Đang tải Affiliate Center...</div>}

      {!loading && tab === "marketplace" && (
        <>
          <section className="affiliate-program-grid">
            {programs.map((program) => (
              <article className="affiliate-program-card" key={program.id}>
                <div className="affiliate-card-top"><span>{scopeLabel[program.scopeType]}</span><small>{program.ownerShopName ?? "Nền tảng"}</small></div>
                <h2>{program.name}</h2>
                <p>{program.offerTitle ?? program.brandName ?? "Áp dụng cho sản phẩm của shop"}</p>
                <div className="affiliate-rate-row">
                  <div><strong>{program.tier1Rate}%</strong><span>Tầng 1</span></div>
                  <div><strong>{program.tier2Rate}%</strong><span>Tầng 2</span></div>
                  <div><strong>{program.commissionHoldDays} ngày</strong><span>Thời gian giữ</span></div>
                </div>
                {!joinedProgramIds.has(program.id) ? (
                  <div className="affiliate-join">
                    <input value={referralCodes[program.id] ?? ""} onChange={(event) => setReferralCodes((current) => ({ ...current, [program.id]: event.target.value }))} placeholder="Mã người giới thiệu (nếu có)" />
                    <button disabled={submitting} onClick={() => joinProgram(program.id)}>Tham gia</button>
                  </div>
                ) : <span className="affiliate-joined">Đã tham gia</span>}
              </article>
            ))}
            {programs.length === 0 && <div className="affiliate-empty">Chưa có chương trình đang hoạt động.</div>}
          </section>
          <Pagination page={programPage} totalPages={programTotalPages} onChange={changeProgramPage} />
        </>
      )}

      {!loading && tab === "member" && (!loggedIn ? (
        <LoginPrompt onLogin={() => navigate("/auth")} />
      ) : (
        <section className="affiliate-workspace">
          <aside className="affiliate-sidebar">
            <h2>Tài khoản của tôi</h2>
            {accounts.map((account) => (
              <button key={account.id} className={selectedAccountId === account.id ? "active" : ""} onClick={() => selectAccount(account.id)}>
                <strong>{account.programName}</strong>
                <span>{account.parentAccountId ? "Có người giới thiệu" : "Tham gia trực tiếp"}</span>
              </button>
            ))}
            {accounts.length === 0 && <p>Bạn chưa tham gia chương trình nào.</p>}
          </aside>
          <div className="affiliate-content">
            {summary && (
              <div className="affiliate-metrics">
                <Metric label="Lượt ghi nhận" value={String(summary.totalConversions)} />
                <Metric label="Chờ hoàn tất" value={formatVnd(summary.pendingCommissionAmount)} />
                <Metric label="Đang giữ" value={formatVnd(summary.lockedCommissionAmount)} />
                <Metric label="Đã trả" value={formatVnd(summary.paidCommissionAmount)} />
                <Metric label="Đã hủy" value={formatVnd(summary.cancelledCommissionAmount)} />
              </div>
            )}
            <div className="affiliate-panel">
              <div className="affiliate-panel-title"><div><h2>Link và mã của bạn</h2><p>Mã của bạn nhận Tầng 1; cha trực tiếp nhận Tầng 2.</p></div></div>
              <form className="affiliate-inline-form" onSubmit={submitCode}>
                <input pattern="[a-z0-9-]+" value={newCode} onChange={(event) => setNewCode(event.target.value)} placeholder="vd: minh-anh-01" />
                <button disabled={submitting}>Tạo mã</button>
              </form>
              <div className="affiliate-code-list">
                {codes.map((code) => <div key={code.id}><div><Link2 size={16} /><strong>{code.code}</strong></div><button onClick={() => copyLink(code.code)}><Copy size={15} /> Sao chép link</button></div>)}
              </div>
            </div>
            <div className="affiliate-panel">
              <h2>Lịch sử hoa hồng</h2>
              <div className="affiliate-table">
                <div className="affiliate-table-head"><span>Ghi nhận</span><span>Tầng</span><span>Trạng thái</span><span>Khả dụng</span><span>Số tiền</span></div>
                {commissions.map((entry) => (
                  <div className="affiliate-table-row" key={entry.id}>
                    <span>{formatDate(entry.createdAt)}</span>
                    <span>Tầng {entry.tierLevel ?? "-"}</span>
                    <span className={`status-${entry.commissionStatus.toLowerCase()}`}>{statusLabel[entry.commissionStatus] ?? entry.commissionStatus}</span>
                    <span>{entry.availableAt ? formatDate(entry.availableAt) : "—"}</span>
                    <strong>{formatVnd(entry.amount)}</strong>
                  </div>
                ))}
                {selectedAccountId && commissions.length === 0 && <p>Chưa có hoa hồng.</p>}
              </div>
              <Pagination page={commissionPage} totalPages={commissionTotalPages} onChange={setCommissionPage} />
            </div>
          </div>
        </section>
      ))}

      {!loading && tab === "shop" && (!loggedIn ? (
        <LoginPrompt onLogin={() => navigate("/auth")} />
      ) : (
        <section className="affiliate-shop-layout">
          <form className="affiliate-panel affiliate-program-form" onSubmit={submitProgram}>
            <div className="affiliate-panel-title"><div><p className="affiliate-eyebrow">SHOP FUNDED</p><h2>Tạo chương trình</h2></div></div>
            <p className="affiliate-funding-note">Hoa hồng được giữ từ phần shop thực nhận khi đơn hoàn tất, sau đó tự động chuyển vào ví affiliate khi hết thời gian giữ.</p>
            <label>Tên chương trình<input required value={programForm.name} onChange={(event) => setProgramForm((current) => ({ ...current, name: event.target.value, slug: slugify(event.target.value) }))} /></label>
            <label>Slug<input required pattern="[a-z0-9-]+" value={programForm.slug} onChange={(event) => setProgramForm((current) => ({ ...current, slug: event.target.value }))} /></label>
            <label>Phạm vi
              <select value={programForm.scopeType} onChange={(event) => setProgramForm((current) => ({ ...current, scopeType: event.target.value as typeof current.scopeType, brandId: "", offerId: "" }))}>
                <option value="SHOP">Toàn shop</option>
                <option value="BRAND">Thương hiệu được duyệt</option>
                <option value="OFFER">Một sản phẩm đang bán</option>
              </select>
            </label>
            {programForm.scopeType === "BRAND" && (
              <label>Thương hiệu
                <select required value={programForm.brandId} onChange={(event) => setProgramForm((current) => ({ ...current, brandId: event.target.value }))}>
                  <option value="">Chọn thương hiệu đã được duyệt</option>
                  {brands.map((brand) => <option value={brand.brandId} key={brand.id}>{brand.brandName ?? brand.brandId}</option>)}
                </select>
                {brands.length === 0 && <small>Shop chưa có thương hiệu được duyệt.</small>}
              </label>
            )}
            {programForm.scopeType === "OFFER" && (
              <label>Sản phẩm
                <select required value={programForm.offerId} onChange={(event) => setProgramForm((current) => ({ ...current, offerId: event.target.value }))}>
                  <option value="">Chọn sản phẩm đang bán</option>
                  {offers.map((offer) => <option value={offer.id} key={offer.id}>{offer.title}</option>)}
                </select>
                {offers.length === 0 && <small>Shop chưa có sản phẩm đang bán đã được duyệt.</small>}
              </label>
            )}
            <div className="affiliate-form-grid">
              <label>Tầng 1 (%)<input type="number" required min="0.01" max="100" step="0.01" value={programForm.tier1Rate} onChange={(event) => setProgramForm((current) => ({ ...current, tier1Rate: event.target.value }))} /></label>
              <label>Tầng 2 (%)<input type="number" required min="0" max="100" step="0.01" value={programForm.tier2Rate} onChange={(event) => setProgramForm((current) => ({ ...current, tier2Rate: event.target.value }))} /></label>
              <label>Cửa sổ ghi nhận<input type="number" required min="1" max="90" value={programForm.attributionWindowDays} onChange={(event) => setProgramForm((current) => ({ ...current, attributionWindowDays: event.target.value }))} /></label>
              <label>Giữ hoa hồng (ngày)<input type="number" required min="0" max="30" value={programForm.commissionHoldDays} onChange={(event) => setProgramForm((current) => ({ ...current, commissionHoldDays: event.target.value }))} /></label>
            </div>
            <button className="affiliate-primary" disabled={submitting || !shopId}>Tạo và kích hoạt</button>
            {!shopId && <small>Chỉ shop đã được phê duyệt mới tạo được chương trình.</small>}
          </form>

          <div className="affiliate-panel">
            <div className="affiliate-panel-title">
              <div><h2>Mạng lưới thành viên</h2><p>Cấp mạng lưới dùng để xem cây; tiền chỉ chi Tầng 1 và cha trực tiếp Tầng 2.</p></div>
              <select value={selectedProgramId} onChange={(event) => selectProgram(event.target.value)}>
                <option value="">Chọn chương trình</option>
                {ownedPrograms.map((program) => <option value={program.id} key={program.id}>{program.name}</option>)}
              </select>
            </div>
            <div className="affiliate-member-list">
              {members.map((member) => (
                <div key={member.accountId}>
                  <span className="affiliate-avatar">{member.displayName.slice(0, 1).toUpperCase()}</span>
                  <div><strong>{member.displayName}</strong><small>Cha trực tiếp: {member.parentDisplayName ?? "Không có"}</small></div>
                  <span>Cấp mạng lưới {member.networkDepth}</span>
                  <b>{statusLabel[member.accountStatus] ?? member.accountStatus}</b>
                </div>
              ))}
              {selectedProgramId && members.length === 0 && <p>Chưa có thành viên.</p>}
            </div>
            <Pagination page={memberPage} totalPages={memberTotalPages} onChange={setMemberPage} />
          </div>
        </section>
      ))}
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div><span>{label}</span><strong>{value}</strong></div>;
}

function Pagination({ page, totalPages, onChange }: { page: number; totalPages: number; onChange: (page: number) => void }) {
  if (totalPages <= 1) return null;
  return (
    <div className="affiliate-pagination" aria-label="Phân trang">
      <button disabled={page <= 1} onClick={() => onChange(page - 1)}>Trước</button>
      <span>Trang {page} / {totalPages}</span>
      <button disabled={page >= totalPages} onClick={() => onChange(page + 1)}>Sau</button>
    </div>
  );
}

function LoginPrompt({ onLogin }: { onLogin: () => void }) {
  return <div className="affiliate-empty"><h2>Đăng nhập để tiếp tục</h2><p>Theo dõi hoa hồng, tạo mã và quản lý chương trình của shop.</p><button onClick={onLogin}>Đăng nhập</button></div>;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("vi-VN");
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
