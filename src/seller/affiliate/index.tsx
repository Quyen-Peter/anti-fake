import { useEffect, useState } from "react";
import { RefreshCw, Users } from "lucide-react";
import { toast } from "sonner";
import { useSellerShop } from "../../contexts/sellerShopContext";
import {
  createAffiliateProgram,
  fetchAffiliateProgramMembers,
  fetchMyAffiliatePrograms,
  type AffiliateProgram,
  type AffiliateProgramMember,
} from "../../services/affiliate.api";
import {
  fetchShopOffers,
  type ShopOffer,
} from "../../services/shop.api";
import "../../css/pages/affiliate.css";

const MEMBER_PAGE_SIZE = 20;

const statusLabel: Record<string, string> = {
  ACTIVE: "Đang hoạt động",
  PENDING: "Chờ duyệt",
  SUSPENDED: "Tạm dừng",
  BLOCKED: "Đã khóa",
};

export default function SellerAffiliatePage() {
  const { shopId } = useSellerShop();
  const [ownedPrograms, setOwnedPrograms] = useState<AffiliateProgram[]>([]);
  const [offers, setOffers] = useState<ShopOffer[]>([]);
  const [selectedProgramId, setSelectedProgramId] = useState("");
  const [members, setMembers] = useState<AffiliateProgramMember[]>([]);
  const [memberPage, setMemberPage] = useState(1);
  const [memberTotalPages, setMemberTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [programForm, setProgramForm] = useState({
    name: "",
    scopeType: "SHOP" as "SHOP" | "OFFER",
    offerId: "",
    tier1Rate: "6",
    tier2Rate: "2",
    attributionWindowDays: "30",
  });

  useEffect(() => {
    let active = true;

    void Promise.all([
      fetchMyAffiliatePrograms(),
      fetchShopOffers(shopId, {
        page: 1,
        pageSize: 100,
        offerStatus: "active",
        moderationStatus: "approved",
      }),
    ])
      .then(([programs, shopOffers]) => {
        if (!active) return;
        setOwnedPrograms(programs);
        setOffers(shopOffers.items);
        if (programs.length === 0) {
          setMembers([]);
          setMemberTotalPages(0);
        }
        setSelectedProgramId((current) =>
          programs.some((program) => program.id === current)
            ? current
            : (programs[0]?.id ?? ""),
        );
      })
      .catch((requestError) => {
        if (active) {
          toast.error(
            requestError instanceof Error
              ? requestError.message
              : "Không thể tải Affiliate của shop",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [refreshKey, shopId]);

  useEffect(() => {
    let active = true;
    if (!selectedProgramId) {
      return () => {
        active = false;
      };
    }

    void fetchAffiliateProgramMembers(
      selectedProgramId,
      memberPage,
      MEMBER_PAGE_SIZE,
    )
      .then((result) => {
        if (!active) return;
        setMembers(result.items);
        setMemberTotalPages(result.totalPages);
      })
      .catch((requestError) => {
        if (active) {
          toast.error(
            requestError instanceof Error
              ? requestError.message
              : "Không thể tải mạng lưới affiliate",
          );
        }
      });

    return () => {
      active = false;
    };
  }, [selectedProgramId, memberPage, refreshKey]);

  const refresh = () => {
    setLoading(true);
    setRefreshKey((current) => current + 1);
  };

  const selectProgram = (programId: string) => {
    setSelectedProgramId(programId);
    setMemberPage(1);
    setMembers([]);
  };

  const submitProgram = async (event: React.FormEvent) => {
    event.preventDefault();
    const tier1Rate = Number(programForm.tier1Rate);
    const tier2Rate = Number(programForm.tier2Rate);
    if (tier1Rate <= 0 || tier2Rate > tier1Rate || tier1Rate + tier2Rate > 100) {
      toast.error(
        "Tầng 1 phải lớn hơn 0; Tầng 2 không vượt Tầng 1; tổng tỷ lệ không vượt 100%",
      );
      return;
    }

    setSubmitting(true);
    try {
      await createAffiliateProgram({
        ownerShopId: shopId,
        scopeType: programForm.scopeType,
        name: programForm.name,
        offerId:
          programForm.scopeType === "OFFER"
            ? programForm.offerId
            : undefined,
        tier1Rate,
        tier2Rate,
        attributionWindowDays: Number(programForm.attributionWindowDays),
      });
      toast.success("Đã tạo chương trình affiliate");
      setProgramForm((current) => ({ ...current, name: "" }));
      refresh();
    } catch (requestError) {
      toast.error(
        requestError instanceof Error
          ? requestError.message
          : "Không thể tạo chương trình",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="affiliate-page seller-affiliate-page">
      <section className="affiliate-hero">
        <div>
          <p className="affiliate-eyebrow">SHOP AFFILIATE</p>
          <h1>Tạo mạng lưới bán hàng cho shop.</h1>
          <p>
            Shop cấu hình chương trình, phạm vi và tỷ lệ hoa hồng. Tiền hoa
            hồng được giữ từ phần shop thực nhận.
          </p>
        </div>
        <div className="affiliate-flow">
          <span>Shop tạo chương trình</span>
          <b>→</b>
          <span>Thành viên chia sẻ</span>
          <b>→</b>
          <span>Tự động đối soát</span>
        </div>
      </section>

      <div className="seller-affiliate-heading">
        <div>
          <Users size={18} />
          <strong>Affiliate dành cho shop</strong>
        </div>
        <button
          type="button"
          onClick={refresh}
          disabled={loading}
          aria-label="Làm mới Affiliate của shop"
        >
          <RefreshCw size={17} />
          Làm mới
        </button>
      </div>

      {loading ? (
        <div className="affiliate-empty" aria-busy="true">
          Đang tải Affiliate của shop...
        </div>
      ) : (
        <section className="affiliate-shop-layout">
          <form
            className="affiliate-panel affiliate-program-form"
            onSubmit={submitProgram}
          >
            <div className="affiliate-panel-title">
              <div>
                <p className="affiliate-eyebrow">SHOP FUNDED</p>
                <h2>Tạo chương trình</h2>
              </div>
            </div>
            <p className="affiliate-funding-note">
              Hoa hồng được giữ từ phần shop thực nhận khi đơn hoàn tất, sau đó
              tự động chuyển vào ví affiliate khi hết thời gian giữ.
            </p>
            <label>
              Tên chương trình
              <input
                required
                value={programForm.name}
                onChange={(event) =>
                  setProgramForm((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
              />
            </label>
            <label>
              Áp dụng cho
              <select
                value={programForm.scopeType}
                onChange={(event) =>
                  setProgramForm((current) => ({
                    ...current,
                    scopeType: event.target.value as typeof current.scopeType,
                    offerId: "",
                  }))
                }
              >
                <option value="SHOP">Toàn bộ sản phẩm của shop</option>
                <option value="OFFER">Một sản phẩm cụ thể</option>
              </select>
              <small>
                Chọn những sản phẩm được tính hoa hồng khi đơn hàng hoàn tất.
              </small>
            </label>
            {programForm.scopeType === "OFFER" && (
              <label>
                Sản phẩm
                <select
                  required
                  value={programForm.offerId}
                  onChange={(event) =>
                    setProgramForm((current) => ({
                      ...current,
                      offerId: event.target.value,
                    }))
                  }
                >
                  <option value="">Chọn sản phẩm đang bán</option>
                  {offers.map((offer) => (
                    <option value={offer.id} key={offer.id}>
                      {offer.title}
                    </option>
                  ))}
                </select>
                {offers.length === 0 && (
                  <small>
                    Shop chưa có sản phẩm đang bán đã được duyệt.
                  </small>
                )}
              </label>
            )}
            <div className="affiliate-form-grid">
              <label>
                Tầng 1 (%)
                <input
                  type="number"
                  required
                  min="0.01"
                  max="100"
                  step="0.01"
                  value={programForm.tier1Rate}
                  onChange={(event) =>
                    setProgramForm((current) => ({
                      ...current,
                      tier1Rate: event.target.value,
                    }))
                  }
                />
              </label>
              <label>
                Tầng 2 (%)
                <input
                  type="number"
                  required
                  min="0"
                  max="100"
                  step="0.01"
                  value={programForm.tier2Rate}
                  onChange={(event) =>
                    setProgramForm((current) => ({
                      ...current,
                      tier2Rate: event.target.value,
                    }))
                  }
                />
              </label>
              <label>
                Cửa sổ ghi nhận
                <input
                  type="number"
                  required
                  min="1"
                  max="90"
                  value={programForm.attributionWindowDays}
                  onChange={(event) =>
                    setProgramForm((current) => ({
                      ...current,
                      attributionWindowDays: event.target.value,
                    }))
                  }
                />
              </label>
            </div>
            <p className="affiliate-funding-note">
              Thời gian giữ hoa hồng do hệ thống quy định để xử lý hoàn tiền
              hoặc tranh chấp. Shop không cần cấu hình mục này.
            </p>
            <button className="affiliate-primary" disabled={submitting}>
              {submitting ? "Đang tạo..." : "Tạo và kích hoạt"}
            </button>
          </form>

          <div className="affiliate-panel">
            <div className="affiliate-panel-title">
              <div>
                <h2>Mạng lưới thành viên</h2>
                <p>
                  Cấp mạng lưới dùng để xem cây; tiền chỉ chi Tầng 1 và cha trực
                  tiếp Tầng 2.
                </p>
              </div>
              <select
                value={selectedProgramId}
                onChange={(event) => selectProgram(event.target.value)}
              >
                <option value="">Chọn chương trình</option>
                {ownedPrograms.map((program) => (
                  <option value={program.id} key={program.id}>
                    {program.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="affiliate-member-list">
              {members.map((member) => (
                <div key={member.accountId}>
                  <span className="affiliate-avatar">
                    {member.displayName.slice(0, 1).toUpperCase()}
                  </span>
                  <div>
                    <strong>{member.displayName}</strong>
                    <small>
                      Cha trực tiếp: {member.parentDisplayName ?? "Không có"}
                    </small>
                  </div>
                  <span>Cấp mạng lưới {member.networkDepth}</span>
                  <b>
                    {statusLabel[member.accountStatus] ?? member.accountStatus}
                  </b>
                </div>
              ))}
              {selectedProgramId && members.length === 0 && (
                <p>Chưa có thành viên.</p>
              )}
            </div>
            <Pagination
              page={memberPage}
              totalPages={memberTotalPages}
              onChange={setMemberPage}
            />
          </div>
        </section>
      )}
    </main>
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
    <div className="affiliate-pagination" aria-label="Phân trang thành viên">
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
