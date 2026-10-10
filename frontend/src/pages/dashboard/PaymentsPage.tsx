import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { accounts, recipients } from "@/data/mock";
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

export function PaymentsPage() {
  const [confirmation, setConfirmation] = useState<PaymentForm | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PaymentForm>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      fromAccount: accounts[0].id,
      recipient: recipients[0].id,
      paymentDate: new Date().toISOString().slice(0, 10),
    },
  });

  const onSubmit = async (values: PaymentForm) => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    setConfirmation(values);
    reset({
      fromAccount: accounts[0].id,
      recipient: recipients[0].id,
      amount: undefined,
      reference: "",
      paymentDate: new Date().toISOString().slice(0, 10),
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Payments & Transfers</h1>
        <p className="mt-1 text-sm text-ink-600">
          Send money, schedule future-dated payments and manage recipients.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>New payment</CardTitle>
            <Badge tone="brand">Dual authorisation applies over R50 000</Badge>
          </CardHeader>
          <CardBody>
            <form
              className="space-y-5"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="fromAccount"
                    className="mb-1.5 block text-sm font-medium text-ink-800"
                  >
                    From account
                  </label>
                  <select
                    id="fromAccount"
                    className={selectClass}
                    {...register("fromAccount")}
                  >
                    {accounts
                      .filter((a) => a.type !== "investment")
                      .map((account) => (
                        <option key={account.id} value={account.id}>
                          {account.name} — {formatCurrency(account.available)}
                        </option>
                      ))}
                  </select>
                  {errors.fromAccount && (
                    <p className="mt-1.5 text-sm text-negative-600">
                      {errors.fromAccount.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="recipient"
                    className="mb-1.5 block text-sm font-medium text-ink-800"
                  >
                    Recipient
                  </label>
                  <select
                    id="recipient"
                    className={selectClass}
                    {...register("recipient")}
                  >
                    {recipients.map((recipient) => (
                      <option key={recipient.id} value={recipient.id}>
                        {recipient.name} — {recipient.bank}
                      </option>
                    ))}
                  </select>
                  {errors.recipient && (
                    <p className="mt-1.5 text-sm text-negative-600">
                      {errors.recipient.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Input
                  label="Amount (ZAR)"
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
                error={errors.reference?.message}
                {...register("reference")}
              />

              {confirmation && (
                <div
                  role="status"
                  className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-positive-600"
                >
                  Payment of{" "}
                  <strong>{formatCurrency(confirmation.amount)}</strong> has been
                  scheduled for {confirmation.paymentDate}.
                </div>
              )}

              <Button
                type="submit"
                size="lg"
                className="w-full sm:w-auto"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing…" : "Continue to authorise"}
              </Button>
            </form>
          </CardBody>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recipients</CardTitle>
              <Button variant="ghost" size="sm">
                Add new
              </Button>
            </CardHeader>
            <CardBody className="space-y-3">
              {recipients.map((recipient) => (
                <div
                  key={recipient.id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-ink-100 p-3"
                >
                  <div className="min-w-0">
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
              ))}
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment limits</CardTitle>
            </CardHeader>
            <CardBody className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-ink-600">Per transaction</span>
                <span className="font-medium">{formatCurrency(250_000)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-ink-600">Daily limit</span>
                <span className="font-medium">{formatCurrency(1_000_000)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-ink-600">Used today</span>
                <span className="font-medium">{formatCurrency(5_500)}</span>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

const selectClass =
  "h-11 w-full rounded-lg border border-ink-300 bg-white px-3 text-sm text-ink-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40";
