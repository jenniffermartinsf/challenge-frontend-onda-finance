import type { Transaction } from "@/features/dashboard/types";

export const initialBalance = 12840.55;

export const initialTransactions: Transaction[] = [
  {
    id: "tx-001",
    title: "Salário mensal",
    counterparty: "JobZ Tecnologia",
    amount: 8900,
    createdAt: "2026-03-28T10:00:00.000Z",
    direction: "credit",
    status: "completed",
    description: "Crédito referente ao fechamento de março.",
  },
  {
    id: "tx-002",
    title: "Reserva de emergência",
    counterparty: "Conta investimento",
    amount: 1200,
    createdAt: "2026-03-27T14:20:00.000Z",
    direction: "debit",
    status: "completed",
    description: "Aporte automático semanal.",
  },
  {
    id: "tx-003",
    title: "Projeto freelance",
    counterparty: "Studio Nuvem",
    amount: 2350,
    createdAt: "2026-03-26T19:10:00.000Z",
    direction: "credit",
    status: "completed",
    description: "Pagamento do ciclo final da sprint.",
  },
  {
    id: "tx-004",
    title: "Assinaturas",
    counterparty: "Ferramentas de design",
    amount: 189.9,
    createdAt: "2026-03-24T11:35:00.000Z",
    direction: "debit",
    status: "completed",
    description: "Renovação mensal de ferramentas.",
  },
];
