import type { ConfirmationResult } from "firebase/auth";
import {
  RecaptchaVerifier,
  isSignInWithEmailLink,
  sendSignInLinkToEmail,
  signInWithEmailLink,
  signInWithPhoneNumber,
} from "firebase/auth";
import { getFirebaseAuth } from "./firebase";

const EMAIL_PENDING_KEY = "wallet-email-step-up";
const EMAIL_CHANNEL = "wallet-email-step-up-result";

type PendingEmailStepUp = { challengeId: string; email: string; createdAt: number };

let recaptchaVerifier: RecaptchaVerifier | null = null;

export const sendPhoneStepUpCode = async (phone: string, containerId: string): Promise<ConfirmationResult> => {
  const auth = getFirebaseAuth();
  recaptchaVerifier?.clear();
  recaptchaVerifier = new RecaptchaVerifier(auth, containerId, { size: "invisible" });
  return signInWithPhoneNumber(auth, normalizeVietnamesePhone(phone), recaptchaVerifier);
};

export const confirmPhoneStepUp = async (confirmation: ConfirmationResult, code: string) => {
  const credential = await confirmation.confirm(code.trim());
  return credential.user.getIdToken(true);
};

export const sendEmailStepUpLink = async (email: string, challengeId: string) => {
  if (!("BroadcastChannel" in window)) {
    throw new Error("Trình duyệt không hỗ trợ xác thực email an toàn. Vui lòng dùng SMS OTP.");
  }
  const pending: PendingEmailStepUp = { challengeId, email, createdAt: Date.now() };
  localStorage.setItem(EMAIL_PENDING_KEY, JSON.stringify(pending));
  const url = new URL(window.location.href);
  url.searchParams.set("walletEmailStepUp", "1");
  await sendSignInLinkToEmail(getFirebaseAuth(), email, { url: url.toString(), handleCodeInApp: true });
};

export const listenForEmailStepUp = (
  challengeId: string,
  onToken: (firebaseIdToken: string) => void,
) => {
  const channel = new BroadcastChannel(EMAIL_CHANNEL);
  channel.onmessage = (event: MessageEvent<{ challengeId?: string; firebaseIdToken?: string }>) => {
    if (event.data?.challengeId === challengeId && event.data.firebaseIdToken) {
      onToken(event.data.firebaseIdToken);
    }
  };
  return () => channel.close();
};

export const completeEmailStepUpFromLink = async () => {
  if (!new URL(window.location.href).searchParams.has("walletEmailStepUp")) return false;
  const auth = getFirebaseAuth();
  if (!isSignInWithEmailLink(auth, window.location.href)) return false;
  const raw = localStorage.getItem(EMAIL_PENDING_KEY);
  if (!raw) throw new Error("Không tìm thấy yêu cầu xác thực email đang chờ");
  const pending = JSON.parse(raw) as PendingEmailStepUp;
  if (!pending.challengeId || !pending.email || Date.now() - pending.createdAt > 5 * 60_000) {
    localStorage.removeItem(EMAIL_PENDING_KEY);
    throw new Error("Yêu cầu xác thực email đã hết hạn");
  }

  const credential = await signInWithEmailLink(auth, pending.email, window.location.href);
  const firebaseIdToken = await credential.user.getIdToken(true);
  const channel = new BroadcastChannel(EMAIL_CHANNEL);
  channel.postMessage({ challengeId: pending.challengeId, firebaseIdToken });
  channel.close();
  localStorage.removeItem(EMAIL_PENDING_KEY);
  window.history.replaceState({}, document.title, window.location.pathname);
  return true;
};

export const clearPhoneStepUp = () => {
  recaptchaVerifier?.clear();
  recaptchaVerifier = null;
};

const normalizeVietnamesePhone = (value: string) => {
  const digits = value.replace(/\D/g, "");
  if (digits.startsWith("84")) return `+${digits}`;
  if (digits.startsWith("0")) return `+84${digits.slice(1)}`;
  return `+${digits}`;
};
