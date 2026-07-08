import { ShieldAlert, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
import type { RegistrationStatus } from "./sellerRegistration";

type CompletionStepProps = {
  status: RegistrationStatus;
  onRetry: () => void;
};

export default function CompletionStep({ status, onRetry }: CompletionStepProps) {
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
