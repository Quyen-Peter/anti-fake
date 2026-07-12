import { ShieldAlert, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
import type { ShopSubmittedDocument } from "../../services/shop.api";
import type { UserKyc } from "../../services/user.api";
import type { RegistrationStatus } from "./sellerRegistration";
import "../../css/components/dataSkeleton.css";

type CompletionStepProps = {
  status: RegistrationStatus;
  onRetry: () => void;
  loadingReviewDetails?: boolean;
  shopDocuments?: ShopSubmittedDocument[];
  userKyc?: UserKyc | null;
};

const reviewStatusLabel: Record<string, string> = {
  pending: "Đang chờ duyệt",
  approved: "Đã duyệt",
  rejected: "Không đạt",
};

const formatReviewStatus = (status?: string) =>
  reviewStatusLabel[String(status ?? "").toLowerCase()] ||
  status ||
  "Chưa có trạng thái";

export default function CompletionStep({
  status,
  onRetry,
  loadingReviewDetails = false,
  shopDocuments = [],
  userKyc = null,
}: CompletionStepProps) {
  const isRejected = status === "rejected";

  return (
    <section
      className={`seller-register-card success ${
        isRejected ? "seller-register-card-error" : ""
      }`}
    >
      <div className="seller-register-success-icon">
        {isRejected ? <ShieldAlert size={52} /> : <ShieldCheck size={52} />}
      </div>

      <h1>
        {isRejected
          ? "Đăng ký thất bại"
          : "Hồ sơ cửa hàng đang chờ xác thực"}
      </h1>
      <p className="seller-register-success-desc">
        {isRejected
          ? "Thông tin đăng ký không hợp lệ. Vui lòng kiểm tra lại thông tin cửa hàng và gửi lại hồ sơ."
          : "Cảm ơn bạn đã gửi hồ sơ đăng ký. Hệ thống AntiFake sẽ tiến hành kiểm tra và xác thực thông tin trong vòng 24 đến 48 giờ làm việc."}
      </p>

      {isRejected && (
        <div className="seller-register-review-box">
          <h2>Chi tiết hồ sơ cần bổ sung</h2>

          {loadingReviewDetails ? (
            <div className="seller-register-review-loading">
              <div className="data-skeleton data-skeleton-detail data-skeleton-compact" role="status" aria-label="Đang tải nhận xét hồ sơ"><div className="data-skeleton-detail-hero"><span /><div><span /><span /><span /></div></div><div className="data-skeleton-detail-grid">{Array.from({ length: 3 }, (_, i) => <span key={i} />)}</div></div>
            </div>
          ) : (
            <>
              <section className="seller-register-review-section">
                <h3>Hồ sơ pháp lý shop</h3>
                {shopDocuments.length > 0 ? (
                  <div className="seller-register-review-list">
                    {shopDocuments.map((document, index) => {
                      const imageUrls = document.files?.length
                        ? document.files.map((file) => file.fileUrl)
                        : document.fileUrl
                          ? [document.fileUrl]
                          : [];
                      const documentName =
                        document.name ||
                        document.docType ||
                        document.code ||
                        `Hồ sơ ${index + 1}`;

                      return (
                        <article
                          key={document.id || `${document.docType}-${index}`}
                        >
                          <div>
                            <strong>{documentName}</strong>
                            <span>{formatReviewStatus(document.status)}</span>
                          </div>
                          <p>
                            {document.reviewNote ||
                              "Chưa có nhận xét từ người duyệt."}
                          </p>
                          {imageUrls.length > 0 && (
                            <div className="seller-register-review-gallery">
                              {imageUrls.map((fileUrl, fileIndex) => (
                                <a
                                  key={`${fileUrl}-${fileIndex}`}
                                  href={fileUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  aria-label={`Mở ảnh ${documentName} ${fileIndex + 1}`}
                                >
                                  <img
                                    src={fileUrl}
                                    alt={`${documentName} ${fileIndex + 1}`}
                                    loading="lazy"
                                  />
                                </a>
                              ))}
                            </div>
                          )}
                        </article>
                      );
                    })}
                  </div>
                ) : (
                  <p>Chưa có dữ liệu hồ sơ pháp lý.</p>
                )}
              </section>

              <section className="seller-register-review-section">
                <h3>Hồ sơ xác minh KYC</h3>
                {userKyc ? (
                  <article className="seller-register-review-kyc">
                    <div>
                      <strong>{userKyc.idType || "Giấy tờ định danh"}</strong>
                      <span>
                        {formatReviewStatus(userKyc.verificationStatus)}
                      </span>
                    </div>
                    <p>
                      {userKyc.reviewNote || "Chưa có nhận xét từ người duyệt."}
                    </p>
                    {userKyc.documents.length > 0 && (
                      <div className="seller-register-review-gallery">
                        {userKyc.documents.map((document, index) => (
                          <a
                            key={document.mediaAssetId || document.fileUrl}
                            href={document.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={`Mở ảnh KYC ${document.side || index + 1}`}
                          >
                            <img
                              src={document.fileUrl}
                              alt={`Ảnh KYC ${document.side || index + 1}`}
                              loading="lazy"
                            />
                          </a>
                        ))}
                      </div>
                    )}
                  </article>
                ) : (
                  <p>Chưa có dữ liệu hồ sơ KYC.</p>
                )}
              </section>
            </>
          )}
        </div>
      )}

      {!isRejected && (
        <div className="seller-register-next-box">
          <h2>Các bước tiếp theo</h2>
          <div className="seller-register-next-grid">
            <NextStep index={1} title="Xác thực">
              Đội ngũ của chúng tôi đang xem xét hồ sơ kinh doanh của bạn.
            </NextStep>
            <NextStep index={2} title="Thông báo kết quả">
              Bạn sẽ nhận được thông báo ngay sau khi hồ sơ được phê duyệt.
            </NextStep>
            <NextStep index={3} title="Bắt đầu bán hàng">
              Khi được duyệt, bạn có thể truy cập dashboard và đăng sản phẩm.
            </NextStep>
          </div>
        </div>
      )}

      {isRejected && (
        <button
          type="button"
          className="seller-register-primary-btn"
          onClick={onRetry}
        >
          Quay lại nộp lại hồ sơ
        </button>
      )}
    </section>
  );
}

function NextStep({
  index,
  title,
  children,
}: {
  index: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <article className="seller-register-next-step">
      <span>{index}</span>
      <div>
        <strong>{title}</strong>
        <p>{children}</p>
      </div>
    </article>
  );
}
