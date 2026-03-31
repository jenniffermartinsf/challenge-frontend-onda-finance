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
        name: /entre para acessar sua plataforma financeira/i,
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

  it("warns before repeating the same transfer on the same day", async () => {
    const { user } = renderWithProviders({
      initialEntries: [paths.login],
    });

    await user.click(
      screen.getByRole("button", {
        name: /acessar dashboard/i,
      }),
    );

    await screen.findByRole(
      "heading",
      {
        name: /sua visão financeira do dia/i,
      },
      {
        timeout: 3000,
      },
    );

    async function completeTransfer() {
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

      await user.clear(recipientNameInput);
      await user.type(recipientNameInput, "Ana Souza");
      await user.clear(screen.getByLabelText(/conta destino/i));
      await user.type(screen.getByLabelText(/conta destino/i), "12345678");
      await user.clear(screen.getByLabelText(/valor/i));
      await user.type(screen.getByLabelText(/valor/i), "250");
      await user.clear(screen.getByLabelText(/descrição opcional/i));
      await user.type(
        screen.getByLabelText(/descrição opcional/i),
        "Reserva para viagem",
      );
      await user.click(
        screen.getByRole("button", {
          name: /concluir transferência/i,
        }),
      );
    }

    await completeTransfer();

    await screen.findByRole(
      "heading",
      {
        name: /sua visão financeira do dia/i,
      },
      {
        timeout: 3000,
      },
    );

    await completeTransfer();

    expect(
      await screen.findByText(/transferência semelhante identificada hoje/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/já existe uma transferência para/i),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", {
        name: /continuar mesmo assim/i,
      }),
    );

    expect(
      await screen.findAllByText(/reserva para viagem/i),
    ).toHaveLength(2);
  });
});
