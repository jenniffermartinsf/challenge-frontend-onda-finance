import { ArrowDownLeft, ArrowUpRight, Clock3 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Transaction } from "@/features/dashboard/types";
import { cn, formatCurrency, formatShortDate } from "@/lib/utils";

type TransactionListProps = {
  transactions: Transaction[];
};

export function TransactionList({ transactions }: TransactionListProps) {
  return (
    <Card className="rounded-[2rem] border border-white/80 bg-white/90 shadow-[0_30px_80px_-55px_rgba(15,23,42,0.45)] backdrop-blur transition-colors dark:border-white/10 dark:bg-slate-950/82 dark:shadow-[0_25px_70px_-45px_rgba(2,6,23,0.95)]">
      <CardHeader className="border-b border-slate-100 pb-4 dark:border-white/10">
        <CardTitle className="text-xl text-slate-950 dark:text-slate-50">
          Últimas movimentações
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {transactions.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-slate-500 dark:text-slate-400">
            Nenhuma movimentação disponível no momento.
          </div>
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-white/10">
            {transactions.map((transaction) => {
              const isCredit = transaction.direction === "credit";

              return (
                <li
                  className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between"
                  key={transaction.id}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        "flex size-11 shrink-0 items-center justify-center rounded-2xl",
                        isCredit
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-400/12 dark:text-emerald-300"
                          : "bg-rose-50 text-rose-700 dark:bg-rose-400/12 dark:text-rose-300",
                      )}
                    >
                      {isCredit ? (
                        <ArrowDownLeft className="size-5" aria-hidden="true" />
                      ) : (
                        <ArrowUpRight className="size-5" aria-hidden="true" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-950 dark:text-slate-50">
                        {transaction.title}
                      </p>
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                        {transaction.counterparty}
                        {transaction.accountNumber
                          ? ` • Conta ${transaction.accountNumber}`
                          : ""}
                      </p>
                      {transaction.description ? (
                        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                          {transaction.description}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <p
                      className={cn(
                        "text-base font-semibold",
                        isCredit
                          ? "text-emerald-700 dark:text-emerald-300"
                          : "text-rose-700 dark:text-rose-300",
                      )}
                    >
                      {isCredit ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 sm:justify-end">
                      <Clock3 className="size-4" aria-hidden="true" />
                      <span>{formatShortDate(transaction.createdAt)}</span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
