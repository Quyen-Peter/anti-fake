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
import LoadingOverlay from "../loadingOverlay";
import "../../css/components/sellerRegistration/sellerRegistration.css";
import { fetchCategories } from "../../services/category.api";
import { createShop } from "../../services/shop.api";
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

export type UploadedFiles = {
  businessLicense?: string;
  identityFront?: string;
  identityBack?: string;
};

export type ShopCategory = {
  id: string | number;
  name: string;
};

type RegisterRouteState = {
  initialStep?: RegistrationStep;
  registrationStatus?: RegistrationStatus;
};

const initialRegistrationForm: RegistrationForm = {
  storeName: "",
  registrationType: "MANUFACTURER",
  taxCode: "",
  businessType: "MANUFACTURER",
  categoryIds: [],
  identityType: "CCCD/CMND",
};

const registrationSteps = [
  { id: 1, title: "Thông tin cửa hàng" },
  { id: 2, title: "Xác thực tài liệu" },
  { id: 3, title: "Hoàn tất" },
] as const;

const normalizeCategories = (data: any): ShopCategory[] => {
  const payload = data?.data ?? data?.items ?? data;
  return Array.isArray(payload) ? payload : [];
};

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
  const [files, setFiles] = useState<UploadedFiles>({});
  const [loadingCategories, setLoadingCategories] = useState(true);
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
      } catch (err: any) {
        toast.error(err.message || "Lấy danh mục thất bại");
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  const handleFileChange =
    (field: keyof UploadedFiles) => (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      setFiles((currentFiles) => ({
        ...currentFiles,
        [field]: file.name,
      }));
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
      await createShop({
        shopName: form.storeName.trim(),
        registrationType: form.registrationType,
        taxCode: form.taxCode.trim(),
        businessType: form.businessType,
        categoryIds: form.categoryIds,
      });

      setRegistrationStatus("pending_kyc");
      setStep(3);
      navigate("/register", {
        replace: true,
        state: { initialStep: 3, registrationStatus: "pending_kyc" },
      });
    } catch (err: any) {
      toast.error(err.message || "Đăng ký cửa hàng thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitDocuments = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setRegistrationStatus("pending_kyc");
    setStep(3);
  };

  const handleRetryRegistration = () => {
    setForm(initialRegistrationForm);
    setFiles({});
    setRegistrationStatus("success");
    setStep(1);
    navigate("/register", { replace: true, state: null });
  };

  return (
    <main className="seller-register-page">
      {((step === 1 && loadingCategories) || submitting) && <LoadingOverlay />}

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
