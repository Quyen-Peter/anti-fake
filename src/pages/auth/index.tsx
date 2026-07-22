import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/pages/auth.css";
import LoginPage from "../../components/auth/login";
import RegisterPage from "../../components/auth/register";
import RegistrationVerification from "../../components/auth/verification";
import type { RegistrationDetails } from "../../services/auth.api";

type AuthMode = "login" | "register" | "verify";

export default function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>(() => hasEmailVerificationCallback() ? "verify" : "login");
  const [registration, setRegistration] = useState<RegistrationDetails | null>(null);
  const [initialChannel, setInitialChannel] = useState<"EMAIL" | "PHONE" | undefined>();
  const [completionTarget, setCompletionTarget] = useState<"LOGIN" | "ACCOUNT">("LOGIN");
  const [pendingGoogleLink, setPendingGoogleLink] = useState(false);

  const showVerification = (
    nextRegistration: RegistrationDetails,
    options: { channel?: "EMAIL" | "PHONE"; target?: "LOGIN" | "ACCOUNT" } = {},
  ) => {
    setRegistration(nextRegistration);
    setInitialChannel(options.channel);
    setCompletionTarget(options.target ?? "LOGIN");
    setMode("verify");
  };

  return (
    <div className="auth-page">
      {mode === "login" && (
        <LoginPage
          pendingGoogleLink={pendingGoogleLink}
          onSwitch={() => setMode("register")}
          onGoogleLinkHandled={() => setPendingGoogleLink(false)}
          onVerificationRequired={(nextRegistration) =>
            showVerification(nextRegistration, {
              channel: nextRegistration.provider === "GOOGLE" ? "EMAIL" : undefined,
              target: "LOGIN",
            })
          }
        />
      )}
      {mode === "register" && (
        <RegisterPage
          onSwitch={() => setMode("login")}
          onRegistration={(nextRegistration, options) => showVerification(nextRegistration, options)}
          onGoogleLinkRequired={() => {
            setPendingGoogleLink(true);
            setMode("login");
          }}
        />
      )}
      {mode === "verify" && (
        <RegistrationVerification
          registration={registration}
          initialChannel={initialChannel}
          completionTarget={completionTarget}
          onBackToLogin={() => setMode("login")}
          onVerified={(target) => {
            setRegistration(null);
            setInitialChannel(undefined);
            if (target === "ACCOUNT") {
              navigate("/");
            } else {
              setMode("login");
            }
          }}
        />
      )}
    </div>
  );
}

function hasEmailVerificationCallback() {
  const params = new URLSearchParams(window.location.search);
  if (params.get("verifyEmail") === "1") return true;
  return params.get("mode") === "signIn" && Boolean(params.get("oobCode"));
}
