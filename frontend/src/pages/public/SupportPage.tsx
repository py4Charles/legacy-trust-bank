import { Link } from "react-router-dom";
import { Container } from "@/components/ui/Container";
import { Card, CardBody } from "@/components/ui/Card";
import { buttonClass } from "@/components/ui/buttonStyles";
import { PageHero } from "@/components/ui/PageHero";

const faqs = [
  {
    question: "How do I open a new account?",
    answer:
      "Select a product, click Apply Now and complete the online application. You'll need a valid ID, proof of address and, for some products, proof of income.",
  },
  {
    question: "How long does a transfer take?",
    answer:
      "Transfers between Legacy Trust accounts are instant. Payments to other banks are processed within the same business day if submitted before the cut-off time.",
  },
  {
    question: "What are my daily transaction limits?",
    answer:
      "Limits depend on your account and device. You can view and adjust your limits under Cards and Settings once you're logged in.",
  },
  {
    question: "How do I report a lost or stolen card?",
    answer:
      "Log in, go to Cards, and freeze the card immediately. Then call our 24/7 fraud line to order a replacement.",
  },
  {
    question: "Is my money protected?",
    answer:
      "Yes. Deposits are protected by the deposit insurance scheme up to the statutory limit, and every account is protected by bank-grade encryption.",
  },
];

const contactChannels = [
  {
    title: "Call centre",
    detail: "0860 000 111",
    note: "Mon–Fri 07:00–21:00, Sat 08:00–17:00",
  },
  {
    title: "24/7 Fraud line",
    detail: "0800 222 333",
    note: "Available 24 hours a day, every day",
  },
  {
    title: "Email",
    detail: "help@legacytrust.example",
    note: "We respond within one business day",
  },
];

const resources = [
  { label: "Account opening forms", to: "/products/accounts" },
  { label: "Rates & fees schedule", to: "/products/accounts" },
  { label: "Branch & ATM locator", to: "/support" },
  { label: "Security centre", to: "/security" },
];

export function SupportPage() {
  return (
    <>
      <PageHero
        eyebrow="Support"
        title="How can we help?"
        description="Answers to common questions, contact options and downloadable forms."
        actions={
          <a href="#contact" className={buttonClass("primary", "lg")}>
            Contact us
          </a>
        }
      />

      <Container className="grid gap-10 py-12 lg:grid-cols-[1.6fr_1fr]">
        <section>
          <h2 className="text-xl font-semibold">Frequently asked questions</h2>
          <div className="mt-5 divide-y divide-ink-100 rounded-xl border border-ink-200 bg-white">
            {faqs.map((faq) => (
              <details key={faq.question} className="group px-5 py-4">
                <summary className="flex cursor-pointer items-center justify-between gap-4 text-sm font-semibold text-ink-900 marker:content-none">
                  {faq.question}
                  <span
                    className="text-ink-400 transition-transform group-open:rotate-45"
                    aria-hidden="true"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm text-ink-600">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <aside className="space-y-6">
          <Card id="contact">
            <CardBody>
              <h2 className="text-base font-semibold">Contact channels</h2>
              <ul className="mt-4 space-y-4">
                {contactChannels.map((channel) => (
                  <li key={channel.title}>
                    <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">
                      {channel.title}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-ink-900">
                      {channel.detail}
                    </p>
                    <p className="text-xs text-ink-500">{channel.note}</p>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <h2 className="text-base font-semibold">Resources</h2>
              <ul className="mt-4 space-y-2">
                {resources.map((resource) => (
                  <li key={resource.label}>
                    <Link
                      to={resource.to}
                      className="flex items-center justify-between rounded-lg border border-ink-100 px-3 py-2.5 text-sm text-ink-700 transition-colors hover:border-brand-300 hover:bg-brand-50"
                    >
                      {resource.label}
                      <span aria-hidden="true">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        </aside>
      </Container>
    </>
  );
}
