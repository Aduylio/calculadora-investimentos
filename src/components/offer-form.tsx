"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { offerFormSchema, type OfferFormValues } from "@/src/schemas/offer-schema";
import type { PurchaseSimulationInput } from "@/src/types/simulation";
import { Info } from "lucide-react";

function parseCurrency(value: string): number {
  if (typeof value !== "string" || value === "") return NaN;
  return parseFloat(value.replace(/[Rr]\$\s*/g, "").replace(",", "."));
}

function parseOptionalNumber(value: string): number | undefined {
  if (typeof value !== "string" || value.trim() === "") return undefined;
  const n = Number(value);
  return isNaN(n) ? undefined : n;
}

interface OfferFormProps {
  onSubmit: (data: PurchaseSimulationInput) => void;
  onReset?: () => void;
}

function TooltipButton({ label, text }: { label: string; text: string }) {
  return (
    <button
      type="button"
      className="tooltip-btn"
      aria-label={label}
      tabIndex={0}
    >
      <Info size={10} aria-hidden="true" />
      <span className="tooltip-text" role="tooltip">
        {text}
      </span>
    </button>
  );
}

export function OfferForm({ onSubmit, onReset }: OfferFormProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<OfferFormValues>({
    resolver: zodResolver(offerFormSchema),
  });

  const productName = useWatch({ name: "productName", control });
  const paymentTermDays = useWatch({ name: "paymentTermDays", control });
  const expirationMonths = useWatch({ name: "expirationMonths", control });

  const showPaymentSuffix =
    typeof paymentTermDays === "number" && !isNaN(paymentTermDays);
  const showExpirationSuffix =
    typeof expirationMonths === "number" && !isNaN(expirationMonths);

  const hasData =
    !!productName ||
    !!paymentTermDays ||
    !!expirationMonths;

  const handleFormSubmit = (data: OfferFormValues) => {
    const input: PurchaseSimulationInput = {
      averagePurchasePrice: data.averagePurchasePrice,
      offerPromotionalPrice: data.offerPromotionalPrice,
      purchaseQuantity: data.purchaseQuantity,
      monthlyDemand: data.monthlyDemand,
      currentStock: data.currentStock,
    };
    if (data.paymentTermDays !== undefined) {
      input.paymentTermDays = data.paymentTermDays;
    }
    if (data.expirationMonths !== undefined) {
      input.expirationMonths = data.expirationMonths;
    }
    onSubmit(input);
  };

  const handleClear = () => {
    if (hasData) {
      const confirmed = window.confirm(
        "Deseja realmente limpar todos os dados preenchidos?"
      );
      if (!confirmed) return;
    }
    reset();
    onReset?.();
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <div className="form-grid">
        <div className="field-full field-wrapper">
          <div className="field-label-row">
            <label htmlFor="productName" className="field-label">
              Produto
            </label>
            <span className="field-optional">(opcional)</span>
            <TooltipButton
              label="Informação sobre o campo Produto"
              text="Identificação opcional do item analisado."
            />
          </div>
          <div className="input-wrapper">
            <input
              id="productName"
              type="text"
              placeholder="Ex: Dipirona 500mg"
              {...register("productName")}
            />
          </div>
        </div>

        <div className="field-wrapper">
          <div className="field-label-row">
            <label htmlFor="averagePurchasePrice" className="field-label">
              Preço médio de compra atual
            </label>
            <span className="field-required">*</span>
            <TooltipButton
              label="Informação sobre o preço médio de compra"
              text="Valor médio atualmente pago por unidade."
            />
          </div>
          <div
            className={`input-wrapper ${
              errors.averagePurchasePrice ? "has-error" : ""
            }`}
          >
            <span className="input-prefix">R$</span>
            <input
              id="averagePurchasePrice"
              type="text"
              inputMode="decimal"
              placeholder="Ex: 10,50"
              aria-invalid={!!errors.averagePurchasePrice}
              aria-describedby={
                errors.averagePurchasePrice
                  ? "error-averagePurchasePrice"
                  : undefined
              }
              {...register("averagePurchasePrice", {
                setValueAs: (v) => parseCurrency(String(v)),
              })}
            />
          </div>
          {errors.averagePurchasePrice && (
            <p className="input-error" id="error-averagePurchasePrice" role="alert">
              {errors.averagePurchasePrice.message}
            </p>
          )}
        </div>

        <div className="field-wrapper">
          <div className="field-label-row">
            <label htmlFor="offerPromotionalPrice" className="field-label">
              Preço promocional da oferta
            </label>
            <span className="field-required">*</span>
            <TooltipButton
              label="Informação sobre o preço promocional"
              text="Preço unitário informado na oferta."
            />
          </div>
          <div
            className={`input-wrapper ${
              errors.offerPromotionalPrice ? "has-error" : ""
            }`}
          >
            <span className="input-prefix">R$</span>
            <input
              id="offerPromotionalPrice"
              type="text"
              inputMode="decimal"
              placeholder="Ex: 8,90"
              aria-invalid={!!errors.offerPromotionalPrice}
              aria-describedby={
                errors.offerPromotionalPrice
                  ? "error-offerPromotionalPrice"
                  : undefined
              }
              {...register("offerPromotionalPrice", {
                setValueAs: (v) => parseCurrency(String(v)),
              })}
            />
          </div>
          {errors.offerPromotionalPrice && (
            <p className="input-error" id="error-offerPromotionalPrice" role="alert">
              {errors.offerPromotionalPrice.message}
            </p>
          )}
        </div>

        <div className="field-wrapper">
          <div className="field-label-row">
            <label htmlFor="purchaseQuantity" className="field-label">
              Quantidade a ser comprada
            </label>
            <span className="field-required">*</span>
            <TooltipButton
              label="Informação sobre a quantidade a ser comprada"
              text="Quantidade total que será adquirida."
            />
          </div>
          <div
            className={`input-wrapper ${
              errors.purchaseQuantity ? "has-error" : ""
            }`}
          >
            <input
              id="purchaseQuantity"
              type="number"
              step="1"
              placeholder="Ex: 100"
              aria-invalid={!!errors.purchaseQuantity}
              aria-describedby={
                errors.purchaseQuantity
                  ? "error-purchaseQuantity"
                  : undefined
              }
              {...register("purchaseQuantity", { valueAsNumber: true })}
            />
            <span className="input-suffix">unid.</span>
          </div>
          {errors.purchaseQuantity && (
            <p className="input-error" id="error-purchaseQuantity" role="alert">
              {errors.purchaseQuantity.message}
            </p>
          )}
        </div>

        <div className="field-wrapper">
          <div className="field-label-row">
            <label htmlFor="monthlyDemand" className="field-label">
              Demanda mensal atual
            </label>
            <span className="field-required">*</span>
            <TooltipButton
              label="Informação sobre a demanda mensal"
              text="Média de unidades vendidas por mês."
            />
          </div>
          <div
            className={`input-wrapper ${
              errors.monthlyDemand ? "has-error" : ""
            }`}
          >
            <input
              id="monthlyDemand"
              type="number"
              step="1"
              placeholder="Ex: 50"
              aria-invalid={!!errors.monthlyDemand}
              aria-describedby={
                errors.monthlyDemand ? "error-monthlyDemand" : undefined
              }
              {...register("monthlyDemand", { valueAsNumber: true })}
            />
            <span className="input-suffix">unid.</span>
          </div>
          {errors.monthlyDemand && (
            <p className="input-error" id="error-monthlyDemand" role="alert">
              {errors.monthlyDemand.message}
            </p>
          )}
        </div>

        <div className="field-wrapper">
          <div className="field-label-row">
            <label htmlFor="currentStock" className="field-label">
              Estoque atual do produto
            </label>
            <span className="field-required">*</span>
            <TooltipButton
              label="Informação sobre o estoque atual"
              text="Quantidade disponível antes da nova compra."
            />
          </div>
          <div
            className={`input-wrapper ${
              errors.currentStock ? "has-error" : ""
            }`}
          >
            <input
              id="currentStock"
              type="number"
              step="1"
              placeholder="Ex: 20"
              aria-invalid={!!errors.currentStock}
              aria-describedby={
                errors.currentStock ? "error-currentStock" : undefined
              }
              {...register("currentStock", { valueAsNumber: true })}
            />
            <span className="input-suffix">unid.</span>
          </div>
          {errors.currentStock && (
            <p className="input-error" id="error-currentStock" role="alert">
              {errors.currentStock.message}
            </p>
          )}
        </div>

        <div className="field-wrapper">
          <div className="field-label-row">
            <label htmlFor="paymentTermDays" className="field-label">
              Prazo de pagamento
            </label>
            <span className="field-optional">(opcional)</span>
            <TooltipButton
              label="Informação sobre o prazo de pagamento"
              text="Quantidade de dias até o vencimento da compra."
            />
          </div>
          <div
            className={`input-wrapper ${
              errors.paymentTermDays ? "has-error" : ""
            }`}
          >
            <input
              id="paymentTermDays"
              type="number"
              step="1"
              placeholder="Ex: 30"
              aria-invalid={!!errors.paymentTermDays}
              aria-describedby={
                errors.paymentTermDays
                  ? "error-paymentTermDays"
                  : undefined
              }
              {...register("paymentTermDays", {
                setValueAs: (v) => parseOptionalNumber(String(v)),
              })}
            />
            {showPaymentSuffix && (
              <span className="input-suffix">dias</span>
            )}
          </div>
          {errors.paymentTermDays && (
            <p className="input-error" id="error-paymentTermDays" role="alert">
              {errors.paymentTermDays.message}
            </p>
          )}
        </div>

        <div className="field-full field-wrapper">
          <div className="field-label-row">
            <label htmlFor="expirationMonths" className="field-label">
              Validade
            </label>
            <span className="field-optional">(opcional)</span>
            <TooltipButton
              label="Informação sobre a validade do produto"
              text="Prazo de validade do produto em meses."
            />
          </div>
          <div
            className={`input-wrapper ${
              errors.expirationMonths ? "has-error" : ""
            }`}
          >
            <input
              id="expirationMonths"
              type="number"
              step="1"
              placeholder="Ex: 12"
              aria-invalid={!!errors.expirationMonths}
              aria-describedby={
                errors.expirationMonths
                  ? "error-expirationMonths"
                  : undefined
              }
              {...register("expirationMonths", {
                setValueAs: (v) => parseOptionalNumber(String(v)),
              })}
            />
            {showExpirationSuffix && (
              <span className="input-suffix">meses</span>
            )}
          </div>
          {errors.expirationMonths && (
            <p className="input-error" id="error-expirationMonths" role="alert">
              {errors.expirationMonths.message}
            </p>
          )}
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={handleClear}>
          Limpar dados
        </button>
        <button type="submit" className="btn btn-primary">
          Analisar investimento
        </button>
      </div>
    </form>
  );
}
