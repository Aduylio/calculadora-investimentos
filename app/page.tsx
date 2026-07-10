"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { OfferForm } from "@/src/components/offer-form";
import { AnalysisResult } from "@/src/components/analysis-result";
import { analyzeInvestment } from "@/src/lib/investment-analysis";
import type {
  PurchaseSimulationInput,
  PurchaseSimulationResult,
} from "@/src/types/simulation";
import { Package, TrendingUp } from "lucide-react";

export default function Home() {
  const [result, setResult] = useState<PurchaseSimulationResult | null>(null);
  const [inputData, setInputData] = useState<PurchaseSimulationInput | null>(
    null
  );
  const analysisPanelRef = useRef<HTMLElement>(null);
  const [formKey, setFormKey] = useState(0);

  const handleAnalyze = useCallback((data: PurchaseSimulationInput) => {
    const analysisResult = analyzeInvestment(data);
    setResult(analysisResult);
    setInputData(data);

    if (window.innerWidth <= 1050) {
      setTimeout(() => {
        analysisPanelRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  }, []);

  const handleReset = useCallback(() => {
    setResult(null);
    setFormKey((k) => k + 1);
  }, []);

  return (
    <>
      <header className="app-header">
        <div className="header-content">
          <div className="brand">
            <Image
              src="/farmstok-logo.png"
              alt="Farmstok"
              width={250}
              height={64}
              priority
            />
          </div>
          <div className="header-divider" aria-hidden="true" />
          <div className="header-title">
            <h1>Calculadora de Viabilidade de Compras</h1>
            <p>
              Analise se a oferta faz sentido para o caixa, giro e rentabilidade
              da farmácia.
            </p>
          </div>
        </div>
      </header>

      <main className="page-container">
        <div className="main-layout">
          <section className="panel">
            <div className="panel-header">
              <div className="panel-header-icon">
                <Package size={26} aria-hidden="true" />
              </div>
              <div className="panel-header-text">
                <h2>Dados do produto e da oferta</h2>
                <p>
                  Preencha as informações para calcular a viabilidade da
                  compra.
                </p>
              </div>
            </div>
            <OfferForm
              key={formKey}
              onSubmit={handleAnalyze}
              onReset={handleReset}
            />
          </section>

          <section className="panel" ref={analysisPanelRef}>
            <div className="panel-header">
              <div className="panel-header-icon">
                <TrendingUp size={26} aria-hidden="true" />
              </div>
              <div className="panel-header-text">
                <h2>Análise do investimento</h2>
                <p>
                  Resultados calculados com base nas informações fornecidas.
                </p>
              </div>
            </div>
            <AnalysisResult result={result} input={inputData} />
          </section>
        </div>
      </main>
    </>
  );
}
