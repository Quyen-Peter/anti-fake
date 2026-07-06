import "../css/components/loadingOverlay.css";

type LoadingOverlayProps = {
  message?: string;
};

export default function LoadingOverlay({
  message = "Đang tải dữ liệu...",
}: LoadingOverlayProps) {
  return (
    <div className="loading-overlay" role="status" aria-live="polite">
      <div className="loading-box">
        <div className="loading-spinner"></div>
        <p>{message}</p>
      </div>
    </div>
  );
}
