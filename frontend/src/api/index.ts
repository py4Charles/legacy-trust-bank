import { apiRequest } from "@/lib/api";
import {
  clearSessionTokens,
  getRefreshToken,
  setSessionTokens,
} from "@/lib/session";
import type {
  Account,
  CardStatus,
  CardType,
  NotificationItem,
  PaymentCard,
  PendingApproval,
  Recipient,
  SessionUser,
  Transaction,
  TransactionDirection,
  TransactionStatus,
  UserRole,
} from "@/types";

interface ApiUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  status: string;
  twoFactorEnabled: boolean;
  createdAt: string;
}

interface ApiAccount {
  id: string;
  name: string;
  type: string;
  number: string;
  currency: string;
  balance: number;
  available: number;
}

interface ApiTransaction {
  id: string;
  accountId: string;
  description: string;
  category: string;
  direction: string;
  amount: number;
  status: string;
  createdAt: string;
}

interface ApiRecipient {
  id: string;
  name: string;
  bank: string;
  accountNumber: string;
  reference: string | null;
  favourite: boolean;
}

interface ApiCard {
  id: string;
  accountId: string;
  label: string;
  last4: string;
  type: string;
  status: string;
  expiry: string;
  monthlyLimit: number;
  spentThisMonth: number;
}

interface ApiNotification {
  id: string;
  title: string;
  body: string;
  severity: string;
  read: boolean;
  createdAt: string;
}

interface ApiApproval {
  id: string;
  type: string;
  title: string;
  amount: number;
  status: string;
  transferId: string | null;
  createdAt: string;
}

interface ApiTransfer {
  id: string;
  reference: string;
  amount: number;
  fromAccountId: string;
  status: string;
  paymentDate: string;
  createdAt: string;
  recipient?: { id: string; name: string; bank: string; accountNumber: string };
}

function toSessionUser(user: ApiUser): SessionUser {
  return {
    id: user.id,
    name: user.fullName,
    email: user.email,
    role: user.role,
  };
}

function toAccount(account: ApiAccount): Account {
  return {
    id: account.id,
    name: account.name,
    type: account.type as Account["type"],
    number: account.number,
    currency: account.currency,
    balance: account.balance,
    available: account.available,
  };
}

function toTransaction(transaction: ApiTransaction): Transaction {
  return {
    id: transaction.id,
    accountId: transaction.accountId,
    date: transaction.createdAt,
    description: transaction.description,
    category: transaction.category,
    direction: transaction.direction as TransactionDirection,
    amount: transaction.amount,
    status: transaction.status as TransactionStatus,
  };
}

function toRecipient(recipient: ApiRecipient): Recipient {
  return {
    id: recipient.id,
    name: recipient.name,
    bank: recipient.bank,
    accountNumber: recipient.accountNumber,
    reference: recipient.reference ?? undefined,
    favourite: recipient.favourite,
  };
}

function toCard(card: ApiCard): PaymentCard {
  return {
    id: card.id,
    accountId: card.accountId,
    label: card.label,
    last4: card.last4,
    type: card.type as CardType,
    status: card.status as CardStatus,
    expiry: card.expiry,
    monthlyLimit: card.monthlyLimit,
    spentThisMonth: card.spentThisMonth,
  };
}

function toNotification(notification: ApiNotification): NotificationItem {
  return {
    id: notification.id,
    title: notification.title,
    body: notification.body,
    date: notification.createdAt,
    read: notification.read,
    severity: notification.severity as NotificationItem["severity"],
  };
}

function toApproval(approval: ApiApproval): PendingApproval {
  return {
    id: approval.id,
    title: approval.title,
    type: approval.type as PendingApproval["type"],
    amount: approval.amount,
    submittedAt: approval.createdAt,
  };
}

export interface LoginResult {
  requiresTwoFactor: boolean;
  challengeId?: string;
  devCode?: string;
  user?: SessionUser;
}

export const authApi = {
  async login(email: string, password: string): Promise<LoginResult> {
    const data = await apiRequest<{
      requiresTwoFactor: boolean;
      challengeId?: string;
      devCode?: string;
      user?: ApiUser;
      accessToken?: string;
      refreshToken?: string;
    }>("/auth/login", { method: "POST", auth: false, body: { email, password } });

    if (data.requiresTwoFactor) {
      return {
        requiresTwoFactor: true,
        challengeId: data.challengeId,
        devCode: data.devCode,
      };
    }

    if (data.accessToken && data.refreshToken) {
      setSessionTokens({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });
    }
    return {
      requiresTwoFactor: false,
      user: data.user ? toSessionUser(data.user) : undefined,
    };
  },

  async verifyTwoFactor(
    challengeId: string,
    code: string,
  ): Promise<SessionUser> {
    const data = await apiRequest<{
      user: ApiUser;
      accessToken: string;
      refreshToken: string;
    }>("/auth/login/verify", {
      method: "POST",
      auth: false,
      body: { challengeId, code },
    });

    setSessionTokens({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    });
    return toSessionUser(data.user);
  },

  async me(): Promise<SessionUser | null> {
    const data = await apiRequest<{ user: ApiUser | null }>("/auth/me");
    return data.user ? toSessionUser(data.user) : null;
  },

  async register(input: {
    fullName: string;
    email: string;
    password: string;
    phone?: string;
    idNumber?: string;
  }): Promise<SessionUser> {
    const data = await apiRequest<{ user: ApiUser }>("/auth/register", {
      method: "POST",
      auth: false,
      body: input,
    });
    return toSessionUser(data.user);
  },

  async logout(): Promise<void> {
    const refreshToken = getRefreshToken();
    try {
      if (refreshToken) {
        await apiRequest("/auth/logout", {
          method: "POST",
          auth: false,
          body: { refreshToken },
        });
      }
    } finally {
      clearSessionTokens();
    }
  },
};

export const accountsApi = {
  async list(): Promise<Account[]> {
    const data = await apiRequest<{ accounts: ApiAccount[] }>("/accounts");
    return data.accounts.map(toAccount);
  },

  async transactions(accountId: string, limit = 100): Promise<Transaction[]> {
    const data = await apiRequest<{ transactions: ApiTransaction[] }>(
      `/accounts/${accountId}/transactions?limit=${limit}`,
    );
    return data.transactions.map(toTransaction);
  },
};

export const transactionsApi = {
  async list(limit = 50): Promise<Transaction[]> {
    const data = await apiRequest<{ transactions: ApiTransaction[] }>(
      `/transactions?limit=${limit}`,
    );
    return data.transactions.map(toTransaction);
  },
};

export const cardsApi = {
  async list(): Promise<PaymentCard[]> {
    const data = await apiRequest<{ cards: ApiCard[] }>("/cards");
    return data.cards.map(toCard);
  },

  async setFrozen(id: string, frozen: boolean): Promise<PaymentCard> {
    const action = frozen ? "freeze" : "unfreeze";
    const data = await apiRequest<{ card: ApiCard }>(`/cards/${id}/${action}`, {
      method: "POST",
    });
    return toCard(data.card);
  },

  async updateLimit(id: string, monthlyLimit: number): Promise<PaymentCard> {
    const data = await apiRequest<{ card: ApiCard }>(`/cards/${id}/limits`, {
      method: "PATCH",
      body: { monthlyLimit },
    });
    return toCard(data.card);
  },
};

export const recipientsApi = {
  async list(): Promise<Recipient[]> {
    const data = await apiRequest<{ recipients: ApiRecipient[] }>("/recipients");
    return data.recipients.map(toRecipient);
  },

  async remove(id: string): Promise<void> {
    await apiRequest(`/recipients/${id}`, { method: "DELETE" });
  },
};

export interface CreatePaymentResult {
  requiresAuthorisation: boolean;
  scheduled: boolean;
  idempotentReplay: boolean;
  transfer: {
    id: string;
    reference: string;
    amount: number;
    status: string;
    paymentDate: string;
  };
}

export const paymentsApi = {
  async create(input: {
    fromAccountId: string;
    recipientId: string;
    amount: number;
    reference: string;
    paymentDate?: string;
    idempotencyKey?: string;
  }): Promise<CreatePaymentResult> {
    const data = await apiRequest<{
      transfer: ApiTransfer;
      requiresAuthorisation: boolean;
      scheduled: boolean;
      idempotentReplay: boolean;
    }>("/payments", { method: "POST", body: input });

    return {
      requiresAuthorisation: data.requiresAuthorisation,
      scheduled: data.scheduled,
      idempotentReplay: data.idempotentReplay,
      transfer: {
        id: data.transfer.id,
        reference: data.transfer.reference,
        amount: data.transfer.amount,
        status: data.transfer.status,
        paymentDate: data.transfer.paymentDate,
      },
    };
  },

  async list(): Promise<ApiTransfer[]> {
    const data = await apiRequest<{ transfers: ApiTransfer[] }>("/payments");
    return data.transfers;
  },
};

export const approvalsApi = {
  async list(): Promise<PendingApproval[]> {
    const data = await apiRequest<{ approvals: ApiApproval[] }>("/approvals");
    return data.approvals.map(toApproval);
  },

  async decide(id: string, decision: "authorise" | "reject"): Promise<void> {
    await apiRequest(`/approvals/${id}/${decision}`, { method: "POST" });
  },
};

export const notificationsApi = {
  async list(): Promise<{ notifications: NotificationItem[]; unread: number }> {
    const data = await apiRequest<{
      notifications: ApiNotification[];
      unread: number;
    }>("/notifications");
    return {
      notifications: data.notifications.map(toNotification),
      unread: data.unread,
    };
  },

  async markAllRead(): Promise<void> {
    await apiRequest("/notifications/read-all", { method: "POST" });
  },
};
