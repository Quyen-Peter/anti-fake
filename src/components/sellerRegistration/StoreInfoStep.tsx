import { ArrowRight } from "lucide-react";
import type { FormEvent } from "react";
import type { RegistrationForm } from "./sellerRegistration";

type StoreInfoStepProps = {
  form: RegistrationForm;
  setForm: (form: RegistrationForm) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

const productCategories = [
  "Linh kiện Điện tử",
  "Cơ khí chính xác",
  "Thời trang",
  "Mỹ phẩm",
  "Thực phẩm",
  "Thiết bị gia dụng",
  "Nội thất",
  "Vật liệu xây dựng",
];

export default function StoreInfoStep({
  form,
  setForm,
  onSubmit,
}: StoreInfoStepProps) {
  const toggleCategory = (category: string) => {
    const isSelected = form.categories.includes(category);

    setForm({
      ...form,
      categories: isSelected
        ? form.categories.filter((item) => item !== category)
        : [...form.categories, category],
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
              onChange={(event) =>
                setForm({ ...form, registrationType: event.target.value })
              }
            >
              <option value="MANUFACTURER">MANUFACTURER</option>
              <option value="DISTRIBUTOR">DISTRIBUTOR</option>
              <option value="RETAILER">RETAILER</option>
            </select>
          </label>

          <label className="seller-register-field">
            <span>Mã số thuế</span>
            <input
              value={form.taxCode}
              onChange={(event) =>
                setForm({ ...form, taxCode: event.target.value })
              }
            />
          </label>
        </div>

        <fieldset className="seller-register-fieldset">
          <legend>Loại hình kinh doanh</legend>
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
                onChange={() =>
                  setForm({ ...form, businessType: "MANUFACTURER" })
                }
              />
              <span>
                <strong>Nhà sản xuất</strong>
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
          <div className="seller-register-category-list">
            {productCategories.map((category) => {
              const checked = form.categories.includes(category);

              return (
                <label
                  key={category}
                  className={`seller-register-category-option ${
                    checked ? "active" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleCategory(category)}
                  />
                  <span>{category}</span>
                </label>
              );
            })}
          </div>
          <small>{form.categories.length} danh mục đã chọn</small>
        </fieldset>
      </div>

      <footer className="seller-register-actions">
        <button type="button" className="seller-register-link-btn">
          Lưu nháp
        </button>
        <button type="submit" className="seller-register-primary-btn">
          Tiếp theo <ArrowRight size={18} />
        </button>
      </footer>
    </form>
  );
}
