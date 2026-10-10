import { Router } from "express";
import { z } from "zod";
import { asyncHandler } from "../../lib/asyncHandler";
import { ok } from "../../lib/response";
import { authenticate } from "../../middleware/auth";
import { recordAudit } from "../../lib/audit";
import { getClientIp } from "../../lib/request";
import { toCents } from "../../lib/money";
import {
  getCard,
  listCards,
  serializeCard,
  setCardStatus,
  updateCardLimit,
} from "./cards.service";

const updateLimitSchema = z.object({
  monthlyLimit: z.coerce.number().positive().max(1_000_000),
});

export const cardsRouter = Router();

cardsRouter.use(authenticate);

cardsRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const cards = await listCards(req.user!.id);
    ok(res, { cards: cards.map(serializeCard) });
  }),
);

cardsRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const card = await getCard(req.user!.id, req.params.id);
    ok(res, { card: serializeCard(card) });
  }),
);

cardsRouter.post(
  "/:id/freeze",
  asyncHandler(async (req, res) => {
    const card = await setCardStatus(req.user!.id, req.params.id, "blocked");
    await recordAudit({
      actorId: req.user!.id,
      action: "card.freeze",
      entity: "Card",
      entityId: card.id,
      ipAddress: getClientIp(req),
    });
    ok(res, { card: serializeCard(card) });
  }),
);

cardsRouter.post(
  "/:id/unfreeze",
  asyncHandler(async (req, res) => {
    const card = await setCardStatus(req.user!.id, req.params.id, "active");
    await recordAudit({
      actorId: req.user!.id,
      action: "card.unfreeze",
      entity: "Card",
      entityId: card.id,
      ipAddress: getClientIp(req),
    });
    ok(res, { card: serializeCard(card) });
  }),
);

cardsRouter.patch(
  "/:id/limits",
  asyncHandler(async (req, res) => {
    const { monthlyLimit } = updateLimitSchema.parse(req.body);
    const card = await updateCardLimit(
      req.user!.id,
      req.params.id,
      toCents(monthlyLimit),
    );
    ok(res, { card: serializeCard(card) });
  }),
);
