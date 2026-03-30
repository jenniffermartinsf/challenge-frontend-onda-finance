import { Navigate } from "react-router-dom";

import { useAuthStore } from "@/features/auth/store/auth-store";
import { paths } from "@/routes/paths";

export function RootRedirect() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <Navigate replace to={isAuthenticated ? paths.dashboard : paths.login} />
  );
}
