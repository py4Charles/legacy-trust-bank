export type AccountType = "cheque" | "savings" | "credit" | "investment";

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  number: string;
  currency: string;
  balance: number;
  available: number;
}

export type TransactionDirection = "credit" | "debit";
export type TransactionStatus = "posted" | "pending" | "failed";

export interface Transaction {
  id: string;
  accountId: string;
  date: string;
  description: string;
  category: string;
  direction: TransactionDirection;
  amount: number;
  status: TransactionStatus;
}

export interface Recipient {
  id: string;
  name: string;
  bank: string;
  accountNumber: string;
  reference?: string;
  favourite?: boolean;
}

export type CardType = "debit" | "credit";
export type CardStatus = "active" | "blocked" | "expired";

export interface PaymentCard {
  id: string;
  accountId: string;
  label: string;
  last4: string;
  type: CardType;
  status: CardStatus;
  expiry: string;
  monthlyLimit: number;
  spentThisMonth: number;
}

export type ProductCategory = "accounts" | "savings" | "loans" | "cards";

export interface Product {
  slug: string;
  name: string;
  category: ProductCategory;
  tagline: string;
  description: string;
  monthlyFee: string;
  features: string[];
  eligibility: string[];
  documents: string[];
  featured?: boolean;
}

export interface ProductCategoryInfo {
  id: ProductCategory;
  label: string;
  description: string;
}

export type UserRole = "capturer" | "authoriser" | "administrator";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthResult {
  requiresTwoFactor: boolean;
  challengeId?: string;
}

export interface PendingApproval {
  id: string;
  title: string;
  submittedBy: string;
  submittedAt: string;
  amount: number;
  type: "payment" | "beneficiary" | "limit-change";
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  date: string;
  read: boolean;
  severity: "info" | "warning" | "critical";
}
