import { Link } from "react-router-dom";
import { Container } from "@/components/ui/Container";
import { Card, CardBody } from "@/components/ui/Card";
import { buttonClass } from "@/components/ui/buttonStyles";
import { PageHero } from "@/components/ui/PageHero";

const tips = [
  {
    title: "Never share your OTP",
    body: "Staff will never ask for your one-time PIN, password or card CVV. Anyone who does is a fraudster.",
  },
  {
    title: "Verify before you pay",
    body: "Always confirm banking details directly with the supplier using a number you already trust — not one in an email.",
  },
  {
    title: "Use strong, unique passwords",
    body: "Combine upper and lower case, numbers and symbols. Reuse across sites is the fastest route to compromise.",
  },
  {
    title: "Enable two-factor authentication",
    body: "Add an extra layer beyond your password. We support SMS and authenticator-app codes.",
  },
  {
    title: "Monitor your notifications",
    body: "Turn on transaction alerts so unusual activity is caught within minutes, not days.",
  },
  {
    title: "Keep devices updated",
    body: "Install operating system and app updates promptly — they close known security gaps.",
  },
];

const fraudSteps = [
  "Freeze your card instantly in the app or call the 24/7 fraud line.",
  "Change your password and one-time PIN from a trusted device.",
  "Review recent transactions and report anything you don't recognise.",
  "Open a fraud case so our team can investigate and recover funds.",
];

export function SecurityPage() {
  return (
    <>
      <PageHero
        eyebrow="Security Centre"
        title="Protecting your money, every step"
        description="Learn how we secure your accounts and what you can do to stay safe online."
        actions={
          <Link to="/support" className={buttonClass("primary", "lg")}>
            Report fraud
          </Link>
        }
      />

      <Container className="py-12">
        <section>
          <h2 className="text-xl font-semibold">How we protect you</h2>
          <div className="mt-5 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "End-to-end encryption",
                body: "All data in transit and at rest is protected with 256-bit encryption.",
              },
              {
                title: "Fraud monitoring",
                body: "Machine-learning models score every transaction in real time and flag anomalies.",
              },
              {
                title: "Granular access control",
                body: "Role-based permissions and dual authorisation keep business accounts safe.",
              },
            ].map((item) => (
              <Card key={item.title}>
                <CardBody>
                  <h3 className="text-base font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm text-ink-600">{item.body}</p>
                </CardBody>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-xl font-semibold">Stay safe online</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tips.map((tip) => (
              <div
                key={tip.title}
                className="rounded-xl border border-ink-200 bg-white p-5"
              >
                <h3 className="text-sm font-semibold text-ink-900">
                  {tip.title}
                </h3>
                <p className="mt-2 text-sm text-ink-600">{tip.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <div className="rounded-xl border border-negative-600/30 bg-red-50 p-5 md:p-6">
            <div className="md:flex md:items-start md:justify-between md:gap-8">
              <div>
                <h2 className="text-xl font-semibold text-negative-600">
                  Think you've been a victim of fraud?
                </h2>
                <p className="mt-2 max-w-xl text-sm text-ink-700">
                  Act fast. Freeze your accounts and follow these steps
                  immediately, then contact our fraud team.
                </p>
                <ol className="mt-4 max-w-xl space-y-2 text-sm text-ink-700">
                  {fraudSteps.map((step, index) => (
                    <li key={step} className="flex items-start gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-negative-600 text-xs font-bold text-white">
                        {index + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
              <div className="mt-6 shrink-0 rounded-lg bg-white p-4 md:mt-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">
                  24/7 Fraud line
                </p>
                <p className="mt-1 text-lg font-bold text-ink-900">
                  0800 222 333
                </p>
                <Link
                  to="/support"
                  className={buttonClass("danger", "sm", "mt-3 w-full")}
                >
                  Open a fraud case
                </Link>
              </div>
            </div>
          </div>
        </section>
      </Container>
    </>
  );
}
