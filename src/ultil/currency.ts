export const formatVnd = (
  value?: number | string | null,
  currency = "VND",
) => {
  const amount = Number(value);

  if (!Number.isFinite(amount)) return "--";

  return `${new Intl.NumberFormat("vi-VN", {
    maximumFractionDigits: 0,
  }).format(amount)} ${currency || "VND"}`;
};
