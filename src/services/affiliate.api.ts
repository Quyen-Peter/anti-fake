import { authFetch } from "../ultil/auth";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const ATTRIBUTION_STORAGE_KEY = "affiliateAttribution";
export const AFFILIATE_ATTRIBUTION_CHANGED_EVENT =
  "affiliate-attribution-changed";

export type AffiliateProgram = {
  id: string;
  ownerShopId: string | null;
  ownerShopName: string | null;
  brandId: string | null;
  brandName: string | null;
  offerId: string | null;
  offerTitle: string | null;
  scopeType: "PLATFORM" | "SHOP" | "BRAND" | "OFFER";
  name: string;
  slug: string;
  programStatus: "DRAFT" | "ACTIVE" | "PAUSED" | "CLOSED";
  attributionWindowDays: number;
  commissionHoldDays: number;
  settlementMode: "MANUAL" | "AUTOMATIC";
  tier1Rate: number;
  tier2Rate: number;
  startedAt: string | null;
  endedAt: string | null;
  createdAt?: string;
  memberCount?: number;
  conversionCount?: number;
  configurationLocked?: boolean;
};

export type AffiliateAccountProgram = {
  ownerShopId: string | null;
  ownerShopName: string | null;
  scopeType: AffiliateProgram["scopeType"];
  offerId: string | null;
  offerTitle: string | null;
  programStatus: AffiliateProgram["programStatus"];
  tier1Rate: number;
  tier2Rate: number;
  commissionHoldDays: number;
  endedAt: string | null;
};

export type AffiliateAccount = {
  id: string;
  programId: string;
  programName: string;
  parentAccountId: string | null;
  accountStatus: string;
  referralPath: string | null;
  joinedAt: string;
  program?: AffiliateAccountProgram;
};

export type AffiliateAccountSummary = {
  accountId: string;
  programId: string;
  programName: string;
  totalConversions: number;
  totalTier1Conversions: number;
  totalTier2Conversions: number;
  totalCommissionAmount: number;
  pendingCommissionAmount: number;
  approvedCommissionAmount: number;
  lockedCommissionAmount: number;
  paidCommissionAmount: number;
  cancelledCommissionAmount: number;
};

export type AffiliateCode = {
  id: string;
  accountId: string;
  code: string;
  landingUrl: string | null;
  isDefault: boolean;
  expiresAt: string | null;
};

export type AffiliateCommission = {
  id: string;
  conversionId: string;
  tierLevel: number | null;
  amount: number | string;
  commissionStatus: string;
  currency?: string;
  createdAt: string;
  availableAt?: string | null;
  lockedAt?: string | null;
  paidAt?: string | null;
};

export type AffiliateProgramMember = {
  accountId: string;
  displayName: string;
  parentAccountId: string | null;
  parentDisplayName: string | null;
  networkDepth: number;
  accountStatus: string;
  joinedAt: string;
};

export type AffiliateAttribution = {
  code: string;
  programId: string;
  attributionToken: string;
  expiresAt: string;
};

export type SellerAffiliateSummary = {
  programCount: number;
  activeProgramCount: number;
  memberCount: number;
  conversionCount: number;
  pendingCommissionAmount: string;
  approvedCommissionAmount: string;
  lockedCommissionAmount: string;
  paidCommissionAmount: string;
  cancelledCommissionAmount: string;
  currency: string;
};

export type SellerAffiliateCommission = {
  id: string;
  conversionId: string;
  orderId: string | null;
  memberAccountId: string | null;
  memberDisplayName: string;
  tierLevel: number | null;
  amount: string;
  currency: string;
  commissionStatus: string;
  recordedAt: string;
  approvedAt: string | null;
  createdAt: string;
  lockedAt: string | null;
  availableAt: string | null;
  paidAt: string | null;
  payoutId: string | null;
  payoutStatus: string | null;
  externalRef: string | null;
};

export type UpdateAffiliateProgramPayload = Partial<{
  name: string;
  scopeType: "SHOP" | "OFFER";
  offerId: string | null;
  attributionWindowDays: number;
  tier1Rate: number;
  tier2Rate: number;
  startedAt: string | null;
  endedAt: string | null;
  programStatus: "DRAFT" | "ACTIVE" | "PAUSED" | "CLOSED";
}>;

export type PaginatedResponse<T> = {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

const unwrap = <T,>(data: T | { data: T }): T =>
  data && typeof data === "object" && "data" in data ? data.data : data;

const readResponse = async <T,>(response: Response, fallback: string): Promise<T> => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || fallback);
  return unwrap<T>(data);
};

const queryString = (values: Record<string, string | number | undefined>) => {
  const query = new URLSearchParams();
  Object.entries(values).forEach(([key, value]) => {
    if (value !== undefined && value !== "") query.set(key, String(value));
  });
  return query.toString();
};

export const fetchActiveAffiliatePrograms = async (page = 1, pageSize = 12) =>
  readResponse<PaginatedResponse<AffiliateProgram>>(
    await fetch(`${BASE_URL}/api/affiliate/programs?page=${page}&pageSize=${pageSize}`, { headers: { Accept: "application/json" } }),
    "Không thể tải chương trình affiliate",
  );

export const fetchMyAffiliatePrograms = async () =>
  readResponse<AffiliateProgram[]>(
    await authFetch(`${BASE_URL}/api/affiliate/programs/mine`),
    "Không thể tải chương trình của shop",
  );

export const fetchSellerAffiliatePrograms = async (params: {
  page?: number;
  pageSize?: number;
  status?: AffiliateProgram["programStatus"];
  search?: string;
} = {}) =>
  readResponse<PaginatedResponse<AffiliateProgram>>(
    await authFetch(
      `${BASE_URL}/api/affiliate/seller/programs?${queryString({
        page: params.page ?? 1,
        pageSize: params.pageSize ?? 20,
        status: params.status,
        search: params.search?.trim(),
      })}`,
    ),
    "Không thể tải danh sách chương trình của shop",
  );

export const fetchSellerAffiliateSummary = async (programId?: string) =>
  readResponse<SellerAffiliateSummary>(
    await authFetch(
      `${BASE_URL}/api/affiliate/seller/summary?${queryString({ programId })}`,
    ),
    "Không thể tải tổng quan Affiliate của shop",
  );

export const fetchMyAffiliateAccounts = async () =>
  readResponse<AffiliateAccount[]>(
    await authFetch(`${BASE_URL}/api/affiliate/accounts/mine`),
    "Không thể tải tài khoản affiliate",
  );

export const fetchAffiliateAccountSummary = async (accountId: string) =>
  readResponse<AffiliateAccountSummary>(
    await authFetch(`${BASE_URL}/api/affiliate/accounts/${accountId}/summary`),
    "Không thể tải tổng quan affiliate",
  );

export const fetchAffiliateCodes = async (accountId: string) =>
  readResponse<AffiliateCode[]>(
    await authFetch(`${BASE_URL}/api/affiliate/accounts/${accountId}/codes`),
    "Không thể tải mã affiliate",
  );

export const fetchAffiliateCommissions = async (accountId: string, page = 1, pageSize = 15) =>
  readResponse<PaginatedResponse<AffiliateCommission>>(
    await authFetch(`${BASE_URL}/api/affiliate/accounts/${accountId}/commissions?page=${page}&pageSize=${pageSize}`),
    "Không thể tải lịch sử hoa hồng",
  );

export const fetchAffiliateProgramMembers = async (programId: string, page = 1, pageSize = 20) =>
  readResponse<PaginatedResponse<AffiliateProgramMember>>(
    await authFetch(`${BASE_URL}/api/affiliate/programs/${programId}/members?page=${page}&pageSize=${pageSize}`),
    "Không thể tải mạng lưới affiliate",
  );

export const fetchSellerProgramCommissions = async (
  programId: string,
  params: {
    page?: number;
    pageSize?: number;
    status?: string;
    tierLevel?: 1 | 2;
  } = {},
) =>
  readResponse<PaginatedResponse<SellerAffiliateCommission>>(
    await authFetch(
      `${BASE_URL}/api/affiliate/seller/programs/${programId}/commissions?${queryString({
        page: params.page ?? 1,
        pageSize: params.pageSize ?? 20,
        status: params.status,
        tierLevel: params.tierLevel,
      })}`,
    ),
    "Không thể tải lịch sử đối soát hoa hồng",
  );

export const joinAffiliateProgram = async (programId: string, referralCode?: string) =>
  readResponse<AffiliateAccount>(
    await authFetch(`${BASE_URL}/api/affiliate/accounts/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ programId, referralCode: referralCode || undefined }),
    }),
    "Không thể tham gia chương trình",
  );

export const createAffiliateProgram = async (payload: {
  ownerShopId: string;
  scopeType: "SHOP" | "OFFER";
  name: string;
  offerId?: string;
  attributionWindowDays: number;
  tier1Rate: number;
  tier2Rate: number;
}) => readResponse<AffiliateProgram>(
  await authFetch(`${BASE_URL}/api/affiliate/programs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }),
  "Không thể tạo chương trình affiliate",
);

export const updateAffiliateProgram = async (
  programId: string,
  payload: UpdateAffiliateProgramPayload,
) =>
  readResponse<AffiliateProgram>(
    await authFetch(`${BASE_URL}/api/affiliate/programs/${programId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
    "Không thể cập nhật chương trình affiliate",
  );

export const createAffiliateCode = async (
  accountId: string,
  code: string,
  options: { landingUrl?: string; isDefault?: boolean } = {},
) =>
  readResponse<AffiliateCode>(
    await authFetch(`${BASE_URL}/api/affiliate/codes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        accountId,
        code,
        landingUrl: options.landingUrl,
        isDefault: options.isDefault ?? true,
      }),
    }),
    "Không thể tạo mã affiliate",
  );

export const resolveAffiliateAttribution = async (
  code: string,
  signal?: AbortSignal,
) =>
  readResponse<AffiliateAttribution>(
    await fetch(`${BASE_URL}/api/affiliate/attributions/resolve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: code.trim() }),
      signal,
    }),
    "Mã affiliate không hợp lệ hoặc đã hết hạn",
  );

const notifyAttributionChanged = () => {
  window.dispatchEvent(new Event(AFFILIATE_ATTRIBUTION_CHANGED_EVENT));
};

export const saveAffiliateAttribution = (attribution: AffiliateAttribution) => {
  localStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(attribution));
  notifyAttributionChanged();
};

export const getAffiliateAttribution = (): AffiliateAttribution | undefined => {
  try {
    const value = localStorage.getItem(ATTRIBUTION_STORAGE_KEY);
    if (!value) return undefined;
    const attribution = JSON.parse(value) as AffiliateAttribution;
    if (
      !attribution.code ||
      !attribution.attributionToken ||
      !Number.isFinite(new Date(attribution.expiresAt).getTime()) ||
      new Date(attribution.expiresAt).getTime() <= Date.now()
    ) {
      localStorage.removeItem(ATTRIBUTION_STORAGE_KEY);
      return undefined;
    }
    return attribution;
  } catch {
    localStorage.removeItem(ATTRIBUTION_STORAGE_KEY);
    return undefined;
  }
};

export const getAffiliateAttributionToken = () =>
  getAffiliateAttribution()?.attributionToken;

export const clearAffiliateAttribution = () => {
  localStorage.removeItem(ATTRIBUTION_STORAGE_KEY);
  notifyAttributionChanged();
};

export const captureAffiliateAttribution = async (
  code: string,
  signal?: AbortSignal,
) => {
  const attribution = await resolveAffiliateAttribution(code, signal);
  if (signal?.aborted) return attribution;
  saveAffiliateAttribution(attribution);
  return attribution;
};
