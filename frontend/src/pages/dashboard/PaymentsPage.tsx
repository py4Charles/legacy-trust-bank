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
  const recipients = recipientsState.data ?? [];

  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
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
              <Button variant="ghost" size="sm">
                Add new
              </Button>
            </CardHeader>
            <CardBody className="space-y-3">
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
                      className="flex items-center gap-3 rounded-xl border border-ink-100 p-3 transition-colors hover:border-ink-200"
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
