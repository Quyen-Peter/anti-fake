import { authFetch } from "../ultil/auth";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export type UpdateUserProfilePayload = {
  phone: string;
  displayName: string;
};

export type SubmitUserKycPayload = {
  idType: string;
  front: File;
  back: File;
};

export type UserKycDocument = {
  side?: string;
  mediaAssetId?: string;
  assetType?: string;
  mimeType?: string;
  publicId?: string;
  fileUrl: string;
};

export type UserKyc = {
  id: string;
  userId?: string;
  fullName?: string;
  dateOfBirth?: string;
  idType?: string;
  kycLevel?: string;
  verificationStatus?: string;
  reviewNote?: string | null;
  verifiedAt?: string | null;
  documents: UserKycDocument[];
};

export const uploadUserAvatar = async (avatar: File) => {
  const formData = new FormData();
  formData.append("avatar", avatar);

  const response = await authFetch(`${BASE_URL}/api/user/avatar`, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Cập nhật ảnh đại diện thất bại");
  }

  return data;
};

export const submitUserKyc = async (payload: SubmitUserKycPayload) => {
  const formData = new FormData();
  formData.append("idType", payload.idType);
  formData.append("front", payload.front);
  formData.append("back", payload.back);

  const response = await authFetch(`${BASE_URL}/api/user/kyc`, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Không thể gửi hồ sơ KYC");
  }

  return data;
};

export const getUserKyc = async (): Promise<UserKyc | null> => {
  const response = await authFetch(`${BASE_URL}/api/user/kyc`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  if (response.status === 204 || response.status === 404) {
    return null;
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Khong the lay trang thai KYC");
  }

  const payload = data?.data ?? data;
  if (!payload || typeof payload !== "object") return null;

  const record = payload as Record<string, unknown>;
  const documents = Array.isArray(record.documents) ? record.documents : [];

  return {
    id: String(record.id ?? ""),
    userId: typeof record.userId === "string" ? record.userId : undefined,
    fullName: typeof record.fullName === "string" ? record.fullName : undefined,
    dateOfBirth:
      typeof record.dateOfBirth === "string" ? record.dateOfBirth : undefined,
    idType: typeof record.idType === "string" ? record.idType : undefined,
    kycLevel: typeof record.kycLevel === "string" ? record.kycLevel : undefined,
    verificationStatus:
      typeof record.verificationStatus === "string"
        ? record.verificationStatus
        : undefined,
    reviewNote:
      typeof record.reviewNote === "string" ? record.reviewNote : null,
    verifiedAt: typeof record.verifiedAt === "string" ? record.verifiedAt : null,
    documents: documents
      .map((item): UserKycDocument | null => {
        if (!item || typeof item !== "object") return null;
        const doc = item as Record<string, unknown>;
        const fileUrl = doc.fileUrl;
        if (typeof fileUrl !== "string") return null;

        return {
          fileUrl,
          side: typeof doc.side === "string" ? doc.side : undefined,
          mediaAssetId:
            typeof doc.mediaAssetId === "string" ? doc.mediaAssetId : undefined,
          assetType: typeof doc.assetType === "string" ? doc.assetType : undefined,
          mimeType: typeof doc.mimeType === "string" ? doc.mimeType : undefined,
          publicId: typeof doc.publicId === "string" ? doc.publicId : undefined,
        };
      })
      .filter((item): item is UserKycDocument => Boolean(item)),
  };
};

export const updateUserProfile = async (
  payload: UpdateUserProfilePayload
) => {
  const response = await authFetch(`${BASE_URL}/api/user/profile`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Cập nhật hồ sơ thất bại");
  }

  return data;
};
