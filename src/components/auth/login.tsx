import { Eye, EyeOff, Lock, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { login } from "../../services/auth.api";
import { saveToken, saveUser } from "../../ultil/auth";

type Props = {
  onSwitch: () => void;
};

export default function LoginPage({ onSwitch }: Props) {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!username.trim()) {
      toast.error("Vui lòng nhập email hoặc số điện thoại");
      return;
    }

    if (!password.trim()) {
      toast.error("Vui lòng nhập mật khẩu");
      return;
    }

    try {
      setLoading(true);

      const data = await login({
        username,
        password,
      });

      saveToken(data.accessToken);
      saveUser(data.user);
      toast.success("Đăng nhập thành công");

      const role = String(data.user?.role ?? "").toLowerCase();
      navigate(role === "admin" ? "/admin" : "/");
    } catch (error) {
      console.error("Login Error:", error);
      toast.error(
        error instanceof Error ? error.message : "Không thể kết nối máy chủ",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <img src="/brand/logo-antifake.png" alt="AntiFake" />
        </div>

        <h1>Chào mừng trở lại</h1>
        <p className="login-subtitle">Truy cập hệ thống AntiFake của bạn</p>

        <form className="login-form" onSubmit={handleLogin}>
          <label>Email hoặc số điện thoại</label>
          <div className="login-input">
            <User size={18} />
            <input
              type="text"
              placeholder="name@example.com"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </div>

          <div className="login-password-header">
            <label>Mật khẩu</label>
            <button type="button">Quên mật khẩu?</button>
          </div>

          <div className="login-input">
            <Lock size={18} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />

            {showPassword ? (
              <EyeOff
                size={18}
                className="password-toggle"
                onClick={() => setShowPassword(false)}
                style={{ cursor: "pointer" }}
              />
            ) : (
              <Eye
                size={18}
                className="password-toggle"
                onClick={() => setShowPassword(true)}
                style={{ cursor: "pointer" }}
              />
            )}
          </div>

          <label className="login-remember">
            <input type="checkbox" />
            <span>Ghi nhớ đăng nhập</span>
          </label>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        <div className="login-divider">
          <span>Hoặc tiếp tục với</span>
        </div>

        <div className="social-buttons">
          <button type="button">Google</button>
        </div>

        <div className="login-register">
          Chưa có tài khoản?
          <button type="button" onClick={onSwitch}>
            Đăng ký ngay
          </button>
        </div>
      </div>
    </div>
  );
}
