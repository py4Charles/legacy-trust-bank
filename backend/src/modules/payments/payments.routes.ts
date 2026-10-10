import { Router } from "express";
import { asyncHandler } from "../../lib/asyncHandler";
import { created, ok } from "../../lib/response";
import { authenticate } from "../../middleware/auth";
import { getClientIp } from "../../lib/request";
import { createPaymentSchema } from "./payments.schemas";
import {
  createPayment,
  getPayment,
  listPayments,
  serializeTransfer,
} from "./payments.service";

export const paymentsRouter = Router();

paymentsRouter.use(authenticate);

paymentsRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const input = createPaymentSchema.parse(req.body);
    const result = await createPayment({
      userId: req.user!.id,
      ipAddress: getClientIp(req),
      input,
    });

    created(res, {
      transfer: serializeTransfer(result.transfer),
      requiresAuthorisation: result.requiresAuthorisation,
      scheduled: result.scheduled,
      idempotentReplay: result.idempotentReplay,
    });
  }),
);

paymentsRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const transfers = await listPayments(req.user!.id);
    ok(res, { transfers: transfers.map(serializeTransfer) });
  }),
);

paymentsRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const transfer = await getPayment(req.user!.id, req.params.id);
    ok(res, { transfer: serializeTransfer(transfer) });
  }),
);
