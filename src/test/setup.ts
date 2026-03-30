import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

import { resetAuthStore } from "@/features/auth/store/auth-store";
import { resetMockApiState } from "@/lib/mock-api";

afterEach(() => {
  cleanup();
  resetAuthStore();
  resetMockApiState();
});
