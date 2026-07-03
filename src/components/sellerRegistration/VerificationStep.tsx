import { Camera, FileText, Upload } from "lucide-react";
import type { ChangeEvent, FormEvent, ReactNode } from "react";
import type { ShopDocumentRequirement } from "../../services/shop.api";
import type {
  RegistrationForm,
  UploadedAsset,
  UploadedFiles,
} from "./sellerRegistration";

type VerificationStepProps = {
  form: RegistrationForm;
  files: UploadedFiles;
  setForm: (form: RegistrationForm) => void;
  onBack: () => void;
  onFileChange: (
    field: "identityFront" | "identityBack",
  ) => (event: ChangeEvent<HTMLInputElement>) => void;
  onRequirementFileChange: (
    requirementId: string,
  ) => (event: ChangeEvent<HTMLInputElement>) => void;
  documentRequirements: ShopDocumentRequirement[];
  documentShopTypeName: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export default function VerificationStep({
  form,
  files,
  setForm,
  onBack,
  onFileChange,
  onRequirementFileChange,
  documentRequirements,
  documentShopTypeName,
  onSubmit,
}: VerificationStepProps) {
  return (
    <form className="seller-register-card documents" onSubmit={onSubmit}>
      <header className="seller-register-card-header compact">
        <h1>Xác thực tài liệu</h1>
        <p>
          Vui lòng cung cấp các ảnh giấy tờ pháp lý cần thiết để xác minh cửa
          hàng của bạn.
        </p>
      </header>

      <div className="seller-register-document-section">
        <div className="seller-register-document-title">
          <h2>Giấy tờ cần nộp</h2>
          {documentShopTypeName && <span>{documentShopTypeName}</span>}
        </div>

        {documentRequirements.length > 0 ? (
          <div className="seller-register-requirement-list">
            {documentRequirements.map((requirement) => {
              const selectedAssets = files.requirements[requirement.id] ?? [];

              return (
                <article
                  className="seller-register-requirement-item"
                  key={requirement.id}
                >
                  <div className="seller-register-requirement-copy">
                    <strong>
                      {requirement.name}
                      {requirement.required && <span> *</span>}
                    </strong>
                    {requirement.description && <p>{requirement.description}</p>}
                  </div>
                  <FileUploadBox
                    icon={<FileText size={24} />}
                    label={
                      requirement.multipleFilesAllowed
                        ? "Chọn một hoặc nhiều ảnh"
                        : "Chọn ảnh"
                    }
                    assets={selectedAssets}
                    multiple={requirement.multipleFilesAllowed}
                    onChange={onRequirementFileChange(requirement.id)}
                  />
                </article>
              );
            })}
          </div>
        ) : (
          <p className="seller-register-empty-category">
            Chưa có giấy tờ bổ sung cần nộp cho loại shop này.
          </p>
        )}
        <p className="seller-register-file-note">
          Định dạng ảnh: JPG, JPEG, PNG.
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
            <option value="CCCD">CCCD/CMND</option>
            <option value="PASSPORT">Hộ chiếu</option>
          </select>
        </label>

        <div className="seller-register-id-grid">
          <FileUploadBox
            compact
            icon={<Camera size={22} />}
            label="Tải ảnh mặt trước"
            assets={files.identityFront ? [files.identityFront] : []}
            onChange={onFileChange("identityFront")}
          />
          <FileUploadBox
            compact
            icon={<Camera size={22} />}
            label="Tải ảnh mặt sau"
            assets={files.identityBack ? [files.identityBack] : []}
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
  assets,
  compact = false,
  multiple = false,
  onChange,
}: {
  icon: ReactNode;
  label: string;
  assets: UploadedAsset[];
  compact?: boolean;
  multiple?: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label className={`seller-register-upload ${compact ? "compact" : ""}`}>
      <input
        type="file"
        accept="image/png,image/jpeg,image/jpg"
        multiple={multiple}
        onChange={onChange}
      />
      <span className="seller-register-upload-icon">{icon}</span>
      <strong>{assets.length > 0 ? assets.map((asset) => asset.name).join(", ") : label}</strong>
      {assets.length > 0 && (
        <div className="seller-register-preview-grid">
          {assets.map((asset) => (
            <img key={asset.previewUrl} src={asset.previewUrl} alt={asset.name} />
          ))}
        </div>
      )}
      {!compact && (
        <span className="seller-register-upload-btn">
          <Upload size={14} />
          Chọn tệp
        </span>
      )}
    </label>
  );
}
