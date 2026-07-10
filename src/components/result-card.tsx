import type { LucideIcon } from "lucide-react";
import type { LimitingFactor } from "@/src/types/simulation";

interface ResultCardProps {
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  title: string;
  value: string;
  description?: string;
  limitDetails?: { label: string; value: string }[];
  limitingFactor?: LimitingFactor;
}

function limitingFactorTag(factor: LimitingFactor): {
  label: string;
  color: string;
  bg: string;
} {
  switch (factor) {
    case "financial":
      return { label: "Rentabilidade", color: "var(--info)", bg: "var(--info-bg)" };
    case "validity":
      return { label: "Validade", color: "var(--warning)", bg: "var(--warning-bg)" };
    case "cash_flow":
      return { label: "Fluxo de caixa", color: "#991b1b", bg: "#fef2f2" };
  }
}

export function ResultCard({
  icon: Icon,
  iconBg,
  iconColor,
  title,
  value,
  description,
  limitDetails,
  limitingFactor,
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
      {limitDetails && limitDetails.length > 1 && (
        <ul className="limit-details-list">
          {limitDetails.map((detail) => {
            const isLimiting =
              limitingFactor &&
              ((detail.label === "Rentabilidade" && limitingFactor === "financial") ||
                (detail.label === "Validade" && limitingFactor === "validity") ||
                (detail.label === "Fluxo de caixa" && limitingFactor === "cash_flow"));
            return (
              <li
                key={detail.label}
                className={`limit-details-item${isLimiting ? " limit-details-item--active" : ""}`}
              >
                <span className="limit-details-label">{detail.label}:</span>
                <span className="limit-details-value">{detail.value}</span>
                {isLimiting && limitingFactor && (
                  <span
                    className="limit-details-badge"
                    style={{
                      color: limitingFactorTag(limitingFactor).color,
                      background: limitingFactorTag(limitingFactor).bg,
                    }}
                  >
                    Fator limitante
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
