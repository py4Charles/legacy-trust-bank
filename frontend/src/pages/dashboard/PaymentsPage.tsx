import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { PageHero } from "@/components/ui/PageHero";
import { accountsApi, paymentsApi, recipientsApi } from "@/api";
import type { CreatePaymentResult } from "@/api";
import { useAsync } from "@/lib/useAsync";
import { formatCurrency } from "@/lib/format";
import type { Recipient } from "@/types";

const paymentSchema = z.object({
  fromAccount: z.string().min(1, "Select an account"),
  recipient: z.string().min(1, "Select a recipient"),
  amount: z.coerce
    .number({ message: "Enter an amount" })
    .positive("Amount must be greater than zero")
    .max(1_000_000, "Amount exceeds your daily limit"),
  reference: z
    .string()
    .min(3, "Reference must be at least 3 characters")
    .max(40, "Reference is too long"),
  paymentDate: z.string().min(1, "Choose a payment date"),
});

type PaymentForm = z.infer<typeof paymentSchema>;

const recipientSchema = z.object({
  name: z.string().min(2, "Enter a name").max(120, "That name is too long"),
  bank: z
    .string()
    .min(2, "Enter a bank")
    .max(120, "That bank name is too long"),
  accountNumber: z
    .string()
    .min(6, "At least 6 characters")
    .max(34, "That account number is too long"),
  reference: z.string().max(40, "That reference is too long").optional(),
  favourite: z.boolean().optional(),
});

type RecipientForm = z.infer<typeof recipientSchema>;

function AddRecipientForm({
  onSubmit,
  onCancel,
  submitting,
  error,
}: {
  onSubmit: (values: RecipientForm) => void;
  onCancel: () => void;
  submitting: boolean;
  error: string | null;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RecipientForm>({
    resolver: zodResolver(recipientSchema),
    defaultValues: { favourite: false },
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-4 rounded-xl border border-ink-100 bg-ink-50/60 p-4"
    >
      <Input
        label="Name"
        placeholder="J. Naidoo"
        error={errors.name?.message}
        {...register("name")}
      />
      <Input
        label="Bank"
        placeholder="Legacy Trust Bank"
        error={errors.bank?.message}
        {...register("bank")}
      />
      <Input
        label="Account number"
        inputMode="numeric"
        placeholder="621 990 4412"
        error={errors.accountNumber?.message}
        {...register("accountNumber")}
      />
      <Input
        label="Reference (optional)"
        placeholder="Rent"
        error={errors.reference?.message}
        {...register("reference")}
      />
      <label className="flex items-center gap-2 text-sm text-ink-700">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-ink-300 text-brand-600 focus:ring-brand-500/30"
          {...register("favourite")}
        />
        Mark as favourite
      </label>
      {error && (
        <p
          role="alert"
          className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-negative-600"
        >
          {error}
        </p>
      )}
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={submitting}>
          {submitting ? "Saving…" : "Save recipient"}
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

interface Confirmation {
  amount: number;
  recipientName: string;
  date: string;
  result: CreatePaymentResult;
}

export function PaymentsPage() {
  const accountsState = useAsync(() => accountsApi.list(), []);
  const recipientsState = useAsync(() => recipientsApi.list(), []);
  const paymentsState = useAsync(() => paymentsApi.list(), []);

  const accounts = accountsState.data ?? [];
  const [recipients, setRecipients] = useState<Recipient[]>([]);

  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showAddRecipient, setShowAddRecipient] = useState(false);
  const [savingRecipient, setSavingRecipient] = useState(false);
  const [recipientError, setRecipientError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PaymentForm>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      fromAccount: "",
      recipient: "",
      paymentDate: new Date().toISOString().slice(0, 10),
    },
  });

  useEffect(() => {
    if (recipientsState.data) setRecipients(recipientsState.data);
  }, [recipientsState.data]);

  useEffect(() => {
    if (!accountsState.data || !recipientsState.data) return;
    const firstAccount =
      accountsState.data.find((a) => a.type !== "investment") ??
      accountsState.data[0];
    reset({
      fromAccount: firstAccount?.id ?? "",
      recipient: recipientsState.data[0]?.id ?? "",
      amount: undefined,
      reference: "",
      paymentDate: new Date().toISOString().slice(0, 10),
    });
  }, [accountsState.data, recipientsState.data, reset]);

  const usedToday = useMemo(() => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    return (paymentsState.data ?? [])
      .filter(
        (transfer) =>
          new Date(transfer.createdAt) >= start &&
          ["completed", "scheduled", "pending_authorisation"].includes(
            transfer.status,
          ),
      )
      .reduce((sum, transfer) => sum + transfer.amount, 0);
  }, [paymentsState.data]);

  const onSubmit = async (values: PaymentForm) => {
    setSubmitError(null);
    try {
      const result = await paymentsApi.create({
        fromAccountId: values.fromAccount,
        recipientId: values.recipient,
        amount: values.amount,
        reference: values.reference,
        paymentDate: values.paymentDate
          ? new Date(values.paymentDate).toISOString()
          : undefined,
        idempotencyKey: crypto.randomUUID(),
      });

      const recipient = recipients.find((r) => r.id === values.recipient);
      setConfirmation({
        amount: values.amount,
        recipientName: recipient?.name ?? "your recipient",
        date: values.paymentDate,
        result,
      });

      reset({
        fromAccount: values.fromAccount,
        recipient: values.recipient,
        amount: undefined,
        reference: "",
        paymentDate: new Date().toISOString().slice(0, 10),
      });
      paymentsState.reload();
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "The payment could not be sent",
      );
    }
  };

  const availableAccounts = accounts.filter((a) => a.type !== "investment");

  const handleAddRecipient = async (values: RecipientForm) => {
    setSavingRecipient(true);
    setRecipientError(null);
    try {
      const recipient = await recipientsApi.create({
        name: values.name,
        bank: values.bank,
        accountNumber: values.accountNumber,
        reference: values.reference || undefined,
        favourite: values.favourite,
      });
      setRecipients((prev) => [...prev, recipient]);
      setShowAddRecipient(false);
      setValue("recipient", recipient.id);
    } catch (err) {
      setRecipientError(
        err instanceof Error ? err.message : "Could not add the recipient",
      );
    } finally {
      setSavingRecipient(false);
    }
  };

  const handleRemoveRecipient = async (id: string) => {
    setRemovingId(id);
    setRecipientError(null);
    try {
      await recipientsApi.remove(id);
      setRecipients((prev) => prev.filter((item) => item.id !== id));
      if (getValues("recipient") === id) setValue("recipient", "");
    } catch (err) {
      setRecipientError(
        err instanceof Error ? err.message : "Could not remove the recipient",
      );
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHero
        eyebrow="Payments"
        title="Move money, instantly"
        description="Send single or future-dated payments with dual authorisation on high-value transactions."
      />

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <Card className="animate-fade-up">
          <CardHeader>
            <CardTitle>New payment</CardTitle>
            <Badge tone="brand">2-step over ₵50 000</Badge>
          </CardHeader>
          <CardBody>
            <form
              className="space-y-5"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <Select
                  label="From account"
                  error={errors.fromAccount?.message}
                  {...register("fromAccount")}
                >
                  {availableAccounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.name} — {formatCurrency(account.available)}
                    </option>
                  ))}
                </Select>

                <Select
                  label="Recipient"
                  error={errors.recipient?.message}
                  {...register("recipient")}
                >
                  {recipients.map((recipient) => (
                    <option key={recipient.id} value={recipient.id}>
                      {recipient.name} — {recipient.bank}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Input
                  label="Amount (GHS)"
                  type="number"
                  step="0.01"
                  inputMode="decimal"
                  placeholder="0.00"
                  error={errors.amount?.message}
                  {...register("amount")}
                />
                <Input
                  label="Payment date"
                  type="date"
                  error={errors.paymentDate?.message}
                  {...register("paymentDate")}
                />
              </div>

              <Input
                label="Reference"
                placeholder="e.g. Rent October"
                hint="Shown to your recipient and on your statement."
                error={errors.reference?.message}
                {...register("reference")}
              />

              {submitError && (
                <p
                  role="alert"
                  className="rounded-xl border border-red-100 bg-red-50 px-4 py-3.5 text-sm text-negative-600"
                >
                  {submitError}
                </p>
              )}

              {confirmation && (
                <div
                  role="status"
                  className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3.5 text-sm text-positive-700"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mt-0.5 h-5 w-5 shrink-0"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path d="m8.5 12 2.5 2.5 4.5-5" />
                  </svg>
                  <p>
                    {confirmation.result.requiresAuthorisation ? (
                      <>
                        Payment of{" "}
                        <strong>{formatCurrency(confirmation.amount)}</strong> to{" "}
                        <strong>{confirmation.recipientName}</strong> is queued
                        for a second authoriser.
                      </>
                    ) : (
                      <>
                        Payment of{" "}
                        <strong>{formatCurrency(confirmation.amount)}</strong> to{" "}
                        <strong>{confirmation.recipientName}</strong> has been{" "}
                        {confirmation.result.scheduled
                          ? `scheduled for ${confirmation.date}`
                          : "sent"}
                        .
                      </>
                    )}
                  </p>
                </div>
              )}

              <Button
                type="submit"
                size="lg"
                className="w-full sm:w-auto"
                disabled={isSubmitting || availableAccounts.length === 0}
              >
                {isSubmitting ? "Processing…" : "Continue to authorise"}
              </Button>
            </form>
          </CardBody>
        </Card>

        <div className="space-y-6">
          <Card className="animate-fade-up">
            <CardHeader>
              <CardTitle>Recipients</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowAddRecipient((open) => !open);
                  setRecipientError(null);
                }}
              >
                {showAddRecipient ? "Close" : "Add new"}
              </Button>
            </CardHeader>
            <CardBody className="space-y-3">
              {showAddRecipient && (
                <AddRecipientForm
                  onSubmit={handleAddRecipient}
                  onCancel={() => setShowAddRecipient(false)}
                  submitting={savingRecipient}
                  error={recipientError}
                />
              )}

              {!showAddRecipient && recipientError && (
                <p
                  role="alert"
                  className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-negative-600"
                >
                  {recipientError}
                </p>
              )}

              {recipients.length > 0 ? (
                recipients.map((recipient) => {
                  const initials = recipient.name
                    .split(" ")
                    .map((part) => part[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase();
                  return (
                    <div
                      key={recipient.id}
                      className="group flex items-center gap-3 rounded-xl border border-ink-100 p-3 transition-colors hover:border-ink-200"
                    >
                      <span
                        aria-hidden="true"
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-50 to-brand-100 text-xs font-bold text-brand-700 ring-1 ring-brand-100"
                      >
                        {initials}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="flex items-center gap-2 truncate text-sm font-medium text-ink-900">
                          {recipient.name}
                          {recipient.favourite && (
                            <Badge tone="warning">Favourite</Badge>
                          )}
                        </p>
                        <p className="truncate text-xs text-ink-500">
                          {recipient.bank} · {recipient.accountNumber}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveRecipient(recipient.id)}
                        disabled={removingId === recipient.id}
                        aria-label={`Remove ${recipient.name}`}
                        className="shrink-0 rounded-lg p-1.5 text-ink-400 transition-colors hover:bg-red-50 hover:text-negative-600 disabled:opacity-50"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4"
                          aria-hidden="true"
                        >
                          <path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" />
                        </svg>
                      </button>
                    </div>
                  );
                })
              ) : (
                <p className="py-4 text-center text-sm text-ink-500">
                  {recipientsState.loading
                    ? "Loading recipients…"
                    : "No recipients yet."}
                </p>
              )}
            </CardBody>
          </Card>

          <Card className="animate-fade-up">
            <CardHeader>
              <CardTitle>Payment limits</CardTitle>
            </CardHeader>
            <CardBody className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-ink-600">Per transaction</span>
                <span className="font-medium tabular-nums">
                  {formatCurrency(250_000)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-ink-600">Daily limit</span>
                <span className="font-medium tabular-nums">
                  {formatCurrency(1_000_000)}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-ink-100 pt-3">
                <span className="text-ink-600">Used today</span>
                <span className="font-semibold tabular-nums text-ink-900">
                  {formatCurrency(usedToday)}
                </span>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
