export type RiskLevel = "healthy" | "attention" | "not_recommended";

export type PurchaseSimulationInput = {
  averagePurchasePrice: number;
  offerPrice: number;
  offerQuantity: number;
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
};
