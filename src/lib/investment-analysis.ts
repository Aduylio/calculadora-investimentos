import type { PurchaseSimulationInput, PurchaseSimulationResult } from "@/src/types/simulation";

const BANK_REFERENCE_MONTHLY_RETURN = 0.009;

export function analyzeInvestment(input: PurchaseSimulationInput): PurchaseSimulationResult {
  const normalPurchaseValue = input.averagePurchasePrice * input.offerQuantity;
  const offerPurchaseValue = input.offerPrice * input.offerQuantity;
  const totalSavings = normalPurchaseValue - offerPurchaseValue;
  const savingsPercentage = normalPurchaseValue > 0 ? totalSavings / normalPurchaseValue : 0;
  const totalStock = input.currentStock + input.offerQuantity;
  const estimatedTurnoverMonths = totalStock / input.monthlyDemand;
  const monthlyReturnPercentage = estimatedTurnoverMonths > 0 ? savingsPercentage / estimatedTurnoverMonths : 0;
  const healthyLimitMonths = savingsPercentage / BANK_REFERENCE_MONTHLY_RETURN;
  const maxHealthyPurchaseQuantity = Math.max(0, Math.floor(input.monthlyDemand * healthyLimitMonths - input.currentStock));

  const expirationValue = input.expirationMonths;
  const hasExpiration = expirationValue !== undefined;
  const expiryRisk = hasExpiration && estimatedTurnoverMonths > expirationValue;
  const expiryAttention = hasExpiration && estimatedTurnoverMonths > expirationValue * 0.8;

  const savingsPercent = savingsPercentage * 100;
  const monthlyReturnPercent = monthlyReturnPercentage * 100;

  let riskLevel: "healthy" | "attention" | "not_recommended";
  let diagnosis: string;
  let interpretation: string;
  let recommendation: string;

  if (expiryRisk) {
    riskLevel = "not_recommended";
    diagnosis = "Compra não recomendada";
    interpretation = "O produto corre o risco de vencer antes de ser vendido. O dinheiro ficaria parado em estoque por tempo demais e renderia menos do que uma aplicação segura no banco.";
    recommendation = "Evitar a compra nessa condição.";
  } else if (monthlyReturnPercentage > BANK_REFERENCE_MONTHLY_RETURN) {
    riskLevel = "healthy";
    diagnosis = "Compra saudável";
    interpretation = `Essa oferta gera uma economia de ${savingsPercent.toFixed(2)}% em relação ao preço médio de compra. Como o estoque gira em cerca de ${estimatedTurnoverMonths.toFixed(1)} meses, o retorno estimado é de aproximadamente ${monthlyReturnPercent.toFixed(2)}% ao mês, acima da aplicação segura de referência de 0,9% ao mês.`;
    recommendation = "A compra está compatível com os parâmetros analisados";
  } else if (expiryAttention || monthlyReturnPercentage > BANK_REFERENCE_MONTHLY_RETURN * 0.89) {
    riskLevel = "attention";
    diagnosis = "Compra com atenção";
    if (expiryAttention) {
      interpretation = `Essa oferta exige cuidado. O tempo estimado de giro de ${estimatedTurnoverMonths.toFixed(1)} meses está próximo da validade do produto. O retorno estimado de ${monthlyReturnPercent.toFixed(2)}% ao mês está abaixo da referência de 0,9% ao mês.`;
    } else {
      interpretation = `Essa oferta gera uma economia de ${savingsPercent.toFixed(2)}% em relação ao preço médio de compra, mas o retorno estimado de ${monthlyReturnPercent.toFixed(2)}% ao mês está próximo da aplicação segura de referência de 0,9% ao mês. Avalie com cuidado.`;
    }
    if (estimatedTurnoverMonths > 3) {
      recommendation = "Comprar menos unidades.";
    } else {
      recommendation = "Negociar um preço menor.";
    }
  } else {
    riskLevel = "not_recommended";
    diagnosis = "Compra não recomendada";
    interpretation = `Nessa quantidade, o retorno estimado fica em ${monthlyReturnPercent.toFixed(2)}% ao mês, abaixo da aplicação segura de referência de 0,9% ao mês. Pode fazer mais sentido reduzir a quantidade ou manter o dinheiro aplicado.`;
    recommendation = "Evitar a compra nessa condição.";
  }

  let cashFlowAlertLevel: "none" | "comfortable" | "attention" | "high_attention" = "none";
  let cashFlowMessage: string | undefined;
  let paymentTermMonths: number | undefined;
  let cashGapMonths: number | undefined;
  let unitsSoldUntilPayment: number | undefined;
  let remainingStockAtPayment: number | undefined;
  let soldPercentageUntilPayment: number | undefined;

  if (input.paymentTermDays !== undefined) {
    paymentTermMonths = input.paymentTermDays / 30;
    cashGapMonths = estimatedTurnoverMonths - paymentTermMonths;
    unitsSoldUntilPayment = input.monthlyDemand * paymentTermMonths;
    remainingStockAtPayment = Math.max(0, totalStock - unitsSoldUntilPayment);
    soldPercentageUntilPayment = Math.min(1, unitsSoldUntilPayment / totalStock);

    if (paymentTermMonths >= estimatedTurnoverMonths) {
      cashFlowAlertLevel = "comfortable";
      cashFlowMessage = "O prazo de pagamento cobre o tempo estimado de giro. Com a demanda atual, o estoque tende a ser vendido antes do vencimento do boleto.";
    } else if (paymentTermMonths < estimatedTurnoverMonths * 0.4) {
      cashFlowAlertLevel = "high_attention";
      cashFlowMessage = `O prazo de pagamento é muito menor que o tempo estimado de giro. Mesmo com boa economia, essa compra pode apertar o caixa se a farmácia não tiver capital disponível.`;
    } else {
      cashFlowAlertLevel = "attention";
      cashFlowMessage = `O boleto vence em ${input.paymentTermDays} dias, mas o estoque deve levar cerca de ${estimatedTurnoverMonths.toFixed(1)} meses para girar. Até o vencimento, a previsão é vender cerca de ${Math.round(unitsSoldUntilPayment).toLocaleString("pt-BR")} unidades. Ainda restarão aproximadamente ${Math.round(remainingStockAtPayment).toLocaleString("pt-BR")} unidades em estoque. Garanta que a farmácia tenha caixa para pagar o fornecedor sem depender exclusivamente dessa venda.`;
    }
  }

  return {
    riskLevel,
    diagnosis,
    normalPurchaseValue,
    offerPurchaseValue,
    totalSavings,
    savingsPercentage,
    estimatedTurnoverMonths,
    monthlyReturnPercentage,
    healthyLimitMonths,
    maxHealthyPurchaseQuantity,
    bankReferencePercentage: BANK_REFERENCE_MONTHLY_RETURN,
    interpretation,
    recommendation,
    paymentTermMonths,
    cashGapMonths,
    unitsSoldUntilPayment,
    remainingStockAtPayment,
    soldPercentageUntilPayment,
    cashFlowAlertLevel,
    cashFlowMessage,
  };
}
