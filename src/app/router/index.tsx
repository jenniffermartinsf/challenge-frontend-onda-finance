import {
  createBrowserRouter,
  Navigate,
  type RouteObject,
} from "react-router-dom";

import { RootRedirect } from "@/app/router/root-redirect";
import {
  AppShellRoute,
  DashboardPageRoute,
  TransferPageRoute,
} from "@/app/router/route-elements";
import { ProtectedRoute } from "@/components/common/protected-route";
import { LoginPage } from "@/features/auth/pages/login-page";
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
        element: <AppShellRoute />,
        children: [
          {
            path: paths.dashboard,
            element: <DashboardPageRoute />,
          },
          {
            path: paths.transfer,
            element: <TransferPageRoute />,
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
