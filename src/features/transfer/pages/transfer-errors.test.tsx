import { screen } from "@testing-library/react";

import { paths } from "@/routes/paths";
import { renderWithProviders } from "@/test/render-with-providers";

describe("transfer validations", () => {
  it("shows an error when there is not enough balance", async () => {
    const { user } = renderWithProviders({
      initialEntries: [paths.login],
    });

    await user.click(
      screen.getByRole("button", {
        name: /acessar dashboard/i,
      }),
    );

    await screen.findByRole("heading", {
      name: /sua visão financeira do dia/i,
    });

    await user.click(
      screen.getByRole("link", {
        name: /nova transferência/i,
      }),
    );

    await user.type(
      screen.getByLabelText(/nome do destinatário/i),
      "Projeto Alpha",
    );
    await user.type(screen.getByLabelText(/conta destino/i), "12345678");
    await user.clear(screen.getByLabelText(/valor/i));
    await user.type(screen.getByLabelText(/valor/i), "20000");

    await user.click(
      screen.getByRole("button", {
        name: /concluir transferência/i,
      }),
    );

    expect(await screen.findByText(/saldo insuficiente/i)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: /enviar dinheiro com validação segura/i,
      }),
    ).toBeInTheDocument();
  });
});
