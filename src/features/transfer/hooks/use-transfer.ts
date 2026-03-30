import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { dashboardQueryKey } from "@/features/dashboard/hooks/use-transactions-query";
import type { TransferPayload } from "@/features/transfer/schemas/transfer-schema";
import { api } from "@/lib/axios";
import { paths } from "@/routes/paths";

type TransferResponse = {
  balance: number;
};

export function useTransfer() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: TransferPayload) => {
      const response = await api.post<TransferResponse>("/transfers", payload);

      return response.data;
    },
    async onSuccess() {
      await queryClient.invalidateQueries({
        queryKey: dashboardQueryKey,
      });

      void navigate(paths.dashboard, {
        replace: true,
      });
    },
  });
}
