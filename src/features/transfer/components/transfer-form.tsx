import { useState, type FormEvent } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, LoaderCircle, SendHorizonal } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Transaction } from "@/features/dashboard/types";
import { useTransfer } from "@/features/transfer/hooks/use-transfer";
import {
  transferSchema,
  type TransferFormValues,
  type TransferPayload,
} from "@/features/transfer/schemas/transfer-schema";
import { getApiErrorMessage } from "@/lib/axios";
import { formatCurrency } from "@/lib/utils";

type TransferFormProps = {
  availableBalance: number;
  recentTransactions: Transaction[];
};

type DuplicateTransferWarning = {
  payload: TransferPayload;
  transaction: Transaction;
};

function normalizeText(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function isSameDay(left: string, right: Date) {
  const leftDate = new Date(left);

  return (
    leftDate.getFullYear() === right.getFullYear() &&
    leftDate.getMonth() === right.getMonth() &&
    leftDate.getDate() === right.getDate()
  );
}

function findDuplicateTransfer(
  payload: TransferPayload,
  recentTransactions: Transaction[],
) {
  const normalizedRecipient = normalizeText(payload.recipientName);
  const today = new Date();

  return recentTransactions.find((transaction) => {
    if (transaction.direction !== "debit" || !transaction.accountNumber) {
      return false;
    }

    return (
      normalizeText(transaction.counterparty) === normalizedRecipient &&
      transaction.accountNumber === payload.accountNumber &&
      Number(transaction.amount.toFixed(2)) === Number(payload.amount.toFixed(2)) &&
      isSameDay(transaction.createdAt, today)
    );
  });
}

export function TransferForm({
  availableBalance,
  recentTransactions,
}: TransferFormProps) {
  const transferMutation = useTransfer();
  const [duplicateWarning, setDuplicateWarning] =
    useState<DuplicateTransferWarning | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TransferFormValues>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      recipientName: "",
      accountNumber: "",
      amount: 0,
      description: "",
    },
  });

  function handleFieldChange() {
    if (duplicateWarning) {
      setDuplicateWarning(null);
    }
  }

  async function executeTransfer(payload: TransferPayload) {
    try {
      setDuplicateWarning(null);
      await transferMutation.mutateAsync(payload);
      reset();
    } catch {
      return;
    }
  }

  function onSubmit(values: TransferFormValues) {
    const payload = transferSchema.parse(values);
    const duplicateTransfer = findDuplicateTransfer(payload, recentTransactions);

    if (duplicateTransfer) {
      setDuplicateWarning({
        payload,
        transaction: duplicateTransfer,
      });

      return;
    }

    void executeTransfer(payload);
  }

  function handleTransferSubmit(event: FormEvent<HTMLFormElement>) {
    void handleSubmit(onSubmit)(event);
  }

  return (
    <Card className="rounded-[2rem] border border-white/80 bg-white/92 shadow-[0_30px_80px_-55px_rgba(15,23,42,0.45)] backdrop-blur transition-colors dark:border-white/10 dark:bg-slate-950/85 dark:shadow-[0_25px_70px_-45px_rgba(2,6,23,0.95)]">
      <CardHeader className="border-b border-slate-100 pb-4">
        <CardTitle className="text-xl text-slate-950">
          Dados da transferência
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <div className="rounded-[1.6rem] border border-teal-100 bg-teal-50 p-4 text-sm text-teal-950 dark:border-teal-400/15 dark:bg-teal-400/10 dark:text-teal-100">
          <p className="font-medium">Saldo disponível</p>
          <p className="mt-2 text-2xl font-semibold">
            {formatCurrency(availableBalance)}
          </p>
        </div>

        <form className="space-y-5" noValidate onSubmit={handleTransferSubmit}>
          {duplicateWarning ? (
            <div
              className="rounded-[1.6rem] border border-amber-300/60 bg-amber-50 px-4 py-4 text-sm text-amber-950 dark:border-amber-300/20 dark:bg-amber-300/10 dark:text-amber-100"
              role="alert"
            >
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-amber-500/15 p-2 text-amber-700 dark:text-amber-200">
                  <AlertTriangle className="size-4" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium">
                    Transferência semelhante identificada hoje
                  </p>
                  <p className="mt-2 leading-6">
                    Já existe uma transferência para{" "}
                    <strong>{duplicateWarning.transaction.counterparty}</strong>{" "}
                    no valor de{" "}
                    <strong>
                      {formatCurrency(duplicateWarning.transaction.amount)}
                    </strong>{" "}
                    para a conta{" "}
                    <strong>{duplicateWarning.transaction.accountNumber}</strong>.
                    Deseja continuar mesmo assim?
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Button
                      className="rounded-xl"
                      onClick={() => setDuplicateWarning(null)}
                      type="button"
                      variant="outline"
                    >
                      Revisar dados
                    </Button>
                    <Button
                      className="rounded-xl bg-amber-600 text-white hover:bg-amber-700 dark:bg-amber-300 dark:text-slate-950 dark:hover:bg-amber-200"
                      onClick={() =>
                        void executeTransfer(duplicateWarning.payload)
                      }
                      type="button"
                    >
                      Continuar mesmo assim
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="recipientName">Nome do destinatário</Label>
              <Input
                aria-describedby={
                  errors.recipientName ? "recipientName-error" : undefined
                }
                aria-invalid={Boolean(errors.recipientName)}
                className="h-11 rounded-xl border-slate-200 bg-white dark:border-white/10 dark:bg-slate-950/70 dark:text-slate-50"
                id="recipientName"
                placeholder="Ana Souza"
                {...register("recipientName", {
                  onChange: handleFieldChange,
                })}
              />
              {errors.recipientName ? (
                <p
                  className="text-sm text-destructive"
                  id="recipientName-error"
                  role="alert"
                >
                  {errors.recipientName.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountNumber">Conta destino</Label>
              <Input
                aria-describedby={
                  errors.accountNumber ? "accountNumber-error" : undefined
                }
                aria-invalid={Boolean(errors.accountNumber)}
                className="h-11 rounded-xl border-slate-200 bg-white dark:border-white/10 dark:bg-slate-950/70 dark:text-slate-50"
                id="accountNumber"
                inputMode="numeric"
                placeholder="12345678"
                {...register("accountNumber", {
                  onChange: handleFieldChange,
                })}
              />
              {errors.accountNumber ? (
                <p
                  className="text-sm text-destructive"
                  id="accountNumber-error"
                  role="alert"
                >
                  {errors.accountNumber.message}
                </p>
              ) : null}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Valor</Label>
            <Input
              aria-describedby={errors.amount ? "amount-error" : "amount-hint"}
              aria-invalid={Boolean(errors.amount)}
              className="h-11 rounded-xl border-slate-200 bg-white dark:border-white/10 dark:bg-slate-950/70 dark:text-slate-50"
              id="amount"
              min="0"
              placeholder="250.00"
              step="0.01"
              type="number"
              {...register("amount", {
                onChange: handleFieldChange,
              })}
            />
            {errors.amount ? (
              <p
                className="text-sm text-destructive"
                id="amount-error"
                role="alert"
              >
                {errors.amount.message}
              </p>
            ) : (
              <p
                className="text-sm text-slate-500 dark:text-slate-400"
                id="amount-hint"
              >
                Transferências mock são validadas também no servidor simulado.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição opcional</Label>
            <Textarea
              aria-describedby={
                errors.description ? "description-error" : "description-hint"
              }
              aria-invalid={Boolean(errors.description)}
              className="rounded-xl border-slate-200 bg-white dark:border-white/10 dark:bg-slate-950/70 dark:text-slate-50"
              id="description"
              placeholder="Ex.: Reserva para a viagem de maio"
              {...register("description", {
                onChange: handleFieldChange,
              })}
            />
            {errors.description ? (
              <p
                className="text-sm text-destructive"
                id="description-error"
                role="alert"
              >
                {errors.description.message}
              </p>
            ) : (
              <p
                className="text-sm text-slate-500 dark:text-slate-400"
                id="description-hint"
              >
                Esta informação aparece no histórico para facilitar a
                conferência.
              </p>
            )}
          </div>

          {transferMutation.error ? (
            <div
              className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive"
              role="alert"
            >
              {getApiErrorMessage(
                transferMutation.error,
                "Não foi possível enviar a transferência.",
              )}
            </div>
          ) : null}

          <Button
            className="h-11 w-full rounded-xl bg-slate-950 text-white hover:bg-slate-800 dark:bg-teal-300 dark:text-slate-950 dark:hover:bg-teal-200"
            disabled={transferMutation.isPending}
            type="submit"
          >
            {transferMutation.isPending ? (
              <>
                <LoaderCircle
                  className="size-4 animate-spin"
                  aria-hidden="true"
                />
                Processando transferência...
              </>
            ) : (
              <>
                <SendHorizonal className="size-4" aria-hidden="true" />
                Concluir transferência
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
