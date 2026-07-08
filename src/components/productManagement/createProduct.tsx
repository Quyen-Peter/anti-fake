import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { toast } from "sonner";
import "../../css/components/productManagement/createProduct.css";
import { fetchBrands, type Brand } from "../../services/brand.api";
import { createOffer, type CreateOfferPayload } from "../../services/product.api";
import {
  fetchShopCategories,
  getMyShop,
  type ShopCategory,
} from "../../services/shop.api";

type CreateProductProps = {
  onCancel?: () => void;
  onCreated?: () => void;
};

type ProductForm = Omit<
  CreateOfferPayload,
  | "price"
  | "availableQuantity"
  | "weightGrams"
  | "lengthCm"
  | "widthCm"
  | "heightCm"
> & {
  price: string;
  availableQuantity: string;
  weightGrams: string;
  lengthCm: string;
  widthCm: string;
  heightCm: string;
};

const MAX_PRODUCT_IMAGES = 4;

const initialForm: ProductForm = {
  categoryId: "",
  brandId: "",
  title: "",
  description: "",
  productImages: ["", "", "", ""],
  price: "",
  currency: "VND",
  itemCondition: "new",
  availableQuantity: "",
  gtin: "",
  model: "",
  weightGrams: "",
  lengthCm: "",
  widthCm: "",
  heightCm: "",
};

const normalizeMyShop = (data: unknown) => {
  if (!data || typeof data !== "object") return null;
  const record = data as Record<string, unknown>;
  const payload = record.data ?? record.items ?? data;

  if (Array.isArray(payload)) return payload[0] ?? null;
  return payload && typeof payload === "object"
    ? (payload as Record<string, unknown>)
    : null;
};

const toPayloadNumber = (value: string) => Number(value || 0);

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

const fileToDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Khong the doc file anh"));
    reader.readAsDataURL(file);
  });

export default function CreateProduct({
  onCancel,
  onCreated,
}: CreateProductProps) {
  const [form, setForm] = useState<ProductForm>(initialForm);
  const [categories, setCategories] = useState<ShopCategory[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [brandSearch, setBrandSearch] = useState("");
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingBrands, setLoadingBrands] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const filteredBrands = useMemo(() => {
    const keyword = brandSearch.trim().toLowerCase();
    if (!keyword) return brands;

    return brands.filter((brand) => brand.name.toLowerCase().includes(keyword));
  }, [brandSearch, brands]);

  useEffect(() => {
    let cancelled = false;

    const loadShopCategories = async () => {
      try {
        const shopData = await getMyShop();
        const shop = normalizeMyShop(shopData);
        const shopId = shop?.shopId ?? shop?.id;

        if (!shopId) {
          if (!cancelled) setCategories([]);
          return;
        }

        const data = await fetchShopCategories(String(shopId));
        if (!cancelled) setCategories(data);
      } catch (error: unknown) {
        toast.error(
          getErrorMessage(error, "Không thể lấy danh mục cửa hàng"),
        );
      } finally {
        if (!cancelled) setLoadingCategories(false);
      }
    };

    loadShopCategories();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadBrands = async () => {
      try {
        const data = await fetchBrands();
        if (!cancelled) setBrands(data);
      } catch (error: unknown) {
        toast.error(
          getErrorMessage(error, "Khong the lay danh sach thuong hieu"),
        );
      } finally {
        if (!cancelled) setLoadingBrands(false);
      }
    };

    loadBrands();

    return () => {
      cancelled = true;
    };
  }, []);

  const updateField = <K extends keyof ProductForm>(
    field: K,
    value: ProductForm[K],
  ) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const buildPayload = (): CreateOfferPayload => ({
    ...form,
    title: form.title.trim(),
    description: form.description.trim(),
    brandId: form.brandId.trim(),
    gtin: form.gtin.trim(),
    model: form.model.trim(),
    productImages: form.productImages.map((image) => image.trim()).filter(Boolean),
    price: toPayloadNumber(form.price),
    availableQuantity: toPayloadNumber(form.availableQuantity),
    weightGrams: toPayloadNumber(form.weightGrams),
    lengthCm: toPayloadNumber(form.lengthCm),
    widthCm: toPayloadNumber(form.widthCm),
    heightCm: toPayloadNumber(form.heightCm),
  });

  const handleProductImagesChange = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(event.target.files ?? []).filter((file) =>
      file.type.startsWith("image/"),
    );
    event.target.value = "";

    if (files.length === 0) return;

    const currentImages = form.productImages.filter(Boolean);
    const availableSlots = MAX_PRODUCT_IMAGES - currentImages.length;

    if (availableSlots <= 0) {
      toast.warning(`Chỉ được chọn tối đa ${MAX_PRODUCT_IMAGES} ảnh`);
      return;
    }

    const acceptedFiles = files.slice(0, availableSlots);
    if (files.length > acceptedFiles.length) {
      toast.warning(`Chỉ được chọn tối đa ${MAX_PRODUCT_IMAGES} ảnh`);
    }

    try {
      const nextImages = await Promise.all(acceptedFiles.map(fileToDataUrl));
      updateField("productImages", [...currentImages, ...nextImages]);
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Không thể đọc ảnh sản phẩm"));
    }
  };

  const removeProductImage = (index: number) => {
    const currentImages = form.productImages.filter(Boolean);
    updateField(
      "productImages",
      currentImages.filter((_, currentIndex) => currentIndex !== index),
    );
  };

  const validatePayload = (payload: CreateOfferPayload) => {
    if (!payload.title || !payload.categoryId || !payload.brandId) {
      return "Vui lòng nhập tên sản phẩm, danh mục và thương hiệu";
    }

    if (!payload.description) {
      return "Vui lòng nhập mô tả sản phẩm";
    }

    if (payload.productImages.length === 0) {
      return "Vui lòng thêm ít nhất một ảnh sản phẩm";
    }

    if (payload.productImages.length > MAX_PRODUCT_IMAGES) {
      return `Chỉ được nhập tối đa ${MAX_PRODUCT_IMAGES} ảnh`;
    }

    if (payload.price <= 0) {
      return "Giá sản phẩm phải lớn hơn 0";
    }

    if (payload.availableQuantity < 0) {
      return "Số lượng có sẵn không được âm";
    }

    if (!payload.gtin || !payload.model) {
      return "Vui lòng nhập GTIN và model sản phẩm";
    }

    if (
      payload.weightGrams <= 0 ||
      payload.lengthCm <= 0 ||
      payload.widthCm <= 0 ||
      payload.heightCm <= 0
    ) {
      return "Vui lòng nhập đầy đủ cân nặng và kích thước hợp lệ";
    }

    return "";
  };

  const handleSubmit = async () => {
    const payload = buildPayload();
    const validationError = validatePayload(payload);

    if (validationError) {
      toast.error(validationError);
      return;
    }

    setSubmitting(true);

    try {
      await createOffer(payload);
      toast.success("Tạo sản phẩm mới thành công");
      onCreated?.();
      onCancel?.();
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Không thể tạo sản phẩm mới"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="create-product-page">
      <div className="create-product-card">
        <div className="create-header">
          <div>
            <h2>Tạo sản phẩm</h2>
            <p>Đăng sản phẩm mới lên cửa hàng của bạn</p>
          </div>
        </div>

        <section className="create-section">
          <h3>Ảnh sản phẩm</h3>
          <div className="form-group">
            <label className="required">Ảnh sản phẩm</label>
            <div className="upload-grid">
              {form.productImages.filter(Boolean).map((image, index) => (
                <div key={index} className="upload-preview">
                  <img src={image} alt={`Ảnh sản phẩm ${index + 1}`} />
                  <button
                    type="button"
                    className="upload-remove"
                    aria-label="Xóa ảnh sản phẩm"
                    onClick={() => removeProductImage(index)}
                  >
                    x
                  </button>
                  {index === 0 && <div className="upload-cover">Ảnh bìa</div>}
                </div>
              ))}

              {form.productImages.filter(Boolean).length < MAX_PRODUCT_IMAGES && (
                <label className="upload-box">
                  <span>+</span>
                  <span>Chọn ảnh</span>
                  <input
                    className="upload-input"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleProductImagesChange}
                  />
                </label>
              )}
            </div>
            <small>
              Chọn tối đa 4 ảnh từ thư mục, ảnh đầu tiên là ảnh bìa.
            </small>
          </div>
        </section>

        <section className="create-section">
          <h3>Thông tin cơ bản</h3>
          <div className="form-group">
            <label className="required">Tên sản phẩm</label>
            <input
              value={form.title}
              onChange={(event) => updateField("title", event.target.value)}
              placeholder="Kem chống nắng SPF50 - lô 2026"
            />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="required">Danh mục</label>
              <select
                value={form.categoryId}
                disabled={loadingCategories}
                onChange={(event) =>
                  updateField("categoryId", event.target.value)
                }
              >
                <option value="">
                  {loadingCategories ? "Đang tải danh mục..." : "Chọn danh mục"}
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={String(category.id)}>
                    {category.name}
                  </option>
                ))}
              </select>
              {!loadingCategories && categories.length === 0 && (
                <small>Cửa hàng chưa có danh mục nào.</small>
              )}
            </div>

            <div className="form-group">
              <label className="required">Thương hiệu</label>
              <div className="brand-picker">
                <input
                  value={brandSearch}
                  disabled={loadingBrands}
                  onChange={(event) => setBrandSearch(event.target.value)}
                  placeholder="Tìm thương hiệu..."
                />
                <select
                  value={form.brandId}
                  disabled={loadingBrands}
                  onChange={(event) =>
                    updateField("brandId", event.target.value)
                  }
                >
                  <option value="">
                    {loadingBrands
                      ? "Đang tải thương hiệu..."
                      : "Chọn thương hiệu"}
                  </option>
                  {filteredBrands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>
              {!loadingBrands && brands.length === 0 && (
                <small>Chưa có thương hiệu nào.</small>
              )}
              {!loadingBrands &&
                brands.length > 0 &&
                filteredBrands.length === 0 && (
                  <small>Không tìm thấy thương hiệu phù hợp.</small>
                )}
            </div>
          </div>

          <div className="form-group">
            <label className="required">Mô tả sản phẩm</label>
            <textarea
              rows={7}
              value={form.description}
              onChange={(event) =>
                updateField("description", event.target.value)
              }
              placeholder="Mô tả sản phẩm..."
            />
          </div>
        </section>

        <section className="create-section">
          <h3>Giá bán và kho</h3>
          <div className="grid-3">
            <div className="form-group">
              <label className="required">Giá</label>
              <input
                type="number"
                min={0}
                value={form.price}
                onChange={(event) =>
                  updateField("price", event.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label>Tiền tệ</label>
              <select value={form.currency} disabled>
                <option value="VND">VND</option>
              </select>
            </div>

            <div className="form-group">
              <label className="required">Số lượng có sẵn</label>
              <input
                type="number"
                min={0}
                value={form.availableQuantity}
                onChange={(event) =>
                  updateField("availableQuantity", event.target.value)
                }
              />
            </div>
          </div>
        </section>

        <section className="create-section">
          <h3>Nhận diện sản phẩm</h3>
          <div className="grid-2">
            <div className="form-group">
              <label className="required">GTIN</label>
              <input
                value={form.gtin}
                onChange={(event) => updateField("gtin", event.target.value)}
                placeholder="8930000000141"
              />
            </div>

            <div className="form-group">
              <label className="required">Model</label>
              <input
                value={form.model}
                onChange={(event) => updateField("model", event.target.value)}
                placeholder="Kem chống nắng SPF50"
              />
            </div>
          </div>

          <div className="create-product-choice-group">
            <label className="create-product-choice">
              <input
                type="radio"
                name="itemCondition"
                checked={form.itemCondition === "new"}
                onChange={() => updateField("itemCondition", "new")}
              />
              <span>Mới</span>
            </label>
            <label className="create-product-choice">
              <input
                type="radio"
                name="itemCondition"
                checked={form.itemCondition === "used"}
                onChange={() => updateField("itemCondition", "used")}
              />
              <span>Đã qua sử dụng</span>
            </label>
          </div>
        </section>

        <section className="create-section">
          <h3>Vận chuyển</h3>
          <div className="grid-4">
            <div className="form-group">
              <label className="required">Cân nặng (gram)</label>
              <input
                type="number"
                min={0}
                value={form.weightGrams}
                onChange={(event) =>
                  updateField("weightGrams", event.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label className="required">Dài (cm)</label>
              <input
                type="number"
                min={0}
                value={form.lengthCm}
                onChange={(event) =>
                  updateField("lengthCm", event.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label className="required">Rộng (cm)</label>
              <input
                type="number"
                min={0}
                value={form.widthCm}
                onChange={(event) =>
                  updateField("widthCm", event.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label className="required">Cao (cm)</label>
              <input
                type="number"
                min={0}
                value={form.heightCm}
                onChange={(event) =>
                  updateField("heightCm", event.target.value)
                }
              />
            </div>
          </div>
        </section>

        <footer className="create-footer">
          <p>Kiểm tra lại thông tin trước khi xác nhận đăng sản phẩm.</p>
          <div>
            <button
              className="btn-outline"
              type="button"
              disabled={submitting}
              onClick={onCancel}
            >
              Hủy
            </button>
            <button
              className={`btn-primary ${submitting ? "btn-loading" : ""}`}
              type="button"
              disabled={submitting}
              onClick={handleSubmit}
            >
              {submitting ? "Đang tạo..." : "Xác nhận đăng sản phẩm"}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
