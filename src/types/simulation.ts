export type RiskLevel = "healthy" | "attention" | "not_recommended";

export type CashFlowAlertLevel =
  | "none"
  | "comfortable"
  | "attention"
  | "high_attention";

export type PurchaseSimulationInput = {
  averagePurchasePrice: number;
  offerPromotionalPrice: number;
  purchaseQuantity: number;
  paymentTermDays?: number;
  monthlyDemand: number;
  currentStock: number;
  expirationMonths?: number;
};

export type PurchaseSimulationResult = {
  riskLevel: RiskLevel;
  diagnosis: string;
  normalPurchaseValue: number;
  offerPurchaseValue: number;
  totalSavings: number;
  savingsPercentage: number;
  estimatedTurnoverMonths: number;
  monthlyReturnPercentage: number;
  healthyLimitMonths: number;
  maxHealthyPurchaseQuantity: number;
  bankReferencePercentage: number;
  interpretation: string;
  recommendation: string;
  paymentTermMonths?: number;
  cashGapMonths?: number;
  unitsSoldUntilPayment?: number;
  remainingStockAtPayment?: number;
  soldPercentageUntilPayment?: number;
  cashFlowAlertLevel?: CashFlowAlertLevel;
  cashFlowMessage?: string;
};
