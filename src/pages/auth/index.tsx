import { useState } from "react";
import "../../css/pages/auth.css";
import LoginPage from "../../components/auth/login";
import RegisterPage from "../../components/auth/register";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");



  return (
    <div className="auth-page">
      {mode === "login" ? (
        <LoginPage onSwitch={() => setMode("register")} />
      ) : (
        <RegisterPage onSwitch={() => setMode("login")} />
      )}
    </div>
  );
}
