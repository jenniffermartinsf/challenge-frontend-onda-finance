import { render } from "@testing-library/react";
import { type QueryClient } from "@tanstack/react-query";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import userEvent from "@testing-library/user-event";

import { AppProviders } from "@/app/providers/app-providers";
import { createAppQueryClient } from "@/app/providers/query-client";
import { appRoutes } from "@/app/router";
import { paths } from "@/routes/paths";

type RenderWithProvidersOptions = {
  initialEntries?: string[];
  queryClient?: QueryClient;
};

export function renderWithProviders({
  initialEntries = [paths.login],
  queryClient = createAppQueryClient(),
}: RenderWithProvidersOptions = {}) {
  const router = createMemoryRouter(appRoutes, {
    initialEntries,
  });

  return {
    user: userEvent.setup(),
    router,
    queryClient,
    ...render(
      <AppProviders queryClient={queryClient}>
        <RouterProvider router={router} />
      </AppProviders>,
    ),
  };
}
