import { beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "../src/app";
import { prisma } from "../src/lib/prisma";

const app = createApp();

const ADMIN_EMAIL = "thandi.mokoena@legacytrust.example";
const CAPTURER_EMAIL = "kevin.dlamini@legacytrust.example";
const PASSWORD = "Demo@1234";

async function login(email: string): Promise<string> {
  const start = await request(app)
    .post("/api/auth/login")
    .send({ email, password: PASSWORD });

  expect(start.status).toBe(200);
  const { challengeId, devCode } = start.body.data;
  expect(challengeId).toBeTruthy();
  expect(devCode).toMatch(/^\d{6}$/);

  const verify = await request(app)
    .post("/api/auth/login/verify")
    .send({ challengeId, code: devCode });

  expect(verify.status).toBe(200);
  return verify.body.data.accessToken as string;
}

let adminToken = "";
let capturerToken = "";

beforeAll(async () => {
  adminToken = await login(ADMIN_EMAIL);
  capturerToken = await login(CAPTURER_EMAIL);
});

describe("health", () => {
  it("reports ok", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe("ok");
  });
});

describe("auth", () => {
  it("rejects an incorrect OTP", async () => {
    const start = await request(app)
      .post("/api/auth/login")
      .send({ email: ADMIN_EMAIL, password: PASSWORD });

    const res = await request(app)
      .post("/api/auth/login/verify")
      .send({ challengeId: start.body.data.challengeId, code: "000000" });

    expect(res.status).toBe(401);
  });

  it("rejects invalid credentials", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: ADMIN_EMAIL, password: "wrong-password" });
    expect(res.status).toBe(401);
  });

  it("returns the current user for /me", async () => {
    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.user.email).toBe(ADMIN_EMAIL);
    expect(res.body.data.user.role).toBe("administrator");
  });

  it("rejects unauthenticated access", async () => {
    const res = await request(app).get("/api/accounts");
    expect(res.status).toBe(401);
  });
});

describe("accounts", () => {
  it("lists the seeded accounts", async () => {
    const res = await request(app)
      .get("/api/accounts")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.accounts).toHaveLength(4);
    const cheque = res.body.data.accounts.find(
      (a: { type: string }) => a.type === "cheque",
    );
    expect(cheque.balanceCents).toBe(4_825_075);
  });

  it("returns account transactions", async () => {
    const accounts = await request(app)
      .get("/api/accounts")
      .set("Authorization", `Bearer ${adminToken}`);
    const cheque = accounts.body.data.accounts.find(
      (a: { type: string }) => a.type === "cheque",
    );

    const res = await request(app)
      .get(`/api/accounts/${cheque.id}/transactions`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.transactions.length).toBeGreaterThan(0);
  });
});

describe("payments", () => {
  it("rejects invalid payloads", async () => {
    const res = await request(app)
      .post("/api/payments")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        fromAccountId: "x",
        recipientId: "y",
        amount: -5,
        reference: "no",
      });
    expect(res.status).toBe(422);
  });

  it("executes an immediate payment and de-duplicates by idempotency key", async () => {
    const accounts = await request(app)
      .get("/api/accounts")
      .set("Authorization", `Bearer ${adminToken}`);
    const cheque = accounts.body.data.accounts.find(
      (a: { type: string }) => a.type === "cheque",
    );

    const recipients = await request(app)
      .get("/api/recipients")
      .set("Authorization", `Bearer ${adminToken}`);
    const recipient = recipients.body.data.recipients[0];

    const payload = {
      fromAccountId: cheque.id,
      recipientId: recipient.id,
      amount: 1500.5,
      reference: "Test payment",
      idempotencyKey: "test-idem-key-0001",
    };

    const first = await request(app)
      .post("/api/payments")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(payload);

    expect(first.status).toBe(201);
    expect(first.body.data.transfer.status).toBe("completed");
    expect(first.body.data.requiresAuthorisation).toBe(false);

    const second = await request(app)
      .post("/api/payments")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(payload);

    expect(second.status).toBe(201);
    expect(second.body.data.idempotentReplay).toBe(true);
    expect(second.body.data.transfer.id).toBe(first.body.data.transfer.id);

    const refreshed = await request(app)
      .get(`/api/accounts/${cheque.id}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(refreshed.body.data.account.balanceCents).toBe(
      4_825_075 - 150_050,
    );
  });
});

describe("dual authorisation", () => {
  it("queues large payments and enforces separation of duties", async () => {
    const capturer = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${capturerToken}`);
    const capturerId = capturer.body.data.user.id;

    const ownAccount = await prisma.account.create({
      data: {
        userId: capturerId,
        name: "Business Cheque",
        type: "cheque",
        number: "555 000 1111",
        balanceCents: 50_000_000,
        availableCents: 50_000_000,
      },
    });

    const recipientRes = await request(app)
      .post("/api/recipients")
      .set("Authorization", `Bearer ${capturerToken}`)
      .send({
        name: "Supplier Ltd",
        bank: "Meridian Bank",
        accountNumber: "123 456 7890",
      });
    expect(recipientRes.status).toBe(201);

    const payment = await request(app)
      .post("/api/payments")
      .set("Authorization", `Bearer ${capturerToken}`)
      .send({
        fromAccountId: ownAccount.id,
        recipientId: recipientRes.body.data.recipient.id,
        amount: 100000,
        reference: "Large payment",
      });

    expect(payment.status).toBe(201);
    expect(payment.body.data.requiresAuthorisation).toBe(true);
    expect(payment.body.data.transfer.status).toBe("pending_authorisation");

    const approvals = await request(app)
      .get("/api/approvals")
      .set("Authorization", `Bearer ${adminToken}`);
    const approval = approvals.body.data.approvals.find(
      (a: { transferId: string | null }) =>
        a.transferId === payment.body.data.transfer.id,
    );
    expect(approval).toBeTruthy();

    const selfApprove = await request(app)
      .post(`/api/approvals/${approval.id}/authorise`)
      .set("Authorization", `Bearer ${capturerToken}`);
    expect(selfApprove.status).toBe(403);

    const approve = await request(app)
      .post(`/api/approvals/${approval.id}/authorise`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(approve.status).toBe(200);
    expect(approve.body.data.approval.status).toBe("approved");

    const accountAfter = await prisma.account.findUnique({
      where: { id: ownAccount.id },
    });
    expect(accountAfter?.balanceCents).toBe(50_000_000 - 10_000_000);

    const transferAfter = await prisma.transfer.findUnique({
      where: { id: payment.body.data.transfer.id },
    });
    expect(transferAfter?.status).toBe("completed");
    expect(transferAfter?.authorisedById).not.toBe(capturerId);
  });
});

describe("cards", () => {
  it("freezes and unfreezes a card", async () => {
    const cards = await request(app)
      .get("/api/cards")
      .set("Authorization", `Bearer ${adminToken}`);
    const card = cards.body.data.cards[0];

    const freeze = await request(app)
      .post(`/api/cards/${card.id}/freeze`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(freeze.status).toBe(200);
    expect(freeze.body.data.card.status).toBe("blocked");

    const unfreeze = await request(app)
      .post(`/api/cards/${card.id}/unfreeze`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(unfreeze.body.data.card.status).toBe("active");
  });
});

describe("admin", () => {
  it("exposes stats and audit logs to administrators", async () => {
    const stats = await request(app)
      .get("/api/admin/stats")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(stats.status).toBe(200);
    expect(stats.body.data.stats.users).toBeGreaterThanOrEqual(3);

    const logs = await request(app)
      .get("/api/admin/audit-logs")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(logs.status).toBe(200);
    expect(logs.body.data.logs.length).toBeGreaterThan(0);
  });

  it("forbids non-administrators from admin endpoints", async () => {
    const res = await request(app)
      .get("/api/admin/users")
      .set("Authorization", `Bearer ${capturerToken}`);
    expect(res.status).toBe(403);
  });
});

describe("hardening", () => {
  it("caps OTP verification attempts", async () => {
    const start = await request(app)
      .post("/api/auth/login")
      .send({ email: ADMIN_EMAIL, password: PASSWORD });
    const { challengeId, devCode } = start.body.data;
    const wrongCode = devCode === "000001" ? "000002" : "000001";

    for (let attempt = 0; attempt < 5; attempt += 1) {
      const res = await request(app)
        .post("/api/auth/login/verify")
        .send({ challengeId, code: wrongCode });
      expect(res.status).toBe(401);
    }

    const after = await request(app)
      .post("/api/auth/login/verify")
      .send({ challengeId, code: devCode });
    expect(after.status).toBe(401);
  });

  it("scopes idempotency keys per user", async () => {
    const me = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${capturerToken}`);
    const capturerId = me.body.data.user.id;

    const account = await prisma.account.create({
      data: {
        userId: capturerId,
        name: "Idempotency Cheque",
        type: "cheque",
        number: `999 ${Date.now()}`,
        balanceCents: 10_000_000,
        availableCents: 10_000_000,
      },
    });

    const recipientRes = await request(app)
      .post("/api/recipients")
      .set("Authorization", `Bearer ${capturerToken}`)
      .send({
        name: "Idempotency Payee",
        bank: "Meridian Bank",
        accountNumber: "555 111 2222",
      });
    const recipientId = recipientRes.body.data.recipient.id;

    const adminAccounts = await request(app)
      .get("/api/accounts")
      .set("Authorization", `Bearer ${adminToken}`);
    const adminCheque = adminAccounts.body.data.accounts.find(
      (a: { type: string }) => a.type === "cheque",
    );
    const adminRecipients = await request(app)
      .get("/api/recipients")
      .set("Authorization", `Bearer ${adminToken}`);
    const adminRecipient = adminRecipients.body.data.recipients[0];

    const key = `shared-key-${Date.now()}`;

    const adminPay = await request(app)
      .post("/api/payments")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        fromAccountId: adminCheque.id,
        recipientId: adminRecipient.id,
        amount: 10,
        reference: "Admin idem",
        idempotencyKey: key,
      });
    expect(adminPay.status).toBe(201);
    expect(adminPay.body.data.idempotentReplay).toBe(false);

    const capturerPay = await request(app)
      .post("/api/payments")
      .set("Authorization", `Bearer ${capturerToken}`)
      .send({
        fromAccountId: account.id,
        recipientId,
        amount: 20,
        reference: "Capturer idem",
        idempotencyKey: key,
      });

    expect(capturerPay.status).toBe(201);
    expect(capturerPay.body.data.idempotentReplay).toBe(false);
    expect(capturerPay.body.data.transfer.createdById).toBe(capturerId);
    expect(capturerPay.body.data.transfer.id).not.toBe(
      adminPay.body.data.transfer.id,
    );
  });

  it("rejects requests from a suspended user", async () => {
    const email = `suspended.${Date.now()}@legacytrust.example`;
    const create = await request(app)
      .post("/api/admin/users")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        email,
        fullName: "Temp User",
        password: PASSWORD,
        role: "capturer",
      });
    expect(create.status).toBe(201);
    const userId = create.body.data.user.id;

    const start = await request(app)
      .post("/api/auth/login")
      .send({ email, password: PASSWORD });
    const verify = await request(app)
      .post("/api/auth/login/verify")
      .send({ challengeId: start.body.data.challengeId, code: start.body.data.devCode });
    expect(verify.status).toBe(200);
    const token = verify.body.data.accessToken as string;

    const before = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${token}`);
    expect(before.status).toBe(200);

    const suspend = await request(app)
      .post(`/api/admin/users/${userId}/suspend`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(suspend.status).toBe(200);

    const after = await request(app)
      .get("/api/accounts")
      .set("Authorization", `Bearer ${token}`);
    expect(after.status).toBe(403);
  });
});
