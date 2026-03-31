import { screen } from "@testing-library/react";

import { paths } from "@/routes/paths";
import { renderWithProviders } from "@/test/render-with-providers";

describe("login flow", () => {
  it("shows an authentication error for invalid credentials", async () => {
    const { user } = renderWithProviders({
      initialEntries: [paths.login],
    });

    await user.clear(screen.getByLabelText(/e-mail/i));
    await user.type(screen.getByLabelText(/e-mail/i), "wrong@onda.finance");
    await user.clear(screen.getByLabelText(/senha/i));
    await user.type(screen.getByLabelText(/senha/i), "SenhaInvalida");

    await user.click(
      screen.getByRole("button", {
        name: /acessar dashboard/i,
      }),
    );

    expect(
      (await screen.findAllByText(/credenciais inválidas/i)).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getByRole("heading", {
        name: /entre para visualizar seu dashboard financeiro/i,
      }),
    ).toBeInTheDocument();
  });
});
