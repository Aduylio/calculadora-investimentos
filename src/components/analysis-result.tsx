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
          value={`${result.healthyLimitMonths} meses`}
          description="Estoque seguro para girar sem risco"
        />
      </div>

      <p className="text-sm text-zinc-600">{result.interpretation}</p>

      <p className="text-sm font-medium text-zinc-900">
        {result.recommendation}
      </p>

      <p className="text-xs text-zinc-400">
        Referência usada: aplicação segura rendendo próximo de 0,9% ao mês.
      </p>
    </div>
  );
}
