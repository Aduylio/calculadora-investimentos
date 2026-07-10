"use client";

import type { PurchaseSimulationResult, PurchaseSimulationInput, LimitingFactor } from "@/src/types/simulation";
import { ResultCard } from "./result-card";
import {
  Clock3,
  ChartNoAxesCombined,
  WalletCards,
  Check,
  TriangleAlert,
  Info,
  CircleAlert,
  Pill,
} from "lucide-react";

interface AnalysisResultProps {
  result: PurchaseSimulationResult | null;
  input?: PurchaseSimulationInput | null;
}

const riskConfig = {
  healthy: {
    bg: "var(--success-bg)",
    border: "var(--success-border)",
    color: "var(--success-dark)",
    iconBg: "var(--success-bg)",
    iconColor: "var(--success)",
    Icon: Check,
  },
  attention: {
    bg: "var(--warning-bg)",
    border: "var(--warning-border)",
    color: "var(--warning)",
    iconBg: "var(--warning-bg)",
    iconColor: "var(--warning)",
    Icon: TriangleAlert,
  },
  not_recommended: {
    bg: "var(--out-of-params-bg)",
    border: "var(--out-of-params-border)",
    color: "var(--out-of-params-text)",
    iconBg: "var(--out-of-params-bg)",
    iconColor: "var(--out-of-params-icon)",
    Icon: TriangleAlert,
  },
};

type CriterionStatus = "within" | "near" | "above" | "not_informed";

function criterionStatus(
  quantity: number,
  limit: number | undefined
): { status: CriterionStatus; excess: number } {
  if (limit === undefined) return { status: "not_informed", excess: 0 };
  if (quantity > limit) return { status: "above", excess: Math.ceil(quantity - limit) };
  if (quantity >= limit * 0.9) return { status: "near", excess: 0 };
  return { status: "within", excess: 0 };
}

function statusIcon(status: CriterionStatus) {
  switch (status) {
    case "within":
      return { Icon: Check, color: "var(--success)" };
    case "near":
      return { Icon: TriangleAlert, color: "var(--warning)" };
    case "above":
      return { Icon: TriangleAlert, color: "var(--out-of-params-icon)" };
    case "not_informed":
      return { Icon: CircleAlert, color: "var(--text-muted)" };
  }
}

function statusText(status: CriterionStatus, excess: number): string {
  switch (status) {
    case "within":
      return "Dentro do limite";
    case "near":
      return "Próximo do limite";
    case "above":
      return `${fmtInt(excess)} unidades acima do limite`;
    case "not_informed":
      return "Não informado";
  }
}

export function AnalysisResult({ result, input }: AnalysisResultProps) {
  if (!result) {
    return (
      <div className="empty-state">
        <div className="empty-state-content">
          <Pill
            size={40}
            className="empty-state-icon"
            aria-hidden="true"
          />
          <p className="empty-state-text">
            Preencha os dados da oferta para descobrir se essa compra vale a
            pena.
          </p>
        </div>
      </div>
    );
  }

  const baseCfg = riskConfig[result.riskLevel];
  const monthlyDemand = input?.monthlyDemand ?? 0;
  const purchaseQuantity = input?.purchaseQuantity ?? 0;
  const currentStock = input?.currentStock ?? 0;

  const coverageTurnoverMonths =
    monthlyDemand > 0 ? (currentStock + purchaseQuantity) / monthlyDemand : 0;

  const financialLimitQty = result.financialLimitMonths > 0
    ? Math.floor(monthlyDemand * result.financialLimitMonths - currentStock)
    : Infinity;
  const validityLimitQty =
    result.validityLimitMonths !== undefined
      ? Math.floor(monthlyDemand * result.validityLimitMonths - currentStock)
      : undefined;
  const cashFlowLimitQty =
    result.cashFlowLimitMonths !== undefined
      ? Math.floor(monthlyDemand * result.cashFlowLimitMonths - currentStock)
      : undefined;

  const financialOk = purchaseQuantity <= financialLimitQty;
  const validityOk =
    validityLimitQty === undefined || purchaseQuantity <= validityLimitQty;
  const cashFlowOk =
    cashFlowLimitQty === undefined || purchaseQuantity <= cashFlowLimitQty;

  const exceededCriteria: string[] = [];
  if (!financialOk) exceededCriteria.push("financial");
  if (!validityOk) exceededCriteria.push("validity");
  if (!cashFlowOk && result.cashFlowLimitMonths !== undefined) exceededCriteria.push("cash_flow");
  const exceededCount = exceededCriteria.length;

  const displayCfg = exceededCount >= 2 ? riskConfig.not_recommended : baseCfg;

  function criterionLabel(factor: LimitingFactor): string {
    switch (factor) {
      case "financial": return "rentabilidade";
      case "validity": return "validade";
      case "cash_flow": return "prazo de pagamento";
    }
  }

  let diagnosisTitle: string;
  let subtext: string;

  if (exceededCount === 0) {
    diagnosisTitle = "Oferta dentro dos parâmetros analisados";
    subtext = "Todos os critérios estão dentro dos limites.";
  } else if (exceededCount === 1) {
    diagnosisTitle = "Oferta exige atenção";
    const factor = exceededCriteria[0] as LimitingFactor;
    const label = criterionLabel(factor);
    const limitQty = factor === "financial" ? financialLimitQty : factor === "validity" ? validityLimitQty! : cashFlowLimitQty!;
    subtext = `Você informou ${fmtInt(purchaseQuantity)} unidades, mas o menor limite calculado foi de ${fmtInt(limitQty)} unidades, definido pelo ${label}.`;
  } else {
    diagnosisTitle = "Quantidade fora dos parâmetros analisados";
    const limitQtyMap: Record<string, number> = {
      financial: financialLimitQty,
      validity: validityLimitQty!,
      cash_flow: cashFlowLimitQty!,
    };
    const numericLimits = exceededCriteria.map((f) => limitQtyMap[f]);
    const minLimit = Math.min(...numericLimits);
    const minFactor = exceededCriteria.find((f) => limitQtyMap[f] === minLimit) as LimitingFactor;
    const minLabel = criterionLabel(minFactor);
    const otherExceeded = exceededCriteria.filter((f) => f !== minFactor);
    let text = `Você informou ${fmtInt(purchaseQuantity)} unidades, mas o menor limite calculado foi de ${fmtInt(minLimit)} unidades, definido pelo ${minLabel}.`;
    if (otherExceeded.length > 0) {
      const otherLabels = otherExceeded.map((f) => criterionLabel(f as LimitingFactor));
      const joined = otherLabels.length === 1
        ? otherLabels[0]
        : `${otherLabels.slice(0, -1).join(" e ")} e ${otherLabels[otherLabels.length - 1]}`;
      text += ` A ${joined} também ficou${otherLabels.length > 1 ? "ram" : ""} acima do limite seguro.`;
    }
    subtext = text;
  }

  const coverageTurnover = Math.max(0, Math.floor(monthlyDemand * result.financialLimitMonths - currentStock));
  const validityTurnover =
    result.validityLimitMonths !== undefined
      ? Math.max(0, Math.floor(monthlyDemand * result.validityLimitMonths - currentStock))
      : undefined;
  const cashFlowTurnover =
    result.cashFlowLimitMonths !== undefined
      ? Math.max(0, Math.floor(monthlyDemand * result.cashFlowLimitMonths - currentStock))
      : undefined;

  type LimitCriterion = {
    key: string;
    title: string;
    quantity: number | undefined;
    description: string;
    factor: LimitingFactor;
  };

  const criteria: LimitCriterion[] = [
    {
      key: "financial",
      title: "Quantidade até o retorno ficar abaixo do banco",
      quantity: coverageTurnover,
      description: "Limite em que o retorno mensal ainda permanece acima de 0,9%.",
      factor: "financial",
    },
    {
      key: "validity",
      title: "Quantidade até uma validade segura",
      quantity: validityTurnover,
      description:
        validityTurnover !== undefined
          ? "Limite calculado com margem de segurança antes do vencimento."
          : "Preencha a validade para incluir este critério.",
      factor: "validity",
    },
    {
      key: "cash_flow",
      title: "Quantidade até o vencimento do boleto",
      quantity: cashFlowTurnover,
      description:
        cashFlowTurnover !== undefined
          ? "Limite calculado para que pelo menos 50% da quantidade seja vendida até o vencimento."
          : "Preencha o prazo para incluir este critério.",
      factor: "cash_flow",
    },
  ];

  const validCriteriaQuantities = criteria
    .filter((c) => c.quantity !== undefined)
    .map((c) => c.quantity as number);
  const mostRestrictiveQuantity =
    validCriteriaQuantities.length > 0 ? Math.min(...validCriteriaQuantities) : undefined;

  const alertCandidates: { text: string; priority: number }[] = [];

  if (
    input?.expirationMonths !== undefined &&
    result.estimatedTurnoverMonths >= input.expirationMonths * 0.8
  ) {
    alertCandidates.push({
      text: `O tempo de giro de ${fmtMonths(result.estimatedTurnoverMonths)} está próximo da validade do produto (${input.expirationMonths} meses).`,
      priority: 1,
    });
  }

  if (result.monthlyReturnPercentage < result.bankReferencePercentage) {
    alertCandidates.push({
      text: "O retorno mensal estimado está abaixo da referência bancária de 0,9% ao mês.",
      priority: 2,
    });
  }

  alertCandidates.sort((a, b) => a.priority - b.priority);
  const alerts = alertCandidates.slice(0, 2);

  let alertTitle = "Pontos de atenção";
  if (alerts.some((a) => a.priority === 1)) {
    alertTitle = "Atenção à validade";
  } else if (alerts.some((a) => a.priority === 2)) {
    alertTitle = "Atenção à rentabilidade";
  }

  const showReadingFinal = exceededCount > 0;
  let readingFinalText = "";
  if (showReadingFinal) {
    const minLimitMap: Record<string, number> = {
      financial: coverageTurnover,
      validity: validityTurnover!,
      cash_flow: cashFlowTurnover!,
    };
    const allLimits = criteria
      .filter((c) => c.quantity !== undefined)
      .map((c) => ({ factor: c.factor, qty: c.quantity as number }));
    const minOverall = allLimits.length > 0 ? allLimits.reduce((a, b) => a.qty < b.qty ? a : b) : null;
    const overallMinLabel = minOverall ? criterionLabel(minOverall.factor) : "";

    if (exceededCount === 1) {
      const factor = exceededCriteria[0] as LimitingFactor;
      const limitQty = minLimitMap[factor];
      readingFinalText = `A quantidade informada ultrapassa o limite seguro de ${criterionLabel(factor)}. O menor limite calculado foi de ${fmtInt(limitQty)} unidades.`;
    } else {
      readingFinalText = `Para ficar dentro de todos os critérios analisados, a quantidade adicional deve ser de até ${fmtInt(result.maxHealthyPurchaseQuantity)} unidades. ${capitalize(overallMinLabel)} definiu o menor limite desta análise.`;
    }
  }

  return (
    <div aria-live="polite" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div
        className={`result-status${exceededCount >= 2 ? " result-status--out-of-params" : ""}`}
        style={{
          background: displayCfg.bg,
          borderColor: displayCfg.border,
          color: displayCfg.color,
        }}
      >
        <div
          className="result-status-icon"
          style={{ background: displayCfg.iconBg, color: displayCfg.iconColor }}
        >
          <displayCfg.Icon size={24} aria-hidden="true" />
        </div>
        <div className="result-status-text">
          <h3 style={{ color: displayCfg.color }}>{diagnosisTitle}</h3>
          <p style={{ color: displayCfg.color, opacity: 0.85 }}>{subtext}</p>
        </div>
      </div>

      <div className="metrics-grid metrics-grid--three">
        <ResultCard
          icon={Clock3}
          iconBg="var(--purple-bg)"
          iconColor="var(--purple)"
          title="Cobertura total após a compra"
          value={fmtMonths(coverageTurnoverMonths)}
          description="Considerando o estoque atual e a nova quantidade."
        />
        <ResultCard
          icon={ChartNoAxesCombined}
          iconBg="var(--info-bg)"
          iconColor="var(--info)"
          title="Retorno mensal estimado"
          value={`${fmtPercent(result.monthlyReturnPercentage * 100)} ao mês`}
        />
        <ResultCard
          icon={WalletCards}
          iconBg="var(--success-bg)"
          iconColor="var(--success)"
          title="Economia total estimada"
          value={fmtCurrency(result.totalSavings)}
        />
      </div>

      <div className="limits-block">
        <h4 className="limits-block-title">Limites da quantidade analisada</h4>
        <div className="limits-grid">
          {criteria.map((c) => {
            const { status, excess } = criterionStatus(purchaseQuantity, c.quantity);
            const isMostRestrictive =
              c.quantity !== undefined &&
              mostRestrictiveQuantity !== undefined &&
              c.quantity === mostRestrictiveQuantity &&
              validCriteriaQuantities.length > 1;
            const sIcon = statusIcon(status);

            return (
              <div
                key={c.key}
                className={`criterion-card${isMostRestrictive ? " criterion-card--restrictive" : ""}`}
              >
                <span className="criterion-title">{c.title}</span>
                <span className="criterion-value">
                  {c.quantity !== undefined ? `${fmtInt(c.quantity)} unidades` : "Não informado"}
                </span>
                <span className="criterion-status" style={{ color: sIcon.color }}>
                  <sIcon.Icon size={14} aria-hidden="true" />
                  {statusText(status, excess)}
                </span>
                <span className="criterion-description">{c.description}</span>
                {isMostRestrictive && (
                  <span className="criterion-restrictive-note">
                    Menor limite identificado
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {alerts.length > 0 && (
        <div className="alerts-block">
          <div className="alerts-block-header">
            <TriangleAlert
              size={18}
              className="alerts-block-icon"
              aria-hidden="true"
            />
            <span className="alerts-block-title">{alertTitle}</span>
          </div>
          <ul className="alerts-block-list">
            {alerts.map((alert, i) => (
              <li key={i} className="alerts-block-item">
                <CircleAlert
                  size={14}
                  className="alerts-block-item-icon"
                  aria-hidden="true"
                  style={{ color: "var(--warning)" }}
                />
                <span>{alert.text}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {showReadingFinal && (
        <div className="reading-final-block">
          <h4 className="reading-final-title">Leitura final</h4>
          <p className="reading-final-text">{readingFinalText}</p>
        </div>
      )}

      <div className="disclaimer-block">
        <Info
          size={16}
          className="disclaimer-block-icon"
          aria-hidden="true"
        />
        <p className="disclaimer-block-text">
          Os cálculos são estimativas com base nas informações fornecidas e não
          substituem a análise completa do seu cenário financeiro.
        </p>
      </div>
    </div>
  );
}

function fmtCurrency(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function fmtPercent(value: number): string {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }) + "%";
}

function fmtMonths(value: number): string {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }) + " meses";
}

function fmtInt(value: number): string {
  return Math.round(value).toLocaleString("pt-BR");
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
