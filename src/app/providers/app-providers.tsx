import type { PropsWithChildren } from "react";
import { QueryClientProvider, type QueryClient } from "@tanstack/react-query";

import { createAppQueryClient } from "@/app/providers/query-client";
import { ThemeProvider } from "@/app/providers/theme-provider";
import { Toaster } from "@/components/common/toaster";

type AppProvidersProps = PropsWithChildren<{
  queryClient?: QueryClient;
}>;

const defaultQueryClient = createAppQueryClient();

export function AppProviders({
  children,
  queryClient = defaultQueryClient,
}: AppProvidersProps) {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
