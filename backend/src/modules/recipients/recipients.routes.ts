import { Router } from "express";
import { z } from "zod";
import { asyncHandler } from "../../lib/asyncHandler";
import { created, ok } from "../../lib/response";
import { authenticate } from "../../middleware/auth";
import {
  createRecipient,
  deleteRecipient,
  listRecipients,
  serializeRecipient,
} from "./recipients.service";

const createRecipientSchema = z.object({
  name: z.string().min(2).max(120),
  bank: z.string().min(2).max(120),
  accountNumber: z.string().min(6).max(34),
  reference: z.string().max(40).optional(),
  favourite: z.boolean().optional(),
});

export const recipientsRouter = Router();

recipientsRouter.use(authenticate);

recipientsRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const recipients = await listRecipients(req.user!.id);
    ok(res, { recipients: recipients.map(serializeRecipient) });
  }),
);

recipientsRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const input = createRecipientSchema.parse(req.body);
    const recipient = await createRecipient(req.user!.id, input);
    created(res, { recipient: serializeRecipient(recipient) });
  }),
);

recipientsRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    await deleteRecipient(req.user!.id, req.params.id);
    ok(res, { success: true });
  }),
);
