import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { dashboardQueryKey } from "@/features/dashboard/hooks/use-transactions-query";
import {
  showErrorToast,
  showSuccessToast,
} from "@/features/feedback/store/toast-store";
import type { TransferPayload } from "@/features/transfer/schemas/transfer-schema";
import { api, getApiErrorMessage } from "@/lib/axios";
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

      showSuccessToast(
        "Transferência concluída",
        "O dashboard foi atualizado com a nova movimentação.",
      );

      void navigate(paths.dashboard, {
        replace: true,
      });
    },
    onError(error) {
      showErrorToast(
        "Transferência não concluída",
        getApiErrorMessage(error, "Revise os dados e tente novamente."),
      );
    },
  });
}
