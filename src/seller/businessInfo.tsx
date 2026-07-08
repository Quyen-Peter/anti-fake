import { useEffect, useState } from "react";
import { BadgeCheck, FileText, IdCard } from "lucide-react";
import { toast } from "sonner";
import {
  fetchShopSubmittedDocuments,
  getMyShop,
  type ShopSubmittedDocument,
} from "../services/shop.api";
import { getUserKyc, type UserKyc } from "../services/user.api";
import "../css/pages/sellerShopInfo.css";

type SellerShop = {
  id?: string;
  shopId?: string;
  shopName?: string;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value && typeof value === "object");

const normalizeMyShop = (data: unknown): SellerShop | null => {
  const payload = isRecord(data) ? data.data ?? data.items ?? data : data;
  if (Array.isArray(payload)) return (payload[0] as SellerShop | undefined) ?? null;
  return isRecord(payload) ? (payload as SellerShop) : null;
};

const formatValue = (value?: string | null) => value || "Chưa cập nhật";

// const formatDate = (value?: string | null) => {
//   if (!value) return "Chưa cập nhật";
//   const date = new Date(value);
//   if (Number.isNaN(date.getTime())) return value;
//   return date.toLocaleDateString("vi-VN");
// };

const formatStatus = (value?: string | null) => {
  if (value === "approved" || value === "verified") return "Đã duyệt";
  if (value === "rejected") return "Từ chối";
  if (value === "pending" || value === "pending_kyc") return "Chờ duyệt";
  if (value === "banned") return "Bị cấm";
  return value || "Chưa cập nhật";
};

const getStatusClass = (value?: string | null) => {
  if (value === "approved" || value === "verified") return "approved";
  if (value === "rejected" || value === "banned") return "rejected";
  return "pending";
};

const getShopDocumentFiles = (document: ShopSubmittedDocument) => {
  const files = document.files ?? [];
  if (document.fileUrl) return [{ fileUrl: document.fileUrl }, ...files];
  return files;
};

export default function SellerBusinessInfo() {
  const [shop, setShop] = useState<SellerShop | null>(null);
  const [shopDocuments, setShopDocuments] = useState<ShopSubmittedDocument[]>([]);
  const [userKyc, setUserKyc] = useState<UserKyc | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBusinessInfo = async () => {
      setLoading(true);

      try {
        const shopData = await getMyShop();
        const nextShop = normalizeMyShop(shopData);
        setShop(nextShop);

        const shopId = nextShop?.id || nextShop?.shopId;
        if (!shopId) {
          toast.error("Không tìm thấy cửa hàng");
          return;
        }

        const [documentsResult, kycResult] = await Promise.allSettled([
          fetchShopSubmittedDocuments(String(shopId)),
          getUserKyc(),
        ]);

        if (documentsResult.status === "fulfilled") {
          setShopDocuments(documentsResult.value);
        } else {
          console.error(documentsResult.reason);
          toast.error("Không thể tải hồ sơ pháp lý của shop");
        }

        if (kycResult.status === "fulfilled") {
          setUserKyc(kycResult.value);
        } else {
          console.error(kycResult.reason);
          toast.error("Không thể tải hồ sơ KYC");
        }
      } catch (error) {
        console.error(error);
        toast.error(
          error instanceof Error
            ? error.message
            : "Không thể tải thông tin doanh nghiệp",
        );
      } finally {
        setLoading(false);
      }
    };

    loadBusinessInfo();
  }, []);

  return (
    <div className="seller-shop-info-page">
      <div className="seller-shop-info-header">
        <div>
          <span>Thông tin doanh nghiệp</span>
          <h1>{formatValue(shop?.shopName)}</h1>
        </div>

        <div className="seller-shop-info-status">
          <BadgeCheck size={18} />
          {loading ? "Đang tải..." : "Hồ sơ doanh nghiệp"}
        </div>
      </div>

      <div className="seller-shop-documents">
        <section className="seller-shop-document-card">
          <div className="seller-shop-document-head">
            <FileText size={20} />
            <div>
              <h2>Hồ sơ pháp lý shop</h2>
              <p>Danh sách giấy tờ pháp lý đã nộp cho cửa hàng.</p>
            </div>
          </div>

          {loading && (
            <div className="seller-shop-document-state">Đang tải hồ sơ...</div>
          )}

          {!loading && shopDocuments.length === 0 && (
            <div className="seller-shop-document-state">
              Chưa có hồ sơ pháp lý shop.
            </div>
          )}

          {!loading && shopDocuments.length > 0 && (
            <div className="seller-shop-document-list">
              {shopDocuments.map((document, index) => {
                const files = getShopDocumentFiles(document);

                return (
                  <article
                    className="seller-shop-document-item"
                    key={document.id || `${document.code}-${index}`}
                  >
                    <div className="seller-shop-document-title">
                      <strong>
                        {document.name ||
                          document.docType ||
                          document.code ||
                          `Hồ sơ ${index + 1}`}
                      </strong>
                      <span
                        className={`seller-shop-document-status ${getStatusClass(
                          document.status,
                        )}`}
                      >
                        {formatStatus(document.status)}
                      </span>
                    </div>

                    {document.reviewNote && (
                      <p className="seller-shop-document-note">
                        {document.reviewNote}
                      </p>
                    )}

                    <div className="seller-shop-document-files seller-shop-document-gallery">
                      {files.length === 0 ? (
                        <small>Không có file đính kèm</small>
                      ) : (
                        files.map((file, fileIndex) => (
                          <a
                            key={`${file.fileUrl}-${fileIndex}`}
                            href={file.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <img
                              src={file.fileUrl}
                              alt={
                                file.side
                                  ? `Hồ sơ ${file.side}`
                                  : `Hồ sơ ${fileIndex + 1}`
                              }
                            />
                            <span>
                              {file.side ? file.side : `File ${fileIndex + 1}`}
                            </span>
                          </a>
                        ))
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <section className="seller-shop-document-card">
          <div className="seller-shop-document-head">
            <IdCard size={20} />
            <div>
              <h2>Hồ sơ KYC chủ shop</h2>
              <p>Trạng thái xác minh danh tính của tài khoản hiện tại.</p>
            </div>
          </div>

          {loading && (
            <div className="seller-shop-document-state">Đang tải KYC...</div>
          )}

          {!loading && !userKyc && (
            <div className="seller-shop-document-state">
              Chưa có hồ sơ KYC.
            </div>
          )}

          {!loading && userKyc && (
            <div className="seller-shop-kyc-detail">
              <div className="seller-shop-kyc-row">
                <span>Trạng thái</span>
                <strong
                  className={`seller-shop-document-status ${getStatusClass(
                    userKyc.verificationStatus,
                  )}`}
                >
                  {formatStatus(userKyc.verificationStatus)}
                </strong>
              </div>
              {/* <div className="seller-shop-kyc-row">
                <span>Họ tên</span>
                <strong>{formatValue(userKyc.fullName)}</strong>
              </div>
              <div className="seller-shop-kyc-row">
                <span>Ngày sinh</span>
                <strong>{formatDate(userKyc.dateOfBirth)}</strong>
              </div> */}
              <div className="seller-shop-kyc-row">
                <span>Loại giấy tờ</span>
                <strong>{formatValue(userKyc.idType)}</strong>
              </div>
              {/* <div className="seller-shop-kyc-row">
                <span>Cấp KYC</span>
                <strong>{formatValue(userKyc.kycLevel)}</strong>
              </div> */}
              {userKyc.reviewNote && (
                <p className="seller-shop-document-note">{userKyc.reviewNote}</p>
              )}

              <div className="seller-shop-document-files seller-shop-document-gallery">
                {userKyc.documents.map((document, index) => (
                  <a
                    key={document.mediaAssetId || document.fileUrl}
                    href={document.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img
                      src={document.fileUrl}
                      alt={document.side || `Ảnh KYC ${index + 1}`}
                    />
                    {document.side || `Ảnh ${index + 1}`}
                  </a>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
