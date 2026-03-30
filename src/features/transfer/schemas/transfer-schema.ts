import { z } from "zod";

export const transferSchema = z.object({
  recipientName: z
    .string()
    .trim()
    .min(3, "Informe o nome completo ou apelido do destinatário.")
    .max(60, "Use no máximo 60 caracteres para o destinatário."),
  accountNumber: z
    .string()
    .trim()
    .regex(/^\d{6,10}$/, "A conta deve ter entre 6 e 10 dígitos numéricos."),
  amount: z.coerce
    .number()
    .positive("O valor da transferência deve ser maior que zero.")
    .max(50_000, "O limite mock por transferência é de R$ 50.000,00."),
  description: z
    .string()
    .trim()
    .max(80, "Use no máximo 80 caracteres na descrição.")
    .optional()
    .transform((value) => (value ? value : undefined)),
});

export type TransferFormValues = z.input<typeof transferSchema>;
export type TransferPayload = z.output<typeof transferSchema>;
