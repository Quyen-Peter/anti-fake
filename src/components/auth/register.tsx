import { User, Mail, Phone, Lock, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { register } from "../../services/auth.api";
import { toast } from "sonner";
import { useGlobalLoadingStore } from "../../store/globalLoadingStore";

type Props = {
  onSwitch: () => void;
};

export default function RegisterPage({ onSwitch }: Props) {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const showLoading = useGlobalLoadingStore((state) => state.showLoading);
  const hideLoading = useGlobalLoadingStore((state) => state.hideLoading);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Họ tên
    if (!displayName.trim()) {
      toast.error("Vui lòng nhập họ tên");
      return;
    }

    if (displayName.trim().length < 3) {
      toast.error("Họ tên phải từ 3 ký tự trở lên");
      return;
    }

    // Email
    if (!email.trim()) {
      toast.error("Vui lòng nhập email");
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;

    if (!emailRegex.test(email)) {
      toast.error("Email không hợp lệ");
      return;
    }

    // Phone
    if (!phone.trim()) {
      toast.error("Vui lòng nhập số điện thoại");
      return;
    }

    const phoneRegex = /^(0|\+84)[0-9]{9,10}$/;

    if (!phoneRegex.test(phone)) {
      toast.error("Số điện thoại không hợp lệ");
      return;
    }

    // Password
    if (!password) {
      toast.error("Vui lòng nhập mật khẩu");
      return;
    }

    if (password.length < 8) {
      toast.error("Mật khẩu phải từ 8 ký tự trở lên");
      return;
    }

    if (!/[A-Z]/.test(password)) {
      toast.error("Mật khẩu phải chứa ít nhất 1 chữ in hoa");
      return;
    }

    if (!/[a-z]/.test(password)) {
      toast.error("Mật khẩu phải chứa ít nhất 1 chữ thường");
      return;
    }

    if (!/[0-9]/.test(password)) {
      toast.error("Mật khẩu phải chứa ít nhất 1 chữ số");
      return;
    }

    // Confirm Password
    if (!confirmPassword) {
      toast.error("Vui lòng nhập lại mật khẩu");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }

    try {
      setLoading(true);
      showLoading("Đang đăng ký...");
      const res = await register({
        email,
        phone,
        displayName,
        password,
      });

      if (res != null) {
        toast.success("Đăng ký thành công");
      }

      onSwitch();
    } catch (error) {
      console.error("Register Error:", error);

      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Không thể kết nối tới máy chủ");
      }
    } finally {
      setLoading(false);
      hideLoading();
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <h1>Tạo tài khoản</h1>

        <p className="register-subtitle">
          Tham gia hệ thống bảo mật hàng đầu AntiFake
        </p>

        <form className="register-form" onSubmit={handleRegister}>
          <label>Họ và tên</label>

          <div className="register-input">
            <User size={18} />
            <input
              type="text"
              placeholder="Nguyễn Văn A"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>

          <div className="register-row">
            <div>
              <label>Email</label>

              <div className="register-input">
                <Mail size={18} />
                <input
                  type="email"
                  placeholder="example@antifake.cc"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label>Số điện thoại</label>

              <div className="register-input">
                <Phone size={18} />
                <input
                  type="text"
                  placeholder="0901234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="register-row">
            <div>
              <label>Mật khẩu</label>

              <div className="register-input">
                <Lock size={18} />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label>Nhập lại mật khẩu</label>

              <div className="register-input">
                <ShieldCheck size={18} />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <label className="register-checkbox">
            <input type="checkbox" />
            <span>
              Tôi đồng ý với các
              <b> Điều khoản dịch vụ </b>
              và
              <b> Chính sách bảo mật </b>
              của AntiFake Integrity System.
            </span>
          </label>

          <button type="button" onClick={onSwitch}>
            Đã có tài khoản? Đăng nhập
          </button>

          <button type="submit" className="register-btn" disabled={loading}>
            Đăng ký ngay
          </button>
        </form>
      </div>
    </div>
  );
}
