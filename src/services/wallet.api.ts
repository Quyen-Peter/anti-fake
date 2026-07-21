import { authFetch } from "../ultil/auth";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export type Wallet = {
  id: string;
  walletCode: string;
  ownerType: "USER" | "SHOP" | "PLATFORM" | string;
  currency: string;
  availableBalance: string;
  pendingBalance: string;
  lockedBalance: string;
  status: string;
};

export type WalletTransaction = {
  transactionCode: string;
  transactionType: string;
  status: string;
  direction: "CREDIT" | "DEBIT" | string;
  balanceType: "AVAILABLE" | "PENDING" | "LOCKED" | string;
  amount: string;
  balanceBefore: string;
  balanceAfter: string;
  description: string | null;
  createdAt: string;
};

export type WalletTransactionsResponse = {
  data: WalletTransaction[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
};

export type WithdrawalStatus = "PENDING" | "COMPLETED" | "REJECTED" | string;

export type WalletWithdrawal = {
  id: string;
  walletId: string;
  amount: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  status: WithdrawalStatus;
  createdAt: string;
  processedAt: string | null;
};

export type CreateWithdrawalPayload = {
  amount: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
};

export type WalletTopUp = {
  topUpId: string;
  paymentLinkId: string;
  checkoutUrl: string;
  amount: string;
  currency: string;
  status: string;
};

export type PlatformWalletSnapshot = {
  wallet: {
    walletCode: string;
    platformCode: string | null;
    currency: string;
    availableBalance: string;
    pendingBalance: string;
    lockedBalance: string;
    status: string;
  };
  ledger: WalletTransactionsResponse;
};

export type WalletListPagination = { page: number; limit: number; total: number; totalPages: number };

const unwrap = async (response: Response, fallback: string) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || data.error || fallback);
  }
  return data?.data ?? data;
};

const normalizeTransactions = (
  payload: any,
  page: number,
  limit: number,
): WalletTransactionsResponse => {
  const items = Array.isArray(payload?.data)
    ? payload.data
    : Array.isArray(payload?.items)
      ? payload.items
      : Array.isArray(payload)
        ? payload
        : [];
  const pagination = payload?.pagination ?? payload;

  return {
    data: items,
    pagination: {
      page: Number(pagination?.page ?? page),
      pageSize: Number(pagination?.pageSize ?? pagination?.limit ?? limit),
      totalItems: Number(pagination?.totalItems ?? items.length),
      totalPages: Number(pagination?.totalPages ?? 1),
    },
  };
};

export const fetchMyWallet = async (): Promise<Wallet> => {
  const response = await authFetch(`${BASE_URL}/api/wallet/me`, {
    method: "GET",
    headers: { Accept: "application/json" },
  });
  return unwrap(response, "Khong the tai thong tin vi");
};

export const fetchMyWalletTransactions = async (
  page = 1,
  limit = 20,
): Promise<WalletTransactionsResponse> => {
  const response = await authFetch(
    `${BASE_URL}/api/wallet/me/transactions?page=${page}&limit=${limit}`,
    { method: "GET", headers: { Accept: "application/json" } },
  );
  return normalizeTransactions(
    await unwrap(response, "Khong the tai lich su giao dich"),
    page,
    limit,
  );
};

export const createWalletTopUp = async (amount: string, idempotencyKey: string): Promise<WalletTopUp> => {
  const response = await authFetch(`${BASE_URL}/api/wallet/me/top-ups`, {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({ amount, idempotencyKey }),
  });
  return unwrap(response, "Khong the tao yeu cau nap tien");
};

export const fetchShopWallet = async (shopId: string): Promise<Wallet> => {
  const response = await authFetch(`${BASE_URL}/api/shops/${shopId}/wallet`, {
    method: "GET",
    headers: { Accept: "application/json" },
  });
  return unwrap(response, "Khong the tai vi shop");
};

export const fetchShopWalletTransactions = async (
  shopId: string,
  page = 1,
  limit = 20,
): Promise<WalletTransactionsResponse> => {
  const response = await authFetch(
    `${BASE_URL}/api/shops/${shopId}/wallet/transactions?page=${page}&limit=${limit}`,
    { method: "GET", headers: { Accept: "application/json" } },
  );
  return normalizeTransactions(
    await unwrap(response, "Khong the tai lich su giao dich shop"),
    page,
    limit,
  );
};

export const createShopWithdrawal = async (
  shopId: string,
  payload: CreateWithdrawalPayload,
): Promise<WalletWithdrawal> => {
  const response = await authFetch(
    `${BASE_URL}/api/shops/${shopId}/wallet/withdrawals`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );
  return unwrap(response, "Khong the tao yeu cau rut tien");
};

export const fetchShopWithdrawals = async (
  shopId: string,
): Promise<WalletWithdrawal[]> => {
  const response = await authFetch(
    `${BASE_URL}/api/shops/${shopId}/wallet/withdrawals`,
    { method: "GET", headers: { Accept: "application/json" } },
  );
  const payload = await unwrap(response, "Khong the tai danh sach rut tien");
  return Array.isArray(payload?.items)
    ? payload.items
    : Array.isArray(payload)
      ? payload
      : [];
};

export const fetchAdminWalletWithdrawals = async (page = 1, limit = 20, status = ""): Promise<{ items: WalletWithdrawal[]; pagination: WalletListPagination }> => {
  const query = new URLSearchParams({ page: String(page), limit: String(limit), ...(status ? { status } : {}) });
  const response = await authFetch(`${BASE_URL}/api/admin/wallet-withdrawals?${query.toString()}`, {
    method: "GET",
    headers: { Accept: "application/json" },
  });
  const payload = await unwrap(response, "Khong the tai yeu cau rut tien");
  return { items: Array.isArray(payload?.items) ? payload.items : Array.isArray(payload) ? payload : [], pagination: payload?.pagination ?? { page, limit, total: 0, totalPages: 0 } };
};

export const fetchPlatformWallets = async (): Promise<PlatformWalletSnapshot[]> => {
  const response = await authFetch(`${BASE_URL}/api/admin/wallets/platform`, { method: "GET", headers: { Accept: "application/json" } });
  const payload = await unwrap(response, "Khong the tai vi he thong");
  return Array.isArray(payload) ? payload : payload?.items ?? [];
};

export const fetchWalletReconciliation = async (params: Record<string, string> = {}) => {
  const query = new URLSearchParams(params).toString();
  const response = await authFetch(`${BASE_URL}/api/admin/wallets/reconciliation${query ? `?${query}` : ""}`, { method: "GET", headers: { Accept: "application/json" } });
  return unwrap(response, "Khong the tai bao cao doi soat vi");
};

export const approveWalletWithdrawal = async (id: string) => {
  const response = await authFetch(
    `${BASE_URL}/api/admin/wallet-withdrawals/${id}/approve`,
    { method: "POST", headers: { Accept: "application/json" } },
  );
  return unwrap(response, "Khong the duyet yeu cau rut tien");
};

export const rejectWalletWithdrawal = async (id: string) => {
  const response = await authFetch(
    `${BASE_URL}/api/admin/wallet-withdrawals/${id}/reject`,
    { method: "POST", headers: { Accept: "application/json" } },
  );
  return unwrap(response, "Khong the tu choi yeu cau rut tien");
};
