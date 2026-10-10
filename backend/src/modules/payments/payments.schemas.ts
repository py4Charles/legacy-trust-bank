import { z } from "zod";

export const createPaymentSchema = z.object({
  fromAccountId: z.string().min(1, "Source account is required"),
  recipientId: z.string().min(1, "Recipient is required"),
  amount: z.coerce.number().positive("Amount must be greater than zero"),
  reference: z
    .string()
    .min(3, "Reference must be at least 3 characters")
    .max(40, "Reference is too long"),
  paymentDate: z.string().min(1).optional(),
  idempotencyKey: z.string().min(8).max(128).optional(),
});

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
