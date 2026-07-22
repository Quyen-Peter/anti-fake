import { Eye, EyeOff, Lock, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { toast } from "sonner";
import {
  AuthApiError,
  confirmGoogleLink,
  firebaseLogin,
  googleRegister,
  login,
  resumeRegistration,
  type RegistrationDetails,
} from "../../services/auth.api";
import { getFirebaseAuth } from "../../services/firebase";
import { saveToken, saveUser } from "../../ultil/auth";
import { useGlobalLoadingStore } from "../../store/globalLoadingStore";

type Props = {
  onSwitch: () => void;
  pendingGoogleLink: boolean;
  onGoogleLinkHandled: () => void;
  onVerificationRequired: (registration: RegistrationDetails) => void;
};

export default function LoginPage({
  onSwitch,
  pendingGoogleLink,
  onGoogleLinkHandled,
  onVerificationRequired,
}: Props) {
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
    if (!username.trim() || !password) {
      toast.error("Vui lòng nhập email/SĐT và mật khẩu");
      return;
    }

    setLoading(true);
    showLoading("Đang đăng nhập…");
    try {
      const data = await login({ username: username.trim(), password });
      saveToken(data.accessToken);
      saveUser(data.user);

      if (pendingGoogleLink) {
        const linked = await confirmGoogleLink(data.accessToken);
        onGoogleLinkHandled();
        if (!linked.success && linked.verificationRequired) {
          toast.info("Hãy xác minh email trước khi hoàn tất liên kết Google.");
          onVerificationRequired(linked.registration);
          return;
        }
        toast.success("Đăng nhập và liên kết Google thành công");
      } else {
        toast.success("Đăng nhập thành công");
      }
      navigateByRole(data.user.role);
    } catch (caught) {
      if (caught instanceof AuthApiError && caught.code === "ACCOUNT_VERIFICATION_REQUIRED") {
        try {
          const pending = await resumeRegistration({ username: username.trim(), password });
          onVerificationRequired(pending.registration);
          toast.info("Hãy hoàn tất xác minh tài khoản.");
        } catch {
          toast.error("Phiên xác minh đã hết hạn. Vui lòng đăng ký lại.");
        }
      } else {
        toast.error(toMessage(caught));
      }
    } finally {
      setLoading(false);
      hideLoading();
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    showLoading("Đang đăng nhập với Google…");
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      const credential = await signInWithPopup(getFirebaseAuth(), provider);
      const idToken = await credential.user.getIdToken(true);

      try {
        const data = await firebaseLogin({ idToken });
        saveToken(data.accessToken);
        saveUser(data.user);
        toast.success("Đăng nhập Google thành công");
        navigateByRole(data.user.role);
      } catch (caught) {
        if (caught instanceof AuthApiError && caught.code === "ACCOUNT_VERIFICATION_REQUIRED") {
          const pending = await googleRegister(idToken);
          if (pending.kind === "PENDING_VERIFICATION") {
            onVerificationRequired(pending.registration);
            toast.info("Tài khoản Google cần xác minh email trước.");
            return;
          }
        }
        if (caught instanceof AuthApiError && caught.code === "GOOGLE_ACCOUNT_NOT_LINKED") {
          toast.info("Google này chưa được đăng ký. Hãy chọn Đăng ký với Google.");
          onSwitch();
          return;
        }
        throw caught;
      }
    } catch (caught) {
      toast.error(toMessage(caught));
    } finally {
      setLoading(false);
      hideLoading();
    }
  };

  const navigateByRole = (role: string) => navigate(role.toLowerCase() === "admin" ? "/admin" : "/");

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo"><img src="/brand/logo-antifake.png" alt="AntiFake" /></div>
        <h1>Chào mừng trở lại</h1>
        <p className="login-subtitle">
          {pendingGoogleLink ? "Đăng nhập tài khoản hiện có để liên kết Google" : "Truy cập tài khoản AntiFake của bạn"}
        </p>

        <form className="login-form" onSubmit={handleLogin}>
          <label htmlFor="login-username">Email hoặc số điện thoại</label>
          <div className="login-input">
            <User size={18} />
            <input id="login-username" type="text" autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} />
          </div>

          <div className="login-password-header"><label htmlFor="login-password">Mật khẩu</label><button type="button">Quên mật khẩu?</button></div>
          <div className="login-input">
            <Lock size={18} />
            <input id="login-password" type={showPassword ? "text" : "password"} autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} />
            <button
              type="button"
              className="password-toggle"
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              onClick={() => setShowPassword((value) => !value)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <button type="submit" className="login-btn" disabled={loading}>Đăng nhập</button>
        </form>

        {!pendingGoogleLink && (
          <>
            <div className="login-divider"><span>Hoặc tiếp tục với</span></div>
            <div className="social-buttons">
              <button type="button" onClick={() => void handleGoogleLogin()} disabled={loading}>
                <GoogleMark /> Google
              </button>
            </div>
            <div className="login-register">Chưa có tài khoản?<button type="button" onClick={onSwitch}>Đăng ký ngay</button></div>
          </>
        )}
      </div>
    </div>
  );
}

function GoogleMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="google-icon">
      <path fill="#4285F4" d="M21.6 12.23c0-.78-.07-1.53-.2-2.23H12v4.22h5.38a4.6 4.6 0 0 1-2 3.02v2.5h3.24c1.9-1.75 2.98-4.32 2.98-7.51z" />
      <path fill="#34A853" d="M12 22c2.7 0 4.96-.9 6.62-2.43l-3.24-2.5c-.9.6-2.04.95-3.38.95-2.6 0-4.8-1.76-5.59-4.12H3.07v2.58A10 10 0 0 0 12 22z" />
      <path fill="#FBBC05" d="M6.41 13.9a6 6 0 0 1 0-3.8V7.52H3.07a10 10 0 0 0 0 8.96l3.34-2.58z" />
      <path fill="#EA4335" d="M12 5.98c1.47 0 2.8.5 3.84 1.5l2.88-2.88C16.96 2.96 14.7 2 12 2a10 10 0 0 0-8.93 5.52l3.34 2.58C7.2 7.74 9.4 5.98 12 5.98z" />
    </svg>
  );
}

function toMessage(error: unknown) {
  return error instanceof Error ? error.message : "Không thể đăng nhập";
}
