"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { offerFormSchema, type OfferFormValues } from "@/src/schemas/offer-schema";
import type { PurchaseSimulationInput } from "@/src/types/simulation";

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
}

export function OfferForm({ onSubmit }: OfferFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<OfferFormValues>({
    resolver: zodResolver(offerFormSchema),
  });

  const paymentTermDays = watch("paymentTermDays");
  const expirationMonths = watch("expirationMonths");

  const showPaymentSuffix = typeof paymentTermDays === "number" && !isNaN(paymentTermDays);
  const showExpirationSuffix = typeof expirationMonths === "number" && !isNaN(expirationMonths);

  const handleFormSubmit = (data: OfferFormValues) => {
    const input: PurchaseSimulationInput = {
      averagePurchasePrice: data.averagePurchasePrice,
      offerPrice: data.offerPrice,
      offerQuantity: data.offerQuantity,
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

  const currencyInputClass =
    "mt-1 block w-full rounded-md border border-zinc-300 pl-8 pr-3 py-2 text-sm shadow-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500";

  const inputClass =
    "mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500";

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <label htmlFor="averagePurchasePrice" className="block text-sm font-medium text-zinc-700">
          Preço médio de compra atual
        </label>
        <div className="relative mt-1">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-sm text-zinc-400">
            R$
          </span>
          <input
            id="averagePurchasePrice"
            type="text"
            inputMode="decimal"
            placeholder="Ex: 10,50"
            {...register("averagePurchasePrice", {
              setValueAs: (v) => parseCurrency(String(v)),
            })}
            className={currencyInputClass}
          />
        </div>
        {errors.averagePurchasePrice && (
          <p className="mt-1 text-xs text-red-500">{errors.averagePurchasePrice.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="offerPrice" className="block text-sm font-medium text-zinc-700">
          Preço da oferta
        </label>
        <div className="relative mt-1">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-sm text-zinc-400">
            R$
          </span>
          <input
            id="offerPrice"
            type="text"
            inputMode="decimal"
            placeholder="Ex: 8,90"
            {...register("offerPrice", {
              setValueAs: (v) => parseCurrency(String(v)),
            })}
            className={currencyInputClass}
          />
        </div>
        {errors.offerPrice && (
          <p className="mt-1 text-xs text-red-500">{errors.offerPrice.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="offerQuantity" className="block text-sm font-medium text-zinc-700">
          Quantidade a ser comprada
        </label>
        <input
          id="offerQuantity"
          type="number"
          step="1"
          placeholder="Ex: 100"
          {...register("offerQuantity", { valueAsNumber: true })}
          className={inputClass}
        />
        {errors.offerQuantity && (
          <p className="mt-1 text-xs text-red-500">{errors.offerQuantity.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="monthlyDemand" className="block text-sm font-medium text-zinc-700">
          Demanda mensal atual
        </label>
        <input
          id="monthlyDemand"
          type="number"
          step="1"
          placeholder="Ex: 50"
          {...register("monthlyDemand", { valueAsNumber: true })}
          className={inputClass}
        />
        {errors.monthlyDemand && (
          <p className="mt-1 text-xs text-red-500">{errors.monthlyDemand.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="currentStock" className="block text-sm font-medium text-zinc-700">
          Estoque atual do produto
        </label>
        <input
          id="currentStock"
          type="number"
          step="1"
          placeholder="Ex: 20"
          {...register("currentStock", { valueAsNumber: true })}
          className={inputClass}
        />
        {errors.currentStock && (
          <p className="mt-1 text-xs text-red-500">{errors.currentStock.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="paymentTermDays" className="block text-sm font-medium text-zinc-700">
          Prazo de pagamento
        </label>
        <div className="flex items-center gap-2">
          <input
            id="paymentTermDays"
            type="text"
            inputMode="numeric"
            placeholder="Ex: 30"
            {...register("paymentTermDays", {
              setValueAs: (v) => parseOptionalNumber(String(v)),
            })}
            className={`${inputClass} mt-0 w-32`}
          />
          {showPaymentSuffix && (
            <span className="text-sm text-zinc-500">dias</span>
          )}
        </div>
        {errors.paymentTermDays && (
          <p className="mt-1 text-xs text-red-500">{errors.paymentTermDays.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="expirationMonths" className="block text-sm font-medium text-zinc-700">
          Validade
        </label>
        <div className="flex items-center gap-2">
          <input
            id="expirationMonths"
            type="text"
            inputMode="decimal"
            placeholder="Ex: 12"
            {...register("expirationMonths", {
              setValueAs: (v) => parseOptionalNumber(String(v)),
            })}
            className={`${inputClass} mt-0 w-32`}
          />
          {showExpirationSuffix && (
            <span className="text-sm text-zinc-500">meses</span>
          )}
        </div>
        {errors.expirationMonths && (
          <p className="mt-1 text-xs text-red-500">{errors.expirationMonths.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
      >
        Analisar oferta
      </button>
    </form>
  );
}
