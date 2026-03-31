import { screen } from "@testing-library/react";

import { formatCurrency } from "@/lib/utils";
import { initialBalance } from "@/mocks/transactions";
import { paths } from "@/routes/paths";
import { renderWithProviders } from "@/test/render-with-providers";

function normalizeWhitespace(value: string) {
  return value.replace(/\s/g, " ");
}

describe("transfer flow", () => {
  it("logs in, transfers money and updates the dashboard", async () => {
    const { user } = renderWithProviders({
      initialEntries: [paths.login],
    });

    expect(
      screen.getByRole("heading", {
        name: /entre para visualizar seu dashboard financeiro/i,
      }),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", {
        name: /acessar dashboard/i,
      }),
    );

    expect(
      await screen.findByRole("heading", {
        name: /sua visão financeira do dia/i,
      }, {
        timeout: 3000,
      }),
    ).toBeInTheDocument();

    expect(
      normalizeWhitespace(
        screen.getByTestId("balance-amount").textContent ?? "",
      ),
    ).toBe(normalizeWhitespace(formatCurrency(initialBalance)));

    await user.click(
      screen.getByRole("link", {
        name: /nova transferência/i,
      }),
    );

    const recipientNameInput = await screen.findByLabelText(
      /nome do destinatário/i,
      undefined,
      {
        timeout: 3000,
      },
    );

    await user.type(
      recipientNameInput,
      "Ana Souza",
    );
    await user.type(screen.getByLabelText(/conta destino/i), "12345678");
    await user.clear(screen.getByLabelText(/valor/i));
    await user.type(screen.getByLabelText(/valor/i), "250");
    await user.type(
      screen.getByLabelText(/descrição opcional/i),
      "Reserva para viagem",
    );

    await user.click(
      screen.getByRole("button", {
        name: /concluir transferência/i,
      }),
    );

    expect(
      await screen.findByRole("heading", {
        name: /sua visão financeira do dia/i,
      }),
    ).toBeInTheDocument();

    expect(await screen.findByText(/reserva para viagem/i)).toBeInTheDocument();
    expect(
      normalizeWhitespace(
        screen.getByTestId("balance-amount").textContent ?? "",
      ),
    ).toBe(normalizeWhitespace(formatCurrency(initialBalance - 250)));
  });
});
