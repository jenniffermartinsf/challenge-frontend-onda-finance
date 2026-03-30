export type TransactionDirection = "credit" | "debit";

export type TransactionStatus = "completed" | "processing";

export type Transaction = {
  id: string;
  title: string;
  counterparty: string;
  amount: number;
  createdAt: string;
  direction: TransactionDirection;
  status: TransactionStatus;
  description?: string;
  accountNumber?: string;
};

export type DashboardData = {
  balance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  recentTransactions: Transaction[];
};
