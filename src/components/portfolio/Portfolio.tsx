"use client";

import { Localized, LanguageSwitcher } from "./Locale";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Asterisk, Icon } from "./Icon";
import { contact, experience, projects } from "./data";
import ImpactSection from "./ImpactSection";
import HilbertPreview from "./HilbertPreview";
import SmallProjects from "./SmallProjects";
import Monogram from "./Monogram";
import TechStack from "./TechStack";
import { usePortfolioMotion } from "./usePortfolioMotion";

const navigation = [
  { id: "work", label: "Work" },
  { id: "journey", label: "Experience" },
  { id: "projects", label: "Projects" },
];

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
  const menuButton = useRef<HTMLButtonElement>(null);
  const copyTimeout = useRef<ReturnType<typeof setTimeout>>();
  const [motion, setMotion] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
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

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButton.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

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
        <header className="site-header">
          <a
            href="#home"
            className="header-monogram"
            aria-label="Naman Luthra, home"
          >
            <Monogram />
          </a>
          <nav
            aria-label="Main navigation"
            id="main-navigation"
            className={menuOpen ? "main-nav is-open" : "main-nav"}
          >
            {navigation.map((item) => (
              <a
                href={`#${item.id}`}
                key={item.id}
                aria-current={
                  activeSection === item.id ? "location" : undefined
                }
                onClick={() => setMenuOpen(false)}
              >
                <span className="nav-dot" />
                {item.label}
              </a>
            ))}
            <a
              href="#contact"
              className="nav-contact"
              onClick={() => setMenuOpen(false)}
            >
              Let’s talk <Icon name="arrow" />
            </a>
          </nav>
          <LanguageSwitcher />
          <button
            className="menu-toggle"
            ref={menuButton}
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
            aria-controls="main-navigation"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Icon name={menuOpen ? "close" : "menu"} />
          </button>
        </header>

        <main id="main">
          <section
            className="introduction section-shell"
            id="home"
            aria-labelledby="hero-heading"
          >
            <div className="intro-layout">
              <div className="intro-copy">
                <span className="eyebrow intro-kicker">A LITTLE ABOUT ME</span>
                <h1 id="hero-heading">
                  Hi, I’m Naman<span>.</span>
                </h1>
                <p className="intro-lead">
                  A software engineer who likes understanding how things
                  work—and making them work a little better.
                </p>
                <p>
                  I work on UI infrastructure at Rubrik: build systems,
                  developer tooling, and the foundations other engineers build
                  on. Before that, I worked on applied AI at Whatfix. I studied
                  Computer Science at BITS Pilani.
                </p>
                <div className="intro-links">
                  <a className="button button-accent" href="#work">
                    Some things I’ve worked on <Icon name="down" />
                  </a>
                  <ExternalLink
                    href={contact.github}
                    className="text-link social-link"
                  >
                    <Icon name="github" /> GitHub
                  </ExternalLink>
                  <ExternalLink
                    href={contact.linkedin}
                    className="text-link social-link"
                  >
                    <Icon name="linkedin" /> LinkedIn
                  </ExternalLink>
                </div>
              </div>
              <div className="intro-portrait">
                <div className="intro-photo">
                  <Image
                    src="/profilePicFull.jpg"
                    alt="Naman Luthra"
                    fill
                    priority
                    sizes="(max-width: 760px) 75vw, 360px"
                  />
                </div>
                <div className="intro-photo-note">
                  <span>Nice to meet you.</span>
                </div>
                <TechStack enabled={motion} />
              </div>
            </div>
            <div className="intro-highlights">
              <a href="#journey">
                <span className="eyebrow">NOW / RUBRIK</span>
                <h2>Infrastructure & developer experience</h2>
                <p>Software Engineer, G6 · UI Platform</p>
              </a>
              <a href="#intelligence">
                <span className="eyebrow">BEFORE / WHATFIX</span>
                <h2>Applied AI & product engineering</h2>
                <p>Retrieval, enterprise search, and the web</p>
              </a>
              <a href="#education">
                <span className="eyebrow">FOUNDATIONS / BITS PILANI</span>
                <h2>Computer Science, class of 2024</h2>
                <p>Ranked first in Data Structures & Algorithms</p>
              </a>
            </div>
            <div className="intro-bottom">
              <a href="#work">
                A selection of my work below <Icon name="down" />
              </a>
              <button
                className="motion-toggle"
                aria-pressed={motion}
                onClick={toggleMotion}
              >
                <Icon name={motion ? "pause" : "play"} />
                <span>{motion ? "Motion on" : "Motion off"}</span>
              </button>
            </div>
          </section>

          <ImpactSection />

          <section id="journey" className="journey-section section-shell">
            <div className="section-heading" data-reveal>
              <SectionLabel number="02">THE JOURNEY SO FAR</SectionLabel>
              <h2>
                Always learning.
                <br />
                <span className="muted">Always building.</span>
              </h2>
              <p>
                A few good teams.
                <br />A lot of interesting problems.
              </p>
            </div>
            <div className="experience-list">
              {experience.map((job, index) => (
                <details
                  className="experience-item"
                  key={`${job.company}-${job.role}`}
                  open={index === 0 ? true : undefined}
                  data-reveal
                >
                  <summary>
                    <span className="experience-date eyebrow">
                      {job.date}
                      {job.current && (
                        <span className="current-badge">
                          <i className="status-dot" /> CURRENT
                        </span>
                      )}
                    </span>
                    <span className="experience-company">{job.company}</span>
                    <span className="experience-role">{job.role}</span>
                    <span className="experience-toggle">
                      <Icon name="plus" />
                    </span>
                  </summary>
                  <div className="experience-content">
                    <p className="experience-note">{job.note}</p>
                    <div>
                      <h3>{job.summary}</h3>
                      <ul>
                        {job.details.map((detail) => (
                          <li key={detail}>{detail}</li>
                        ))}
                      </ul>
                      <p className="eyebrow experience-stack">{job.stack}</p>
                    </div>
                  </div>
                </details>
              ))}
            </div>
            <div className="career-foundations">
              <div className="education" id="education">
                <span className="education-icon" aria-hidden="true">
                  ⌘
                </span>
                <div>
                  <span className="eyebrow">WHERE IT STARTED</span>
                  <h3>BITS Pilani</h3>
                  <p>B.E. Computer Science Engineering · 2020–2024</p>
                  <small>
                    OOP Teaching Assistant · Full Stack + API course development
                  </small>
                </div>
              </div>
              <div className="achievement-strip" data-reveal>
                <div>
                  <span>01 / HACKATHON</span>
                  <strong>First place</strong>
                  <p>Whatfix R&D Global Hackathon, 2024</p>
                </div>
                <div>
                  <span>02 / FOUNDATIONS</span>
                  <strong>Top of the class</strong>
                  <p>Data Structures & Algorithms · BITS Pilani</p>
                </div>
                <div>
                  <span>03 / THE BEGINNING</span>
                  <strong>
                    99.84+<small>percentile</small>
                  </strong>
                  <p>JEE Mains, 2020</p>
                </div>
              </div>
              <div className="toolbox">
                <span className="eyebrow">SOME TOOLS I WORK WITH</span>
                <div>
                  {[
                    "TypeScript",
                    "React",
                    "Next.js",
                    "Go",
                    "Rust",
                    "Python",
                    "C++",
                    "Node.js",
                    "Bazel",
                    "SQL",
                    "WebRTC",
                    "Git",
                  ].map((skill) => (
                    <span key={skill}>{skill}</span>
                  ))}
                </div>
              </div>
            </div>
          </section>

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

          <section id="contact" className="contact-section section-shell">
            <div className="contact-top">
              <SectionLabel number="04">
                GOOD THINGS START WITH A CONVERSATION
              </SectionLabel>
              <span className="eyebrow">
                <i className="status-dot" /> OPEN TO INTERESTING IDEAS
              </span>
            </div>
            <a className="contact-heading" href={`mailto:${contact.email}`}>
              <h2>
                Looking for an engineer<span>?</span>
              </h2>
              <Asterisk className="contact-asterisk" />
              <span className="contact-arrow">
                <Icon name="arrow" />
              </span>
            </a>
            <div className="contact-bottom">
              <p>
                Infrastructure, web, or applied AI.
                <br />
                Let’s talk about what you’re building.
              </p>
              <div className="email-group">
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
                <button
                  onClick={copyEmail}
                  aria-label="Copy email address"
                  className="copy-button"
                >
                  <Icon name={copyState === "copied" ? "check" : "copy"} />
                </button>
                <span className="copy-status" role="status">
                  {copyState === "copied"
                    ? "Email copied!"
                    : copyState === "failed"
                      ? "Please select the email to copy it."
                      : ""}
                </span>
              </div>
            </div>
          </section>
        </main>

        <footer className="site-footer section-shell">
          <div className="footer-top">
            <a href="#home" className="wordmark" aria-label="Back to top">
              Naman Luthra
            </a>
            <p>
              Thoughtfully engineered.
              <br />
              Endlessly curious.
            </p>
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
              BASED IN INDIA <span className="time-dot">·</span> {localTime}
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
