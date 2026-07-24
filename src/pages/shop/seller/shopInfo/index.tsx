import { useEffect, useMemo, useState } from "react";
import {
  BadgeCheck,
  Building2,
  Factory,
  MapPin,
  Pencil,
  ReceiptText,
  Store,
  X,
} from "lucide-react";
import { toast } from "sonner";
import {
  getAddressProvinces,
  getAddressWards,
} from "../../../../services/address.api";
import {
  getMyShop,
  updateShopProfile,
  type UpdateShopProfilePayload,
} from "../../../../services/shop.api";
import type { AddressProvince, AddressWard } from "../../../../type/address";
import { useGlobalLoadingStore } from "../../../../store/globalLoadingStore";
import "../../css/pages/sellerShopInfo.css";

const SELLER_SHOP_CACHE_KEY = "sellerShop";

type SellerShopInfo = {
  id?: string;
  shopId?: string;
  shopName?: string;
  registrationType?: string;
  businessType?: string;
  taxCode?: string;
  warehouseAddress?: string | null;
  warehouseProvinceCode?: string | null;
  warehouseProvinceName?: string | null;
  warehouseWardCode?: string | null;
  warehouseWardName?: string | null;
  shopStatus?: string;
};

type EditField = "shopName" | "businessType" | "taxCode" | "warehouse";

type WarehouseForm = {
  warehouseAddress: string;
  warehouseProvinceCode: string;
  warehouseProvinceName: string;
  warehouseWardCode: string;
  warehouseWardName: string;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value && typeof value === "object");

const normalizeMyShop = (data: unknown): SellerShopInfo | null => {
  const payload = isRecord(data)
    ? data.data ?? data.items ?? data
    : data;
  if (Array.isArray(payload)) {
    return (payload[0] as SellerShopInfo | undefined) ?? null;
  }
  return isRecord(payload) ? (payload as SellerShopInfo) : null;
};

const readCachedShop = () => {
  try {
    const cached = localStorage.getItem(SELLER_SHOP_CACHE_KEY);
    return cached ? (JSON.parse(cached) as SellerShopInfo) : null;
  } catch {
    return null;
  }
};

const formatValue = (value?: string | null) => value || "Chưa cập nhật";

const formatWarehouseAddress = (shop: SellerShopInfo | null) =>
  [shop?.warehouseAddress, shop?.warehouseWardName, shop?.warehouseProvinceName]
    .filter(Boolean)
    .join(", ") || "Chưa cập nhật";

const toProfilePayload = (
  shop: SellerShopInfo,
  overrides: Partial<UpdateShopProfilePayload> = {},
): UpdateShopProfilePayload => ({
  shopName: shop.shopName || "",
  businessType: shop.businessType || "",
  taxCode: shop.taxCode || "",
  warehouseAddress: shop.warehouseAddress || "",
  warehouseProvinceCode: shop.warehouseProvinceCode || "",
  warehouseProvinceName: shop.warehouseProvinceName || "",
  warehouseWardCode: shop.warehouseWardCode || "",
  warehouseWardName: shop.warehouseWardName || "",
  ...overrides,
});

export default function SellerShopInfo() {
  const [shop, setShop] = useState<SellerShopInfo | null>(() => readCachedShop());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const showLoading = useGlobalLoadingStore((state) => state.showLoading);
  const hideLoading = useGlobalLoadingStore((state) => state.hideLoading);
  const [editField, setEditField] = useState<EditField | null>(null);
  const [editValue, setEditValue] = useState("");
  const [warehouseForm, setWarehouseForm] = useState<WarehouseForm>({
    warehouseAddress: "",
    warehouseProvinceCode: "",
    warehouseProvinceName: "",
    warehouseWardCode: "",
    warehouseWardName: "",
  });
  const [provinces, setProvinces] = useState<AddressProvince[]>([]);
  const [wards, setWards] = useState<AddressWard[]>([]);
  const [loadingWards, setLoadingWards] = useState(false);

  useEffect(() => {
    void getMyShop()
      .then((data) => {
        const nextShop = normalizeMyShop(data);
        setShop(nextShop);

        if (nextShop) {
          localStorage.setItem(SELLER_SHOP_CACHE_KEY, JSON.stringify(nextShop));
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const loadProvinces = async () => {
      try {
        setProvinces(await getAddressProvinces());
      } catch (error) {
        console.error(error);
      }
    };

    loadProvinces();
  }, []);

  useEffect(() => {
    if (!warehouseForm.warehouseProvinceCode) {
      return;
    }

    const loadWards = async () => {
      try {
        setLoadingWards(true);
        setWards(await getAddressWards(warehouseForm.warehouseProvinceCode));
      } catch (error) {
        console.error(error);
        setWards([]);
      } finally {
        setLoadingWards(false);
      }
    };

    loadWards();
  }, [warehouseForm.warehouseProvinceCode]);

  const closeEditor = () => {
    setEditField(null);
    setEditValue("");
  };

  const openEditor = (field: EditField) => {
    setEditField(field);

    if (field === "warehouse") {
      setWarehouseForm({
        warehouseAddress: shop?.warehouseAddress || "",
        warehouseProvinceCode: shop?.warehouseProvinceCode || "",
        warehouseProvinceName: shop?.warehouseProvinceName || "",
        warehouseWardCode: shop?.warehouseWardCode || "",
        warehouseWardName: shop?.warehouseWardName || "",
      });
      return;
    }

    setEditValue(String(shop?.[field] || ""));
  };

  const handleSaveBasic = async () => {
    if (!shop || !editField || editField === "warehouse") return;

    const shopId = shop.id || shop.shopId;
    if (!shopId) {
      toast.error("Không tìm thấy cửa hàng");
      return;
    }

    if (!editValue.trim()) {
      toast.error("Vui lòng nhập thông tin cần cập nhật");
      return;
    }

    try {
      setSaving(true);
      showLoading("Đang lưu thông tin cửa hàng...");
      const payload = toProfilePayload(shop, {
        [editField]: editValue.trim(),
      });
      await updateShopProfile(shopId, payload);
      const refreshedData = await getMyShop();
      const nextShop = normalizeMyShop(refreshedData) ?? { ...shop, ...payload };
      setShop(nextShop);
      localStorage.setItem(SELLER_SHOP_CACHE_KEY, JSON.stringify(nextShop));
      closeEditor();
      toast.success("Cập nhật thông tin cửa hàng thành công");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Cập nhật thất bại");
    } finally {
      setSaving(false);
      hideLoading();
    }
  };

  const handleSaveWarehouse = async () => {
    if (!shop) return;

    const shopId = shop.id || shop.shopId;
    if (!shopId) {
      toast.error("Không tìm thấy cửa hàng");
      return;
    }

    if (
      !warehouseForm.warehouseAddress.trim() ||
      !warehouseForm.warehouseProvinceCode ||
      !warehouseForm.warehouseWardCode
    ) {
      toast.error("Vui lòng nhập đầy đủ địa chỉ kho");
      return;
    }

    try {
      setSaving(true);
      showLoading("Đang lưu địa chỉ kho...");
      const payload = toProfilePayload(shop, {
        warehouseAddress: warehouseForm.warehouseAddress.trim(),
        warehouseProvinceCode: warehouseForm.warehouseProvinceCode,
        warehouseProvinceName: warehouseForm.warehouseProvinceName,
        warehouseWardCode: warehouseForm.warehouseWardCode,
        warehouseWardName: warehouseForm.warehouseWardName,
      });
      await updateShopProfile(shopId, payload);
      const refreshedData = await getMyShop();
      const nextShop = normalizeMyShop(refreshedData) ?? { ...shop, ...payload };
      setShop(nextShop);
      localStorage.setItem(SELLER_SHOP_CACHE_KEY, JSON.stringify(nextShop));
      closeEditor();
      toast.success("Cập nhật địa chỉ kho thành công");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Cập nhật thất bại");
    } finally {
      setSaving(false);
      hideLoading();
    }
  };

  const infoItems = useMemo(
    () => [
      {
        field: "shopName" as const,
        label: "Tên cửa hàng",
        value: formatValue(shop?.shopName),
        icon: Store,
      },
      {
        field: null,
        label: "Loại đăng ký",
        value: formatValue(shop?.registrationType),
        icon: Factory,
      },
      {
        field: "businessType" as const,
        label: "Loại hình kinh doanh",
        value: formatValue(shop?.businessType),
        icon: Building2,
      },
      {
        field: "taxCode" as const,
        label: "Mã số thuế",
        value: formatValue(shop?.taxCode),
        icon: ReceiptText,
      },
      {
        field: "warehouse" as const,
        label: "Địa chỉ kho",
        value: formatWarehouseAddress(shop),
        icon: MapPin,
      },
    ],
    [shop],
  );

  const editTitle =
    infoItems.find((item) => item.field === editField)?.label || "";

  return (
    <div className="seller-shop-info-page">
      <div className="seller-shop-info-header">
        <div>
          <span>Thông tin cửa hàng</span>
          <h1>{formatValue(shop?.shopName)}</h1>
        </div>

        <div className="seller-shop-info-status">
          <BadgeCheck size={18} />
          {loading ? "Đang tải..." : formatValue(shop?.shopStatus)}
        </div>
      </div>

      <div className="seller-shop-info-grid">
        {infoItems.map((item) => {
          const Icon = item.icon;

          return (
            <div className="seller-shop-info-item" key={item.label}>
              <div className="seller-shop-info-icon">
                <Icon size={20} />
              </div>
              <div>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
              {item.field && (
                <button
                  type="button"
                  className="seller-shop-info-edit"
                  onClick={() => openEditor(item.field)}
                >
                  <Pencil size={15} />
                  Cập nhật
                </button>
              )}
            </div>
          );
        })}
      </div>

      {editField && (
        <div className="seller-shop-edit-overlay" onClick={closeEditor}>
          <div
            className="seller-shop-edit-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="seller-shop-edit-header">
              <h2>Cập nhật {editTitle}</h2>
              <button type="button" onClick={closeEditor}>
                <X size={20} />
              </button>
            </div>

            {editField === "warehouse" ? (
              <>
                <label>
                  Tỉnh/Thành phố
                  <select
                    value={warehouseForm.warehouseProvinceCode}
                    onChange={(event) => {
                      const selectedProvince = provinces.find(
                        (province) => province.provinceCode === event.target.value,
                      );

                      setWarehouseForm((current) => ({
                        ...current,
                        warehouseProvinceCode: selectedProvince?.provinceCode ?? "",
                        warehouseProvinceName: selectedProvince?.provinceName ?? "",
                        warehouseWardCode: "",
                        warehouseWardName: "",
                      }));
                    }}
                  >
                    <option value="">Chọn tỉnh/thành</option>
                    {provinces.map((province) => (
                      <option
                        key={province.provinceCode}
                        value={province.provinceCode}
                      >
                        {province.provinceName}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Phường/Xã
                  <select
                    value={warehouseForm.warehouseWardCode}
                    disabled={!warehouseForm.warehouseProvinceCode || loadingWards}
                    onChange={(event) => {
                      const selectedWard = wards.find(
                        (ward) => ward.wardCode === event.target.value,
                      );

                      setWarehouseForm((current) => ({
                        ...current,
                        warehouseWardCode: selectedWard?.wardCode ?? "",
                        warehouseWardName: selectedWard?.wardName ?? "",
                      }));
                    }}
                  >
                    <option value="">
                      {loadingWards ? "Đang tải..." : "Chọn phường/xã"}
                    </option>
                    {wards.map((ward) => (
                      <option key={ward.wardCode} value={ward.wardCode}>
                        {ward.wardName}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Địa chỉ kho
                  <textarea
                    rows={3}
                    value={warehouseForm.warehouseAddress}
                    onChange={(event) =>
                      setWarehouseForm((current) => ({
                        ...current,
                        warehouseAddress: event.target.value,
                      }))
                    }
                    placeholder="Nhập số nhà, tên đường..."
                  />
                </label>
              </>
            ) : (
              <label>
                {editTitle}
                <input
                  value={editValue}
                  onChange={(event) => setEditValue(event.target.value)}
                  placeholder={`Nhập ${editTitle.toLowerCase()}`}
                />
              </label>
            )}

            <div className="seller-shop-edit-actions">
              <button type="button" onClick={closeEditor} disabled={saving}>
                Hủy
              </button>
              <button
                type="button"
                className="primary"
                disabled={saving}
                onClick={
                  editField === "warehouse"
                    ? handleSaveWarehouse
                    : handleSaveBasic
                }
              >
                {saving ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
