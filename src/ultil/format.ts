export const formatSale = (value: number) => {
  if (value == null) return "0";
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1).replace(/\.0$/, "")}M`;
  }

  if (value >= 1000) {
    return `${(value / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  }

  return value.toString();
};

export const formatJoinTime = (createdAt: string): string => {
  const created = new Date(createdAt);
  const now = new Date();

  let years = now.getFullYear() - created.getFullYear();
  let months = now.getMonth() - created.getMonth();

  if (months < 0) {
    years--;
    months += 12;
  }

  if (years <= 0 && months <= 0) {
    return "Hôm nay";
  }

  if (years <= 0) {
    return `${months} tháng`;
  }

  if (months === 0) {
    return `${years} năm`;
  }

  return `${years} năm ${months} tháng`;
};