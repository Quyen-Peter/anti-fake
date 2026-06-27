import { useEffect, useRef, useState, type ChangeEvent } from "react";
import "../../css/components/productManagement/createProduct.css";

type CreateProductProps = {
  onCancel?: () => void;
};

type ProductImage = {
  id: string;
  file: File;
  preview: string;
};

type DescriptionImage = {
  id: string;
  file: File;
  preview: string;
};

const MAX_PRODUCT_IMAGES = 4;

export default function CreateProduct({ onCancel }: CreateProductProps) {
  const [form, setForm] = useState({
    shopId: "",
    categoryId: "",
    brandId: "",
    distributionNodeId: "",

    title: "",
    description: "",

    price: 0,
    currency: "VND",

    salesMode: "RETAIL",

    minWholesaleQty: 1,

    itemCondition: "new",

    availableQuantity: 0,

    offerStatus: "draft",

    verificationLevel: "standard",

    shippingProviderCodes: [] as string[],

    parcelWeightGrams: 0,

    parcelLengthCm: 0,

    parcelWidthCm: 0,

    parcelHeightCm: 0,
  });

  const [images, setImages] = useState<ProductImage[]>([]);
  const [descriptionImages, setDescriptionImages] = useState<
    DescriptionImage[]
  >([]);
  const imagesRef = useRef<ProductImage[]>([]);
  const descriptionImagesRef = useRef<DescriptionImage[]>([]);

  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  useEffect(() => {
    descriptionImagesRef.current = descriptionImages;
  }, [descriptionImages]);

  useEffect(() => {
    return () => {
      imagesRef.current.forEach((image) => URL.revokeObjectURL(image.preview));
      descriptionImagesRef.current.forEach((image) =>
        URL.revokeObjectURL(image.preview),
      );
    };
  }, []);

  const createImageItems = <T extends ProductImage | DescriptionImage>(
    files: FileList | null,
  ): T[] => {
    if (!files) return [];

    return Array.from(files)
      .filter((file) => file.type.startsWith("image/"))
      .map((file, index) => ({
        id: `${Date.now()}-${file.name}-${index}`,
        file,
        preview: URL.createObjectURL(file),
      })) as T[];
  };

  const handleProductImagesChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const nextImages = createImageItems<ProductImage>(event.target.files);
    const availableSlots = MAX_PRODUCT_IMAGES - images.length;
    const acceptedImages = nextImages.slice(0, availableSlots);
    const rejectedImages = nextImages.slice(availableSlots);

    rejectedImages.forEach((image) => URL.revokeObjectURL(image.preview));
    setImages((currentImages) => [...currentImages, ...acceptedImages]);
    event.target.value = "";
  };

  const handleDescriptionImagesChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const nextImages = createImageItems<DescriptionImage>(event.target.files);

    setDescriptionImages((currentImages) => [
      ...currentImages,
      ...nextImages,
    ]);
    event.target.value = "";
  };

  const removeProductImage = (imageId: string) => {
    setImages((currentImages) => {
      const removedImage = currentImages.find((image) => image.id === imageId);
      if (removedImage) URL.revokeObjectURL(removedImage.preview);

      return currentImages.filter((image) => image.id !== imageId);
    });
  };

  const removeDescriptionImage = (imageId: string) => {
    setDescriptionImages((currentImages) => {
      const removedImage = currentImages.find((image) => image.id === imageId);
      if (removedImage) URL.revokeObjectURL(removedImage.preview);

      return currentImages.filter((image) => image.id !== imageId);
    });
  };

  return (
    <div className="create-product-page">
      <div className="create-product-card">
        {/* Header */}

        <div className="create-header">
          <div>
            <h2>Tạo sản phẩm</h2>

            <p>Đăng sản phẩm mới lên cửa hàng của bạn</p>
          </div>

          <div className="create-header-action">
            <button className="btn-outline">Lưu nháp</button>

            <button className="btn-primary">Đăng sản phẩm</button>
          </div>
        </div>

        {/* ================= Thông tin cơ bản ================= */}

        <section className="create-section">
          <h3>Thông tin cơ bản</h3>

          {/* Ảnh */}

          <div className="form-group">
            <label>Ảnh sản phẩm</label>

            <div className="upload-grid">
              {images.map((image, index) => (
                <div key={image.id} className="upload-preview">
                  <img
                    src={image.preview}
                    alt={`Anh san pham ${index + 1}`}
                  />

                  <button
                    type="button"
                    className="upload-remove"
                    aria-label="Xoa anh san pham"
                    onClick={() => removeProductImage(image.id)}
                  >
                    x
                  </button>

                  {index === 0 && <div className="upload-cover">Ảnh bìa</div>}
                </div>
              ))}

              {images.length < MAX_PRODUCT_IMAGES && (
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

          {/* Tên */}

          <div className="form-group">
            <label>Tên sản phẩm</label>

            <input
              value={form.title}
              onChange={(e) =>
                setForm({
                  ...form,
                  title: e.target.value,
                })
              }
              placeholder="Nhập tên sản phẩm..."
            />
          </div>

          {/* Danh mục */}

          <div className="grid-2">
            <div className="form-group">
              <label>Danh mục</label>

              <select
                value={form.categoryId}
                onChange={(e) =>
                  setForm({
                    ...form,
                    categoryId: e.target.value,
                  })
                }
              >
                <option value="">Chọn danh mục</option>
              </select>
            </div>

            <div className="form-group">
              <label>Thương hiệu</label>

              <select
                value={form.brandId}
                onChange={(e) =>
                  setForm({
                    ...form,
                    brandId: e.target.value,
                  })
                }
              >
                <option value="">Chọn thương hiệu</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Đơn vị phân phối</label>

            <select
              value={form.distributionNodeId}
              onChange={(e) =>
                setForm({
                  ...form,
                  distributionNodeId: e.target.value,
                })
              }
            >
              <option value="">Chọn đơn vị phân phối</option>
            </select>
          </div>
        </section>

        {/* ================= Mô tả ================= */}

        <section className="create-section">
          <h3>Mô tả sản phẩm</h3>

          <textarea
            rows={8}
            placeholder="Mô tả sản phẩm..."
            value={form.description}
            onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value,
              })
            }
          />

          <div className="description-upload">
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
          </div>

          {descriptionImages.length > 0 && (
            <div className="description-images">
              {descriptionImages.map((image, index) => (
                <div key={image.id} className="description-image">
                  <img src={image.preview} alt={`Anh mo ta ${index + 1}`} />

                  <button
                    type="button"
                    className="upload-remove"
                    aria-label="Xoa anh mo ta"
                    onClick={() => removeDescriptionImage(image.id)}
                  >
                    x
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ================= Bán hàng ================= */}

        <section className="create-section">
          <h3>Thông tin bán hàng</h3>

          <div className="grid-2">
            <div className="form-group">
              <label>Giá</label>

              <input
                type="number"
                value={form.price}
                onChange={(e) =>
                  setForm({
                    ...form,
                    price: Number(e.target.value),
                  })
                }
              />
            </div>

            <div className="form-group">
              <label>Kho hàng</label>

              <input
                type="number"
                value={form.availableQuantity}
                onChange={(e) =>
                  setForm({
                    ...form,
                    availableQuantity: Number(e.target.value),
                  })
                }
              />
            </div>
          </div>

          <div className="grid-3">
            <div className="form-group">
              <label>Currency</label>

              <select
                value={form.currency}
                onChange={(e) =>
                  setForm({
                    ...form,
                    currency: e.target.value,
                  })
                }
              >
                <option>VND</option>
              </select>
            </div>

            <div className="form-group">
              <label>Hình thức bán</label>

              <select
                value={form.salesMode}
                onChange={(e) =>
                  setForm({
                    ...form,
                    salesMode: e.target.value,
                  })
                }
              >
                <option value="RETAIL">Bán lẻ</option>

                <option value="WHOLESALE">Bán sỉ</option>
              </select>
            </div>

            <div className="form-group">
              <label>Số lượng tối thiểu</label>

              <input
                type="number"
                value={form.minWholesaleQty}
                onChange={(e) =>
                  setForm({
                    ...form,
                    minWholesaleQty: Number(e.target.value),
                  })
                }
              />
            </div>
          </div>
        </section>
        {/* ================= Vận chuyển ================= */}

        <section className="create-section">
          <h3>Thông tin vận chuyển</h3>

          <div className="form-group">
            <label>Đơn vị vận chuyển</label>

            <div className="shipping-list">
              {["SELF_DELIVERY", "GHN", "GHTK", "VIETTEL_POST", "J&T"].map(
                (item) => (
                  <label key={item} className="shipping-item">
                    <input
                      type="checkbox"
                      checked={form.shippingProviderCodes.includes(item)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setForm({
                            ...form,
                            shippingProviderCodes: [
                              ...form.shippingProviderCodes,
                              item,
                            ],
                          });
                        } else {
                          setForm({
                            ...form,
                            shippingProviderCodes:
                              form.shippingProviderCodes.filter(
                                (x) => x !== item,
                              ),
                          });
                        }
                      }}
                    />

                    <span>{item}</span>
                  </label>
                ),
              )}
            </div>
          </div>

          <div className="grid-4">
            <div className="form-group">
              <label>Khối lượng (g)</label>

              <input
                type="number"
                value={form.parcelWeightGrams}
                onChange={(e) =>
                  setForm({
                    ...form,
                    parcelWeightGrams: Number(e.target.value),
                  })
                }
              />
            </div>

            <div className="form-group">
              <label>Dài (cm)</label>

              <input
                type="number"
                value={form.parcelLengthCm}
                onChange={(e) =>
                  setForm({
                    ...form,
                    parcelLengthCm: Number(e.target.value),
                  })
                }
              />
            </div>

            <div className="form-group">
              <label>Rộng (cm)</label>

              <input
                type="number"
                value={form.parcelWidthCm}
                onChange={(e) =>
                  setForm({
                    ...form,
                    parcelWidthCm: Number(e.target.value),
                  })
                }
              />
            </div>

            <div className="form-group">
              <label>Cao (cm)</label>

              <input
                type="number"
                value={form.parcelHeightCm}
                onChange={(e) =>
                  setForm({
                    ...form,
                    parcelHeightCm: Number(e.target.value),
                  })
                }
              />
            </div>
          </div>
        </section>

        {/* ================= Cài đặt ================= */}

        <section className="create-section">
          <h3>Cài đặt sản phẩm</h3>

          <div className="grid-3">
            <div className="form-group">
              <label>Trạng thái</label>

              <select
                value={form.offerStatus}
                onChange={(e) =>
                  setForm({
                    ...form,
                    offerStatus: e.target.value,
                  })
                }
              >
                <option value="draft">Bản nháp</option>

                <option value="active">Đang bán</option>

                <option value="inactive">Tạm ngưng</option>
              </select>
            </div>

            <div className="form-group">
              <label>Mức xác thực</label>

              <select
                value={form.verificationLevel}
                onChange={(e) =>
                  setForm({
                    ...form,
                    verificationLevel: e.target.value,
                  })
                }
              >
                <option value="standard">Standard</option>

                <option value="verified">Verified</option>

                <option value="premium">Premium</option>
              </select>
            </div>

            <div className="form-group">
              <label>Tình trạng</label>

              <select
                value={form.itemCondition}
                onChange={(e) =>
                  setForm({
                    ...form,
                    itemCondition: e.target.value,
                  })
                }
              >
                <option value="new">Mới</option>

                <option value="used">Đã sử dụng</option>
              </select>
            </div>
          </div>
        </section>

        {/* ================= Footer ================= */}

        <div className="create-footer">
          <button type="button" className="btn-outline" onClick={onCancel}>
            Hủy
          </button>

          <div
            style={{
              display: "flex",
              gap: 12,
            }}
          >
            <button type="button" className="btn-outline">
              Lưu nháp
            </button>

            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                console.log(form);
              }}
            >
              Đăng sản phẩm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
