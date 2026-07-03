import { authFetch } from "../ultil/auth";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export type UpdateUserProfilePayload = {
  phone: string;
  displayName: string;
};

export type SubmitUserKycDocument = {
  side: "FRONT" | "BACK";
  assetType: "IMAGE";
  mimeType: string;
  fileUrl: string;
  publicId: string;
};

export type SubmitUserKycPayload = {
  idType: string;
  documents: SubmitUserKycDocument[];
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
  const response = await authFetch(`${BASE_URL}/api/user/kyc`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Không thể gửi hồ sơ KYC");
  }

  return data;
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
