import { Check } from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import "../../css/components/sellerRegistration/sellerRegistration.css";
import { fetchCategories } from "../../services/category.api";
import {
  createShop,
  fetchShopDocumentRequirements,
  getMyShop,
  submitShopDocuments,
  type ShopDocumentRequirement,
} from "../../services/shop.api";
import { submitUserKyc } from "../../services/user.api";
import LoadingOverlay from "../loadingOverlay";
import CompletionStep from "./CompletionStep";
import StoreInfoStep from "./StoreInfoStep";
import VerificationStep from "./VerificationStep";

export type RegistrationStep = 1 | 2 | 3;
export type BusinessType = "MANUFACTURER" | "DISTRIBUTOR";
export type RegistrationStatus = "pending_kyc" | "rejected" | "success";

export type RegistrationForm = {
  storeName: string;
  registrationType: string;
  taxCode: string;
  businessType: BusinessType;
  categoryIds: string[];
  identityType: string;
};

export type UploadedAsset = {
  file: File;
  name: string;
  mimeType: string;
  previewUrl: string;
};

export type UploadedFiles = {
  identityFront?: UploadedAsset;
  identityBack?: UploadedAsset;
  requirements: Record<string, UploadedAsset[]>;
};

export type ShopCategory = {
  id: string | number;
  name: string;
};

type RegisterRouteState = {
  initialStep?: RegistrationStep;
  registrationStatus?: RegistrationStatus;
  shopId?: string;
};

type RegisteredShop = {
  id?: string;
  shopId?: string;
};

const initialRegistrationForm: RegistrationForm = {
  storeName: "",
  registrationType: "MANUFACTURER",
  taxCode: "",
  businessType: "MANUFACTURER",
  categoryIds: [],
  identityType: "CCCD",
};

const initialUploadedFiles: UploadedFiles = {
  requirements: {},
};

const registrationSteps = [
  { id: 1, title: "Thông tin cửa hàng" },
  { id: 2, title: "Xác thực tài liệu" },
  { id: 3, title: "Hoàn tất" },
] as const;

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value && typeof value === "object");

const normalizeCategories = (data: unknown): ShopCategory[] => {
  const response =
    isRecord(data) ? (data as { data?: unknown; items?: unknown }) : null;
  const payload = response?.data ?? response?.items ?? data;
  return Array.isArray(payload) ? payload : [];
};

const normalizeMyShop = (data: unknown): RegisteredShop | null => {
  const payload = isRecord(data) ? data.data ?? data.items ?? data : data;
  if (Array.isArray(payload)) {
    return (payload[0] as RegisteredShop | undefined) ?? null;
  }
  return isRecord(payload) ? (payload as RegisteredShop) : null;
};

const isExistingShopError = (error: unknown) =>
  getErrorMessage(error, "").toLowerCase().includes("only create one shop");

const createUploadedAsset = (file: File): UploadedAsset => ({
  file,
  name: file.name,
  mimeType: file.type || "image/jpeg",
  previewUrl: URL.createObjectURL(file),
});

const revokeUploadedFiles = (uploadedFiles: UploadedFiles) => {
  if (uploadedFiles.identityFront) {
    URL.revokeObjectURL(uploadedFiles.identityFront.previewUrl);
  }
  if (uploadedFiles.identityBack) {
    URL.revokeObjectURL(uploadedFiles.identityBack.previewUrl);
  }
  Object.values(uploadedFiles.requirements).forEach((assets) => {
    assets.forEach((asset) => URL.revokeObjectURL(asset.previewUrl));
  });
};

const makePublicId = (prefix: string, name: string) =>
  `${prefix}/${Date.now()}-${name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;

export default function SellerRegistration() {
  const navigate = useNavigate();
  const location = useLocation();
  const routeState = location.state as RegisterRouteState | null;
  const [step, setStep] = useState<RegistrationStep>(
    routeState?.initialStep ?? 1,
  );
  const [registrationStatus, setRegistrationStatus] =
    useState<RegistrationStatus>(routeState?.registrationStatus ?? "success");
  const [form, setForm] = useState<RegistrationForm>(initialRegistrationForm);
  const [categories, setCategories] = useState<ShopCategory[]>([]);
  const [files, setFiles] = useState<UploadedFiles>(initialUploadedFiles);
  const [shopId, setShopId] = useState(routeState?.shopId ?? "");
  const [documentRequirements, setDocumentRequirements] = useState<
    ShopDocumentRequirement[]
  >([]);
  const [documentShopTypeName, setDocumentShopTypeName] = useState("");
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingRequirements, setLoadingRequirements] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const completedSteps = useMemo(
    () =>
      registrationSteps.filter((item) => item.id < step).map((item) => item.id),
    [step],
  );

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(normalizeCategories(data));
      } catch (err: unknown) {
        toast.error(getErrorMessage(err, "Lấy danh mục thất bại"));
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    if (step !== 2 || !shopId) return;

    const loadRequirements = async () => {
      setLoadingRequirements(true);
      try {
        const data = await fetchShopDocumentRequirements(shopId);
        const sortedRequirements = [...data.requirements].sort(
          (first, second) => (first.sortOrder ?? 0) - (second.sortOrder ?? 0),
        );
        setDocumentRequirements(sortedRequirements);
        setDocumentShopTypeName(data.shopType?.name ?? data.shopType?.code ?? "");
      } catch (err: unknown) {
        toast.error(getErrorMessage(err, "Lấy danh sách giấy tờ thất bại"));
      } finally {
        setLoadingRequirements(false);
      }
    };

    loadRequirements();
  }, [step, shopId]);

  const handleFileChange =
    (field: "identityFront" | "identityBack") =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      const asset = createUploadedAsset(file);

      setFiles((currentFiles) => {
        if (currentFiles[field]) {
          URL.revokeObjectURL(currentFiles[field].previewUrl);
        }

        return {
          ...currentFiles,
          [field]: asset,
        };
      });
    };

  const handleRequirementFileChange =
    (requirementId: string) => (event: ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(event.target.files ?? []);
      if (selectedFiles.length === 0) return;
      const assets = selectedFiles.map(createUploadedAsset);

      setFiles((currentFiles) => {
        currentFiles.requirements[requirementId]?.forEach((asset) =>
          URL.revokeObjectURL(asset.previewUrl),
        );

        return {
          ...currentFiles,
          requirements: {
            ...currentFiles.requirements,
            [requirementId]: assets,
          },
        };
      });
    };

  const handleSubmitStoreInfo = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;

    if (!form.storeName.trim()) {
      toast.error("Vui lòng nhập tên cửa hàng");
      return;
    }

    if (!form.taxCode.trim()) {
      toast.error("Vui lòng nhập mã số thuế");
      return;
    }

    if (form.categoryIds.length === 0) {
      toast.error("Vui lòng chọn ít nhất một danh mục");
      return;
    }

    setSubmitting(true);

    try {
      try {
        await createShop({
          shopName: form.storeName.trim(),
          registrationType: form.registrationType,
          taxCode: form.taxCode.trim(),
          businessType: form.businessType,
          categoryIds: form.categoryIds,
        });
      } catch (error: unknown) {
        if (!isExistingShopError(error)) {
          throw error;
        }
      }

      const currentShop = normalizeMyShop(await getMyShop());
      const nextShopId = currentShop?.id || currentShop?.shopId;

      if (!nextShopId) {
        throw new Error("Không tìm thấy mã cửa hàng để nộp giấy tờ");
      }

      setShopId(String(nextShopId));
      setStep(2);
      navigate("/register", {
        replace: true,
        state: { initialStep: 2, shopId: String(nextShopId) },
      });
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Đăng ký cửa hàng thất bại"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitDocuments = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;

    const missingRequirement = documentRequirements.find(
      (requirement) =>
        requirement.required &&
        (files.requirements[requirement.id]?.length ?? 0) === 0,
    );

    if (missingRequirement) {
      toast.error(`Vui lòng nộp ${missingRequirement.name}`);
      return;
    }

    if (!files.identityFront || !files.identityBack) {
      toast.error("Vui lòng nộp ảnh CCCD/CMND mặt trước và mặt sau");
      return;
    }

    if (!shopId) {
      toast.error("Không tìm thấy mã cửa hàng để nộp hồ sơ");
      return;
    }

    setSubmitting(true);

    try {
      const shopDocumentItems = documentRequirements.flatMap((requirement) =>
        (files.requirements[requirement.id] ?? []).map((asset) => ({
          docType: requirement.code,
          mimeType: asset.mimeType,
          fileUrl: asset.previewUrl,
          publicId: makePublicId(
            `shops/${shopId}/documents/${requirement.code}`,
            asset.name,
          ),
        })),
      );

      if (shopDocumentItems.length > 0) {
        try {
          await submitShopDocuments(shopId, { items: shopDocumentItems });
        } catch (error: unknown) {
          throw new Error(
            `Nộp hồ sơ pháp lý shop thất bại: ${getErrorMessage(
              error,
              "Lỗi không xác định",
            )}`,
            { cause: error },
          );
        }
      }

      try {
        await submitUserKyc({
          idType: form.identityType,
          documents: [
            {
              side: "FRONT",
              assetType: "IMAGE",
              mimeType: files.identityFront.mimeType,
              fileUrl: files.identityFront.previewUrl,
              publicId: makePublicId("kyc/front", files.identityFront.name),
            },
            {
              side: "BACK",
              assetType: "IMAGE",
              mimeType: files.identityBack.mimeType,
              fileUrl: files.identityBack.previewUrl,
              publicId: makePublicId("kyc/back", files.identityBack.name),
            },
          ],
        });
      } catch (error: unknown) {
        throw new Error(
          `Nộp hồ sơ KYC thất bại: ${getErrorMessage(
            error,
            "Lỗi không xác định",
          )}`,
          { cause: error },
        );
      }

      setRegistrationStatus("pending_kyc");
      setStep(3);
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Nộp hồ sơ đăng ký thất bại"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetryRegistration = () => {
    revokeUploadedFiles(files);
    setForm(initialRegistrationForm);
    setFiles(initialUploadedFiles);
    setShopId("");
    setDocumentRequirements([]);
    setDocumentShopTypeName("");
    setRegistrationStatus("success");
    setStep(1);
    navigate("/register", { replace: true, state: null });
  };

  return (
    <main className="seller-register-page">
      {((step === 1 && loadingCategories) ||
        loadingRequirements ||
        submitting) && <LoadingOverlay />}

      <StepProgress step={step} completedSteps={completedSteps} />

      {step === 1 && (
        <StoreInfoStep
          form={form}
          setForm={setForm}
          categories={categories}
          loadingCategories={loadingCategories}
          submitting={submitting}
          onSubmit={handleSubmitStoreInfo}
        />
      )}

      {step === 2 && (
        <VerificationStep
          form={form}
          files={files}
          setForm={setForm}
          onBack={() => setStep(1)}
          onFileChange={handleFileChange}
          onRequirementFileChange={handleRequirementFileChange}
          documentRequirements={documentRequirements}
          documentShopTypeName={documentShopTypeName}
          onSubmit={handleSubmitDocuments}
        />
      )}

      {step === 3 && (
        <CompletionStep
          status={registrationStatus}
          onRetry={handleRetryRegistration}
        />
      )}
    </main>
  );
}

function StepProgress({
  step,
  completedSteps,
}: {
  step: RegistrationStep;
  completedSteps: number[];
}) {
  return (
    <nav
      className={`seller-register-progress step-${step}`}
      aria-label="Tiến trình đăng ký"
    >
      {registrationSteps.map((item) => {
        const isComplete = completedSteps.includes(item.id);
        const isActive = step === item.id;

        return (
          <div
            key={item.id}
            className={`seller-register-step ${isActive ? "active" : ""} ${
              isComplete ? "complete" : ""
            }`}
          >
            <span className="seller-register-step-dot">
              {isComplete ? <Check size={16} /> : item.id}
            </span>
            <strong>{item.title}</strong>
          </div>
        );
      })}
    </nav>
  );
}
