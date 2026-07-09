import { z } from "zod";

export const offerFormSchema = z.object({
  averagePurchasePrice: z.number({ message: "Informe um valor válido." }).positive("Informe um valor maior que zero."),
  offerPrice: z.number({ message: "Informe um valor válido." }).positive("Informe um valor maior que zero."),
  offerQuantity: z.number({ message: "Informe um valor válido." }).int("A quantidade precisa ser um número inteiro.").positive("A quantidade precisa ser maior que zero."),
  paymentTermDays: z.number({ message: "Informe um valor válido." }).int("O prazo precisa ser um número inteiro.").min(0, "O prazo não pode ser negativo.").optional(),
  monthlyDemand: z.number({ message: "Informe um valor válido." }).int("A demanda precisa ser um número inteiro.").positive("A demanda mensal precisa ser maior que zero."),
  currentStock: z.number({ message: "Informe um valor válido." }).int("O estoque precisa ser um número inteiro.").min(0, "O estoque não pode ser negativo."),
  expirationMonths: z.number({ message: "Informe um valor válido." }).positive("Informe um valor maior que zero.").optional(),
}).refine(
  (data) => data.offerPrice < data.averagePurchasePrice,
  {
    message: "O preço da oferta precisa ser menor que o preço médio de compra.",
    path: ["offerPrice"],
  },
);

export type OfferFormValues = z.infer<typeof offerFormSchema>;
