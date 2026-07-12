import { authFetch } from "../ultil/auth";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export type Category = {
  id: string;
  parentId: string | null;
  name: string;
  imageUrl: string | null;
  riskTier?: string;
};

export type CreateCategoryInput = {
  name: string;
  parentId?: string;
  riskTier?: string;
  image: File;
};

export const fetchCategories = async (): Promise<Category[]> => {
  const response = await fetch(
    `${BASE_URL}/api/categories`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    }
  );

  

  if (!response.ok) {
    throw new Error("Lấy danh mục thất bại");
  }
  const data: unknown = await response.json();
  const payload =
    data && typeof data === "object" && "data" in data
      ? (data as { data: unknown }).data
      : data;

  if (!Array.isArray(payload)) return [];

  return payload.flatMap((item): Category[] => {
    if (!item || typeof item !== "object") return [];
    const category = item as Record<string, unknown>;
    if (typeof category.id !== "string" || typeof category.name !== "string") {
      return [];
    }

    return [{
      id: category.id,
      parentId: typeof category.parentId === "string" ? category.parentId : null,
      name: category.name,
      imageUrl: typeof category.imageUrl === "string" ? category.imageUrl : null,
      riskTier: typeof category.riskTier === "string" ? category.riskTier : undefined,
    }];
  });
};

export const createCategory = async (
  input: CreateCategoryInput,
): Promise<Category> => {
  const formData = new FormData();
  formData.append("name", input.name);
  if (input.parentId) formData.append("parentId", input.parentId);
  if (input.riskTier) formData.append("riskTier", input.riskTier);
  formData.append("image", input.image);

  const response = await authFetch(`${BASE_URL}/api/categories`, {
    method: "POST",
    headers: { Accept: "application/json" },
    body: formData,
  });
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Không thể tạo danh mục");
  }

  const payload = data?.data ?? data;
  return {
    id: String(payload?.id ?? payload?.categoryId ?? ""),
    parentId: typeof payload?.parentId === "string" ? payload.parentId : null,
    name: String(payload?.name ?? input.name),
    imageUrl: typeof payload?.imageUrl === "string" ? payload.imageUrl : null,
    riskTier: typeof payload?.riskTier === "string" ? payload.riskTier : input.riskTier,
  };
};
