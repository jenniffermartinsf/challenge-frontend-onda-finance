import type { LoginRequest } from "@/features/auth/types";

export const authStorageKey = "onda-finance.auth";

export const demoUser = {
  id: "user-onda",
  name: "Jenniffer Martins",
  email: "demo@onda.finance",
  accountNumber: "45678910",
  branch: "0001",
} as const;

export const demoCredentials: LoginRequest = {
  email: "demo@onda.finance",
  password: "Onda@123456",
};
