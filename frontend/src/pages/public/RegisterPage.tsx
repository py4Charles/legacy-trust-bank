import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Container } from "@/components/ui/Container";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { buttonClass } from "@/components/ui/buttonStyles";
import { productCategories } from "@/data/mock";
import { authApi } from "@/api";

const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(2, "Please enter your full name")
      .max(120, "That name is too long"),
    email: z.string().min(1, "Email is required").email("Enter a valid email"),
    phone: z
      .string()
      .regex(/^0\d{9}$/, "Enter a valid 10-digit mobile number"),
    idNumber: z
      .string()
      .regex(/^\d{13}$/, "Enter your 13-digit GH ID number"),
    password: z
      .string()
      .min(8, "Use at least 8 characters")
      .max(128, "That password is too long"),
    confirm: z.string().min(1, "Confirm your password"),
    product: z.enum(
      ["accounts", "savings", "loans", "cards"],
      { message: "Choose a product to apply for" },
    ),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const [submitted, setSubmitted] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { product: "accounts" },
  });

  const onSubmit = async (values: RegisterForm) => {
    setError(null);
    try {
      await authApi.register({
        fullName: values.fullName,
        email: values.email,
        password: values.password,
        phone: values.phone,
        idNumber: values.idNumber,
      });
      setSubmitted(values.fullName);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "We couldn't submit your application. Please try again.",
      );
    }
  };

  if (submitted) {
    return (
      <Container className="max-w-xl py-20">
        <Card className="animate-fade-up">
          <CardBody className="text-center">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-positive-700 text-white shadow-lg shadow-emerald-500/30">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-8 w-8"
                aria-hidden="true"
              >
                <path d="m5 13 4 4L19 7" />
              </svg>
            </span>
            <h1 className="mt-5 text-2xl font-bold text-ink-950">
              Thanks, {submitted.split(" ")[0]}!
            </h1>
            <p className="mt-3 text-ink-600">
              Your application is in. We'll email you within one business day
              with the next steps to verify your identity.
            </p>
            <Link to="/" className={buttonClass("primary", "md", "mt-6")}>
              Back to home
            </Link>
          </CardBody>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="py-14">
      <div className="mx-auto max-w-xl">
        <p className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-brand-700 ring-1 ring-brand-100">
          Apply online
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-ink-950">
          Open an account
        </h1>
        <p className="mt-3 text-ink-600">
          Start your application online. It takes about 5 minutes.
        </p>

        <Card className="mt-8">
          <CardBody>
            <form
              className="space-y-5"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
            >
              <Input
                label="Full name"
                autoComplete="name"
                placeholder="Thandi Mokoena"
                error={errors.fullName?.message}
                {...register("fullName")}
              />
              <Input
                label="Email address"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                error={errors.email?.message}
                {...register("email")}
              />
              <div className="grid gap-5 sm:grid-cols-2">
                <Input
                  label="Mobile number"
                  inputMode="numeric"
                  placeholder="+233 21 235 6978"
                  error={errors.phone?.message}
                  {...register("phone")}
                />
                <Input
                  label="GH ID number"
                  inputMode="numeric"
                  placeholder="9001015800087"
                  error={errors.idNumber?.message}
                  {...register("idNumber")}
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Input
                  label="Password"
                  type="password"
                  autoComplete="new-password"
                  hint="Min 8 characters."
                  error={errors.password?.message}
                  {...register("password")}
                />
                <Input
                  label="Confirm password"
                  type="password"
                  autoComplete="new-password"
                  error={errors.confirm?.message}
                  {...register("confirm")}
                />
              </div>

              <Select
                label="Product to apply for"
                error={errors.product?.message}
                {...register("product")}
              >
                {productCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.label}
                  </option>
                ))}
              </Select>

              {error && (
                <p
                  role="alert"
                  className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-negative-600"
                >
                  {error}
                </p>
              )}

              <p className="text-xs text-ink-500">
                By continuing you agree to our terms of use and privacy policy.
                We'll verify your identity before your account is activated.
              </p>

              <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Submitting…" : "Submit application"}
              </Button>
            </form>
          </CardBody>
        </Card>

        <p className="mt-6 text-center text-sm text-ink-600">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-brand-700">
            Log in
          </Link>
        </p>
      </div>
    </Container>
  );
}
