import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PageHero } from "@/components/ui/PageHero";
import { useAuthStore } from "@/store/auth";
import { cn } from "@/lib/utils";

const passwordSchema = z
  .object({
    current: z.string().min(1, "Enter your current password"),
    next: z
      .string()
      .min(8, "Use at least 8 characters")
      .regex(/[A-Z]/, "Include an uppercase letter")
      .regex(/[0-9]/, "Include a number")
      .regex(/[^A-Za-z0-9]/, "Include a symbol"),
    confirm: z.string().min(1, "Confirm your new password"),
  })
  .refine((data) => data.next === data.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  })
  .refine((data) => data.next !== data.current, {
    message: "New password must differ from the current one",
    path: ["next"],
  });

type PasswordForm = z.infer<typeof passwordSchema>;

const notificationChannels = [
  { id: "txn", label: "Transaction alerts", default: true },
  { id: "login", label: "New device sign-in alerts", default: true },
  { id: "marketing", label: "Product and marketing updates", default: false },
  { id: "statements", label: "Monthly statement ready", default: true },
];

export function SettingsPage() {
  const user = useAuthStore((s) => s.user);
  const [twoFactor, setTwoFactor] = useState(true);
  const [savedMessage, setSavedMessage] = useState("");
  const [prefs, setPrefs] = useState(
    Object.fromEntries(notificationChannels.map((c) => [c.id, c.default])),
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordForm>({ resolver: zodResolver(passwordSchema) });

  const onPasswordSubmit = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    setSavedMessage(
      "Password updated. You'll be asked to re-authenticate on other devices.",
    );
    reset();
  };

  return (
    <div className="space-y-6">
      <PageHero
        eyebrow="Settings"
        title="Profile, security & preferences"
        description="Keep your details current and your account locked down tight."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="animate-fade-up">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardBody className="space-y-4">
            <Input label="Full name" defaultValue={user?.name} />
            <Input label="Email address" type="email" defaultValue={user?.email} />
            <Input label="Mobile number" defaultValue="082 123 4567" />
            <div className="flex items-center gap-3 pt-1">
              <Button onClick={() => setSavedMessage("Profile details saved.")}>
                Save changes
              </Button>
            </div>
          </CardBody>
        </Card>

        <Card className="animate-fade-up">
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <Badge tone={twoFactor ? "positive" : "danger"}>
              {twoFactor ? "Protected" : "At risk"}
            </Badge>
          </CardHeader>
          <CardBody className="space-y-4">
            <div
              className={cn(
                "flex items-center justify-between gap-4 rounded-xl border p-3.5",
                twoFactor
                  ? "border-emerald-200 bg-emerald-50/50"
                  : "border-ink-200",
              )}
            >
              <div>
                <p className="text-sm font-medium text-ink-900">
                  Two-factor authentication
                </p>
                <p className="text-xs text-ink-500">
                  Require a code from your authenticator app on every login.
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={twoFactor}
                aria-label="Toggle two-factor authentication"
                onClick={() => setTwoFactor((v) => !v)}
                className={cn(
                  "relative h-6 w-11 shrink-0 rounded-full transition-colors",
                  twoFactor ? "bg-brand-600" : "bg-ink-300",
                )}
              >
                <span
                  className={cn(
                    "absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
                    twoFactor ? "translate-x-5" : "translate-x-0",
                  )}
                />
              </button>
            </div>

            <form
              className="space-y-4"
              onSubmit={handleSubmit(onPasswordSubmit)}
              noValidate
            >
              <Input
                label="Current password"
                type="password"
                autoComplete="current-password"
                error={errors.current?.message}
                {...register("current")}
              />
              <Input
                label="New password"
                type="password"
                autoComplete="new-password"
                hint="Min 8 chars with an uppercase letter, a number and a symbol."
                error={errors.next?.message}
                {...register("next")}
              />
              <Input
                label="Confirm new password"
                type="password"
                autoComplete="new-password"
                error={errors.confirm?.message}
                {...register("confirm")}
              />
              <Button
                type="submit"
                variant="secondary"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Updating…" : "Update password"}
              </Button>
            </form>
          </CardBody>
        </Card>

        <Card className="animate-fade-up lg:col-span-2">
          <CardHeader>
            <CardTitle>Notification preferences</CardTitle>
          </CardHeader>
          <CardBody className="grid gap-3 sm:grid-cols-2">
            {notificationChannels.map((channel) => (
              <label
                key={channel.id}
                className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-ink-100 p-3.5 text-sm transition-colors hover:border-ink-200"
              >
                <span className="font-medium text-ink-700">
                  {channel.label}
                </span>
                <input
                  type="checkbox"
                  checked={prefs[channel.id]}
                  onChange={(e) =>
                    setPrefs((prev) => ({
                      ...prev,
                      [channel.id]: e.target.checked,
                    }))
                  }
                  className="h-4 w-4 rounded border-ink-300 text-brand-600 focus:ring-brand-500"
                />
              </label>
            ))}
          </CardBody>
        </Card>
      </div>

      {savedMessage && (
        <div
          role="status"
          className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3.5 text-sm text-positive-700 animate-fade-in"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5 shrink-0"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="m8.5 12 2.5 2.5 4.5-5" />
          </svg>
          <p>{savedMessage}</p>
        </div>
      )}
    </div>
  );
}