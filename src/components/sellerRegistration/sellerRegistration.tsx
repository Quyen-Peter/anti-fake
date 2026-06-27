import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { Check } from "lucide-react";
import "../../css/components/sellerRegistration/sellerRegistration.css";
import CompletionStep from "./CompletionStep";
import StoreInfoStep from "./StoreInfoStep";
import VerificationStep from "./VerificationStep";

export type RegistrationStep = 1 | 2 | 3;
export type BusinessType = "MANUFACTURER" | "DISTRIBUTOR";

export type RegistrationForm = {
  storeName: string;
  registrationType: string;
  taxCode: string;
  businessType: BusinessType;
  categories: string[];
  identityType: string;
};

export type UploadedFiles = {
  businessLicense?: string;
  identityFront?: string;
  identityBack?: string;
};

const initialRegistrationForm: RegistrationForm = {
  storeName: "Công ty TNHH Sản Xuất ABC",
  registrationType: "MANUFACTURER",
  taxCode: "0312345678",
  businessType: "MANUFACTURER",
  categories: ["Linh kiện Điện tử", "Cơ khí chính xác"],
  identityType: "CCCD/CMND",
};

const registrationSteps = [
  { id: 1, title: "Thông tin cửa hàng" },
  { id: 2, title: "Xác thực tài liệu" },
  { id: 3, title: "Hoàn tất" },
] as const;

export default function SellerRegistration() {
  const [step, setStep] = useState<RegistrationStep>(1);
  const [form, setForm] = useState<RegistrationForm>(initialRegistrationForm);
  const [files, setFiles] = useState<UploadedFiles>({});

  const completedSteps = useMemo(
    () =>
      registrationSteps.filter((item) => item.id < step).map((item) => item.id),
    [step],
  );

  const handleFileChange =
    (field: keyof UploadedFiles) => (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      setFiles((currentFiles) => ({
        ...currentFiles,
        [field]: file.name,
      }));
    };

  const handleSubmitStoreInfo = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStep(2);
  };

  const handleSubmitDocuments = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStep(3);
  };

  return (
    <main className="seller-register-page">
      <StepProgress step={step} completedSteps={completedSteps} />

      {step === 1 && (
        <StoreInfoStep
          form={form}
          setForm={setForm}
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

      {step === 3 && <CompletionStep />}
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
