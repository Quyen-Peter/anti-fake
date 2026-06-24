import { useState } from "react";
import { User, Phone, MapPin } from "lucide-react";

import "../../css/components/address/createAddress.css";
import { createAddress } from "../../services/address.api";
import { toast } from "sonner";

interface Props {
  onClose: () => void;
}

export default function CreateAddress({ onClose }: Props) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    recipientName: "",
    phone: "",
    addressLine: "",
    isDefault: false,
  });

  const [errors, setErrors] = useState({
    recipientName: "",
    phone: "",
    addressLine: "",
  });

  const validate = () => {
    const newErrors = {
      recipientName: "",
      phone: "",
      addressLine: "",
    };

    let isValid = true;

    if (!form.recipientName.trim()) {
      newErrors.recipientName = "Vui lòng nhập họ tên người nhận";
      isValid = false;
    }

    const phoneRegex = /^0(3|5|7|8|9)[0-9]{8}$/;

    if (!form.phone.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
      isValid = false;
    } else if (!phoneRegex.test(form.phone.trim())) {
      newErrors.phone = "Số điện thoại không hợp lệ";
      isValid = false;
    }

    if (!form.addressLine.trim()) {
      newErrors.addressLine = "Vui lòng nhập địa chỉ";
      isValid = false;
    }

    setErrors(newErrors);

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      const data =  await createAddress(form);
      if(data!= null){
        toast.success("Thêm địa chỉ thành công");
      }

      onClose();
    } catch (error) {
      console.error(error);
      
      toast.error(error instanceof Error ? error.message : "Tạo địa chỉ thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="address-modal-overlay" onClick={onClose}>
      <div className="address-modal" onClick={(e) => e.stopPropagation()}>
        <div className="address-modal-header">
          <h3>Thêm địa chỉ mới</h3>

          <button
            type="button"
            className="address-modal-close"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="address-form-grid">
            <div className="address-input-group">
              <label>Họ và tên người nhận</label>

              <div className="address-input-wrapper">
                <input
                  type="text"
                  placeholder="Nhập họ tên"
                  value={form.recipientName}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      recipientName: e.target.value,
                    })
                  }
                />

                <User size={16} />
              </div>

              {errors.recipientName && (
                <span className="address-error">{errors.recipientName}</span>
              )}
            </div>

            <div className="address-input-group">
              <label>Số điện thoại</label>

              <div className="address-input-wrapper">
                <input
                  type="tel"
                  maxLength={10}
                  placeholder="0987654321"
                  value={form.phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");

                    setForm({
                      ...form,
                      phone: value,
                    });
                  }}
                />

                <Phone size={16} />
              </div>

              {errors.phone && (
                <span className="address-error">{errors.phone}</span>
              )}
            </div>
          </div>

          <div className="address-input-group">
            <label>Địa chỉ cụ thể</label>

            <div className="address-textarea-wrapper">
              <textarea
                rows={4}
                placeholder="Nhập địa chỉ chi tiết..."
                value={form.addressLine}
                onChange={(e) =>
                  setForm({
                    ...form,
                    addressLine: e.target.value,
                  })
                }
              />

              <MapPin size={16} />
            </div>

            {errors.addressLine && (
              <span className="address-error">{errors.addressLine}</span>
            )}
          </div>

          <div className="address-default-box">
            <div>
              <h4>Đặt làm địa chỉ mặc định</h4>

              <p>Địa chỉ này sẽ được ưu tiên sử dụng khi đặt hàng.</p>
            </div>

            <label className="address-switch">
              <input
                type="checkbox"
                checked={form.isDefault}
                onChange={(e) =>
                  setForm({
                    ...form,
                    isDefault: e.target.checked,
                  })
                }
              />

              <span></span>
            </label>
          </div>

          <div className="address-modal-footer">
            <button
              type="button"
              className="address-cancel-btn"
              onClick={onClose}
              disabled={loading}
            >
              Hủy
            </button>

            <button
              type="submit"
              className="address-save-btn"
              disabled={loading}
            >
              {loading ? "Đang lưu..." : "Lưu địa chỉ"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
