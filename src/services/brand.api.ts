const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export type Brand = {
  id: string;
  name: string;
  registrationStatus?: string;
  createdAt?: string;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value && typeof value === "object");

const normalizeBrands = (data: unknown): Brand[] => {
  const payload = isRecord(data) ? data.data ?? data.items ?? data : data;

  if (!Array.isArray(payload)) return [];

  return payload
    .map((item): Brand | null => {
      if (!isRecord(item)) return null;

      const id = item.id;
      const name = item.name;

      if (typeof id !== "string" || typeof name !== "string") return null;

      return {
        id,
        name,
        registrationStatus:
          typeof item.registrationStatus === "string"
            ? item.registrationStatus
            : undefined,
        createdAt: typeof item.createdAt === "string" ? item.createdAt : undefined,
      };
    })
    .filter((item): item is Brand => Boolean(item));
};

export const fetchBrands = async (): Promise<Brand[]> => {
  const response = await fetch(`${BASE_URL}/api/brands`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Khong the lay danh sach thuong hieu");
  }

  return normalizeBrands(data);
};
