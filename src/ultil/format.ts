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


export const formatCommunityTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();

  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diff < 60) {
    return "Vừa xong";
  }

  if (diff < 3600) {
    const minutes = Math.floor(diff / 60);
    return `${minutes} phút trước`;
  }

  if (diff < 86400) {
    const hours = Math.floor(diff / 3600);
    return `${hours} giờ trước`;
  }

  if (diff < 7 * 86400) {
    const days = Math.floor(diff / 86400);
    return `${days} ngày trước`;
  }

  if (date.getFullYear() === now.getFullYear()) {
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};