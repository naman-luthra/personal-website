"use client";

import { Localized } from "./Locale";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Icon } from "./Icon";
import { contact, projects } from "./data";
import Contact from "./Contact";
import Hero from "./Hero";
import HilbertPreview from "./HilbertPreview";
import ImpactSection from "./ImpactSection";
import Journey from "./Journey";
import SiteNav from "./SiteNav";
import SmallProjects from "./SmallProjects";
import { usePortfolioMotion } from "./usePortfolioMotion";

function ExternalLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Localized>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {children}
        <Icon name="arrow" />
      </a>
    </Localized>
  );
}

function SectionLabel({
  number,
  children,
}: {
  number: string;
  children: ReactNode;
}) {
  return (
    <Localized>
      <div className="section-label">
        <span className="section-number">{number}</span>
        <span>{children}</span>
      </div>
    </Localized>
  );
}

function VideoPreview() {
  return (
    <Localized>
      <div className="project-mockup call-window" aria-hidden="true">
        <div className="mockup-topbar">
          <span className="window-dots">
            <i />
            <i />
            <i />
          </span>
          <span>room / good-company</span>
          <span className="secure-call">● ENCRYPTED</span>
        </div>
        <div className="call-heading">
          <span>Better, together.</span>
          <span>
            04 connected <i className="status-dot" />
          </span>
        </div>
        <div className="call-grid">
          {[
            { initials: "NL", label: "You", color: "sage" },
            { initials: "AS", label: "Aarav", color: "lilac" },
            { initials: "MK", label: "Maya", color: "peach" },
            { initials: "RK", label: "Riya", color: "blue" },
          ].map((person) => (
            <div className={`call-tile ${person.color}`} key={person.initials}>
              <div className="person-avatar">{person.initials}</div>
              <span>{person.label}</span>
              <div className="audio-wave">
                <i />
                <i />
                <i />
                <i />
              </div>
            </div>
          ))}
        </div>
        <div className="call-controls">
          <span>
            <Icon name="mic" />
          </span>
          <span>
            <Icon name="video" />
          </span>
          <span>
            <Icon name="screen" />
          </span>
          <span className="end-call">
            <Icon name="phone" />
          </span>
        </div>
        <div className="floating-label call-label">
          <span className="status-dot" /> DIRECT CONNECTION<span>↗</span>
        </div>
      </div>
    </Localized>
  );
}

function FitnessPreview() {
  return (
    <Localized>
      <div className="project-mockup fitness-window" aria-hidden="true">
        <div className="fitness-sidebar">
          <span className="fitness-mark">
            m<span>.</span>
          </span>
          <span className="sidebar-icon active">⌂</span>
          <span className="sidebar-icon">◷</span>
          <span className="sidebar-icon">♡</span>
          <span className="sidebar-icon">⊞</span>
          <span className="sidebar-bottom">N</span>
        </div>
        <div className="fitness-body">
          <div className="fitness-top">
            <span>YOUR DAILY DOSE OF BETTER</span>
            <span>✦</span>
          </div>
          <h4>
            Hey Naman,
            <br />
            let’s find your fit.
          </h4>
          <div className="fitness-cards">
            <div className="fitness-ring">
              <svg viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="48" />
                <circle className="ring-progress" cx="60" cy="60" r="48" />
              </svg>
              <div>
                <strong>
                  78<span>%</span>
                </strong>
                <small>Daily goal</small>
              </div>
            </div>
            <div className="fitness-stat">
              <span>MOVE A LITTLE MORE</span>
              <strong>6,240</strong>
              <small>steps in the right direction ↗</small>
              <div className="mini-bars">
                {[25, 42, 34, 60, 44, 74, 92, 70, 100, 85, 115, 105].map(
                  (height, i) => (
                    <i key={i} style={{ height: `${height / 2}px` }} />
                  ),
                )}
              </div>
            </div>
          </div>
          <div className="fitness-plan">
            <span className="plan-symbol">✦</span>
            <div>
              <b>A plan that gets you.</b>
              <small>Meals & movement, personalized with AI.</small>
            </div>
            <span>↗</span>
          </div>
        </div>
        <div className="floating-label fitness-label">
          <span>✦</span> A LITTLE AI. A HEALTHIER YOU.
        </div>
      </div>
    </Localized>
  );
}

export default function Portfolio() {
  const root = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLDivElement>(null);
  const copyTimeout = useRef<ReturnType<typeof setTimeout>>();
  const [motion, setMotion] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">(
    "idle",
  );
  const [localTime, setLocalTime] = useState("IST / UTC +5:30");
  usePortfolioMotion(root, motion);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const readPreference = () => {
      try {
        const stored = localStorage.getItem("naman-motion");
        setMotion(!preference.matches && stored !== "off");
      } catch {
        setMotion(!preference.matches);
      }
    };
    readPreference();
    preference.addEventListener("change", readPreference);
    const updateTime = () =>
      setLocalTime(
        `${new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date())} IST`,
      );
    updateTime();
    const timer = setInterval(updateTime, 60_000);
    const updateProgress = () => {
      const available =
        document.documentElement.scrollHeight - window.innerHeight;
      if (progress.current)
        progress.current.style.transform = `scaleX(${available > 0 ? window.scrollY / available : 0})`;
    };
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    updateProgress();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-10% 0px -65% 0px" },
    );
    root.current
      ?.querySelectorAll("main > section[id]")
      .forEach((element) => observer.observe(element));
    return () => {
      preference.removeEventListener("change", readPreference);
      clearInterval(timer);
      clearTimeout(copyTimeout.current);
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.motion = motion ? "on" : "off";
    return () => {
      delete document.documentElement.dataset.motion;
    };
  }, [motion]);

  const toggleMotion = () => {
    const next = !motion;
    setMotion(next);
    try {
      localStorage.setItem("naman-motion", next ? "on" : "off");
    } catch {
      /* Motion works without storage. */
    }
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contact.email);
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
    clearTimeout(copyTimeout.current);
    copyTimeout.current = setTimeout(() => setCopyState("idle"), 3500);
  };

  return (
    <Localized>
      <div ref={root} className="portfolio" data-motion={motion ? "on" : "off"}>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <div className="scroll-progress" ref={progress} aria-hidden="true" />
        <SiteNav activeSection={activeSection} />

        <main id="main">
          <Hero
            motion={motion}
            toggleMotion={toggleMotion}
            localTime={localTime}
          />

          <ImpactSection />
          <Journey />

          <section id="projects" className="projects-section section-shell">
            <div className="section-heading" data-reveal>
              <SectionLabel number="03">BUILT OUT OF CURIOSITY</SectionLabel>
              <h2>
                Ideas are good.
                <br />
                <span className="muted">Making is better.</span>
              </h2>
              <ExternalLink href={contact.github} className="text-link">
                More on GitHub
              </ExternalLink>
            </div>
            <div className="project-list">
              {projects.map((project, index) => (
                <article
                  className={`project-row project-${index + 1}`}
                  key={project.number}
                  id={index === 2 ? "hilbert-r-tree" : undefined}
                >
                  <div
                    className="project-stage"
                    lang="en"
                    translate="no"
                    role="img"
                    aria-label={`Illustrative interface concept for ${project.name}`}
                  >
                    <div className="stage-grid" />
                    <span className="stage-label eyebrow">
                      EXPERIMENT {project.number} /{" "}
                      {["CONNECTION", "WELLBEING", "SPATIAL INDEXING"][index]}
                    </span>
                    {index === 0 ? (
                      <VideoPreview />
                    ) : index === 1 ? (
                      <FitnessPreview />
                    ) : (
                      <HilbertPreview />
                    )}
                    <span className="stage-caption eyebrow">
                      {
                        [
                          "LESS DISTANCE. MORE HUMAN.",
                          "SMALL STEPS. BETTER DAYS.",
                          "A LITTLE ORDER IN EVERY DIMENSION.",
                        ][index]
                      }
                    </span>
                    <span className="stage-cross">+</span>
                  </div>
                  <div className="project-info" data-reveal>
                    <span className="eyebrow project-type">{project.type}</span>
                    <h3>{project.title}</h3>
                    <p className="project-name">{project.name}</p>
                    <p className="project-description">{project.description}</p>
                    <div className="tags">
                      {project.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                    <div className="project-links">
                      {project.links.map((link) => (
                        <ExternalLink
                          key={link.href}
                          href={link.href}
                          className="text-link"
                        >
                          {link.label}
                        </ExternalLink>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <SmallProjects />
          </section>
          <Contact copyEmail={copyEmail} copyState={copyState} />
        </main>

        <footer className="site-footer section-shell">
          <div className="footer-top">
            <a href="#home" className="wordmark" aria-label="Back to top">
              Naman Luthra
            </a>
            <p>Software engineer at Rubrik, based in Bengaluru.</p>
            <div className="footer-links">
              <ExternalLink href={contact.github}>GitHub</ExternalLink>
              <ExternalLink href={contact.linkedin}>LinkedIn</ExternalLink>
              <a href={`tel:${contact.phone}`}>
                Say hello <Icon name="arrow" />
              </a>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} NAMAN LUTHRA</span>
            <span>
              BASED IN BENGALURU <span className="time-dot">·</span> {localTime}
            </span>
            <a href="#home">
              BACK TO TOP <Icon name="arrow" />
            </a>
          </div>
        </footer>
      </div>
    </Localized>
  );
}
