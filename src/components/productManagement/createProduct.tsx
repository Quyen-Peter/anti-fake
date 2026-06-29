import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
} from "react";
import { toast } from "sonner";
import "../../css/components/productManagement/createProduct.css";
import {
  fetchShopCategories,
  getMyShop,
  type ShopCategory,
} from "../../services/shop.api";

type CreateProductProps = {
  onCancel?: () => void;
};

type ImageItem = {
  id: string;
  file: File;
  preview: string;
};

type ProductForm = {
  productImages: File[];
  title: string;
  categoryId: string;
  brandId: string;
  description: string;
  descriptionImages: File[];
  price: number;
  currency: "VND";
  salesMode: "RETAIL" | "WHOLESALE";
  minWholesaleQty?: number;
  availableQuantity: number;
  itemCondition: "new" | "used";
};

const MAX_PRODUCT_IMAGES = 4;
const MAX_DESCRIPTION_IMAGES = 10;

const initialForm: ProductForm = {
  productImages: [],
  title: "",
  categoryId: "",
  brandId: "",
  description: "",
  descriptionImages: [],
  price: 0,
  currency: "VND",
  salesMode: "RETAIL",
  minWholesaleQty: undefined,
  availableQuantity: 0,
  itemCondition: "new",
};

const normalizeMyShop = (data: any) => {
  const payload = data?.data ?? data?.items ?? data;
  if (Array.isArray(payload)) return payload[0] ?? null;
  return payload && typeof payload === "object" ? payload : null;
};

export default function CreateProduct({ onCancel }: CreateProductProps) {
  const [form, setForm] = useState<ProductForm>(initialForm);
  const [productImages, setProductImages] = useState<ImageItem[]>([]);
  const [descriptionImageItems, setDescriptionImageItems] = useState<
    ImageItem[]
  >([]);
  const [categories, setCategories] = useState<ShopCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const productImagesRef = useRef<ImageItem[]>([]);
  const descriptionImagesRef = useRef<ImageItem[]>([]);

  useEffect(() => {
    productImagesRef.current = productImages;
    setForm((current) => ({
      ...current,
      productImages: productImages.map((image) => image.file),
    }));
  }, [productImages]);

  useEffect(() => {
    descriptionImagesRef.current = descriptionImageItems;
    setForm((current) => ({
      ...current,
      descriptionImages: descriptionImageItems.map((image) => image.file),
    }));
  }, [descriptionImageItems]);

  useEffect(() => {
    const loadShopCategories = async () => {
      try {
        const shopData = await getMyShop();
        const shop = normalizeMyShop(shopData);
        const shopId = shop?.shopId || shop?.id;

        if (!shopId) {
          setCategories([]);
          return;
        }

        const data = await fetchShopCategories(String(shopId));
        setCategories(data);
      } catch (err: any) {
        toast.error(err.message || "Không thể lấy danh mục cửa hàng");
      } finally {
        setLoadingCategories(false);
      }
    };

    loadShopCategories();
  }, []);

  useEffect(() => {
    return () => {
      productImagesRef.current.forEach((image) =>
        URL.revokeObjectURL(image.preview),
      );
      descriptionImagesRef.current.forEach((image) =>
        URL.revokeObjectURL(image.preview),
      );
    };
  }, []);

  const createImageItems = (files: FileList | null) => {
    if (!files) return [];

    return Array.from(files)
      .filter((file) => file.type.startsWith("image/"))
      .map((file, index) => ({
        id: `${Date.now()}-${file.name}-${index}`,
        file,
        preview: URL.createObjectURL(file),
      }));
  };

  const addImages = (
    files: FileList | null,
    currentCount: number,
    maxImages: number,
    setImages: Dispatch<SetStateAction<ImageItem[]>>,
  ) => {
    const nextImages = createImageItems(files);
    const availableSlots = maxImages - currentCount;
    const acceptedImages = nextImages.slice(0, availableSlots);
    const rejectedImages = nextImages.slice(availableSlots);

    rejectedImages.forEach((image) => URL.revokeObjectURL(image.preview));
    if (rejectedImages.length > 0) {
      toast.warning(`Chỉ được tải tối đa ${maxImages} ảnh`);
    }

    setImages((currentImages) => [...currentImages, ...acceptedImages]);
  };

  const handleProductImagesChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    addImages(
      event.target.files,
      productImages.length,
      MAX_PRODUCT_IMAGES,
      setProductImages,
    );
    event.target.value = "";
  };

  const handleDescriptionImagesChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    addImages(
      event.target.files,
      descriptionImageItems.length,
      MAX_DESCRIPTION_IMAGES,
      setDescriptionImageItems,
    );
    event.target.value = "";
  };

  const removeImage = (
    imageId: string,
    setImages: Dispatch<SetStateAction<ImageItem[]>>,
  ) => {
    setImages((currentImages) => {
      const removedImage = currentImages.find((image) => image.id === imageId);
      if (removedImage) URL.revokeObjectURL(removedImage.preview);
      return currentImages.filter((image) => image.id !== imageId);
    });
  };

  const handleSubmit = () => {
    if (form.productImages.length === 0) {
      toast.error("Vui lòng thêm ít nhất một ảnh sản phẩm");
      return;
    }

    if (!form.title.trim() || !form.categoryId || !form.brandId.trim()) {
      toast.error("Vui lòng nhập đầy đủ thông tin cơ bản");
      return;
    }

    if (!form.description.trim() || form.price <= 0 || form.availableQuantity < 0) {
      toast.error("Vui lòng nhập đầy đủ mô tả, giá và số lượng");
      return;
    }

    toast.success("Thông tin sản phẩm đã sẵn sàng để gửi API");
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
              {productImages.map((image, index) => (
                <div key={image.id} className="upload-preview">
                  <img src={image.preview} alt={`Ảnh sản phẩm ${index + 1}`} />
                  <button
                    type="button"
                    className="upload-remove"
                    aria-label="Xóa ảnh sản phẩm"
                    onClick={() => removeImage(image.id, setProductImages)}
                  >
                    x
                  </button>
                  {index === 0 && <div className="upload-cover">Ảnh bìa</div>}
                </div>
              ))}

              {productImages.length < MAX_PRODUCT_IMAGES && (
                <label className="upload-box">
                  <span>+</span>
                  <span>Thêm ảnh</span>
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
            <small>Tối đa 4 ảnh, ảnh đầu tiên là ảnh bìa</small>
          </div>
        </section>

        <section className="create-section">
          <h3>Thông tin cơ bản</h3>
          <div className="form-group">
            <label className="required">Tên sản phẩm</label>
            <input
              value={form.title}
              onChange={(event) =>
                setForm({ ...form, title: event.target.value })
              }
              placeholder="Nhập tên sản phẩm..."
            />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="required">Danh mục</label>
              <select
                value={form.categoryId}
                disabled={loadingCategories}
                onChange={(event) =>
                  setForm({ ...form, categoryId: event.target.value })
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
              <input
                value={form.brandId}
                onChange={(event) =>
                  setForm({ ...form, brandId: event.target.value })
                }
                placeholder="Nhập tên thương hiệu..."
              />
            </div>
          </div>
        </section>

        <section className="create-section">
          <h3>Mô tả</h3>
          <div className="form-group">
            <label className="required">Mô tả sản phẩm</label>
            <textarea
              rows={8}
              placeholder="Mô tả sản phẩm..."
              value={form.description}
              onChange={(event) =>
                setForm({ ...form, description: event.target.value })
              }
            />
          </div>

          <div className="description-upload">
            {descriptionImageItems.length < MAX_DESCRIPTION_IMAGES && (
              <label className="description-upload-btn">
                + Thêm ảnh vào mô tả
                <input
                  className="upload-input"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleDescriptionImagesChange}
                />
              </label>
            )}
            <small className="create-product-help">
              Tối đa 10 ảnh mô tả
            </small>
          </div>

          {descriptionImageItems.length > 0 && (
            <div className="description-images">
              {descriptionImageItems.map((image, index) => (
                <div key={image.id} className="description-image">
                  <img src={image.preview} alt={`Ảnh mô tả ${index + 1}`} />
                  <button
                    type="button"
                    className="upload-remove"
                    aria-label="Xóa ảnh mô tả"
                    onClick={() =>
                      removeImage(image.id, setDescriptionImageItems)
                    }
                  >
                    x
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="create-section">
          <h3>Bán hàng</h3>
          <div className="grid-3">
            <div className="form-group">
              <label className="required">Giá</label>
              <input
                type="number"
                min={0}
                value={form.price}
                onChange={(event) =>
                  setForm({ ...form, price: Number(event.target.value) })
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
                  setForm({
                    ...form,
                    availableQuantity: Number(event.target.value),
                  })
                }
              />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label>Hình thức bán</label>
              <select
                value={form.salesMode}
                onChange={(event) =>
                  setForm({
                    ...form,
                    salesMode: event.target.value as ProductForm["salesMode"],
                    minWholesaleQty:
                      event.target.value === "WHOLESALE" ? 1 : undefined,
                  })
                }
              >
                <option value="RETAIL">Bán lẻ</option>
                <option value="WHOLESALE">Bán sỉ</option>
              </select>
            </div>

            {form.salesMode === "WHOLESALE" && (
              <div className="form-group">
                <label>Số lượng bán sỉ tối thiểu</label>
                <input
                  type="number"
                  min={1}
                  value={form.minWholesaleQty ?? 1}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      minWholesaleQty: Number(event.target.value),
                    })
                  }
                />
              </div>
            )}
          </div>
        </section>

        <section className="create-section">
          <h3>Tình trạng</h3>
          <div className="create-product-choice-group">
            <label className="create-product-choice">
              <input
                type="radio"
                name="itemCondition"
                checked={form.itemCondition === "new"}
                onChange={() => setForm({ ...form, itemCondition: "new" })}
              />
              <span>Mới</span>
            </label>
            <label className="create-product-choice">
              <input
                type="radio"
                name="itemCondition"
                checked={form.itemCondition === "used"}
                onChange={() => setForm({ ...form, itemCondition: "used" })}
              />
              <span>Đã qua sử dụng</span>
            </label>
          </div>
        </section>

        <footer className="create-footer">
          <p>Kiểm tra lại thông tin trước khi xác nhận đăng sản phẩm.</p>
          <div>
            <button className="btn-outline" type="button" onClick={onCancel}>
              Hủy
            </button>
            <button className="btn-primary" type="button" onClick={handleSubmit}>
              Xác nhận đăng sản phẩm
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
