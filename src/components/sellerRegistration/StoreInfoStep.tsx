import { ArrowRight } from "lucide-react";
import type { FormEvent } from "react";
import type {
  RegistrationForm,
  ShopCategory,
  ShopRegistrationType,
} from "./sellerRegistration";

type StoreInfoStepProps = {
  form: RegistrationForm;
  setForm: (form: RegistrationForm) => void;
  categories: ShopCategory[];
  loadingCategories: boolean;
  submitting: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export default function StoreInfoStep({
  form,
  setForm,
  categories,
  loadingCategories,
  submitting,
  onSubmit,
}: StoreInfoStepProps) {
  const toggleCategory = (categoryId: string) => {
    const isSelected = form.categoryIds.includes(categoryId);

    setForm({
      ...form,
      categoryIds: isSelected
        ? form.categoryIds.filter((item) => item !== categoryId)
        : [...form.categoryIds, categoryId],
    });
  };

  return (
    <form className="seller-register-card" onSubmit={onSubmit}>
      <header className="seller-register-card-header">
        <h1>Đăng ký Cửa hàng mới</h1>
        <p>
          Chào mừng bạn đến với mạng lưới liêm chính AntiFake. Vui lòng cung
          cấp chi tiết doanh nghiệp của bạn để bắt đầu.
        </p>
      </header>

      <div className="seller-register-section">
        <label className="seller-register-field full">
          <span>Tên Cửa hàng</span>
          <input
            value={form.storeName}
            disabled={submitting}
            onChange={(event) =>
              setForm({ ...form, storeName: event.target.value })
            }
          />
        </label>

        <div className="seller-register-grid">
          <label className="seller-register-field">
            <span>Loại hình đăng ký</span>
            <select
              value={form.registrationType}
              disabled={submitting}
              onChange={(event) =>
                setForm({
                  ...form,
                  registrationType: event.target.value as ShopRegistrationType,
                })
              }
            >
              <option value="NORMAL">Thông thường</option>
              <option value="HANDMADE">Thủ công</option>
              <option value="MANUFACTURER">Nhà sản xuất</option>
              <option value="DISTRIBUTOR">Nhà phân phối</option>
            </select>
          </label>

          <label className="seller-register-field">
            <span>Mã số thuế</span>
            <input
              value={form.taxCode}
              disabled={submitting}
              onChange={(event) =>
                setForm({ ...form, taxCode: event.target.value })
              }
            />
          </label>
        </div>

        <fieldset className="seller-register-fieldset">
          <legend>Quy mô kinh doanh</legend>
          <div className="seller-register-business-grid">
            <label
              className={`seller-register-business-option ${
                form.businessType === "MANUFACTURER" ? "active" : ""
              }`}
            >
              <input
                type="radio"
                name="businessType"
                checked={form.businessType === "MANUFACTURER"}
                disabled={submitting}
                onChange={() =>
                  setForm({ ...form, businessType: "MANUFACTURER" })
                }
              />
              <span>
                <strong>Công ty</strong>
                <small>Tự sản xuất và phân phối sản phẩm gốc</small>
              </span>
            </label>

            <label
              className={`seller-register-business-option ${
                form.businessType === "DISTRIBUTOR" ? "active" : ""
              }`}
            >
              <input
                type="radio"
                name="businessType"
                checked={form.businessType === "DISTRIBUTOR"}
                disabled={submitting}
                onChange={() =>
                  setForm({ ...form, businessType: "DISTRIBUTOR" })
                }
              />
              <span>
                <strong>Hộ kinh doanh</strong>
                <small>Phân phối các sản phẩm từ đối tác hoặc cá nhân</small>
              </span>
            </label>
          </div>
        </fieldset>

        <fieldset className="seller-register-fieldset seller-register-category-fieldset">
          <legend>Danh mục Sản phẩm</legend>
          {categories.length > 0 ? (
            <div className="seller-register-category-list">
              {categories.map((category) => {
                const categoryId = String(category.id);
                const checked = form.categoryIds.includes(categoryId);

                return (
                  <label
                    key={categoryId}
                    className={`seller-register-category-option ${
                      checked ? "active" : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={submitting}
                      onChange={() => toggleCategory(categoryId)}
                    />
                    <span>{category.name}</span>
                  </label>
                );
              })}
            </div>
          ) : (
            <p className="seller-register-empty-category">
              {loadingCategories
                ? "Đang tải danh mục..."
                : "Chưa có danh mục nào."}
            </p>
          )}
          <small>{form.categoryIds.length} danh mục đã chọn</small>
        </fieldset>
      </div>

      <footer className="seller-register-actions">
        <button
          type="submit"
          className="seller-register-primary-btn"
          disabled={submitting || loadingCategories}
        >
          Đăng ký <ArrowRight size={18} />
        </button>
      </footer>
    </form>
  );
}
