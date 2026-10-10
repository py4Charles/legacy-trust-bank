import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Logo } from "@/components/layout/Logo";
import { useAuthStore } from "@/store/auth";
import { demoUser } from "@/data/mock";

const credentialsSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

const otpSchema = z.object({
  code: z
    .string()
    .regex(/^\d{6}$/, "Enter the 6-digit code from your authenticator"),
});

type Credentials = z.infer<typeof credentialsSchema>;
type Otp = z.infer<typeof otpSchema>;

const securityFeatures = [
  "Two-factor authentication on every login",
  "Real-time fraud monitoring",
  "Instant card freeze from your dashboard",
  "Dual authorisation for business payments",
];

export function LoginPage() {
  const [step, setStep] = useState<"credentials" | "otp">("credentials");
  const login = useAuthStore((s) => s.login);
  const verifyTwoFactor = useAuthStore((s) => s.verifyTwoFactor);
  const cancelTwoFactor = useAuthStore((s) => s.cancelTwoFactor);
  const error = useAuthStore((s) => s.error);
  const navigate = useNavigate();
  const location = useLocation();

  const from =
    (location.state as { from?: string } | null)?.from ?? "/dashboard";

  const credentialsForm = useForm<Credentials>({
    resolver: zodResolver(credentialsSchema),
  });

  const otpForm = useForm<Otp>({ resolver: zodResolver(otpSchema) });

  const onCredentials = (values: Credentials) => {
    const result = login(values.email, values.password);
    if (result.requiresTwoFactor) {
      setStep("otp");
    }
  };

  const onOtp = (values: Otp) => {
    if (verifyTwoFactor(values.code)) {
      navigate(from, { replace: true });
    }
  };

  const backToCredentials = () => {
    cancelTwoFactor();
    otpForm.reset();
    setStep("credentials");
  };

  return (
    <div className="grid min-h-screen bg-ink-50 lg:grid-cols-2">
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12">
        <div className="mx-auto w-full max-w-md animate-fade-up">
          <div className="lg:hidden">
            <Logo />
          </div>

          <h1 className="mt-8 text-3xl font-bold tracking-tight text-ink-950 lg:mt-0">
            {step === "credentials"
              ? "Welcome back"
              : "Verify it's you"}
          </h1>
          <p className="mt-3 text-sm text-ink-600">
            {step === "credentials"
              ? "Log in to your account to continue banking."
              : "Enter the 6-digit code from your authenticator app."}
          </p>

          <Card className="mt-8 border-ink-100 shadow-card">
            <CardBody>
              {step === "credentials" ? (
                <form
                  className="space-y-5"
                  onSubmit={credentialsForm.handleSubmit(onCredentials)}
                  noValidate
                >
                  <Input
                    label="Email address"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    error={credentialsForm.formState.errors.email?.message}
                    {...credentialsForm.register("email")}
                  />
                  <Input
                    label="Password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    error={credentialsForm.formState.errors.password?.message}
                    {...credentialsForm.register("password")}
                  />

                  {error && (
                    <p
                      role="alert"
                      className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-3.5 py-2.5 text-sm text-negative-600 animate-fade-in"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 shrink-0"
                        aria-hidden="true"
                      >
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 8v4M12 16h.01" />
                      </svg>
                      {error}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-sm">
                    <label className="inline-flex items-center gap-2 text-ink-600">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-ink-300 text-brand-600 focus:ring-brand-500"
                      />
                      Remember this device
                    </label>
                    <Link
                      to="/support"
                      className="font-medium text-brand-700 hover:text-brand-800"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={credentialsForm.formState.isSubmitting}
                  >
                    Log in securely
                  </Button>
                </form>
              ) : (
                <form
                  className="space-y-5"
                  onSubmit={otpForm.handleSubmit(onOtp)}
                  noValidate
                >
                  <div className="rounded-xl border border-brand-100 bg-brand-50/70 px-4 py-3 text-sm text-brand-800">
                    For this demo, the code is{" "}
                    <strong className="font-display">123456</strong>.
                  </div>
                  <Input
                    label="One-time code"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    placeholder="••••••"
                    className="text-center text-xl font-semibold tracking-[0.5em]"
                    error={otpForm.formState.errors.code?.message}
                    {...otpForm.register("code")}
                  />

                  {error && (
                    <p
                      role="alert"
                      className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-3.5 py-2.5 text-sm text-negative-600 animate-fade-in"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 shrink-0"
                        aria-hidden="true"
                      >
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 8v4M12 16h.01" />
                      </svg>
                      {error}
                    </p>
                  )}

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={otpForm.formState.isSubmitting}
                  >
                    Verify and continue
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full"
                    onClick={backToCredentials}
                  >
                    Back to login
                  </Button>
                </form>
              )}
            </CardBody>
          </Card>

          <p className="mt-6 text-center text-sm text-ink-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-brand-700 hover:text-brand-800"
            >
              Open one now
            </Link>
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 font-medium text-positive-700 ring-1 ring-emerald-100">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-3.5 w-3.5"
                aria-hidden="true"
              >
                <path d="M12 3 4 6v5c0 4.5 3.4 8.3 8 10 4.6-1.7 8-5.5 8-10V6l-8-3Z" />
              </svg>
              256-bit encrypted session
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-ink-100 px-3 py-1.5 font-medium text-ink-600">
              Demo: {demoUser.email}
            </span>
          </div>
        </div>
      </div>

      <div className="relative hidden overflow-hidden bg-gradient-to-br from-brand-950 via-brand-800 to-brand-600 lg:block">
        <div
          aria-hidden="true"
          className="absolute -right-20 top-10 h-80 w-80 rounded-full bg-brand-500/30 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute -left-16 bottom-24 h-72 w-72 rounded-full bg-accent-500/20 blur-3xl"
        />
        <div className="relative flex h-full flex-col justify-center px-16 text-white">
          <Logo tone="light" />
          <h2 className="mt-10 max-w-md text-4xl font-bold leading-tight tracking-tight">
            Your money, protected around the clock.
          </h2>
          <ul className="mt-8 space-y-4 text-white/85">
            {securityFeatures.map((item) => (
              <li key={item} className="flex items-center gap-3 text-[15px]">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/25">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-3.5 w-3.5"
                    aria-hidden="true"
                  >
                    <path d="m5 12 5 5 9-10" />
                  </svg>
                </span>
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-12 max-w-sm animate-float rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/70">Protection status</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/20 px-2.5 py-1 text-xs font-semibold text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Secure
              </span>
            </div>
            <div className="mt-4 space-y-2.5">
              {[
                { label: "Fraud monitoring", value: "Active" },
                { label: "Card protection", value: "All cards" },
                { label: "Device trust", value: "Verified" },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between rounded-lg bg-white/10 px-3.5 py-2.5 text-sm"
                >
                  <span className="text-white/75">{row.label}</span>
                  <span className="font-semibold">{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}