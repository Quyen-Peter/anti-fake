import { Check, Copy, Radio, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { BroadcastCredentials } from "../../services/live.api";

type Props = {
  credentials: BroadcastCredentials;
  onClose: () => void;
};

export default function BroadcastCredentialsPanel({
  credentials,
  onClose,
}: Props) {
  const [copied, setCopied] = useState<"url" | "key" | null>(null);

  const copy = async (value: string, field: "url" | "key") => {
    await navigator.clipboard.writeText(value);
    setCopied(field);
    toast.success("Đã sao chép");
    window.setTimeout(() => setCopied(null), 1500);
  };

  return (
    <aside className="seller-live-credentials" aria-labelledby="obs-title">
      <header>
        <div>
          <span className="seller-live-kicker">
            <Radio size={15} /> OBS SETUP
          </span>
          <h2 id="obs-title">Thông tin phát trực tiếp</h2>
        </div>
        <button type="button" onClick={onClose} aria-label="Đóng cấu hình OBS">
          <X size={18} />
        </button>
      </header>

      <p className="seller-live-security-note">
        Stream key cho phép phát lên kênh của shop. Không gửi mã này cho người
        khác và không chụp màn hình công khai.
      </p>

      <label>
        Server RTMPS
        <span>
          <input readOnly value={credentials.ingestUrl} />
          <button
            type="button"
            onClick={() => void copy(credentials.ingestUrl, "url")}
            aria-label="Sao chép server RTMPS"
          >
            {copied === "url" ? <Check size={17} /> : <Copy size={17} />}
          </button>
        </span>
      </label>

      <label>
        Stream key
        <span>
          <input readOnly type="password" value={credentials.streamKey} />
          <button
            type="button"
            onClick={() => void copy(credentials.streamKey, "key")}
            aria-label="Sao chép stream key"
          >
            {copied === "key" ? <Check size={17} /> : <Copy size={17} />}
          </button>
        </span>
      </label>

      <ol>
        <li>Mở OBS → Settings → Stream.</li>
        <li>Chọn Custom, dán Server và Stream Key.</li>
        <li>Đặt keyframe 2 giây, video H.264 và audio AAC.</li>
        <li>Nhấn Start Streaming; trạng thái sẽ tự chuyển sang LIVE.</li>
      </ol>
    </aside>
  );
}
