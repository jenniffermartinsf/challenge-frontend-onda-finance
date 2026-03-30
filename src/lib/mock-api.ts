import type { InternalAxiosRequestConfig } from "axios";

import type { LoginRequest, LoginResponse } from "@/features/auth/types";
import type { DashboardData, Transaction } from "@/features/dashboard/types";
import type { TransferPayload } from "@/features/transfer/schemas/transfer-schema";
import { initialBalance, initialTransactions } from "@/mocks/transactions";
import { demoCredentials, demoUser } from "@/mocks/user";

type MockApiSuccess<TData> = {
  data: TData;
  status: number;
};

type MockApiErrorPayload = {
  message: string;
};

type MockApiState = {
  balance: number;
  transactions: Transaction[];
};

type TransferResponse = {
  transaction: Transaction;
  balance: number;
};

class MockApiError extends Error {
  public readonly status: number;
  public readonly payload: MockApiErrorPayload;

  constructor(status: number, payload: MockApiErrorPayload) {
    super(payload.message);
    this.status = status;
    this.payload = payload;
  }
}

function createInitialState(): MockApiState {
  return {
    balance: initialBalance,
    transactions: [...initialTransactions],
  };
}

let mockApiState = createInitialState();

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseRequestData(data: unknown): unknown {
  if (typeof data !== "string") {
    return data;
  }

  if (data.length === 0) {
    return undefined;
  }

  try {
    return JSON.parse(data) as unknown;
  } catch {
    return undefined;
  }
}

function isLoginRequest(value: unknown): value is LoginRequest {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.email === "string" &&
    typeof value.password === "string" &&
    value.email.length > 0 &&
    value.password.length > 0
  );
}

function isTransferPayload(value: unknown): value is TransferPayload {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.recipientName === "string" &&
    typeof value.accountNumber === "string" &&
    typeof value.amount === "number" &&
    Number.isFinite(value.amount) &&
    (typeof value.description === "string" || value.description === undefined)
  );
}

function buildDashboardData(): DashboardData {
  const monthlyIncome = mockApiState.transactions
    .filter((transaction) => transaction.direction === "credit")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const monthlyExpenses = mockApiState.transactions
    .filter((transaction) => transaction.direction === "debit")
    .reduce((total, transaction) => total + transaction.amount, 0);

  return {
    balance: mockApiState.balance,
    monthlyIncome,
    monthlyExpenses,
    recentTransactions: [...mockApiState.transactions].sort((left, right) =>
      right.createdAt.localeCompare(left.createdAt),
    ),
  };
}

function handleLoginRequest(
  payload: LoginRequest,
): MockApiSuccess<LoginResponse> {
  const normalizedEmail = payload.email.trim().toLowerCase();

  if (
    normalizedEmail !== demoCredentials.email ||
    payload.password !== demoCredentials.password
  ) {
    throw new MockApiError(401, {
      message: "Credenciais inválidas. Use o acesso mock informado na tela.",
    });
  }

  return {
    status: 200,
    data: {
      user: demoUser,
    },
  };
}

function handleTransferRequest(
  payload: TransferPayload,
): MockApiSuccess<TransferResponse> {
  if (payload.amount > mockApiState.balance) {
    throw new MockApiError(400, {
      message: "Saldo insuficiente para concluir esta transferência.",
    });
  }

  if (payload.accountNumber === demoUser.accountNumber) {
    throw new MockApiError(400, {
      message: "Escolha uma conta de destino diferente da conta autenticada.",
    });
  }

  const transaction: Transaction = {
    id: crypto.randomUUID(),
    title: "Transferência enviada",
    counterparty: payload.recipientName,
    amount: payload.amount,
    createdAt: new Date().toISOString(),
    direction: "debit",
    status: "completed",
    description: payload.description,
    accountNumber: payload.accountNumber,
  };

  mockApiState = {
    balance: Number((mockApiState.balance - payload.amount).toFixed(2)),
    transactions: [transaction, ...mockApiState.transactions],
  };

  return {
    status: 201,
    data: {
      transaction,
      balance: mockApiState.balance,
    },
  };
}

function delay(duration = 350) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, duration);
  });
}

export async function handleMockRequest(
  config: InternalAxiosRequestConfig,
): Promise<MockApiSuccess<DashboardData | LoginResponse | TransferResponse>> {
  await delay();

  const method = config.method?.toUpperCase() ?? "GET";
  const url = new URL(config.url ?? "/", "https://mock.onda.finance");
  const payload = parseRequestData(config.data);

  if (method === "POST" && url.pathname === "/auth/login") {
    if (!isLoginRequest(payload)) {
      throw new MockApiError(400, {
        message: "Preencha e-mail e senha para continuar.",
      });
    }

    return handleLoginRequest(payload);
  }

  if (method === "GET" && url.pathname === "/dashboard") {
    return {
      status: 200,
      data: buildDashboardData(),
    };
  }

  if (method === "POST" && url.pathname === "/transfers") {
    if (!isTransferPayload(payload)) {
      throw new MockApiError(400, {
        message: "Os dados da transferência estão inválidos.",
      });
    }

    return handleTransferRequest(payload);
  }

  throw new MockApiError(404, {
    message: "A rota mock solicitada não foi encontrada.",
  });
}

export function resetMockApiState() {
  mockApiState = createInitialState();
}

export function toMockApiErrorPayload(error: unknown): MockApiErrorPayload {
  if (error instanceof MockApiError) {
    return error.payload;
  }

  return {
    message: "Não foi possível concluir a operação mock.",
  };
}
