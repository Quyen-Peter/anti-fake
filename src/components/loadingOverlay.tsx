import "../css/components/loadingOverlay.css";

export default function LoadingOverlay() {
  return (
    <div className="loading-overlay">
      <div className="loading-box">
        <div className="loading-spinner"></div>
        <p>Đang tải dữ liệu...</p>
      </div>
    </div>
  );
}