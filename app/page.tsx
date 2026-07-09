"use client";

import { useState } from "react";
import { OfferForm } from "@/src/components/offer-form";
import { AnalysisResult } from "@/src/components/analysis-result";
import { analyzeInvestment } from "@/src/lib/investment-analysis";
import type { PurchaseSimulationInput, PurchaseSimulationResult } from "@/src/types/simulation";

export default function Home() {
  const [result, setResult] = useState<PurchaseSimulationResult | null>(null);

  const handleAnalyze = (data: PurchaseSimulationInput) => {
    const analysisResult = analyzeInvestment(data);
    setResult(analysisResult);
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-zinc-900">
            Calculadora de Investimentos
          </h1>
          <p className="mt-1 text-zinc-500">
            Descubra se essa compra vale mais do que deixar o dinheiro no banco.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <div className="rounded-lg border border-zinc-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-zinc-900">
                Dados da oferta
              </h2>
              <p className="mt-1 mb-4 text-sm text-zinc-500">
                Informe os principais dados da compra para analisar se essa oferta vale a pena.
              </p>
              <OfferForm onSubmit={handleAnalyze} />
            </div>
          </div>

          <div>
            <AnalysisResult result={result} />
          </div>
        </div>
      </div>
    </div>
  );
}
