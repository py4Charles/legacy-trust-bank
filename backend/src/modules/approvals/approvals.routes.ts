import { Router } from "express";
import { asyncHandler } from "../../lib/asyncHandler";
import { ok } from "../../lib/response";
import { authenticate, authorize } from "../../middleware/auth";
import { getClientIp } from "../../lib/request";
import { decideApproval, listApprovals, serializeApproval } from "./approvals.service";

export const approvalsRouter = Router();

approvalsRouter.use(authenticate);

approvalsRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const approvals = await listApprovals(req.user!);
    ok(res, { approvals: approvals.map(serializeApproval) });
  }),
);

const decide = (decision: "approved" | "rejected") =>
  asyncHandler(async (req, res) => {
    const approval = await decideApproval({
      user: req.user!,
      approvalId: req.params.id,
      decision,
      ipAddress: getClientIp(req),
    });
    ok(res, { approval: serializeApproval(approval) });
  });

approvalsRouter.post(
  "/:id/authorise",
  authorize("authoriser", "administrator"),
  decide("approved"),
);

approvalsRouter.post(
  "/:id/reject",
  authorize("authoriser", "administrator"),
  decide("rejected"),
);
