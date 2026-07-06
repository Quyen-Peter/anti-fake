import type { ReactNode } from "react";
import "../../css/components/common/emptyState.css";

type EmptyStateProps = {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  tone?: "default" | "warning";
  className?: string;
};

export default function EmptyState({
  icon,
  title,
  description,
  action,
  tone = "default",
  className = "",
}: EmptyStateProps) {
  return (
    <div className={`app-empty-state ${tone === "warning" ? "is-warning" : ""} ${className}`} role="status">
      <div className="app-empty-state-icon">{icon}</div>
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {action && <div className="app-empty-state-action">{action}</div>}
    </div>
  );
}
