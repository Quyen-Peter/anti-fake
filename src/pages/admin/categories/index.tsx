import { ImageOff, LoaderCircle, Plus, Search, Shapes, Upload } from "lucide-react";
import { type FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import "../../../css/components/dataSkeleton.css";
import "../../../css/pages/adminStyles/categories.css";
import {
  createCategory,
  fetchCategories,
  type Category,
} from "../../../services/category.api";

const ACCEPTED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const getRiskLabel = (value?: string) => {
  if (value === "high") return "Cao";
  if (value === "medium") return "Trung bình";
  if (value === "low") return "Thấp";
  return value || "--";
};

export default function AdminCategoriesPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [keyword, setKeyword] = useState("");
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState("");
  const [riskTier, setRiskTier] = useState("medium");
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadCategories = async () => {
    try {
      setCategories(await fetchCategories());
      setError("");
    } catch (requestError: unknown) {
      const message = requestError instanceof Error
        ? requestError.message
        : "Không thể tải danh sách danh mục";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    fetchCategories()
      .then((items) => {
        if (!cancelled) {
          setCategories(items);
          setError("");
        }
      })
      .catch((requestError: unknown) => {
        if (cancelled) return;
        const message = requestError instanceof Error
          ? requestError.message
          : "Không thể tải danh sách danh mục";
        setError(message);
        toast.error(message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const categoryNames = useMemo(
    () => new Map(categories.map((category) => [category.id, category.name])),
    [categories],
  );

  const filteredCategories = useMemo(() => {
    const value = keyword.trim().toLowerCase();
    if (!value) return categories;
    return categories.filter((category) =>
      category.name.toLowerCase().includes(value),
    );
  }, [categories, keyword]);

  const selectImage = (file?: File) => {
    if (!file) return;
    if (!ACCEPTED_IMAGE_TYPES.has(file.type)) {
      toast.error("Ảnh phải có định dạng JPG, PNG hoặc WEBP");
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      toast.error("Ảnh không được lớn hơn 5MB");
      return;
    }

    setImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const resetForm = () => {
    setName("");
    setParentId("");
    setRiskTier("medium");
    setImage(null);
    setPreviewUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const retryLoad = () => {
    setLoading(true);
    void loadCategories();
  };

  const submitCategory = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim()) {
      toast.error("Vui lòng nhập tên danh mục");
      return;
    }
    if (!image) {
      toast.error("Vui lòng chọn ảnh đại diện");
      return;
    }

    setSubmitting(true);
    try {
      const created = await createCategory({
        name: name.trim(),
        parentId: parentId || undefined,
        riskTier,
        image,
      });
      setCategories((current) => [created, ...current]);
      resetForm();
      toast.success("Đã tạo danh mục mới");
    } catch (requestError: unknown) {
      toast.error(
        requestError instanceof Error
          ? requestError.message
          : "Không thể tạo danh mục",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="admin-page admin-categories-page">
      <div className="admin-page-heading">
        <div>
          <h1>Quản lý danh mục</h1>
          <p>Tạo và theo dõi các danh mục sản phẩm trên hệ thống AntiFake.</p>
        </div>
        <span className="admin-category-count"><Shapes size={17} /> {categories.length} danh mục</span>
      </div>

      <div className="admin-category-layout">
        <form className="admin-category-form" onSubmit={submitCategory}>
          <div className="admin-category-card-title">
            <Plus size={19} />
            <div><h2>Tạo danh mục mới</h2><p>Điền thông tin và tải ảnh đại diện.</p></div>
          </div>

          <label>
            Tên danh mục <b>*</b>
            <input value={name} onChange={(event) => setName(event.target.value)} maxLength={120} placeholder="Ví dụ: Mỹ phẩm" />
          </label>
          <label>
            Danh mục cha
            <select value={parentId} onChange={(event) => setParentId(event.target.value)}>
              <option value="">Không có danh mục cha</option>
              {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
            </select>
          </label>
          <label>
            Mức rủi ro
            <select value={riskTier} onChange={(event) => setRiskTier(event.target.value)}>
              <option value="low">Thấp</option>
              <option value="medium">Trung bình</option>
              <option value="high">Cao</option>
            </select>
          </label>
          <label>
            Ảnh đại diện <b>*</b>
            <button className="admin-category-upload" type="button" onClick={() => fileInputRef.current?.click()}>
              {previewUrl ? <img src={previewUrl} alt="Ảnh xem trước danh mục" /> : <><Upload size={25} /><span>Chọn ảnh JPG, PNG hoặc WEBP</span><small>Tối đa 5MB</small></>}
            </button>
            <input ref={fileInputRef} className="admin-category-file" type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => selectImage(event.target.files?.[0])} />
          </label>
          <button className="admin-primary-btn admin-category-submit" type="submit" disabled={submitting}>
            {submitting ? <LoaderCircle className="admin-spin" size={17} /> : <Plus size={17} />}
            {submitting ? "Đang tạo..." : "Tạo danh mục"}
          </button>
        </form>

        <div className="admin-category-list-card">
          <div className="admin-category-list-heading">
            <div><h2>Danh sách danh mục</h2><p>Danh mục hiện có trên hệ thống.</p></div>
            <label className="admin-category-search"><Search size={16} /><input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="Tìm danh mục..." /></label>
          </div>

          {loading ? (
            <div className="data-skeleton data-skeleton-table admin-category-skeleton" aria-busy="true" aria-label="Đang tải danh mục">
              {Array.from({ length: 6 }, (_, index) => <div className="data-skeleton-row" key={index}><span className="data-skeleton-thumbnail" /><span className="data-skeleton-cell" /><span className="data-skeleton-cell" /><span className="data-skeleton-cell" /></div>)}
            </div>
          ) : error ? (
            <div className="admin-category-state" role="alert"><strong>Không thể tải danh mục</strong><p>{error}</p><button type="button" onClick={retryLoad}>Thử lại</button></div>
          ) : filteredCategories.length === 0 ? (
            <div className="admin-category-state"><Shapes size={30} /><strong>Không có danh mục</strong><p>Hãy tạo danh mục đầu tiên hoặc đổi từ khóa.</p></div>
          ) : (
            <div className="admin-category-table-wrap">
              <table className="admin-category-table">
                <thead><tr><th>Danh mục</th><th>Danh mục cha</th><th>Rủi ro</th></tr></thead>
                <tbody>{filteredCategories.map((category) => (
                  <tr key={category.id}>
                    <td><span className="admin-category-info">{category.imageUrl ? <img src={category.imageUrl} alt="" /> : <span><ImageOff size={17} /></span>}<strong>{category.name}</strong></span></td>
                    <td>{category.parentId ? categoryNames.get(category.parentId) || "Không xác định" : "Danh mục gốc"}</td>
                    <td><span className={`admin-risk-tier ${category.riskTier || "unknown"}`}>{getRiskLabel(category.riskTier)}</span></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
