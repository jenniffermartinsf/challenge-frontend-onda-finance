import { Link } from "react-router-dom";
import { ArrowRight, RefreshCcw } from "lucide-react";

import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { BalanceCard } from "@/features/dashboard/components/balance-card";
import { TransactionList } from "@/features/dashboard/components/transaction-list";
import { useTransactionsQuery } from "@/features/dashboard/hooks/use-transactions-query";
import { getApiErrorMessage } from "@/lib/axios";
import { paths } from "@/routes/paths";

export function DashboardPage() {
  const { data, error, isError, isLoading, refetch, isFetching } =
    useTransactionsQuery();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <PageHeader
          description="Estamos buscando as movimentações mais recentes da sua conta."
          eyebrow="Dashboard"
          title="Sua visão financeira está carregando"
        />
        <div className="grid gap-4">
          <div className="h-64 animate-pulse rounded-[2rem] bg-slate-200/70 dark:bg-white/8" />
          <div className="h-96 animate-pulse rounded-[2rem] bg-slate-200/70 dark:bg-white/8" />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="space-y-4">
        <PageHeader
          description="Houve um problema ao carregar o dashboard mock."
          eyebrow="Dashboard"
          title="Não foi possível exibir seus dados"
        />
        <div className="rounded-[2rem] border border-destructive/20 bg-white p-6 shadow-[0_25px_70px_-50px_rgba(15,23,42,0.45)] dark:bg-slate-950/82">
          <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
            {getApiErrorMessage(error, "Tente novamente em instantes.")}
          </p>
          <Button className="mt-4 rounded-xl" onClick={() => void refetch()}>
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PageHeader
        actions={
          <div className="flex flex-wrap gap-3">
            <Button
              className="rounded-xl dark:border-white/10 dark:bg-transparent dark:text-slate-100 dark:hover:bg-white/5"
              onClick={() => void refetch()}
              type="button"
              variant="outline"
            >
              <RefreshCcw
                className={isFetching ? "size-4 animate-spin" : "size-4"}
                aria-hidden="true"
              />
              Atualizar
            </Button>
            <Button
              asChild
              className="rounded-xl bg-slate-950 text-white hover:bg-slate-800 dark:bg-teal-300 dark:text-slate-950 dark:hover:bg-teal-200"
            >
              <Link to={paths.transfer}>
                Nova transferência
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        }
        description="Acompanhe saldo, entradas, saídas e as movimentações mais recentes em uma única tela."
        eyebrow="Dashboard"
        title="Sua visão financeira do dia"
      />

      <BalanceCard summary={data} />
      <TransactionList transactions={data.recentTransactions} />
    </div>
  );
}
