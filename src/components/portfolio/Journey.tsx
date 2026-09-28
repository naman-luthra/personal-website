"use client";

import { useState } from "react";
import { Icon } from "./Icon";
import { Localized } from "./Locale";
import { experience } from "./data";

type Entry = {
  company: string;
  role: string;
  date: string;
  note: string;
  summary?: string;
  details: readonly string[];
  stack?: string;
  current?: boolean;
};

const education: Entry[] = [
  {
    company: "BITS Pilani",
    role: "B.E. Computer Science",
    date: "2020 → 2024",
    note: "Ranked first in Data Structures & Algorithms",
    details: [
      "Teaching Assistant for Object-Oriented Programming.",
      "Helped develop the Full Stack + API course.",
    ],
    stack: "C++ / ALGORITHMS / SYSTEMS",
  },
  {
    company: "JEE Mains",
    role: "National engineering entrance",
    date: "2020",
    note: "99.84+ percentile",
    details: [],
  },
];

// Long roles show their first two highlights until expanded.
const PREVIEW = 2;

function Timeline({ entries }: { entries: readonly Entry[] }) {
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  return (
    <Localized>
      <ol className="tl-list">
        {entries.map((job, index) => {
          const open = expanded[index];
          const hidden = job.details.length - PREVIEW;
          const visible = open ? job.details : job.details.slice(0, PREVIEW);
          return (
            <li
              key={`${job.company}-${job.role}`}
              className={`tl-item ${job.current ? "is-current" : ""}`}
              data-reveal
            >
              <div className="tl-date">
                <span className="eyebrow">{job.date}</span>
                {job.current && (
                  <span className="current-badge eyebrow">
                    <i className="status-dot" /> CURRENT
                  </span>
                )}
              </div>
              <span className="tl-node" aria-hidden="true" />
              <article className="tl-card">
                <header>
                  <h3>{job.company}</h3>
                  <span>{job.role}</span>
                </header>
                {job.summary && <p className="tl-summary">{job.summary}</p>}
                <p className="tl-note eyebrow">{job.note}</p>
                {visible.length > 0 && (
                  <ul>
                    {visible.map((detail) => (
                      <li key={detail}>{detail}</li>
                    ))}
                  </ul>
                )}
                {(job.stack || hidden > 0) && (
                  <footer>
                    <span className="eyebrow">{job.stack}</span>
                    {hidden > 0 && (
                      <button
                        className="tl-more"
                        aria-expanded={!!open}
                        onClick={() =>
                          setExpanded({ ...expanded, [index]: !open })
                        }
                      >
                        {open ? "Show less" : <>{hidden} more</>}
                        <Icon name={open ? "close" : "plus"} />
                      </button>
                    )}
                  </footer>
                )}
              </article>
            </li>
          );
        })}
      </ol>
    </Localized>
  );
}

export default function Journey() {
  return (
    <Localized>
      <section id="journey" className="journey-section section-shell">
        <div className="section-heading" data-reveal>
          <div className="section-label">
            <span className="section-number">02</span>
            <span>THE JOURNEY SO FAR</span>
          </div>
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
        <div className="tl-group">
          <div className="tl-group-head">
            <h3>Work</h3>
            <span className="eyebrow">4 ROLES · 2022 → NOW</span>
          </div>
          <Timeline entries={experience} />
        </div>
        <div className="tl-group" id="education">
          <div className="tl-group-head">
            <h3>Education</h3>
            <span className="eyebrow">COMPUTER SCIENCE · BITS PILANI</span>
          </div>
          <Timeline entries={education} />
        </div>
      </section>
    </Localized>
  );
}
