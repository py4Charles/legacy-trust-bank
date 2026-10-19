import { useEffect, useRef, useState } from "react";
import "./about/about.css";
import type { DocumentId } from "./about/documents";
import {
  IconArrow,
  IconConnect,
  IconDiagonal,
  IconHeart,
  IconMail,
  IconPhone,
  IconShield,
} from "./about/icons";
import { LegacyInsights } from "./about/LegacyInsights";
import { PhotoSlot } from "./about/PhotoSlot";
import { ExpandedPdfReader } from "./about/PdfReaders";
import { PressRoom } from "./about/PressRoom";

const sectionLinks = [
  { id: "our-story", label: "Our story" },
  { id: "our-people", label: "Our people" },
  { id: "legacy-insights", label: "Legacy Insights" },
  { id: "press-room", label: "Press room" },
];

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function AboutPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const toastTimerRef = useRef<number>();
  const [openDocId, setOpenDocId] = useState<DocumentId | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [toast, setToast] = useState("");

  // Toast messages raised by download failures etc.
  useEffect(() => {
    const handler = (event: Event) => {
      setToast((event as CustomEvent<string>).detail);
      window.clearTimeout(toastTimerRef.current);
      toastTimerRef.current = window.setTimeout(() => setToast(""), 4200);
    };
    window.addEventListener("about:toast", handler);
    return () => {
      window.removeEventListener("about:toast", handler);
      window.clearTimeout(toastTimerRef.current);
    };
  }, []);

  // Smooth in-page navigation that accounts for the sticky site header.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest?.(
        "a[href^='#']",
      ) as HTMLAnchorElement | null;
      if (!anchor || !root.contains(anchor)) return;
      const hash = anchor.getAttribute("href") ?? "";
      const behavior: ScrollBehavior = prefersReducedMotion()
        ? "auto"
        : "smooth";
      if (hash === "#") {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior });
        return;
      }
      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (!target) return;
      event.preventDefault();
      const header = document.querySelector<HTMLElement>("header");
      const offset = (header?.offsetHeight ?? 64) + 20;
      const top =
        target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: Math.max(0, top), behavior });
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    };
    root.addEventListener("click", onClick);
    return () => root.removeEventListener("click", onClick);
  }, []);

  // Fine gold underline plus accessible current-location state for the
  // section navigation.
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const elements = sectionLinks
      .map((link) => document.getElementById(link.id))
      .filter((element): element is HTMLElement => element !== null);
    if (elements.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const active = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!active) return;
        setActiveSection(active.target.id);
      },
      { rootMargin: "-15% 0px -55% 0px", threshold: [0, 0.1, 0.5] },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="about-page" id="top" ref={rootRef}>
      <div className="utility-bar">
        <div className="about-container utility-inner">
          <span>Your Trust, Your Legacy.</span>
          <a href="tel:0302211211">
            <IconPhone className="icon" />
            0302-211-211
          </a>
        </div>
      </div>

      <nav className="about-nav" aria-label="About page navigation">
        <div className="about-container about-nav-inner">
          {sectionLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              data-nav={link.id}
              className={activeSection === link.id ? "active" : undefined}
              aria-current={
                activeSection === link.id ? "location" : undefined
              }
            >
              {link.label}
            </a>
          ))}
          <a className="nav-contact" href="#contact">
            Get in touch
            <IconDiagonal className="icon" />
          </a>
        </div>
      </nav>

      <section
        className="about-container hero"
        aria-labelledby="hero-title"
      >
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="small-line" />
            ABOUT LEGACY TRUST BANK
          </p>
          <h1 id="hero-title">
            A legacy built
            <br />
            on <em>trust.</em>
            <br />
            A future, together.
          </h1>
          <p className="hero-intro">
            Rooted in Ghana since 1923, we bring personal relationships and
            thoughtful innovation together—helping individuals, families and
            businesses build what comes next.
          </p>
          <a href="#our-story" className="button button-navy">
            Discover our story
            <IconArrow className="icon" />
          </a>
        </div>
        <div className="hero-visual">
          <PhotoSlot
            photo="head-office"
            variant="office-photo"
            ariaLabel="Photo placeholder: Legacy Trust Bank head office in Lapaz, Accra"
            label="HEAD OFFICE PHOTOGRAPH"
            sub="Lapaz, Greater Accra"
            note="IMAGE TO BE ADDED"
            crop
            officeLines
          />
          <div className="heritage-badge">
            <span>ESTABLISHED</span>
            <strong>1923</strong>
            <span>A STORY STILL GROWING</span>
          </div>
          <span className="hero-caption">
            Our roots are local. Our ambition is shared.
          </span>
        </div>
      </section>

      <div className="about-container fact-strip" aria-label="At a glance">
        <div>
          <span>OUR HERITAGE</span>
          <strong>Established in 1923</strong>
        </div>
        <div>
          <span>OUR HOME</span>
          <strong>Lapaz, Greater Accra</strong>
        </div>
        <div>
          <span>OUR PROMISE</span>
          <strong>Your Trust, Your Legacy.</strong>
        </div>
      </div>

      <section
        id="our-story"
        className="section about-container story-section"
        aria-labelledby="story-title"
      >
        <div className="section-heading split-heading">
          <div>
            <p className="eyebrow">
              <span className="section-number">01</span>OUR STORY
            </p>
            <h2 id="story-title">
              Strong roots.
              <br />
              <em>New possibilities.</em>
            </h2>
          </div>
          <div className="story-copy">
            <p>
              Legacy Trust Bank was established in 1923 by Mr. Collins Asare,
              together with co-founders Mr. Kenneth Antwi and Dr. Kojo Asare.
              Our headquarters is in Lapaz, in Ghana’s Greater Accra Region.
            </p>
            <p>
              From account opening and transfers to loans and investments, our
              services support the everyday needs and long-term plans of the
              people we serve.
            </p>
            <p>
              Our story continues through closer customer relationships,
              digital innovation and support for the communities around us.
            </p>
          </div>
        </div>
        <div className="values-grid">
          <article className="value-card">
            <IconShield className="value-icon" />
            <span className="mini-label">01 / TRUST</span>
            <h3>Relationships first.</h3>
            <p>
              Personal service and the confidence that comes from being heard.
            </p>
          </article>
          <article className="value-card">
            <IconConnect className="value-icon" />
            <span className="mini-label">02 / INNOVATION</span>
            <h3>Progress with purpose.</h3>
            <p>
              Thoughtful partnerships and simpler tools, shaped by customer
              feedback.
            </p>
          </article>
          <article className="value-card">
            <IconHeart className="value-icon" />
            <span className="mini-label">03 / COMMUNITY</span>
            <h3>Growing together.</h3>
            <p>
              Standing alongside families and businesses when support matters
              most.
            </p>
          </article>
        </div>
      </section>

      <section
        id="our-people"
        className="people-section section"
        aria-labelledby="people-title"
      >
        <div className="about-container">
          <div className="section-heading heading-inline">
            <div>
              <p className="eyebrow">
                <span className="section-number">02</span>FOUNDERS &amp;
                LEADERSHIP
              </p>
              <h2 id="people-title">
                People behind
                <br />
                <em>the promise.</em>
              </h2>
            </div>
            <p className="section-intro">
              A dedicated place for the people who shaped our beginnings and
              guide our next chapter.
            </p>
          </div>
          <div className="people-grid">
            <article className="person-card" data-profile="founder">
              <PhotoSlot
                photo="founder"
                variant="portrait"
                ariaLabel="Portrait placeholder: Founder"
                note="PORTRAIT TO BE ADDED"
                icon="person"
                compact
              />
              <p className="person-role" data-edit="role">
                Founder
              </p>
              <h3 className="placeholder-name" data-edit="name">
                Name to be added
              </h3>
              <p className="placeholder-bio" data-edit="bio">
                Short biography to be added.
              </p>
            </article>
            <article className="person-card" data-profile="cofounder-one">
              <PhotoSlot
                photo="cofounder-one"
                variant="portrait"
                ariaLabel="Portrait placeholder: First co-founder"
                note="PORTRAIT TO BE ADDED"
                icon="person"
                compact
              />
              <p className="person-role" data-edit="role">
                Co-founder
              </p>
              <h3 className="placeholder-name" data-edit="name">
                Name to be added
              </h3>
              <p className="placeholder-bio" data-edit="bio">
                Short biography to be added.
              </p>
            </article>
            <article className="person-card" data-profile="cofounder-two">
              <PhotoSlot
                photo="cofounder-two"
                variant="portrait"
                ariaLabel="Portrait placeholder: Second co-founder"
                note="PORTRAIT TO BE ADDED"
                icon="person"
                compact
              />
              <p className="person-role" data-edit="role">
                Co-founder
              </p>
              <h3 className="placeholder-name" data-edit="name">
                Name to be added
              </h3>
              <p className="placeholder-bio" data-edit="bio">
                Short biography to be added.
              </p>
            </article>
            <article
              className="person-card"
              data-profile="managing-director"
            >
              <PhotoSlot
                photo="managing-director"
                variant="portrait"
                ariaLabel="Portrait placeholder: Managing Director"
                note="PORTRAIT TO BE ADDED"
                icon="person"
                compact
              />
              <p className="person-role" data-edit="role">
                Managing Director
              </p>
              <h3 className="placeholder-name" data-edit="name">
                Name to be added
              </h3>
              <p className="placeholder-bio" data-edit="bio">
                Short biography to be added.
              </p>
            </article>
          </div>
          <p className="draft-note">
            <span className="draft-dot" />
            Profile placeholders — portraits, names and biographies can be
            filled in later.
          </p>
        </div>
      </section>

      <LegacyInsights onOpenDoc={setOpenDocId} />
      <PressRoom onOpenDoc={setOpenDocId} />

      <section
        id="contact"
        className="contact-section"
        aria-labelledby="contact-title"
      >
        <div className="about-container contact-inner">
          <div>
            <p className="eyebrow">LET’S BUILD WHAT’S NEXT</p>
            <h2 id="contact-title">
              Your next chapter
              <br />
              <em>starts with a conversation.</em>
            </h2>
          </div>
          <div className="contact-links">
            <a href="tel:0302211211">
              <IconPhone className="icon" />
              <span>
                <small>CALL OUR TEAM</small>
                0302-211-211
              </span>
              <IconDiagonal className="icon" />
            </a>
            <a href="mailto:LTBANK@gmail.com">
              <IconMail className="icon" />
              <span>
                <small>EMAIL US</small>
                LTBANK@gmail.com
              </span>
              <IconDiagonal className="icon" />
            </a>
          </div>
        </div>
      </section>

      <div className="about-container about-disclosure">
        <span>Legacy Trust Bank · Your Trust, Your Legacy.</span>
        <span>
          About page design preview · Images and profiles are placeholders
        </span>
        <a href="#top" className="back-top">
          Back to top
          <IconDiagonal className="icon" />
        </a>
      </div>

      {openDocId && (
        <ExpandedPdfReader
          key={openDocId}
          docId={openDocId}
          onClose={() => setOpenDocId(null)}
        />
      )}

      <div
        id="about-toast"
        className={toast ? "toast visible" : "toast"}
        role="status"
        aria-live="polite"
      >
        {toast}
      </div>
    </div>
  );
}
