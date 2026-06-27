import { ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";

export default function CompletionStep() {
  return (
    <section className="seller-register-card success">
      <div className="seller-register-success-icon">
        <ShieldCheck size={52} />
      </div>

      <h1>Đăng ký cửa hàng thành công!</h1>
      <p className="seller-register-success-desc">
        Cảm ơn bạn đã gửi hồ sơ đăng ký. Hệ thống AntiFake sẽ tiến hành kiểm
        tra và xác thực thông tin trong vòng 24 đến 48 giờ làm việc.
      </p>

      <div className="seller-register-next-box">
        <h2>Các bước tiếp theo</h2>
        <div className="seller-register-next-grid">
          <NextStep index={1} title="Verification">
            Đội ngũ của chúng tôi đang xem xét các hồ sơ kinh doanh của bạn.
          </NextStep>
          <NextStep index={2} title="Email Notification">
            Bạn sẽ nhận được thông báo qua email ngay sau khi được phê duyệt.
          </NextStep>
          <NextStep index={3} title="Start Selling">
            Truy cập dashboard và bắt đầu đăng tải sản phẩm xác thực đầu tiên.
          </NextStep>
        </div>
      </div>

      <button type="button" className="seller-register-primary-btn">
        Xem lại hồ sơ
      </button>
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
