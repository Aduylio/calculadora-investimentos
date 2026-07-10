"use client";

import type { PurchaseSimulationResult, PurchaseSimulationInput, LimitingFactor } from "@/src/types/simulation";
import { ResultCard } from "./result-card";
import {
  Clock3,
  ChartNoAxesCombined,
  WalletCards,
  ShieldCheck,
  Check,
  TriangleAlert,
  X,
  ClipboardList,
  Info,
  CircleAlert,
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
    bg: "#fef2f2",
    border: "#fecaca",
    color: "#991b1b",
    iconBg: "#fef2f2",
    iconColor: "#dc2626",
    Icon: X,
  },
};

function limitingFactorLabel(factor: LimitingFactor): string {
  switch (factor) {
    case "financial":
      return "a rentabilidade é o fator limitante desta análise";
    case "validity":
      return "a validade é o fator limitante desta análise";
    case "cash_flow":
      return "o fluxo de caixa é o fator limitante desta análise";
  }
}

export function AnalysisResult({ result, input }: AnalysisResultProps) {
  if (!result) {
    return (
      <div className="empty-state">
        <div className="empty-state-content">
          <CircleAlert
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

  const cfg = riskConfig[result.riskLevel];

  const attentionItems: string[] = [];

  if (
    result.paymentTermMonths !== undefined &&
    result.cashGapMonths !== undefined &&
    result.cashGapMonths > 0
  ) {
    attentionItems.push(
      "O prazo de pagamento é menor que o tempo estimado de giro, o que exige planejamento de caixa."
    );
  }

  if (
    result.estimatedTurnoverMonths > result.finalHealthyLimitMonths &&
    result.finalHealthyLimitMonths > 0
  ) {
    attentionItems.push(
      "A quantidade analisada excede a cobertura máxima dentro dos critérios, reduzindo a eficiência do investimento."
    );
  }

  if (input?.expirationMonths !== undefined) {
    const expiryThreshold = input.expirationMonths * 0.8;
    if (result.estimatedTurnoverMonths >= expiryThreshold) {
      attentionItems.push(
        `O tempo de giro estimado de ${fmtMonths(result.estimatedTurnoverMonths)} está próximo ou superior à validade do produto (${input.expirationMonths} meses).`
      );
    }
  }

  if (result.monthlyReturnPercentage < result.bankReferencePercentage) {
    attentionItems.push(
      "O retorno mensal estimado está abaixo da referência bancária de 0,9% ao mês."
    );
  }

  if (
    (input?.currentStock ?? 0) > 0 &&
    result.estimatedTurnoverMonths > 3
  ) {
    attentionItems.push(
      "O estoque atual amplia significativamente a cobertura, tornando a compra menos eficiente."
    );
  }

  if (
    result.paymentTermMonths !== undefined &&
    result.unitsSoldUntilPayment !== undefined &&
    result.remainingStockAtPayment !== undefined &&
    result.remainingStockAtPayment > 0
  ) {
    attentionItems.push(
      `Até o vencimento do boleto, permanecerão aproximadamente ${fmtInt(result.remainingStockAtPayment)} unidades em estoque.`
    );
  }

  if (
    result.paymentTermMonths !== undefined &&
    result.cashGapMonths !== undefined &&
    result.cashGapMonths > 2
  ) {
    attentionItems.push(
      "A farmácia precisará de capital disponível para pagar o fornecedor antes de vender todo o estoque."
    );
  }

  if (result.limitingFactor === "cash_flow") {
    attentionItems.push(
      "O fluxo de caixa limitou a cobertura máxima desta análise."
    );
  }

  if (result.limitingFactor === "validity") {
    attentionItems.push(
      "A validade limitou a cobertura máxima desta análise."
    );
  }

  if (
    result.limitingFactor === "financial" &&
    (result.validityLimitMonths !== undefined ||
      result.cashFlowLimitMonths !== undefined)
  ) {
    attentionItems.push(
      "A rentabilidade frente à aplicação bancária limitou a cobertura máxima desta análise."
    );
  }

  const summaryParts: string[] = [];

  summaryParts.push(
    `A oferta representa uma economia estimada de ${fmtCurrency(result.totalSavings)}, equivalente a ${fmtPercent(result.savingsPercentage * 100)} em relação ao preço médio atual.`
  );

  summaryParts.push(
    `Com uma demanda de ${fmtInt(input?.monthlyDemand ?? 0)} unidades por mês, a quantidade analisada gera aproximadamente ${fmtMonths(result.estimatedTurnoverMonths)} de cobertura.`
  );

  if (
    input?.paymentTermDays !== undefined &&
    result.paymentTermMonths !== undefined
  ) {
    if (result.cashFlowAlertLevel === "comfortable") {
      summaryParts.push(
        `O prazo de pagamento de ${input.paymentTermDays} dias é suficiente para cobrir o tempo de giro.`
      );
    } else {
      summaryParts.push(
        `O prazo de pagamento de ${input.paymentTermDays} dias exige atenção ao fluxo de caixa durante o período.`
      );
    }
  }

  const coverageDescription = `Equivalente a aproximadamente ${fmtMonths(result.finalHealthyLimitMonths)} da demanda atual. ${limitingFactorLabel(result.limitingFactor)}.`;

  const limitDetails: { label: string; value: string }[] = [
    {
      label: "Rentabilidade",
      value: `até ${fmtMonths(result.financialLimitMonths)}`,
    },
  ];
  if (result.validityLimitMonths !== undefined) {
    limitDetails.push({
      label: "Validade",
      value: `até ${fmtMonths(result.validityLimitMonths)}`,
    });
  }
  if (result.cashFlowLimitMonths !== undefined) {
    limitDetails.push({
      label: "Fluxo de caixa",
      value: `até ${fmtMonths(result.cashFlowLimitMonths)}`,
    });
  }

  return (
    <div aria-live="polite" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div
        className="result-status"
        style={{
          background: cfg.bg,
          borderColor: cfg.border,
          color: cfg.color,
        }}
      >
        <div
          className="result-status-icon"
          style={{ background: cfg.iconBg, color: cfg.iconColor }}
        >
          <cfg.Icon size={24} aria-hidden="true" />
        </div>
        <div className="result-status-text">
          <h3 style={{ color: cfg.color }}>{result.diagnosis}</h3>
          <p style={{ color: cfg.color, opacity: 0.85 }}>
            {result.interpretation}
          </p>
        </div>
      </div>

      <div className="metrics-grid">
        <ResultCard
          icon={Clock3}
          iconBg="var(--purple-bg)"
          iconColor="var(--purple)"
          title="Tempo estimado de giro"
          value={fmtMonths(result.estimatedTurnoverMonths)}
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
        <ResultCard
          icon={ShieldCheck}
          iconBg="var(--brand-orange-soft)"
          iconColor="var(--brand-orange)"
          title="Cobertura máxima dentro dos critérios"
          value={`${fmtInt(result.maxHealthyPurchaseQuantity)} unidades`}
          description={coverageDescription}
          limitDetails={limitDetails}
          limitingFactor={result.limitingFactor}
        />
      </div>

      <div className="summary-block">
        <div className="summary-block-header">
          <ClipboardList
            size={18}
            className="summary-block-icon"
            aria-hidden="true"
          />
          <span className="summary-block-title">Resumo da análise</span>
        </div>
        <p className="summary-block-text">{summaryParts.join(" ")}</p>
      </div>

      {attentionItems.length > 0 && (
        <div className="attention-block">
          <div className="attention-block-header">
            <TriangleAlert
              size={18}
              className="attention-block-icon"
              aria-hidden="true"
            />
            <span className="attention-block-title">Pontos de atenção</span>
          </div>
          <ul className="attention-block-list">
            {attentionItems.map((item, i) => (
              <li key={i} className="attention-block-item">
                <CircleAlert
                  size={14}
                  className="attention-block-item-icon"
                  aria-hidden="true"
                  style={{ color: "var(--warning)" }}
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
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
