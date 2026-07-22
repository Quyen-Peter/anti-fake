import { CheckCircle2, Clock3, Mail, MessageSquareText, ShieldCheck } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ConfirmationResult, RecaptchaVerifier } from "firebase/auth";
import { toast } from "sonner";
import {
  confirmRegistrationChallenge,
  createRegistrationChallenge,
  getEmailVerificationContext,
  resendRegistrationChallenge,
  type RegistrationDetails,
  type VerificationChallenge,
} from "../../services/auth.api";
import {
  clearTemporaryFirebaseSession,
  completeRegistrationEmailLink,
  sendRegistrationEmailLink,
  sendRegistrationPhoneOtp,
} from "../../services/registration-verification.firebase";

type VerificationStep = "CHOOSE" | "EMAIL_SENT" | "PHONE_OTP" | "EMAIL_CALLBACK";

type Props = {
  registration: RegistrationDetails | null;
  initialChannel?: "EMAIL" | "PHONE";
  completionTarget?: "LOGIN" | "ACCOUNT";
  onVerified: (target: "LOGIN" | "ACCOUNT") => void;
  onBackToLogin: () => void;
};

export default function RegistrationVerification({
  registration,
  initialChannel,
  completionTarget = "LOGIN",
  onVerified,
  onBackToLogin,
}: Props) {
  const callbackParams = useMemo(() => readEmailCallbackParams(), []);
  const [step, setStep] = useState<VerificationStep>(
    callbackParams ? "EMAIL_CALLBACK" : initialChannel === "PHONE" ? "PHONE_OTP" : "CHOOSE",
  );
  const [challenge, setChallenge] = useState<VerificationChallenge | null>(null);
  const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(null);
  const [otp, setOtp] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const verifierRef = useRef<RecaptchaVerifier | null>(null);
  const autoStartedRef = useRef(false);

  useEffect(() => () => verifierRef.current?.clear(), []);

  useEffect(() => {
    if (!challenge || challenge.channel !== "PHONE") return;
    const update = () => {
      setSecondsLeft(Math.max(0, Math.ceil((new Date(challenge.expiresAt).getTime() - Date.now()) / 1000)));
    };
    update();
    const timer = window.setInterval(update, 1_000);
    return () => window.clearInterval(timer);
  }, [challenge]);

  const sendPhoneOtp = useCallback(async (nextChallenge: VerificationChallenge) => {
    if (!registration?.phone) throw new Error("Phiên đăng ký không có số điện thoại hợp lệ");
    verifierRef.current?.clear();
    const result = await sendRegistrationPhoneOtp(registration.phone, "registration-recaptcha");
    verifierRef.current = result.verifier;
    setConfirmation(result.confirmation);
    setChallenge(nextChallenge);
    setOtp("");
    setStep("PHONE_OTP");
    toast.success("Mã OTP đã được gửi");
  }, [registration]);

  const startChannel = useCallback(async (channel: "EMAIL" | "PHONE") => {
    if (!registration) return;
    setLoading(true);
    setError(null);
    try {
      const result = await createRegistrationChallenge(channel);
      setChallenge(result.challenge);
      if (channel === "EMAIL") {
        if (!registration.email || !result.challenge.state) {
          throw new Error("Phiên đăng ký không có email hợp lệ");
        }
        await sendRegistrationEmailLink(
          registration.email,
          result.challenge.id,
          result.challenge.state,
        );
        setStep("EMAIL_SENT");
        toast.success("Đã gửi link xác minh tới email của bạn");
      } else {
        await sendPhoneOtp(result.challenge);
      }
    } catch (caught) {
      setError(toMessage(caught));
    } finally {
      setLoading(false);
    }
  }, [registration, sendPhoneOtp]);

  const resendPhoneOtp = async () => {
    if (!challenge || secondsLeft > 0) return;
    setLoading(true);
    setError(null);
    try {
      const result = await resendRegistrationChallenge(challenge.id);
      await sendPhoneOtp(result.challenge);
    } catch (caught) {
      setError(toMessage(caught));
    } finally {
      setLoading(false);
    }
  };

  const verifyPhoneOtp = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!challenge || !confirmation || !/^\d{6}$/.test(otp) || secondsLeft <= 0) return;
    setLoading(true);
    setError(null);
    try {
      const firebaseCredential = await confirmation.confirm(otp);
      const idToken = await firebaseCredential.user.getIdToken(true);
      await confirmRegistrationChallenge(challenge.id, { idToken });
      await clearTemporaryFirebaseSession();
      toast.success("Xác minh số điện thoại thành công");
      onVerified(completionTarget);
    } catch (caught) {
      setError(toMessage(caught));
    } finally {
      setLoading(false);
    }
  };

  const completeEmailCallback = useCallback(async (challengeId: string, state: string) => {
    setLoading(true);
    setError(null);
    try {
      const context = await getEmailVerificationContext(challengeId, state);
      const idToken = await completeRegistrationEmailLink(context.email, window.location.href);
      await confirmRegistrationChallenge(challengeId, { idToken, state });
      await clearTemporaryFirebaseSession();
      window.history.replaceState({}, "", "/auth");
      toast.success("Xác minh email thành công. Vui lòng đăng nhập.");
      onVerified("LOGIN");
    } catch (caught) {
      setError(toMessage(caught));
    } finally {
      setLoading(false);
    }
  }, [onVerified]);

  useEffect(() => {
    if (!callbackParams || autoStartedRef.current) return;
    autoStartedRef.current = true;
    void completeEmailCallback(callbackParams.challengeId, callbackParams.state);
  }, [callbackParams, completeEmailCallback]);

  useEffect(() => {
    if (
      callbackParams ||
      autoStartedRef.current ||
      !registration ||
      (registration.provider !== "GOOGLE" && initialChannel !== "PHONE")
    ) {
      return;
    }
    autoStartedRef.current = true;
    void startChannel(initialChannel ?? "EMAIL");
  }, [callbackParams, initialChannel, registration, startChannel]);

  return (
    <div className="register-page">
      <section className="register-card verification-card" aria-labelledby="verification-title">
        <div className="verification-icon" aria-hidden="true">
          <ShieldCheck size={30} />
        </div>
        <h1 id="verification-title">Xác minh tài khoản</h1>

        {step === "CHOOSE" && registration && (
          <>
            <p className="register-subtitle">
              Chọn cách nhận mã xác minh. Bạn không cần nhập lại thông tin.
            </p>
            <div className="verification-options">
              <button type="button" onClick={() => void startChannel("EMAIL")} disabled={loading}>
                <Mail size={22} />
                <span><b>Xác minh qua email</b><small>{maskEmail(registration.email)}</small></span>
              </button>
              <button type="button" onClick={() => void startChannel("PHONE")} disabled={loading}>
                <MessageSquareText size={22} />
                <span><b>Nhận OTP qua SMS</b><small>{maskPhone(registration.phone)}</small></span>
              </button>
            </div>
          </>
        )}

        {step === "EMAIL_SENT" && (
          <div className="verification-status" role="status">
            <Mail size={36} />
            <h2>Kiểm tra hộp thư của bạn</h2>
            <p>Chúng tôi đã gửi link xác minh tới {maskEmail(registration?.email ?? null)}.</p>
            <p className="verification-hint">Bấm link trong email để hoàn tất, sau đó hệ thống sẽ chuyển về đăng nhập.</p>
          </div>
        )}

        {step === "PHONE_OTP" && (
          <form className="verification-status" onSubmit={verifyPhoneOtp}>
            <MessageSquareText size={36} />
            <h2>Nhập mã OTP 6 số</h2>
            <p>Mã đã gửi tới {maskPhone(registration?.phone ?? null)}</p>
            <input
              className="otp-input"
              aria-label="Mã OTP gồm 6 số"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={otp}
              onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
              autoFocus
            />
            <div className="otp-timer" role="timer">
              <Clock3 size={16} />
              {secondsLeft > 0 ? `Mã còn hiệu lực ${formatCountdown(secondsLeft)}` : "Mã đã hết hạn"}
            </div>
            <button className="register-btn" type="submit" disabled={loading || secondsLeft <= 0 || otp.length !== 6}>
              Xác minh
            </button>
            <button type="button" className="verification-link" disabled={loading || secondsLeft > 0} onClick={() => void resendPhoneOtp()}>
              Gửi lại mã
            </button>
          </form>
        )}

        {step === "EMAIL_CALLBACK" && !error && (
          <div className="verification-status" role="status" aria-live="polite">
            <CheckCircle2 size={36} />
            <h2>Đang xác minh email…</h2>
            <p>Vui lòng giữ nguyên trang này trong giây lát.</p>
          </div>
        )}

        {error && <p className="verification-error" role="alert">{error}</p>}
        {(error || step === "EMAIL_SENT") && (
          <button type="button" className="verification-link" onClick={onBackToLogin}>
            Quay về đăng nhập
          </button>
        )}
        <div id="registration-recaptcha" />
      </section>
    </div>
  );
}

function readEmailCallbackParams() {
  const url = new URL(window.location.href);
  const challengeId = url.searchParams.get("challengeId");
  const state = url.searchParams.get("state");
  if (url.searchParams.get("verifyEmail") === "1" && challengeId && state) {
    return { challengeId, state };
  }
  const continueUrl = url.searchParams.get("continueUrl");
  if (!continueUrl) return null;
  try {
    const nested = new URL(continueUrl);
    const nestedChallengeId = nested.searchParams.get("challengeId");
    const nestedState = nested.searchParams.get("state");
    return nestedChallengeId && nestedState
      ? { challengeId: nestedChallengeId, state: nestedState }
      : null;
  } catch {
    return null;
  }
}

function formatCountdown(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

function maskEmail(email: string | null) {
  if (!email) return "email đã đăng ký";
  const [name, domain] = email.split("@");
  return `${name.slice(0, 2)}***@${domain}`;
}

function maskPhone(phone: string | null) {
  if (!phone) return "số điện thoại đã đăng ký";
  return `${phone.slice(0, 3)}****${phone.slice(-3)}`;
}

function toMessage(error: unknown) {
  return error instanceof Error ? error.message : "Không thể hoàn tất xác minh";
}
