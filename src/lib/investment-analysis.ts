import type {
  PurchaseSimulationInput,
  PurchaseSimulationResult,
  LimitingFactor,
} from "@/src/types/simulation";

const BANK_REFERENCE_MONTHLY_RETURN = 0.009;
const MIN_SOLD_PERCENTAGE_UNTIL_PAYMENT = 0.5;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function analyzeInvestment(
  input: PurchaseSimulationInput
): PurchaseSimulationResult {
  const normalPurchaseValue =
    input.averagePurchasePrice * input.purchaseQuantity;
  const offerPurchaseValue =
    input.offerPromotionalPrice * input.purchaseQuantity;
  const totalSavings = normalPurchaseValue - offerPurchaseValue;
  const savingsPercentage =
    normalPurchaseValue > 0 ? totalSavings / normalPurchaseValue : 0;
  const totalStock = input.currentStock + input.purchaseQuantity;
  const estimatedTurnoverMonths = totalStock / input.monthlyDemand;
  const monthlyReturnPercentage =
    estimatedTurnoverMonths > 0
      ? savingsPercentage / estimatedTurnoverMonths
      : 0;

  const financialLimitMonths = savingsPercentage / BANK_REFERENCE_MONTHLY_RETURN;

  let validityLimitMonths: number | undefined;
  let validitySafetyMarginMonths: number | undefined;

  if (input.expirationMonths !== undefined) {
    validitySafetyMarginMonths = clamp(input.expirationMonths * 0.2, 2, 4);
    validityLimitMonths = Math.max(
      0,
      input.expirationMonths - validitySafetyMarginMonths
    );
  }

  let cashFlowLimitMonths: number | undefined;

  if (input.paymentTermDays !== undefined) {
    const paymentTermMonths = input.paymentTermDays / 30;
    cashFlowLimitMonths = paymentTermMonths / MIN_SOLD_PERCENTAGE_UNTIL_PAYMENT;
  }

  const applicableLimits: number[] = [financialLimitMonths];
  if (validityLimitMonths !== undefined) {
    applicableLimits.push(validityLimitMonths);
  }
  if (cashFlowLimitMonths !== undefined) {
    applicableLimits.push(cashFlowLimitMonths);
  }

  const finalHealthyLimitMonths = Math.min(...applicableLimits);

  let limitingFactor: LimitingFactor = "financial";
  if (finalHealthyLimitMonths === validityLimitMonths) {
    limitingFactor = "validity";
  }
  if (finalHealthyLimitMonths === cashFlowLimitMonths) {
    limitingFactor = "cash_flow";
  }

  const maxHealthyPurchaseQuantity = Math.max(
    0,
    Math.floor(input.monthlyDemand * finalHealthyLimitMonths - input.currentStock)
  );

  const expirationValue = input.expirationMonths;
  const hasExpiration = expirationValue !== undefined;
  const expiryRisk = hasExpiration && estimatedTurnoverMonths > expirationValue;
  const expiryAttention =
    hasExpiration && estimatedTurnoverMonths > expirationValue * 0.8;

  const savingsPercent = savingsPercentage * 100;
  const monthlyReturnPercent = monthlyReturnPercentage * 100;

  let riskLevel: "healthy" | "attention" | "not_recommended";
  let diagnosis: string;
  let interpretation: string;
  let recommendation: string;

  if (expiryRisk) {
    riskLevel = "not_recommended";
    diagnosis = "Compra fora dos parâmetros analisados";
    interpretation =
      "O produto corre o risco de vencer antes de ser vendido. O dinheiro ficaria parado em estoque por tempo demais e renderia menos do que uma aplicação segura no banco.";
    recommendation = "Evitar a compra nessa condição.";
  } else if (monthlyReturnPercentage > BANK_REFERENCE_MONTHLY_RETURN) {
    riskLevel = "healthy";
    diagnosis = "Compra dentro dos parâmetros analisados";

    const limitingFactorText =
      limitingFactor === "cash_flow"
        ? "o fluxo de caixa é o fator limitante desta análise"
        : limitingFactor === "validity"
          ? "a validade é o fator limitante desta análise"
          : "a rentabilidade é o fator limitante desta análise";

    if (limitingFactor !== "financial") {
      interpretation = `Essa oferta representa uma economia estimada de R$ ${totalSavings.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}, equivalente a ${savingsPercent.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}% em relação ao preço médio atual, mas ${limitingFactorText}.`;
    } else {
      interpretation = `Essa oferta representa uma economia estimada de R$ ${totalSavings.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}, equivalente a ${savingsPercent.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}% em relação ao preço médio atual. Com uma demanda de ${input.monthlyDemand.toLocaleString("pt-BR")} unidades por mês, a quantidade analisada gera aproximadamente ${estimatedTurnoverMonths.toLocaleString("pt-BR", { minimumFractionDigits: 1 })} meses de cobertura.`;
    }
    recommendation = "A compra está compatível com os parâmetros analisados";
  } else if (
    expiryAttention ||
    monthlyReturnPercentage > BANK_REFERENCE_MONTHLY_RETURN * 0.89
  ) {
    riskLevel = "attention";
    diagnosis = "Compra exige atenção";
    if (expiryAttention) {
      interpretation = `Essa oferta exige cuidado. O tempo estimado de giro de ${estimatedTurnoverMonths.toLocaleString("pt-BR", { minimumFractionDigits: 1 })} meses está próximo da validade do produto. O retorno estimado de ${monthlyReturnPercent.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}% ao mês está abaixo da referência de 0,9% ao mês.`;
    } else {
      interpretation = `Essa oferta representa uma economia estimada de R$ ${totalSavings.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}, equivalente a ${savingsPercent.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}% em relação ao preço médio atual, mas o retorno estimado de ${monthlyReturnPercent.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}% ao mês está próximo da aplicação segura de referência de 0,9% ao mês.`;
    }
    if (estimatedTurnoverMonths > 3) {
      recommendation = "Comprar menos unidades.";
    } else {
      recommendation = "Negociar um preço menor.";
    }
  } else {
    riskLevel = "not_recommended";
    diagnosis = "Compra fora dos parâmetros analisados";
    interpretation = `Nessa quantidade, o retorno estimado fica em ${monthlyReturnPercent.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}% ao mês, abaixo da aplicação segura de referência de 0,9% ao mês. Pode fazer mais sentido reduzir a quantidade ou manter o dinheiro aplicado.`;
    recommendation = "Evitar a compra nessa condição.";
  }

  let cashFlowAlertLevel:
    | "none"
    | "comfortable"
    | "attention"
    | "high_attention" = "none";
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
    soldPercentageUntilPayment = Math.min(
      1,
      unitsSoldUntilPayment / totalStock
    );

    if (paymentTermMonths >= estimatedTurnoverMonths) {
      cashFlowAlertLevel = "comfortable";
      cashFlowMessage =
        "O prazo de pagamento cobre o tempo estimado de giro. Com a demanda atual, o estoque tende a ser vendido antes do vencimento do boleto.";
    } else if (paymentTermMonths < estimatedTurnoverMonths * 0.4) {
      cashFlowAlertLevel = "high_attention";
      cashFlowMessage =
        "O prazo de pagamento é muito menor que o tempo estimado de giro. Mesmo com boa economia, essa compra pode apertar o caixa se a farmácia não tiver capital disponível.";
    } else {
      cashFlowAlertLevel = "attention";
      cashFlowMessage = `O boleto vence em ${input.paymentTermDays} dias, mas o estoque deve levar cerca de ${estimatedTurnoverMonths.toLocaleString("pt-BR", { minimumFractionDigits: 1 })} meses para girar. Até o vencimento, a previsão é vender cerca de ${Math.round(unitsSoldUntilPayment).toLocaleString("pt-BR")} unidades. Ainda restarão aproximadamente ${Math.round(remainingStockAtPayment).toLocaleString("pt-BR")} unidades em estoque. Garanta que a farmácia tenha caixa para pagar o fornecedor sem depender exclusivamente dessa venda.`;
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
    financialLimitMonths,
    validityLimitMonths,
    cashFlowLimitMonths,
    finalHealthyLimitMonths,
    limitingFactor,
    validitySafetyMarginMonths,
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
