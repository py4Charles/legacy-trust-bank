import type {
  BannerMessage,
  Product,
  ProductCategoryInfo,
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
