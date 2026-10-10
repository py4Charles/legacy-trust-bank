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
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12">
        <div className="mx-auto w-full max-w-md">
          <div className="lg:hidden">
            <Logo />
          </div>

          <h1 className="mt-8 text-3xl font-bold tracking-tight lg:mt-0">
            {step === "credentials" ? "Log in to your account" : "Verify it's you"}
          </h1>
          <p className="mt-3 text-sm text-ink-600">
            {step === "credentials"
              ? "Secure access to your personal and business banking."
              : "We've sent a 6-digit code to your registered mobile number."}
          </p>

          <Card className="mt-8">
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
                      className="rounded-lg bg-red-50 px-3 py-2 text-sm text-negative-600"
                    >
                      {error}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-sm">
                    <label className="inline-flex items-center gap-2 text-ink-600">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-ink-300 text-brand-600"
                      />
                      Remember this device
                    </label>
                    <Link to="/support" className="font-medium text-brand-700">
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
                  <Input
                    label="One-time code"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    placeholder="123456"
                    className="text-center text-lg tracking-[0.5em]"
                    error={otpForm.formState.errors.code?.message}
                    {...otpForm.register("code")}
                  />

                  {error && (
                    <p
                      role="alert"
                      className="rounded-lg bg-red-50 px-3 py-2 text-sm text-negative-600"
                    >
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
            <Link to="/register" className="font-semibold text-brand-700">
              Open one now
            </Link>
          </p>

          <div className="mt-8 rounded-lg border border-dashed border-ink-300 bg-white p-4 text-xs text-ink-500">
            <p className="font-semibold text-ink-700">Demo credentials</p>
            <p className="mt-1">Email: {demoUser.email}</p>
            <p>Password: {demoUser.password}</p>
            <p>One-time code: 123456</p>
          </div>
        </div>
      </div>

      <div className="relative hidden overflow-hidden bg-gradient-to-br from-brand-950 via-brand-800 to-brand-600 lg:block">
        <div className="absolute -right-20 top-10 h-80 w-80 rounded-full bg-brand-500/30 blur-3xl" />
        <div className="flex h-full flex-col justify-center px-16 text-white">
          <Logo tone="light" />
          <h2 className="mt-10 max-w-md text-3xl font-bold leading-tight">
            Your money, protected around the clock.
          </h2>
          <ul className="mt-8 space-y-4 text-white/80">
            {[
              "Two-factor authentication on every login",
              "Real-time fraud monitoring",
              "Instant card freeze from your dashboard",
              "Dual authorisation for business payments",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15">
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
