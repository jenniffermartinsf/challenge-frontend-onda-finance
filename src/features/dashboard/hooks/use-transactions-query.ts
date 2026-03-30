import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/axios";
import type { DashboardData } from "@/features/dashboard/types";

export const dashboardQueryKey = ["dashboard"] as const;

export function useTransactionsQuery() {
  return useQuery({
    queryKey: dashboardQueryKey,
    queryFn: async () => {
      const response = await api.get<DashboardData>("/dashboard");

      return response.data;
    },
  });
}
