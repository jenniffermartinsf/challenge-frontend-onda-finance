import { ArrowDownRight, ArrowUpRight, Wallet } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import type { DashboardData } from "@/features/dashboard/types";
import { formatCurrency } from "@/lib/utils";

type BalanceCardProps = {
  summary: DashboardData;
};

export function BalanceCard({ summary }: BalanceCardProps) {
  return (
    <Card className="overflow-hidden rounded-[2rem] border border-slate-200 bg-[linear-gradient(135deg,#0f172a_0%,#134e4a_100%)] text-white shadow-[0_35px_80px_-50px_rgba(15,23,42,0.85)]">
      <CardContent className="space-y-8 p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-white/70">
              Saldo disponível
            </p>
            <p
              className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl"
              data-testid="balance-amount"
            >
              {formatCurrency(summary.balance)}
            </p>
            <p className="mt-3 max-w-lg text-sm leading-6 text-white/75">
              Panorama atualizado após cada transferência concluída, sem refresh
              manual e com consistência de dados via React Query.
            </p>
          </div>
          <div className="rounded-[1.4rem] bg-white/10 p-4 text-teal-100">
            <Wallet className="size-6" aria-hidden="true" />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-[1.6rem] border border-white/10 bg-white/8 p-5">
            <div className="flex items-center gap-2 text-emerald-200">
              <ArrowUpRight className="size-4" aria-hidden="true" />
              <span className="text-sm font-medium">Entradas do mês</span>
            </div>
            <p className="mt-4 text-2xl font-semibold">
              {formatCurrency(summary.monthlyIncome)}
            </p>
          </div>
          <div className="rounded-[1.6rem] border border-white/10 bg-white/8 p-5">
            <div className="flex items-center gap-2 text-amber-100">
              <ArrowDownRight className="size-4" aria-hidden="true" />
              <span className="text-sm font-medium">Saídas do mês</span>
            </div>
            <p className="mt-4 text-2xl font-semibold">
              {formatCurrency(summary.monthlyExpenses)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
