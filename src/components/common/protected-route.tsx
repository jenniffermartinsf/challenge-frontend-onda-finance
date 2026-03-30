import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuthStore } from "@/features/auth/store/auth-store";
import { paths } from "@/routes/paths";

export function ProtectedRoute() {
  const location = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return (
      <Navigate
        replace
        to={paths.login}
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  return <Outlet />;
}
