import type { PurchaseSimulationInput, PurchaseSimulationResult } from "@/src/types/simulation";

const BANK_REFERENCE_MONTHLY_RETURN = 0.009;

export function analyzeInvestment(input: PurchaseSimulationInput): PurchaseSimulationResult {
  const economyPerUnit = input.averagePurchasePrice - input.offerPrice;
  const totalStock = input.currentStock + input.offerQuantity;
  const estimatedTurnoverMonths = totalStock / input.monthlyDemand;
  const investmentValue = input.offerQuantity * input.offerPrice;
  const totalSavings = input.offerQuantity * economyPerUnit;
  const totalSavingsPercentage = investmentValue > 0 ? totalSavings / investmentValue : 0;
  const monthlyReturnPercentage = estimatedTurnoverMonths > 0 ? totalSavingsPercentage / estimatedTurnoverMonths : 0;

  const healthyLimitMonths = 3;
  const expiryRisk = input.expirationMonths !== undefined && estimatedTurnoverMonths > input.expirationMonths;

  let riskLevel: "healthy" | "attention" | "not_recommended";
  let diagnosis: string;
  let interpretation: string;
  let recommendation: string;

  const monthlyReturnPercent = monthlyReturnPercentage * 100;

  if (expiryRisk) {
    riskLevel = "not_recommended";
    diagnosis = "Compra não recomendada";
    interpretation = "O produto corre o risco de vencer antes de ser vendido. O dinheiro ficaria parado em estoque por tempo demais e renderia menos do que uma aplicação segura no banco.";
    recommendation = "Evitar a compra nessa condição.";
  } else if (monthlyReturnPercentage > BANK_REFERENCE_MONTHLY_RETURN) {
    riskLevel = "healthy";
    diagnosis = "Compra saudável";
    interpretation = `Essa oferta parece saudável. Com a demanda atual, a economia estimada de ${monthlyReturnPercent.toFixed(2)}% ao mês supera uma aplicação segura no banco, que rende próximo de 0,9% ao mês.`;
    recommendation = "Comprar nessa quantidade.";
  } else if (monthlyReturnPercentage > BANK_REFERENCE_MONTHLY_RETURN * 0.5) {
    riskLevel = "attention";
    diagnosis = "Compra com atenção";
    if (estimatedTurnoverMonths > healthyLimitMonths) {
      interpretation = `Acima de ${healthyLimitMonths} meses de estoque, a economia estimada de ${monthlyReturnPercent.toFixed(2)}% ao mês começa a se aproximar do rendimento de uma aplicação segura no banco.`;
      recommendation = "Comprar menos unidades.";
    } else {
      interpretation = `Essa oferta exige cuidado. Com uma economia estimada de ${monthlyReturnPercent.toFixed(2)}% ao mês, o retorno está próximo do rendimento de uma aplicação segura no banco.`;
      recommendation = "Negociar um preço menor.";
    }
  } else {
    riskLevel = "not_recommended";
    diagnosis = "Compra não recomendada";
    interpretation = `Com uma economia estimada de ${monthlyReturnPercent.toFixed(2)}% ao mês, essa compra renderia menos do que uma aplicação segura no banco de 0,9% ao mês. Nesse cenário, faz mais sentido deixar o dinheiro aplicado.`;
    recommendation = "Evitar a compra nessa condição.";
  }

  return {
    riskLevel,
    diagnosis,
    estimatedTurnoverMonths,
    monthlyReturnPercentage,
    totalSavings,
    totalSavingsPercentage,
    healthyLimitMonths,
    bankReferencePercentage: BANK_REFERENCE_MONTHLY_RETURN,
    interpretation,
    recommendation,
  };
}
