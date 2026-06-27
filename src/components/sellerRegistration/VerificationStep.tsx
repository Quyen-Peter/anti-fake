import { Camera, FileText, Upload } from "lucide-react";
import type { ChangeEvent, FormEvent, ReactNode } from "react";
import type { RegistrationForm, UploadedFiles } from "./sellerRegistration";

type VerificationStepProps = {
  form: RegistrationForm;
  files: UploadedFiles;
  setForm: (form: RegistrationForm) => void;
  onBack: () => void;
  onFileChange: (
    field: keyof UploadedFiles,
  ) => (event: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export default function VerificationStep({
  form,
  files,
  setForm,
  onBack,
  onFileChange,
  onSubmit,
}: VerificationStepProps) {
  return (
    <form className="seller-register-card documents" onSubmit={onSubmit}>
      <header className="seller-register-card-header compact">
        <h1>Xác thực tài liệu</h1>
        <p>
          Vui lòng cung cấp các giấy tờ pháp lý cần thiết để xác minh cửa hàng
          của bạn.
        </p>
      </header>

      <div className="seller-register-document-section">
        <h2>Giấy phép kinh doanh</h2>
        <FileUploadBox
          icon={<FileText size={28} />}
          label="Kéo và thả tệp vào đây hoặc nhấn nút để tải lên"
          fileName={files.businessLicense}
          onChange={onFileChange("businessLicense")}
        />
        <p className="seller-register-file-note">
          Định dạng: JPG, PNG, PDF. Dung lượng tối đa: 5MB.
        </p>
      </div>

      <div className="seller-register-document-section">
        <h2>Giấy tờ định danh chủ sở hữu</h2>
        <label className="seller-register-field full">
          <span>Loại giấy tờ</span>
          <select
            value={form.identityType}
            onChange={(event) =>
              setForm({ ...form, identityType: event.target.value })
            }
          >
            <option>CCCD/CMND</option>
            <option>Hộ chiếu</option>
          </select>
        </label>

        <div className="seller-register-id-grid">
          <FileUploadBox
            compact
            icon={<Camera size={22} />}
            label="Tải ảnh mặt trước"
            fileName={files.identityFront}
            onChange={onFileChange("identityFront")}
          />
          <FileUploadBox
            compact
            icon={<Camera size={22} />}
            label="Tải ảnh mặt sau"
            fileName={files.identityBack}
            onChange={onFileChange("identityBack")}
          />
        </div>
      </div>

      <footer className="seller-register-actions split">
        <button
          type="button"
          className="seller-register-outline-btn"
          onClick={onBack}
        >
          Quay lại
        </button>
        <button type="submit" className="seller-register-primary-btn">
          Tiếp theo
        </button>
      </footer>
    </form>
  );
}

function FileUploadBox({
  icon,
  label,
  fileName,
  compact = false,
  onChange,
}: {
  icon: ReactNode;
  label: string;
  fileName?: string;
  compact?: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label className={`seller-register-upload ${compact ? "compact" : ""}`}>
      <input type="file" onChange={onChange} />
      <span className="seller-register-upload-icon">{icon}</span>
      <strong>{fileName || label}</strong>
      {!compact && (
        <span className="seller-register-upload-btn">
          <Upload size={14} />
          Chọn tệp
        </span>
      )}
    </label>
  );
}
