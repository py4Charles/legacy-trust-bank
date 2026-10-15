import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Container } from "@/components/ui/Container";
import { bannerMessages } from "@/data/mock";
import { cn } from "@/lib/utils";
import type { BannerTone } from "@/types";

const ROTATE_MS = 6000;

const toneStyles: Record<BannerTone, string> = {
  promotion:
    "bg-gradient-to-r from-brand-700 via-brand-600 to-brand-500 text-white",
  update: "bg-ink-900 text-white",
  alert: "bg-accent-500 text-ink-950",
};

const toneIcons: Record<BannerTone, ReactNode> = {
  promotion: (
    <>
      <path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0l-7.2-7.2A2 2 0 0 1 2.8 12V5a2 2 0 0 1 2-2h7a2 2 0 0 1 1.4.6l7.4 7.4a2 2 0 0 1 0 2.8Z" />
      <circle cx="7.5" cy="7.5" r="1.2" />
    </>
  ),
  update: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </>
  ),
  alert: (
    <>
      <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.7 21a2 2 0 0 1-3.4 0" />
    </>
  ),
};

export function AnnouncementBanner() {
  const [dismissed, setDismissed] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (dismissed || bannerMessages.length < 2) return;
    const timer = window.setTimeout(
      () => setIndex((current) => (current + 1) % bannerMessages.length),
      ROTATE_MS,
    );
    return () => window.clearTimeout(timer);
  }, [dismissed, index]);

  if (dismissed || bannerMessages.length === 0) return null;

  const message = bannerMessages[index] ?? bannerMessages[0];

  return (
    <div
      role="region"
      aria-label="Announcements"
      className={cn("relative border-b border-black/5", toneStyles[message.tone])}
    >
      <Container className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 py-2.5">
        <span aria-hidden="true" />

        <p
          className="flex items-center justify-center gap-2 text-center text-sm"
          aria-live="polite"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="hidden h-4 w-4 shrink-0 sm:block"
            aria-hidden="true"
          >
            {toneIcons[message.tone]}
          </svg>
          <span className="font-medium">{message.message}</span>
          {message.link ? (
            <Link
              to={message.link.to}
              className="font-semibold underline decoration-current/40 underline-offset-2 transition-opacity hover:opacity-80"
            >
              {message.link.label}
            </Link>
          ) : null}
        </p>

        <div className="flex items-center justify-end gap-3">
          {bannerMessages.length > 1 ? (
            <div className="hidden items-center gap-1.5 sm:flex">
              {bannerMessages.map((item, i) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Show announcement ${i + 1} of ${bannerMessages.length}`}
                  aria-current={i === index}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    i === index
                      ? "w-5 bg-current opacity-90"
                      : "w-1.5 bg-current opacity-40 hover:opacity-70",
                  )}
                />
              ))}
            </div>
          ) : null}

          <button
            type="button"
            onClick={() => setDismissed(true)}
            aria-label="Dismiss announcements"
            className="inline-flex h-6 w-6 items-center justify-center rounded-md transition-opacity hover:opacity-80"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="h-3.5 w-3.5"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M6 18 18 6" />
            </svg>
          </button>
        </div>
      </Container>
    </div>
  );
}
