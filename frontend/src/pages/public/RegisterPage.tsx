import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Container } from "@/components/ui/Container";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { buttonClass } from "@/components/ui/buttonStyles";
import { productCategories } from "@/data/mock";

const registerSchema = z.object({
  fullName: z
    .string()
    .min(2, "Please enter your full name")
    .max(120, "That name is too long"),
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  phone: z
    .string()
    .regex(/^0\d{9}$/, "Enter a valid 10-digit SA mobile number"),
  idNumber: z
    .string()
    .regex(/^\d{13}$/, "Enter your 13-digit SA ID number"),
  product: z.enum(
    ["accounts", "savings", "loans", "cards"],
    { message: "Choose a product to apply for" },
  ),
});

type RegisterForm = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const [submitted, setSubmitted] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { product: "accounts" },
  });

  const onSubmit = async (values: RegisterForm) => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    setSubmitted(values.fullName);
  };

  if (submitted) {
    return (
      <Container className="max-w-xl py-20">
        <Card>
          <CardBody className="text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-positive-600">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-7 w-7"
                aria-hidden="true"
              >
                <path d="m5 13 4 4L19 7" />
              </svg>
            </span>
            <h1 className="mt-5 text-2xl font-bold">
              Thanks, {submitted.split(" ")[0]}!
            </h1>
            <p className="mt-3 text-sm text-ink-600">
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
        <h1 className="text-3xl font-bold tracking-tight">Open an account</h1>
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
                  placeholder="0821234567"
                  error={errors.phone?.message}
                  {...register("phone")}
                />
                <Input
                  label="SA ID number"
                  inputMode="numeric"
                  placeholder="9001015800087"
                  error={errors.idNumber?.message}
                  {...register("idNumber")}
                />
              </div>

              <div>
                <label
                  htmlFor="product"
                  className="mb-1.5 block text-sm font-medium text-ink-800"
                >
                  Product to apply for
                </label>
                <select
                  id="product"
                  className="h-11 w-full rounded-lg border border-ink-300 bg-white px-3 text-sm text-ink-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                  {...register("product")}
                >
                  {productCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.label}
                    </option>
                  ))}
                </select>
                {errors.product && (
                  <p className="mt-1.5 text-sm text-negative-600">
                    {errors.product.message}
                  </p>
                )}
              </div>

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
