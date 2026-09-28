"use client";

import Image from "next/image";
import { useRef, type PointerEvent, type ReactNode } from "react";
import {
  SiCplusplus,
  SiGit,
  SiGo,
  SiNextdotjs,
  SiNodedotjs,
  SiPython,
  SiReact,
  SiTypescript,
  SiVite,
  SiWebrtc,
} from "react-icons/si";
import { Icon } from "./Icon";
import { Localized } from "./Locale";
import { contact } from "./data";

// Two rows drift in opposite directions to fill the tile.
const stackRows = [
  [
    { name: "TypeScript", Icon: SiTypescript },
    { name: "React", Icon: SiReact },
    { name: "Go", Icon: SiGo },
    { name: "Next.js", Icon: SiNextdotjs },
    { name: "Node.js", Icon: SiNodedotjs },
  ],
  [
    { name: "Python", Icon: SiPython },
    { name: "C++", Icon: SiCplusplus },
    { name: "Vite", Icon: SiVite },
    { name: "WebRTC", Icon: SiWebrtc },
    { name: "Git", Icon: SiGit },
  ],
];

function Tile({
  className = "",
  children,
  href,
}: {
  className?: string;
  children: ReactNode;
  href?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  // The hover spotlight follows the pointer inside each tile.
  const onMove = (event: PointerEvent) => {
    const box = ref.current?.getBoundingClientRect();
    if (!box) return;
    ref.current!.style.setProperty("--mx", `${event.clientX - box.left}px`);
    ref.current!.style.setProperty("--my", `${event.clientY - box.top}px`);
  };
  const Tag = (href ? "a" : "div") as "div";
  return (
    <Tag
      ref={ref as never}
      className={`bento-tile ${className}`}
      onPointerMove={onMove}
      {...(href ? { href } : {})}
    >
      {children}
    </Tag>
  );
}

export default function Hero({
  motion,
  toggleMotion,
  localTime,
}: {
  motion: boolean;
  toggleMotion: () => void;
  localTime: string;
}) {
  return (
    <Localized>
      <section
        className="introduction section-shell"
        id="home"
        aria-labelledby="hero-heading"
      >
        <div className="bento-grid">
          <Tile className="bento-intro">
            <span className="eyebrow intro-kicker">A LITTLE ABOUT ME</span>
            <h1 id="hero-heading">
              Hi, I’m Naman<span>.</span>
            </h1>
            <p className="intro-lead">
              A software engineer who likes understanding how things work and
              making them work a little better.
            </p>
            <p className="intro-detail">
              I work on UI infrastructure at Rubrik: build systems, developer
              tooling, and the foundations other engineers build on. Before
              that, I worked on applied AI at Whatfix. I studied Computer
              Science at BITS Pilani.
            </p>
            <div className="intro-links">
              <a className="button button-accent" href="#work">
                Some things I’ve worked on <Icon name="down" />
              </a>
              <a
                className="text-link social-link"
                href={contact.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon name="github" /> GitHub
              </a>
              <a
                className="text-link social-link"
                href={contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon name="linkedin" /> LinkedIn
              </a>
            </div>
          </Tile>
          <Tile className="bento-photo">
            <Image
              src="/profilePic.jpg"
              alt="Naman Luthra"
              fill
              priority
              sizes="(max-width: 760px) 90vw, 360px"
            />
            <span className="bento-photo-note">Nice to meet you.</span>
          </Tile>
          <Tile className="bento-org bento-now" href="#journey">
            <div className="bento-org-head">
              <span className="bento-logo">
                <Image
                  src="/logos/rubrik-mark.svg"
                  alt=""
                  width={36}
                  height={36}
                  unoptimized
                />
              </span>
              <span className="eyebrow">
                <i className="status-dot" /> NOW
              </span>
            </div>
            <strong>Rubrik</strong>
            <p>Software Engineer, G6</p>
            <small>UI Platform · infrastructure and developer experience</small>
          </Tile>
          <Tile className="bento-org bento-edu" href="#education">
            <div className="bento-org-head">
              <span className="bento-logo bento-logo-crest">
                <Image
                  src="/logos/bits-pilani.png"
                  alt=""
                  width={48}
                  height={48}
                />
              </span>
              <span className="eyebrow">EDUCATION</span>
            </div>
            <strong>BITS Pilani</strong>
            <p>B.E. Computer Science</p>
            <small>Class of 2024</small>
          </Tile>
          <Tile className="bento-stack">
            <span className="eyebrow">SOME TOOLS I WORK WITH</span>
            <div
              className="bento-marquee"
              aria-label={stackRows
                .flat()
                .map((item) => item.name)
                .join(", ")}
            >
              {stackRows.map((row, rowIndex) => (
                <div aria-hidden="true" key={rowIndex}>
                  {[...row, ...row, ...row, ...row].map(
                    ({ name, Icon: Logo }, index) => (
                      <span key={index} lang="en" translate="no">
                        <Logo /> {name}
                      </span>
                    ),
                  )}
                </div>
              ))}
            </div>
          </Tile>
          <Tile className="bento-resume">
            <span className="eyebrow">RESUME</span>
            <strong>The one-page version</strong>
            <p>Experience, projects and education in one place.</p>
            <div className="bento-resume-links">
              <a
                className="bento-pill bento-pill-solid"
                href={`${contact.resume}/preview`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Read it <Icon name="arrow" />
              </a>
              <a
                className="bento-pill"
                href={`${contact.resume}/export?format=pdf`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Download PDF <Icon name="down" />
              </a>
            </div>
          </Tile>
          <Tile className="bento-place">
            <span className="eyebrow">BASED IN</span>
            <strong>Bengaluru</strong>
            <small>{localTime}</small>
            <button
              className="motion-toggle"
              aria-pressed={motion}
              onClick={toggleMotion}
            >
              <Icon name={motion ? "pause" : "play"} />
              <span>{motion ? "Motion on" : "Motion off"}</span>
            </button>
          </Tile>
        </div>
      </section>
    </Localized>
  );
}
