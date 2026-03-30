import type { PropsWithChildren } from "react";
import { QueryClientProvider, type QueryClient } from "@tanstack/react-query";

import { createAppQueryClient } from "@/app/providers/query-client";

type AppProvidersProps = PropsWithChildren<{
  queryClient?: QueryClient;
}>;

const defaultQueryClient = createAppQueryClient();

export function AppProviders({
  children,
  queryClient = defaultQueryClient,
}: AppProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
