import {
  RecaptchaVerifier,
  isSignInWithEmailLink,
  sendSignInLinkToEmail,
  signInWithEmailLink,
  signInWithPhoneNumber,
  signOut,
  type ConfirmationResult,
} from "firebase/auth";
import { getFirebaseAuth } from "./firebase";

export async function sendRegistrationEmailLink(
  email: string,
  challengeId: string,
  state: string,
) {
  const auth = getFirebaseAuth();
  const callbackUrl = new URL("/auth", window.location.origin);
  callbackUrl.searchParams.set("verifyEmail", "1");
  callbackUrl.searchParams.set("challengeId", challengeId);
  callbackUrl.searchParams.set("state", state);

  await sendSignInLinkToEmail(auth, email, {
    url: callbackUrl.toString(),
    handleCodeInApp: true,
  });
  await signOut(auth).catch(() => undefined);
}

export async function completeRegistrationEmailLink(email: string, href: string) {
  const auth = getFirebaseAuth();
  if (!isSignInWithEmailLink(auth, href)) {
    throw new Error("Link xác minh email không hợp lệ hoặc đã hết hạn");
  }
  const credential = await signInWithEmailLink(auth, email, href);
  return credential.user.getIdToken(true);
}

export async function sendRegistrationPhoneOtp(
  phone: string,
  containerId: string,
): Promise<{ confirmation: ConfirmationResult; verifier: RecaptchaVerifier }> {
  const auth = getFirebaseAuth();
  const verifier = new RecaptchaVerifier(auth, containerId, { size: "invisible" });
  const confirmation = await signInWithPhoneNumber(auth, toFirebasePhone(phone), verifier);
  return { confirmation, verifier };
}

export function toFirebasePhone(phone: string) {
  const normalized = phone.replace(/[\s.-]/g, "");
  if (/^0\d{9}$/.test(normalized)) return `+84${normalized.slice(1)}`;
  if (/^\+84\d{9}$/.test(normalized)) return normalized;
  throw new Error("Số điện thoại Việt Nam không hợp lệ");
}

export async function clearTemporaryFirebaseSession() {
  await signOut(getFirebaseAuth()).catch(() => undefined);
}
