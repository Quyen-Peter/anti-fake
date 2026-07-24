import { useEffect, useMemo, useState } from "react";
import {
  BadgeDollarSign,
  ChartNoAxesCombined,
  Clock3,
  Edit3,
  Plus,
  RefreshCw,
  Search,
  Users,
  WalletCards,
} from "lucide-react";
import { toast } from "sonner";
import {
  AffiliateKpiGrid,
  AffiliatePageHeader,
  AffiliatePagination,
  AffiliateSectionState,
  AffiliateStatusBadge,
} from "../../../../components/affiliate/dashboardPrimitives";
import {
  AffiliateProgramFormModal,
  type AffiliateProgramFormSubmit,
} from "../../../../components/affiliate/programFormModal";
import { useSellerShop } from "../../../../contexts/sellerShopContext";
import {
  createAffiliateProgram,
  fetchAffiliateProgramMembers,
  fetchSellerAffiliatePrograms,
  fetchSellerAffiliateSummary,
  fetchSellerProgramCommissions,
  updateAffiliateProgram,
  type AffiliateProgram,
  type AffiliateProgramMember,
  type SellerAffiliateCommission,
  type SellerAffiliateSummary,
  type UpdateAffiliateProgramPayload,
} from "../../../../services/affiliate.api";
import { fetchShopOffers, type ShopOffer } from "../../../../services/shop.api";
import { formatVnd } from "../../../../ultil/currency";
import "../../css/pages/sellerAffiliate.css";

const PAGE_SIZE = 10;
const DETAIL_PAGE_SIZE = 10;

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

export default function SellerAffiliatePage() {
  const { shopId } = useSellerShop();
  const [programs, setPrograms] = useState<AffiliateProgram[]>([]);
  const [programPage, setProgramPage] = useState(1);
  const [programTotalPages, setProgramTotalPages] = useState(0);
  const [programLoading, setProgramLoading] = useState(true);
  const [programError, setProgramError] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"" | AffiliateProgram["programStatus"]>("");
  const [summary, setSummary] = useState<SellerAffiliateSummary | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [summaryError, setSummaryError] = useState("");
  const [offers, setOffers] = useState<ShopOffer[]>([]);
  const [selectedProgramId, setSelectedProgramId] = useState("");
  const [members, setMembers] = useState<AffiliateProgramMember[]>([]);
  const [memberPage, setMemberPage] = useState(1);
  const [memberTotalPages, setMemberTotalPages] = useState(0);
  const [memberLoading, setMemberLoading] = useState(false);
  const [memberError, setMemberError] = useState("");
  const [commissions, setCommissions] = useState<SellerAffiliateCommission[]>([]);
  const [commissionPage, setCommissionPage] = useState(1);
  const [commissionTotalPages, setCommissionTotalPages] = useState(0);
  const [commissionLoading, setCommissionLoading] = useState(false);
  const [commissionError, setCommissionError] = useState("");
  const [modalProgram, setModalProgram] = useState<AffiliateProgram | null | undefined>();
  const [submitting, setSubmitting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const selectedProgram = useMemo(
    () => programs.find((program) => program.id === selectedProgramId),
    [programs, selectedProgramId],
  );

  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      setProgramLoading(true);
      setProgramError("");
    });
    void fetchSellerAffiliatePrograms({
      page: programPage,
      pageSize: PAGE_SIZE,
      status: status || undefined,
      search,
    })
      .then((result) => {
        if (!active) return;
        setPrograms(result.items);
        setProgramTotalPages(result.totalPages);
        setSelectedProgramId((current) =>
          result.items.some((program) => program.id === current)
            ? current
            : (result.items[0]?.id ?? ""),
        );
      })
      .catch((error) => {
        if (active) setProgramError(errorMessage(error, "Không thể tải chương trình của shop."));
      })
      .finally(() => {
        if (active) setProgramLoading(false);
      });
    return () => {
      active = false;
    };
  }, [programPage, refreshKey, search, status]);

  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      setSummaryLoading(true);
      setSummaryError("");
    });
    void fetchSellerAffiliateSummary()
      .then((result) => {
        if (active) setSummary(result);
      })
      .catch((error) => {
        if (active) setSummaryError(errorMessage(error, "Không thể tải tổng quan Affiliate."));
      })
      .finally(() => {
        if (active) setSummaryLoading(false);
      });
    return () => {
      active = false;
    };
  }, [refreshKey]);

  useEffect(() => {
    let active = true;
    void fetchShopOffers(shopId, {
      page: 1,
      pageSize: 100,
      offerStatus: "active",
      moderationStatus: "approved",
    })
      .then((result) => {
        if (active) setOffers(result.items);
      })
      .catch((error) => toast.error(errorMessage(error, "Không thể tải sản phẩm của shop.")));
    return () => {
      active = false;
    };
  }, [shopId, refreshKey]);

  useEffect(() => {
    if (!selectedProgramId) {
      queueMicrotask(() => setMembers([]));
      return;
    }
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      setMemberLoading(true);
      setMemberError("");
    });
    void fetchAffiliateProgramMembers(selectedProgramId, memberPage, DETAIL_PAGE_SIZE)
      .then((result) => {
        if (!active) return;
        setMembers(result.items);
        setMemberTotalPages(result.totalPages);
      })
      .catch((error) => {
        if (active) setMemberError(errorMessage(error, "Không thể tải mạng lưới thành viên."));
      })
      .finally(() => {
        if (active) setMemberLoading(false);
      });
    return () => {
      active = false;
    };
  }, [memberPage, refreshKey, selectedProgramId]);

  useEffect(() => {
    if (!selectedProgramId) {
      queueMicrotask(() => setCommissions([]));
      return;
    }
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      setCommissionLoading(true);
      setCommissionError("");
    });
    void fetchSellerProgramCommissions(selectedProgramId, {
      page: commissionPage,
      pageSize: DETAIL_PAGE_SIZE,
    })
      .then((result) => {
        if (!active) return;
        setCommissions(result.items);
        setCommissionTotalPages(result.totalPages);
      })
      .catch((error) => {
        if (active) setCommissionError(errorMessage(error, "Không thể tải lịch sử đối soát."));
      })
      .finally(() => {
        if (active) setCommissionLoading(false);
      });
    return () => {
      active = false;
    };
  }, [commissionPage, refreshKey, selectedProgramId]);

  const refresh = () => setRefreshKey((current) => current + 1);
  const selectProgram = (programId: string) => {
    setSelectedProgramId(programId);
    setMemberPage(1);
    setCommissionPage(1);
  };

  const saveProgram = async (value: AffiliateProgramFormSubmit) => {
    setSubmitting(true);
    try {
      if (modalProgram) {
        const payload: UpdateAffiliateProgramPayload = {
          name: value.name,
          startedAt: value.startedAt,
          endedAt: value.endedAt,
          programStatus: value.programStatus,
        };
        if (!modalProgram.configurationLocked) {
          payload.scopeType = value.scopeType;
          payload.offerId = value.scopeType === "OFFER" ? (value.offerId ?? null) : null;
          payload.tier1Rate = value.tier1Rate;
          payload.tier2Rate = value.tier2Rate;
          payload.attributionWindowDays = value.attributionWindowDays;
        }
        await updateAffiliateProgram(modalProgram.id, payload);
        toast.success("Đã cập nhật chương trình Affiliate.");
      } else {
        await createAffiliateProgram({
          ownerShopId: shopId,
          name: value.name,
          scopeType: value.scopeType,
          offerId: value.offerId,
          tier1Rate: value.tier1Rate,
          tier2Rate: value.tier2Rate,
          attributionWindowDays: value.attributionWindowDays,
        });
        toast.success("Đã tạo chương trình Affiliate.");
      }
      setModalProgram(undefined);
      refresh();
    } catch (error) {
      toast.error(errorMessage(error, "Không thể lưu chương trình Affiliate."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="affiliate-dashboard seller-affiliate-dashboard">
      <div className="affiliate-dashboard-inner">
        <AffiliatePageHeader
          eyebrow="SHOP AFFILIATE"
          title="Quản lý chương trình Affiliate"
          description="Theo dõi chương trình, thành viên và hoa hồng được shop tài trợ."
          actions={
            <>
              <button type="button" className="affiliate-button secondary" onClick={refresh}>
                <RefreshCw size={16} /> Làm mới
              </button>
              <button type="button" className="affiliate-button" onClick={() => setModalProgram(null)}>
                <Plus size={17} /> Tạo chương trình
              </button>
            </>
          }
        />

        <AffiliateSectionState loading={summaryLoading} error={summaryError} onRetry={refresh} />
        {!summaryLoading && !summaryError && summary && (
          <AffiliateKpiGrid
            items={[
              { label: "Chương trình", value: String(summary.programCount), helper: `${summary.activeProgramCount} đang hoạt động`, icon: <ChartNoAxesCombined size={19} /> },
              { label: "Thành viên", value: String(summary.memberCount), icon: <Users size={19} /> },
              { label: "Chuyển đổi", value: String(summary.conversionCount), icon: <BadgeDollarSign size={19} /> },
              { label: "Đang giữ", value: formatVnd(summary.lockedCommissionAmount, summary.currency), helper: `Chờ: ${formatVnd(summary.pendingCommissionAmount, summary.currency)}`, icon: <Clock3 size={19} /> },
              { label: "Đã thanh toán", value: formatVnd(summary.paidCommissionAmount, summary.currency), icon: <WalletCards size={19} /> },
            ]}
          />
        )}

        <section className="affiliate-panel seller-program-panel">
          <div className="affiliate-panel-header">
            <div><h2>Danh sách chương trình</h2><p>Chọn một chương trình để xem mạng lưới và đối soát.</p></div>
          </div>
          <form
            className="affiliate-toolbar"
            onSubmit={(event) => {
              event.preventDefault();
              setProgramPage(1);
              setSearch(searchInput.trim());
            }}
          >
            <label className="affiliate-search-field">
              <Search size={16} />
              <input
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Tìm theo tên chương trình"
              />
            </label>
            <select
              aria-label="Lọc trạng thái chương trình"
              value={status}
              onChange={(event) => {
                setProgramPage(1);
                setStatus(event.target.value as typeof status);
              }}
            >
              <option value="">Tất cả trạng thái</option>
              <option value="DRAFT">Bản nháp</option>
              <option value="ACTIVE">Đang hoạt động</option>
              <option value="PAUSED">Tạm dừng</option>
              <option value="CLOSED">Đã đóng</option>
            </select>
            <button type="submit" className="affiliate-button secondary">Tìm kiếm</button>
          </form>
          <AffiliateSectionState
            loading={programLoading}
            error={programError}
            empty={!programLoading && !programError && programs.length === 0}
            emptyTitle="Chưa có chương trình"
            emptyDescription="Tạo chương trình đầu tiên để bắt đầu xây dựng mạng lưới."
            onRetry={refresh}
          />
          {!programLoading && !programError && programs.length > 0 && (
            <div className="affiliate-table-wrap">
              <table className="affiliate-data-table seller-program-table">
                <thead>
                  <tr><th>Chương trình</th><th>Trạng thái</th><th>Tỷ lệ</th><th>Thành viên</th><th>Chuyển đổi</th><th aria-label="Thao tác" /></tr>
                </thead>
                <tbody>
                  {programs.map((program) => (
                    <tr
                      key={program.id}
                      className={selectedProgramId === program.id ? "selected" : ""}
                      onClick={() => selectProgram(program.id)}
                    >
                      <td data-label="Chương trình">
                        <strong>{program.name}</strong>
                        <small>{scopeLabel[program.scopeType]}{program.offerTitle ? ` · ${program.offerTitle}` : ""}</small>
                      </td>
                      <td data-label="Trạng thái"><AffiliateStatusBadge status={program.programStatus} /></td>
                      <td data-label="Tỷ lệ">{program.tier1Rate}% / {program.tier2Rate}%</td>
                      <td data-label="Thành viên">{program.memberCount ?? 0}</td>
                      <td data-label="Chuyển đổi">{program.conversionCount ?? 0}</td>
                      <td data-label="Thao tác">
                        <button
                          type="button"
                          className="affiliate-icon-button"
                          aria-label={`Chỉnh sửa ${program.name}`}
                          onClick={(event) => {
                            event.stopPropagation();
                            setModalProgram(program);
                          }}
                        >
                          <Edit3 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <AffiliatePagination page={programPage} totalPages={programTotalPages} onChange={setProgramPage} />
        </section>

        {selectedProgram ? (
          <div className="seller-affiliate-details">
            <section className="affiliate-panel">
              <div className="affiliate-panel-header">
                <div><h2>Mạng lưới thành viên</h2><p>{selectedProgram.name} · Cây giới thiệu nhiều cấp, hoa hồng chỉ áp dụng Tầng 1 và Tầng 2.</p></div>
              </div>
              <AffiliateSectionState
                loading={memberLoading}
                error={memberError}
                empty={!memberLoading && !memberError && members.length === 0}
                emptyTitle="Chưa có thành viên"
                emptyDescription="Thành viên mới sẽ xuất hiện sau khi tham gia chương trình."
                onRetry={refresh}
              />
              {!memberLoading && !memberError && members.length > 0 && (
                <div className="affiliate-table-wrap">
                  <table className="affiliate-data-table">
                    <thead><tr><th>Thành viên</th><th>Người giới thiệu</th><th>Cấp mạng lưới</th><th>Trạng thái</th><th>Ngày tham gia</th></tr></thead>
                    <tbody>
                      {members.map((member) => (
                        <tr key={member.accountId}>
                          <td data-label="Thành viên"><strong>{member.displayName}</strong></td>
                          <td data-label="Người giới thiệu">{member.parentDisplayName ?? "Trực tiếp"}</td>
                          <td data-label="Cấp mạng lưới">Cấp {member.networkDepth}</td>
                          <td data-label="Trạng thái"><AffiliateStatusBadge status={member.accountStatus} /></td>
                          <td data-label="Ngày tham gia">{formatDate(member.joinedAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <AffiliatePagination page={memberPage} totalPages={memberTotalPages} onChange={setMemberPage} />
            </section>

            <section className="affiliate-panel">
              <div className="affiliate-panel-header">
                <div><h2>Lịch sử và đối soát hoa hồng</h2><p>Số tiền và trạng thái được đọc trực tiếp từ sổ cái Affiliate.</p></div>
              </div>
              <AffiliateSectionState
                loading={commissionLoading}
                error={commissionError}
                empty={!commissionLoading && !commissionError && commissions.length === 0}
                emptyTitle="Chưa có hoa hồng"
                emptyDescription="Hoa hồng phát sinh sẽ được ghi nhận tại đây."
                onRetry={refresh}
              />
              {!commissionLoading && !commissionError && commissions.length > 0 && (
                <div className="affiliate-table-wrap">
                  <table className="affiliate-data-table">
                    <thead><tr><th>Thành viên</th><th>Đơn hàng</th><th>Tầng</th><th>Trạng thái</th><th>Ghi nhận</th><th className="numeric">Số tiền</th></tr></thead>
                    <tbody>
                      {commissions.map((commission) => (
                        <tr key={commission.id}>
                          <td data-label="Thành viên"><strong>{commission.memberDisplayName}</strong></td>
                          <td data-label="Đơn hàng">{commission.orderId ?? "—"}</td>
                          <td data-label="Tầng">Tầng {commission.tierLevel ?? "—"}</td>
                          <td data-label="Trạng thái"><AffiliateStatusBadge status={commission.commissionStatus} /></td>
                          <td data-label="Ghi nhận">{formatDate(commission.recordedAt)}</td>
                          <td data-label="Số tiền" className="numeric"><strong>{formatVnd(commission.amount, commission.currency)}</strong></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <AffiliatePagination page={commissionPage} totalPages={commissionTotalPages} onChange={setCommissionPage} />
            </section>
          </div>
        ) : (
          !programLoading && !programError && programs.length > 0 && (
            <section className="affiliate-panel">
              <AffiliateSectionState empty emptyTitle="Chọn một chương trình" emptyDescription="Chọn chương trình để xem thành viên và lịch sử đối soát." />
            </section>
          )
        )}
      </div>

      <AffiliateProgramFormModal
        open={modalProgram !== undefined}
        program={modalProgram}
        offers={offers}
        submitting={submitting}
        onClose={() => setModalProgram(undefined)}
        onSubmit={saveProgram}
      />
    </main>
  );
}
