import type { LucideIcon } from "lucide-react";

interface ResultCardProps {
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  title: string;
  value: string;
  description?: string;
}

export function ResultCard({
  icon: Icon,
  iconBg,
  iconColor,
  title,
  value,
  description,
}: ResultCardProps) {
  return (
    <div className="metric-card">
      <div className="metric-card-header">
        <div
          className="metric-card-icon"
          style={{ background: iconBg, color: iconColor }}
        >
          <Icon size={18} aria-hidden="true" />
        </div>
        <span className="metric-card-title">{title}</span>
      </div>
      <div className="metric-card-value">{value}</div>
      {description && (
        <p className="metric-card-description">{description}</p>
      )}
    </div>
  );
}
