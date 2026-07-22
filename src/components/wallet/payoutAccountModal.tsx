import { useEffect, useMemo, useRef, useState } from "react";
import type { ConfirmationResult } from "firebase/auth";
import { toast } from "sonner";
import { getUser } from "../../ultil/auth";
import {
  createShopPayoutAccount,
  createShopWithdrawal,
  createWithdrawalAuthorizationChallenge,
  verifyWithdrawalAuthorizationChallenge,
  type PayoutAccount,
  type PayoutAccountInput,
  type WithdrawalAuthorizationChannel,
} from "../../services/wallet.api";
import {
  clearPhoneStepUp,
  confirmPhoneStepUp,
  listenForEmailStepUp,
  sendEmailStepUpLink,
  sendPhoneStepUpCode,
} from "../../services/withdrawal-step-up";

type Props = {
  open: boolean;
  mode: "add-account" | "withdraw";
  shopId: string;
  payoutAccounts: PayoutAccount[];
  onClose: () => void;
  onSuccess: () => Promise<void> | void;
};

const emptyAccount: PayoutAccountInput = {
  bankBin: "",
  bankCode: "",
  bankName: "",
  accountNumber: "",
  accountHolder: "",
};

export default function PayoutAccountModal({ open, mode, shopId, payoutAccounts, onClose, onSuccess }: Props) {
  const [account, setAccount] = useState<PayoutAccountInput>(emptyAccount);
  const [amount, setAmount] = useState("");
  const [payoutAccountId, setPayoutAccountId] = useState("");
  const [channel, setChannel] = useState<WithdrawalAuthorizationChannel>("PHONE");
  const [step, setStep] = useState<"form" | "otp" | "email">("form");
  const [otp, setOtp] = useState("");
  const [busy, setBusy] = useState(false);
  const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(null);
  const cleanupEmailListener = useRef<null | (() => void)>(null);
  const challengeIdRef = useRef("");
  const currentUser = getUser() as { email?: string; phone?: string } | null;

  const eligibleAccounts = useMemo(() => payoutAccounts.filter(
    (item) => item.verificationStatus === "VERIFIED" && new Date(item.availableAfter).getTime() <= Date.now(),
  ), [payoutAccounts]);

  useEffect(() => {
    if (!open) return;
    setAccount(emptyAccount);
    setAmount("");
    setPayoutAccountId(eligibleAccounts[0]?.id ?? "");
    setChannel(currentUser?.phone ? "PHONE" : "EMAIL");
    setStep("form");
    setOtp("");
    setConfirmation(null);
    return () => {
      cleanupEmailListener.current?.();
      cleanupEmailListener.current = null;
      clearPhoneStepUp();
    };
  }, [open, mode]);

  if (!open) return null;

  const close = () => {
    if (busy) return;
    cleanupEmailListener.current?.();
    cleanupEmailListener.current = null;
    clearPhoneStepUp();
    onClose();
  };

  const validate = () => {
    if (mode === "add-account") {
      if (!/^\d{6}$/.test(account.bankBin) || !/^[A-Za-z0-9]{2,20}$/.test(account.bankCode)) {
        throw new Error("BIN phải có 6 số và mã ngân hàng phải hợp lệ");
      }
      if (!account.bankName.trim() || !/^\d{6,20}$/.test(account.accountNumber) || !account.accountHolder.trim()) {
        throw new Error("Vui lòng nhập đầy đủ và đúng định dạng thông tin tài khoản");
      }
    } else {
      if (!payoutAccountId) throw new Error("Chưa có tài khoản nhận tiền đã xác minh và hết thời gian chờ");
      if (!Number.isFinite(Number(amount)) || Number(amount) < 100_000) {
        throw new Error("Số tiền rút tối thiểu là 100.000 ₫");
      }
    }
    if (channel === "PHONE" && !currentUser?.phone) throw new Error("Tài khoản chưa có số điện thoại");
    if (channel === "EMAIL" && !currentUser?.email) throw new Error("Tài khoản chưa có email");
  };

  const finalize = async (challengeId: string, firebaseIdToken: string) => {
    const verified = await verifyWithdrawalAuthorizationChallenge(challengeId, firebaseIdToken);
    if (mode === "add-account") {
      await createShopPayoutAccount(shopId, { ...account, authorizationToken: verified.authorizationToken });
      toast.success("Đã thêm tài khoản. Admin cần xác minh tên người thụ hưởng trước khi rút tiền.");
    } else {
      await createShopWithdrawal(shopId, {
        amount: Number(amount).toFixed(2),
        payoutAccountId,
        idempotencyKey: crypto.randomUUID(),
        authorizationToken: verified.authorizationToken,
      });
      toast.success("Đã tạo yêu cầu rút tiền và khóa số dư tương ứng");
    }
    await onSuccess();
    onClose();
  };

  const confirmOtp = async () => {
    if (!confirmation || !/^\d{6}$/.test(otp)) {
      toast.error("Vui lòng nhập mã OTP gồm 6 số");
      return;
    }
    try {
      setBusy(true);
      const firebaseIdToken = await confirmPhoneStepUp(confirmation, otp);
      if (!challengeIdRef.current) throw new Error("Thiếu mã yêu cầu xác thực");
      await finalize(challengeIdRef.current, firebaseIdToken);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Mã OTP không hợp lệ");
    } finally {
      setBusy(false);
    }
  };

  const beginWithChallengeTracking = async () => {
    try {
      validate();
      setBusy(true);
      const normalizedAmount = mode === "withdraw" ? Number(amount).toFixed(2) : undefined;
      const challenge = await createWithdrawalAuthorizationChallenge({
        shopId,
        operation: mode === "add-account" ? "CREATE_PAYOUT_ACCOUNT" : "CREATE_WITHDRAWAL",
        channel,
        ...(mode === "add-account" ? account : { amount: normalizedAmount, payoutAccountId }),
      });
      challengeIdRef.current = challenge.challengeId;
      if (channel === "PHONE") {
        setConfirmation(await sendPhoneStepUpCode(currentUser!.phone!, "wallet-recaptcha"));
        setStep("otp");
        toast.success("Mã OTP đã được gửi qua SMS");
      } else {
        cleanupEmailListener.current = listenForEmailStepUp(challenge.challengeId, async (firebaseIdToken) => {
          try {
            setBusy(true);
            await finalize(challenge.challengeId, firebaseIdToken);
          } catch (error) {
            toast.error(error instanceof Error ? error.message : "Xác thực email thất bại");
          } finally {
            setBusy(false);
          }
        });
        await sendEmailStepUpLink(currentUser!.email!, challenge.challengeId);
        setStep("email");
        toast.success("Đã gửi liên kết xác thực. Hãy giữ tab này mở.");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không thể bắt đầu xác thực");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="wallet-modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && close()}>
      <section className="wallet-modal" role="dialog" aria-modal="true" aria-labelledby="wallet-modal-title">
        <header>
          <div>
            <p>{mode === "add-account" ? "TÀI KHOẢN NHẬN TIỀN" : "RÚT TIỀN AN TOÀN"}</p>
            <h2 id="wallet-modal-title">{mode === "add-account" ? "Thêm tài khoản ngân hàng" : "Tạo yêu cầu rút tiền"}</h2>
          </div>
          <button type="button" className="wallet-modal-close" onClick={close} aria-label="Đóng">×</button>
        </header>

        {step === "form" ? (
          <div className="wallet-modal-body">
            {mode === "add-account" ? (
              <div className="wallet-form-grid">
                <label>BIN ngân hàng<input inputMode="numeric" maxLength={6} value={account.bankBin} onChange={(e) => setAccount({ ...account, bankBin: e.target.value.replace(/\D/g, "") })} placeholder="970436" /></label>
                <label>Mã ngân hàng<input value={account.bankCode} onChange={(e) => setAccount({ ...account, bankCode: e.target.value.toUpperCase() })} placeholder="VCB" /></label>
                <label className="wide">Tên ngân hàng<input value={account.bankName} onChange={(e) => setAccount({ ...account, bankName: e.target.value })} placeholder="Vietcombank" /></label>
                <label className="wide">Số tài khoản<input inputMode="numeric" value={account.accountNumber} onChange={(e) => setAccount({ ...account, accountNumber: e.target.value.replace(/\D/g, "") })} autoComplete="off" /></label>
                <label className="wide">Tên chủ tài khoản<input value={account.accountHolder} onChange={(e) => setAccount({ ...account, accountHolder: e.target.value })} placeholder="Phải trùng KYC hoặc tên pháp nhân đã xác minh" /></label>
              </div>
            ) : (
              <div className="wallet-form-grid">
                <label className="wide">Tài khoản nhận tiền<select value={payoutAccountId} onChange={(e) => setPayoutAccountId(e.target.value)}><option value="">Chọn tài khoản</option>{eligibleAccounts.map((item) => <option key={item.id} value={item.id}>{item.bankName} · {item.accountNumberMasked} · {item.accountHolder}</option>)}</select></label>
                <label className="wide">Số tiền<input inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))} placeholder="Tối thiểu 100000" /></label>
              </div>
            )}

            <fieldset className="wallet-channel-picker">
              <legend>Xác thực mỗi thao tác qua</legend>
              <label><input type="radio" checked={channel === "PHONE"} disabled={!currentUser?.phone} onChange={() => setChannel("PHONE")} /> SMS OTP {currentUser?.phone ? `(${maskContact(currentUser.phone)})` : "(chưa có số điện thoại)"}</label>
              <label><input type="radio" checked={channel === "EMAIL"} disabled={!currentUser?.email} onChange={() => setChannel("EMAIL")} /> Email link {currentUser?.email ? `(${maskEmail(currentUser.email)})` : "(chưa có email)"}</label>
            </fieldset>
            <p className="wallet-security-note">Không hỗ trợ tài khoản người khác. Thông tin phải trùng KYC của chủ shop hoặc tên pháp nhân đã xác minh.</p>
          </div>
        ) : null}

        {step === "otp" ? <div className="wallet-modal-body wallet-verification-state"><h3>Nhập mã SMS OTP</h3><p>Mã chỉ dùng cho thao tác hiện tại và hết hạn sau 5 phút.</p><input className="wallet-otp-input" inputMode="numeric" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} autoFocus /></div> : null}
        {step === "email" ? <div className="wallet-modal-body wallet-verification-state"><h3>Kiểm tra email</h3><p>Mở liên kết Firebase trong email và giữ tab này mở. Hệ thống sẽ tiếp tục tự động sau khi xác thực.</p></div> : null}

        <div id="wallet-recaptcha" />
        <footer>
          <button type="button" className="secondary" onClick={close} disabled={busy}>Hủy</button>
          {step === "form" ? <button type="button" onClick={beginWithChallengeTracking} disabled={busy}>{busy ? "Đang gửi..." : "Gửi xác thực"}</button> : null}
          {step === "otp" ? <button type="button" onClick={confirmOtp} disabled={busy}>{busy ? "Đang xác thực..." : "Xác nhận OTP"}</button> : null}
        </footer>
      </section>
    </div>
  );
}

const maskContact = (value: string) => value.length > 6 ? `${value.slice(0, 3)}***${value.slice(-3)}` : "***";
const maskEmail = (value: string) => {
  const [name, domain] = value.split("@");
  return `${name?.slice(0, 2) ?? ""}***@${domain ?? ""}`;
};
