import { prisma } from "../lib/prisma";
import { hashPassword } from "../lib/password";

async function reset() {
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.approval.deleteMany();
  await prisma.transfer.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.card.deleteMany();
  await prisma.recipient.deleteMany();
  await prisma.account.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.loginChallenge.deleteMany();
  await prisma.user.deleteMany();
}

async function main() {
  console.log("Seeding Legacy Trust Bank database…");
  await reset();

  const password = await hashPassword("Demo@1234");

  const [thandi, kevin, priya] = await Promise.all([
    prisma.user.create({
      data: {
        email: "thandi.mokoena@legacytrust.example",
        fullName: "Thandi Mokoena",
        passwordHash: password,
        role: "administrator",
      },
    }),
    prisma.user.create({
      data: {
        email: "kevin.dlamini@legacytrust.example",
        fullName: "Kevin Dlamini",
        passwordHash: password,
        role: "capturer",
      },
    }),
    prisma.user.create({
      data: {
        email: "priya.botha@legacytrust.example",
        fullName: "Priya Botha",
        passwordHash: password,
        role: "authoriser",
      },
    }),
  ]);

  const cheque = await prisma.account.create({
    data: {
      userId: thandi.id,
      name: "Everyday Cheque",
      type: "cheque",
      number: "621 304 5588",
      balanceCents: 4_825_075,
      availableCents: 4_725_075,
    },
  });

  const savings = await prisma.account.create({
    data: {
      userId: thandi.id,
      name: "Flexi Savings",
      type: "savings",
      number: "902 118 7742",
      balanceCents: 13_842_000,
      availableCents: 13_842_000,
    },
  });

  const credit = await prisma.account.create({
    data: {
      userId: thandi.id,
      name: "Aspire Credit Card",
      type: "credit",
      number: "4128 9021 4477",
      balanceCents: -642_030,
      availableCents: 4_357_970,
    },
  });

  await prisma.account.create({
    data: {
      userId: thandi.id,
      name: "Growth Fixed Deposit",
      type: "investment",
      number: "701 556 2201",
      balanceCents: 25_000_000,
      availableCents: 0,
    },
  });

  const transactionSeeds: Array<{
    accountId: string;
    description: string;
    category: string;
    direction: "credit" | "debit";
    amountCents: number;
    status: string;
    createdAt: Date;
  }> = [
    {
      accountId: cheque.id,
      description: "Salary — Nimbus Technologies",
      category: "Income",
      direction: "credit",
      amountCents: 3_850_000,
      status: "posted",
      createdAt: new Date("2026-10-09T08:14:00Z"),
    },
    {
      accountId: cheque.id,
      description: "Woolworths Food — Rosebank",
      category: "Groceries",
      direction: "debit",
      amountCents: 128_455,
      status: "posted",
      createdAt: new Date("2026-10-09T13:02:00Z"),
    },
    {
      accountId: cheque.id,
      description: "Discovery Health Medical Scheme",
      category: "Insurance",
      direction: "debit",
      amountCents: 324_000,
      status: "posted",
      createdAt: new Date("2026-10-08T06:45:00Z"),
    },
    {
      accountId: cheque.id,
      description: "Vodacom Airtime Top-Up",
      category: "Airtime",
      direction: "debit",
      amountCents: 19_900,
      status: "posted",
      createdAt: new Date("2026-10-07T17:22:00Z"),
    },
    {
      accountId: cheque.id,
      description: "Payment to J. Naidoo",
      category: "Transfer",
      direction: "debit",
      amountCents: 550_000,
      status: "pending",
      createdAt: new Date("2026-10-07T09:10:00Z"),
    },
    {
      accountId: cheque.id,
      description: "City of Tshwane — Electricity",
      category: "Utilities",
      direction: "debit",
      amountCents: 178_000,
      status: "posted",
      createdAt: new Date("2026-10-04T19:35:00Z"),
    },
    {
      accountId: savings.id,
      description: "Savings interest",
      category: "Interest",
      direction: "credit",
      amountCents: 81_244,
      status: "posted",
      createdAt: new Date("2026-10-05T11:00:00Z"),
    },
    {
      accountId: credit.id,
      description: "Takealot.com",
      category: "Shopping",
      direction: "debit",
      amountCents: 74_999,
      status: "posted",
      createdAt: new Date("2026-10-02T20:05:00Z"),
    },
  ];

  await prisma.transaction.createMany({ data: transactionSeeds });

  const [naidoo, tshwane, discovery] = await Promise.all([
    prisma.recipient.create({
      data: {
        ownerId: thandi.id,
        name: "J. Naidoo",
        bank: "Legacy Trust Bank",
        accountNumber: "621 990 4412",
        reference: "Rent",
        favourite: true,
      },
    }),
    prisma.recipient.create({
      data: {
        ownerId: thandi.id,
        name: "City of Tshwane",
        bank: "Legacy Trust Bank",
        accountNumber: "110 445 2201",
        reference: "Utilities",
        favourite: true,
      },
    }),
    prisma.recipient.create({
      data: {
        ownerId: thandi.id,
        name: "Discovery Health",
        bank: "Meridian Bank",
        accountNumber: "789 200 1145",
        reference: "Medical aid",
        favourite: false,
      },
    }),
  ]);

  await Promise.all([
    prisma.card.create({
      data: {
        accountId: cheque.id,
        label: "Everyday Debit",
        last4: "4477",
        type: "debit",
        status: "active",
        expiry: "09/29",
        monthlyLimitCents: 2_500_000,
        spentThisMonthCents: 813_355,
      },
    }),
    prisma.card.create({
      data: {
        accountId: credit.id,
        label: "Aspire Credit",
        last4: "9021",
        type: "credit",
        status: "active",
        expiry: "03/28",
        monthlyLimitCents: 5_000_000,
        spentThisMonthCents: 74_999,
      },
    }),
  ]);

  // Pending payment captured by Kevin, awaiting authorisation by an admin/authoriser.
  const pendingTransfer = await prisma.transfer.create({
    data: {
      reference: "Supplier settlement",
      amountCents: 12_500_000,
      fromAccountId: cheque.id,
      recipientId: discovery.id,
      status: "pending_authorisation",
      paymentDate: new Date(),
      createdById: kevin.id,
    },
  });

  await prisma.approval.createMany({
    data: [
      {
        type: "payment",
        title: "EFT payment — Meridian Bank",
        amountCents: 12_500_000,
        payloadJson: JSON.stringify({ transferId: pendingTransfer.id }),
        status: "pending",
        transferId: pendingTransfer.id,
        submittedById: kevin.id,
        createdAt: new Date("2026-10-09T15:30:00Z"),
      },
      {
        type: "beneficiary",
        title: "New beneficiary — S. Mokoena",
        amountCents: 0,
        status: "pending",
        submittedById: kevin.id,
        createdAt: new Date("2026-10-08T10:12:00Z"),
      },
      {
        type: "limit-change",
        title: "Daily limit increase — batch file",
        amountCents: 0,
        status: "pending",
        submittedById: priya.id,
        createdAt: new Date("2026-10-07T09:45:00Z"),
      },
    ],
  });

  await prisma.notification.createMany({
    data: [
      {
        userId: thandi.id,
        title: "New device sign-in",
        body: "Your account was accessed from a new device in Pretoria. If this wasn't you, secure your profile immediately.",
        severity: "warning",
        read: false,
        createdAt: new Date("2026-10-09T18:40:00Z"),
      },
      {
        userId: thandi.id,
        title: "Payment awaiting authorisation",
        body: "A payment of R125 000.00 requires a second authoriser.",
        severity: "info",
        read: false,
        createdAt: new Date("2026-10-09T15:31:00Z"),
      },
      {
        userId: thandi.id,
        title: "Card freeze lifted",
        body: "The freeze on your Everyday Debit card ending 4477 was lifted.",
        severity: "info",
        read: true,
        createdAt: new Date("2026-10-05T12:02:00Z"),
      },
    ],
  });

  await prisma.auditLog.create({
    data: {
      actorId: thandi.id,
      action: "system.seed",
      entity: "System",
      metadataJson: JSON.stringify({
        users: 3,
        accounts: 4,
        recipients: [naidoo.name, tshwane.name, discovery.name].length,
      }),
    },
  });

  console.log("Seed complete.");
  console.log("Admin login: thandi.mokoena@legacytrust.example / Demo@1234");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
