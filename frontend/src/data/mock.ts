import type {
  Account,
  BannerMessage,
  NotificationItem,
  PaymentCard,
  PendingApproval,
  Product,
  ProductCategoryInfo,
  Recipient,
  Transaction,
} from "@/types";

export const productCategories: ProductCategoryInfo[] = [
  {
    id: "accounts",
    label: "Current Accounts",
    description: "Everyday banking that moves at your pace.",
  },
  {
    id: "savings",
    label: "Savings & Investments",
    description: "Grow your money with competitive rates.",
  },
  {
    id: "loans",
    label: "Loans & Credit",
    description: "Flexible finance for life's big moments.",
  },
  {
    id: "cards",
    label: "Cards",
    description: "Secure cards with rewards that fit you.",
  },
];

export const products: Product[] = [
  {
    slug: "everyday-cheque",
    name: "Everyday Cheque Account",
    category: "accounts",
    tagline: "The all-rounder for daily banking.",
    description:
      "A flexible transactional account with unlimited card swipes, a linked savings pocket and no minimum balance requirement.",
    monthlyFee: "₵69 / month",
    featured: true,
    features: [
      "Unlimited card purchases",
      "Free online transfers",
      "Linked savings pocket with instant access",
      "24/7 digital banking and fraud alerts",
    ],
    eligibility: [
      "South African ID or valid passport",
      "Aged 18 years or older",
      "Proof of residence not older than 3 months",
    ],
    documents: ["Identity document", "Proof of address", "Recent payslip (optional)"],
  },
  {
    slug: "premier-cheque",
    name: "Premier Cheque Account",
    category: "accounts",
    tagline: "More benefits for your money.",
    description:
      "Premium transactional banking with dedicated support, higher card limits and preferential lending rates.",
    monthlyFee: "₵199 / month",
    features: [
      "Dedicated relationship banker",
      "Higher daily card and transfer limits",
      "Preferential lending rates",
      "Complimentary airport lounge access",
    ],
    eligibility: [
      "Minimum monthly income of ₵35 000",
      "South African ID or valid passport",
      "Credit assessment",
    ],
    documents: ["Identity document", "Proof of income", "Proof of residence"],
  },
  {
    slug: "flex-savings",
    name: "Flexi Savings",
    category: "savings",
    tagline: "Save without locking your money away.",
    description:
      "Earn competitive interest with instant access to your funds. No penalties, no notice periods.",
    monthlyFee: "No monthly fee",
    featured: true,
    features: [
      "Interest from the first Cedis",
      "Instant access to funds",
      "Automatic savings rules",
      "Goal-based savings sub-accounts",
    ],
    eligibility: ["South African ID or valid passport", "Aged 18 years or older"],
    documents: ["Identity document", "Proof of address"],
  },
  {
    slug: "growth-fixed-deposit",
    name: "Growth Fixed Deposit",
    category: "savings",
    tagline: "Higher rates for committed savers.",
    description:
      "Lock in a fixed rate for a fixed term and watch your money grow predictably.",
    monthlyFee: "No monthly fee",
    features: [
      "₵ates from 8.5% per annum",
      "Terms from 6 to 60 months",
      "Interest paid monthly or on maturity",
      "Automatic reinvestment options",
    ],
    eligibility: ["Minimum deposit of ₵10 000", "South African ID or valid passport"],
    documents: ["Identity document", "Proof of address"],
  },
  {
    slug: "personal-loan",
    name: "Personal Loan",
    category: "loans",
    tagline: "Finance that flexes with you.",
    description:
      "Borrow from R10 000 to ₵300 000 with a fixed interest rate and repayment term that suits your budget.",
    monthlyFee: "Once-off initiation fee",
    features: [
      "Amounts from ₵10 000 to ₵300 000",
      "Fixed monthly instalments",
      "Terms from 6 to 72 months",
      "Decision within minutes",
    ],
    eligibility: [
      "Minimum monthly income of ₵5 000",
      "Aged 18 years or older",
      "Clean credit record",
    ],
    documents: ["Identity document", "Proof of income", "3 months bank statements"],
  },
  {
    slug: "vehicle-finance",
    name: "Vehicle Finance",
    category: "loans",
    tagline: "Drive away sooner.",
    description:
      "Competitive vehicle finance with flexible deposit options and a repayment term up to 72 months.",
    monthlyFee: "Once-off initiation fee",
    features: [
      "Finance up to 100% of the value",
      "Terms up to 72 months",
      "Balloon payment options",
      "Approval within 4 hours",
    ],
    eligibility: [
      "Minimum monthly income of ₵8 000",
      "Valid driver's licence",
      "Credit assessment",
    ],
    documents: ["Identity document", "Proof of income", "Vehicle quotation"],
  },
  {
    slug: "debit-card",
    name: "Everyday Debit Card",
    category: "cards",
    tagline: "Tap, swipe and pay securely.",
    description:
      "A tap-to-pay debit card linked to your cheque account, with instant notifications and zero card fees.",
    monthlyFee: "No card fee",
    features: [
      "Tap-to-pay and contactless",
      "Instant transaction alerts",
      "Freeze and unfreeze in app",
      "Zero card fees",
    ],
    eligibility: ["Active cheque account", "Aged 16 years or older"],
    documents: ["Identity document"],
  },
  {
    slug: "aspire-credit-card",
    name: "Aspire Credit Card",
    category: "cards",
    tagline: "Rewards on everything you buy.",
    description:
      "Earn rewards on everyday spend with flexible repayment and up to 55 days interest-free.",
    monthlyFee: "₵75 / month",
    featured: true,
    features: [
      "Up to 55 days interest-free",
      "Rewards on everyday spend",
      "Flexible repayment options",
      "Complimentary travel insurance",
    ],
    eligibility: ["Minimum monthly income of ₵6 000", "Credit assessment"],
    documents: ["Identity document", "Proof of income"],
  },
];

export const accounts: Account[] = [
  {
    id: "acc-cheque-01",
    name: "Everyday Cheque",
    type: "cheque",
    number: "621 304 5588",
    currency: "₵",
    balance: 48250.75,
    available: 47250.75,
  },
  {
    id: "acc-savings-01",
    name: "Flexi Savings",
    type: "savings",
    number: "902 118 7742",
    currency: "₵",
    balance: 138420.0,
    available: 138420.0,
  },
  {
    id: "acc-credit-01",
    name: "Aspire Credit Card",
    type: "credit",
    number: "4128 9021 4477",
    currency: "₵",
    balance: -6420.3,
    available: 43579.7,
  },
  {
    id: "acc-invest-01",
    name: "Growth Fixed Deposit",
    type: "investment",
    number: "701 556 2201",
    currency: "₵",
    balance: 250000.0,
    available: 0,
  },
];

export const transactions: Transaction[] = [
  {
    id: "txn-1001",
    accountId: "acc-cheque-01",
    date: "2026-10-09T08:14:00Z",
    description: "Salary — Nimbus Technologies",
    category: "Income",
    direction: "credit",
    amount: 38500.0,
    status: "posted",
  },
  {
    id: "txn-1002",
    accountId: "acc-cheque-01",
    date: "2026-10-09T13:02:00Z",
    description: "Woolworths Food — Rosebank",
    category: "Groceries",
    direction: "debit",
    amount: 1284.55,
    status: "posted",
  },
  {
    id: "txn-1003",
    accountId: "acc-cheque-01",
    date: "2026-10-08T06:45:00Z",
    description: "Discovery Health Medical Scheme",
    category: "Insurance",
    direction: "debit",
    amount: 3240.0,
    status: "posted",
  },
  {
    id: "txn-1004",
    accountId: "acc-cheque-01",
    date: "2026-10-07T17:22:00Z",
    description: "Vodacom Airtime Top-Up",
    category: "Airtime",
    direction: "debit",
    amount: 199.0,
    status: "posted",
  },
  {
    id: "txn-1005",
    accountId: "acc-cheque-01",
    date: "2026-10-07T09:10:00Z",
    description: "Payment to J. Naidoo",
    category: "Transfer",
    direction: "debit",
    amount: 5500.0,
    status: "pending",
  },
  {
    id: "txn-1006",
    accountId: "acc-savings-01",
    date: "2026-10-05T11:00:00Z",
    description: "Savings interest",
    category: "Interest",
    direction: "credit",
    amount: 812.44,
    status: "posted",
  },
  {
    id: "txn-1007",
    accountId: "acc-cheque-01",
    date: "2026-10-04T19:35:00Z",
    description: "City of Tshwane — Electricity",
    category: "Utilities",
    direction: "debit",
    amount: 1780.0,
    status: "posted",
  },
  {
    id: "txn-1008",
    accountId: "acc-cheque-01",
    date: "2026-10-03T07:58:00Z",
    description: "Engen Fuel Station",
    category: "Fuel",
    direction: "debit",
    amount: 950.0,
    status: "posted",
  },
  {
    id: "txn-1009",
    accountId: "acc-credit-01",
    date: "2026-10-02T20:05:00Z",
    description: "Takealot.com",
    category: "Shopping",
    direction: "debit",
    amount: 749.99,
    status: "posted",
  },
  {
    id: "txn-1010",
    accountId: "acc-cheque-01",
    date: "2026-10-01T08:00:00Z",
    description: "Netflix Subscription",
    category: "Entertainment",
    direction: "debit",
    amount: 199.0,
    status: "posted",
  },
];

export const recipients: Recipient[] = [
  {
    id: "rec-01",
    name: "J. Naidoo",
    bank: "Legacy Trust Bank",
    accountNumber: "621 990 4412",
    reference: "Rent",
    favourite: true,
  },
  {
    id: "rec-02",
    name: "City of Tshwane",
    bank: "Legacy Trust Bank",
    accountNumber: "110 445 2201",
    reference: "Utilities",
    favourite: true,
  },
  {
    id: "rec-03",
    name: "Discovery Health",
    bank: "Meridian Bank",
    accountNumber: "789 200 1145",
    reference: "Medical aid",
    favourite: false,
  },
];

export const cards: PaymentCard[] = [
  {
    id: "card-01",
    accountId: "acc-cheque-01",
    label: "Everyday Debit",
    last4: "4477",
    type: "debit",
    status: "active",
    expiry: "09/29",
    monthlyLimit: 25000,
    spentThisMonth: 8133.55,
  },
  {
    id: "card-02",
    accountId: "acc-credit-01",
    label: "Aspire Credit",
    last4: "9021",
    type: "credit",
    status: "active",
    expiry: "03/28",
    monthlyLimit: 50000,
    spentThisMonth: 749.99,
  },
];

export const pendingApprovals: PendingApproval[] = [
  {
    id: "apr-01",
    title: "EFT payment — Meridian Bank",
    submittedBy: "K. Dlamini",
    submittedAt: "2026-10-09T15:30:00Z",
    amount: 125000.0,
    type: "payment",
  },
  {
    id: "apr-02",
    title: "New beneficiary — S. Mokoena",
    submittedBy: "K. Dlamini",
    submittedAt: "2026-10-08T10:12:00Z",
    amount: 0,
    type: "beneficiary",
  },
  {
    id: "apr-03",
    title: "Daily limit increase — batch file",
    submittedBy: "P. Botha",
    submittedAt: "2026-10-07T09:45:00Z",
    amount: 0,
    type: "limit-change",
  },
];

export const notifications: NotificationItem[] = [
  {
    id: "ntf-01",
    title: "New device sign-in",
    body: "Your account was accessed from a new device in Pretoria. If this wasn't you, secure your profile immediately.",
    date: "2026-10-09T18:40:00Z",
    read: false,
    severity: "warning",
  },
  {
    id: "ntf-02",
    title: "Payment awaiting authorisation",
    body: "A payment of ₵125 000.00 requires a second authoriser.",
    date: "2026-10-09T15:31:00Z",
    read: false,
    severity: "info",
  },
  {
    id: "ntf-03",
    title: "Card freeze lifted",
    body: "The freeze on your Everyday Debit card ending 4477 was lifted.",
    date: "2026-10-05T12:02:00Z",
    read: true,
    severity: "info",
  },
];

export const bannerMessages: BannerMessage[] = [
  {
    id: "bnr-promo-fees",
    tone: "promotion",
    message:
      "Zero monthly fees on new Everyday Cheque Accounts until 31 December.",
    link: { label: "Open an account", to: "/register" },
  },
  {
    id: "bnr-update-app",
    tone: "update",
    message:
      "Mobile banking 4.2 is live — faster payments and improved fraud alerts.",
    link: { label: "See what's new", to: "/support" },
  },
  {
    id: "bnr-alert-scam",
    tone: "alert",
    message: "Never share your OTP or PIN. We will never ask for them.",
    link: { label: "Security centre", to: "/security" },
  },
  {
    id: "bnr-promo-savings",
    tone: "promotion",
    message: "Lock in up to 9.5% p.a. on a 12-month fixed deposit.",
    link: { label: "View rates", to: "/products/savings" },
  },
];

export const demoUser = {
  email: "thandi.mokoena@legacytrust.example",
  password: "Demo@1234",
};
