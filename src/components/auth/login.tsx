import { Eye, EyeOff, Lock, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { firebaseLogin, login } from "../../services/auth.api";
import { getFirebaseAuth } from "../../services/firebase";
import { saveToken, saveUser } from "../../ultil/auth";
import { useGlobalLoadingStore } from "../../store/globalLoadingStore";

type Props = {
  onSwitch: () => void;
};

function GoogleMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="google-icon">
      <path
        fill="#4285F4"
        d="M21.6 12.23c0-.78-.07-1.53-.2-2.23H12v4.22h5.38a4.6 4.6 0 0 1-2 3.02v2.5h3.24c1.9-1.75 2.98-4.32 2.98-7.51z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.96-.9 6.62-2.43l-3.24-2.5c-.9.6-2.04.95-3.38.95-2.6 0-4.8-1.76-5.59-4.12H3.07v2.58A10 10 0 0 0 12 22z"
      />
      <path
        fill="#FBBC05"
        d="M6.41 13.9a6 6 0 0 1 0-3.8V7.52H3.07a10 10 0 0 0 0 8.96l3.34-2.58z"
      />
      <path
        fill="#EA4335"
        d="M12 5.98c1.47 0 2.8.5 3.84 1.5l2.88-2.88C16.96 2.96 14.7 2 12 2a10 10 0 0 0-8.93 5.52l3.34 2.58C7.2 7.74 9.4 5.98 12 5.98z"
      />
    </svg>
  );
}

export default function LoginPage({ onSwitch }: Props) {
  const navigate = useNavigate();
  const showLoading = useGlobalLoadingStore((state) => state.showLoading);
  const hideLoading = useGlobalLoadingStore((state) => state.hideLoading);

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
      showLoading("Đang đăng nhập...");

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
      hideLoading();
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      showLoading("Đang đăng nhập với Google...");

      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });

      const firebaseCredential = await signInWithPopup(
        getFirebaseAuth(),
        provider,
      );
      const idToken = await firebaseCredential.user.getIdToken();
      const data = await firebaseLogin({
        idToken,
        displayName: firebaseCredential.user.displayName ?? undefined,
      });

      saveToken(data.accessToken);
      saveUser(data.user);
      toast.success("Đăng nhập Google thành công");

      const role = String(data.user?.role ?? "").toLowerCase();
      navigate(role === "admin" ? "/admin" : "/");
    } catch (error) {
      console.error("Google Login Error:", error);
      toast.error(
        error instanceof Error ? error.message : "Không thể đăng nhập Google",
      );
    } finally {
      setLoading(false);
      hideLoading();
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
            Đăng nhập
          </button>
        </form>

        <div className="login-divider">
          <span>Hoặc tiếp tục với</span>
        </div>

        <div className="social-buttons">
          <button type="button" onClick={handleGoogleLogin} disabled={loading}>
            <GoogleMark />
            Google
          </button>
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
