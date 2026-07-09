import type { PurchaseSimulationResult } from "@/src/types/simulation";
import { ResultCard } from "./result-card";

interface AnalysisResultProps {
  result: PurchaseSimulationResult | null;
}

const riskColors = {
  healthy: "bg-green-50 border-green-200 text-green-800",
  attention: "bg-yellow-50 border-yellow-200 text-yellow-800",
  not_recommended: "bg-red-50 border-red-200 text-red-800",
};

const cashFlowColors: Record<string, string> = {
  comfortable: "bg-green-50 border-green-200 text-green-800",
  attention: "bg-yellow-50 border-yellow-200 text-yellow-800",
  high_attention: "bg-orange-50 border-orange-200 text-orange-800",
};

const cashFlowTitles: Record<string, string> = {
  comfortable: "Boa condição de prazo",
  attention: "Compra saudável, mas exige atenção no caixa",
  high_attention: "Atenção forte ao caixa",
};

export function AnalysisResult({ result }: AnalysisResultProps) {
  if (!result) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-dashed border-zinc-300 bg-white p-8 text-center">
        <p className="text-zinc-500">
          Preencha os dados da oferta para descobrir se essa compra vale a pena.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className={`rounded-lg border p-4 ${riskColors[result.riskLevel]}`}>
        <p className="text-lg font-semibold">{result.diagnosis}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <ResultCard
          title="Tempo estimado de giro"
          value={`${result.estimatedTurnoverMonths.toFixed(1)} meses`}
        />
        <ResultCard
          title="Retorno mensal estimado"
          value={`${(result.monthlyReturnPercentage * 100).toFixed(2)}% ao mês`}
        />
        <ResultCard
          title="Economia total estimada"
          value={`R$ ${result.totalSavings.toFixed(2)}`}
        />
        <ResultCard
          title="Limite saudável de compra"
          value={`${result.healthyLimitMonths.toFixed(1)} meses`}
          description={`Até aproximadamente ${result.maxHealthyPurchaseQuantity.toLocaleString("pt-BR")} unidades, considerando a demanda atual.`}
        />
      </div>

      <p className="text-sm text-zinc-600">{result.interpretation}</p>

      <p className="text-sm font-medium text-zinc-900">
        {result.recommendation}
      </p>

      {result.cashFlowAlertLevel && result.cashFlowAlertLevel !== "none" && (
        <div className={`rounded-lg border p-4 ${cashFlowColors[result.cashFlowAlertLevel] ?? ""}`}>
          <p className="text-sm font-semibold">
            {cashFlowTitles[result.cashFlowAlertLevel] ?? "Fluxo de caixa"}
          </p>
          <p className="mt-1 text-sm">{result.cashFlowMessage}</p>
        </div>
      )}

      <p className="text-xs text-zinc-400">
        Referência usada: aplicação segura rendendo próximo de 0,9% ao mês.
      </p>
    </div>
  );
}
