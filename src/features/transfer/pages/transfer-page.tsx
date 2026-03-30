import { Landmark } from "lucide-react";

import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { TransferForm } from "@/features/transfer/components/transfer-form";
import { useTransactionsQuery } from "@/features/dashboard/hooks/use-transactions-query";
import { formatCurrency } from "@/lib/utils";

export function TransferPage() {
  const { data } = useTransactionsQuery();

  return (
    <div className="space-y-4">
      <PageHeader
        description="Preencha os dados com atenção. Após confirmar, o dashboard será atualizado automaticamente com a nova movimentação."
        eyebrow="Transferência"
        title="Enviar dinheiro com validação segura"
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <TransferForm availableBalance={data?.balance ?? 0} />

        <Card className="rounded-[2rem] border border-white/80 bg-white/90 shadow-[0_30px_80px_-55px_rgba(15,23,42,0.45)] backdrop-blur">
          <CardContent className="space-y-5 p-6">
            <div className="flex size-12 items-center justify-center rounded-[1.4rem] bg-slate-950 text-white">
              <Landmark className="size-5" aria-hidden="true" />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-slate-950">
                Resumo da operação
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                O mock simula validação de saldo, conta de destino e
                persistência visual imediata no dashboard após a transferência.
              </p>
            </div>

            <dl className="space-y-4 rounded-[1.6rem] border border-slate-200 bg-slate-50 p-4">
              <div>
                <dt className="text-sm font-medium text-slate-500">
                  Saldo disponível
                </dt>
                <dd className="mt-1 text-lg font-semibold text-slate-950">
                  {formatCurrency(data?.balance ?? 0)}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-500">
                  Regra mock
                </dt>
                <dd className="mt-1 text-sm leading-6 text-slate-700">
                  Não é permitido transferir para a própria conta autenticada.
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-500">
                  Atualização
                </dt>
                <dd className="mt-1 text-sm leading-6 text-slate-700">
                  A listagem de transações é invalidada automaticamente via
                  React Query.
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
