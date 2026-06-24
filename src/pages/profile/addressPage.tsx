import { useEffect, useState } from "react";
import {
  Building2,
  Plus,
} from "lucide-react";

import "../../css/pages/profile/address.css";

interface Address {
  id: string;
  userId: string;
  recipientName: string;
  phone: string;
  addressLine: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ProfileAddress() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      // TODO: thay bằng API của bạn
      // const data = await getMyAddresses();

      const data: Address[] = [
        {
          id: "1",
          userId: "1",
          recipientName: "Nguyễn Văn A",
          phone: "0901234567",
          addressLine:
            "123 Đường Lê Lợi, Phường Bến Thành, Quận 1, TP Hồ Chí Minh",
          isDefault: true,
          createdAt: "",
          updatedAt: "",
        },
        {
          id: "2",
          userId: "1",
          recipientName: "Nguyễn Văn B",
          phone: "0918889999",
          addressLine:
            "45 Phố Huế, Quận Hai Bà Trưng, Hà Nội",
          isDefault: false,
          createdAt: "",
          updatedAt: "",
        },
      ];

      setAddresses(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = () => {
    console.log("add address");
  };

  const handleEdit = (id: string) => {
    console.log("edit", id);
  };

  const handleDelete = (id: string) => {
    console.log("delete", id);
  };

  const handleSetDefault = (id: string) => {
    console.log("set default", id);
  };

  return (
    <div className="profile-address-page">
      <div className="profile-address-top">
        <div>
          <h1 className="profile-address-title">
            Địa chỉ của tôi
          </h1>

          <p className="profile-address-subtitle">
            Quản lý các địa chỉ nhận hàng của bạn một cách an toàn.
          </p>
        </div>

        <button
          className="profile-address-add-btn"
          onClick={handleAddAddress}
        >
          <Plus size={18} />
          Thêm địa chỉ mới
        </button>
      </div>

      <div className="profile-address-divider" />

      {loading ? (
        <div className="profile-address-loading">
          Đang tải địa chỉ...
        </div>
      ) : addresses.length === 0 ? (
        <div className="profile-address-empty">
          Không có địa chỉ nào
        </div>
      ) : (
        <div className="profile-address-list">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`profile-address-card ${
                address.isDefault
                  ? "profile-address-card-default"
                  : ""
              }`}
            >

              <div className="profile-address-header">
                <div className="profile-address-user">
                  <span className="profile-address-name">
                    {address.recipientName}
                  </span>

                  <span className="profile-address-phone">
                    {address.phone}
                  </span>

                  {address.isDefault && (
                    <span className="profile-address-default-badge">
                      MẶC ĐỊNH
                    </span>
                  )}
                </div>

                <div className="profile-address-actions">
                  <button
                    onClick={() =>
                      handleEdit(address.id)
                    }
                  >
                    Sửa
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(address.id)
                    }
                  >
                    Xóa
                  </button>
                </div>
              </div>

              <div className="profile-address-line">
                {address.addressLine}
              </div>

              {!address.isDefault && (
                <button
                  className="profile-address-default-btn"
                  onClick={() =>
                    handleSetDefault(address.id)
                  }
                >
                  Thiết lập mặc định
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="profile-address-footer">
        <Building2 size={42} />

        <p>
          Bạn có thể lưu tối đa 10 địa chỉ khác nhau để
          thuận tiện hơn trong quá trình mua sắm.
        </p>
      </div>
    </div>
  );
}