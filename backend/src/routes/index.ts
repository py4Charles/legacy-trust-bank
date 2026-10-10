import { Router } from "express";
import { authRouter } from "../modules/auth/auth.routes";
import { accountsRouter } from "../modules/accounts/accounts.routes";
import { transactionsRouter } from "../modules/transactions/transactions.routes";
import { cardsRouter } from "../modules/cards/cards.routes";
import { notificationsRouter } from "../modules/notifications/notifications.routes";
import { recipientsRouter } from "../modules/recipients/recipients.routes";
import { paymentsRouter } from "../modules/payments/payments.routes";
import { approvalsRouter } from "../modules/approvals/approvals.routes";
import { adminRouter } from "../modules/admin/admin.routes";

export const apiRouter = Router();

apiRouter.get("/health", (_req, res) => {
  res.json({
    data: {
      status: "ok",
      service: "legacy-trust-bank-api",
      uptimeSeconds: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
    },
  });
});

apiRouter.use("/auth", authRouter);
apiRouter.use("/accounts", accountsRouter);
apiRouter.use("/transactions", transactionsRouter);
apiRouter.use("/cards", cardsRouter);
apiRouter.use("/notifications", notificationsRouter);
apiRouter.use("/recipients", recipientsRouter);
apiRouter.use("/payments", paymentsRouter);
apiRouter.use("/approvals", approvalsRouter);
apiRouter.use("/admin", adminRouter);
