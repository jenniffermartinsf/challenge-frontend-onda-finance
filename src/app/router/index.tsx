import {
  createBrowserRouter,
  Navigate,
  type RouteObject,
} from "react-router-dom";

import { RootRedirect } from "@/app/router/root-redirect";
import { AppShell } from "@/components/common/app-shell";
import { ProtectedRoute } from "@/components/common/protected-route";
import { LoginPage } from "@/features/auth/pages/login-page";
import { DashboardPage } from "@/features/dashboard/pages/dashboard-page";
import { TransferPage } from "@/features/transfer/pages/transfer-page";
import { paths } from "@/routes/paths";

export const appRoutes: RouteObject[] = [
  {
    path: paths.root,
    element: <RootRedirect />,
  },
  {
    path: paths.login,
    element: <LoginPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppShell />,
        children: [
          {
            path: paths.dashboard,
            element: <DashboardPage />,
          },
          {
            path: paths.transfer,
            element: <TransferPage />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <Navigate replace to={paths.root} />,
  },
];

export const router = createBrowserRouter(appRoutes);
