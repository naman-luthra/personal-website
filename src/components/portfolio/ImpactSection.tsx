"use client";

import { Localized, useLocale } from "./Locale";

import { useEffect, useRef, useState } from "react";
import { impact } from "./impact";
import ImpactVisual from "./ImpactVisual";
import SlackNotifySection from "./SlackNotifySection";

export default function ImpactSection() {
  const { t } = useLocale();
  const section = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const elements =
      section.current?.querySelectorAll<HTMLElement>(".impact-chapter");
    if (!elements) return;
    let observer: IntersectionObserver;
    const observeReadingPosition = () => {
      observer?.disconnect();
      const readingLine = Math.round(window.innerHeight * 0.48);
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting)
              setActive(Number((entry.target as HTMLElement).dataset.index));
          });
        },
        {
          // A single reading line prevents two adjacent chapters competing.
          rootMargin: `-${readingLine}px 0px -${window.innerHeight - readingLine - 1}px 0px`,
          threshold: 0,
        },
      );
      elements.forEach((element) => observer.observe(element));
    };
    observeReadingPosition();
    window.addEventListener("resize", observeReadingPosition);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", observeReadingPosition);
    };
  }, []);

  const selected = impact[active];

  return (
    <Localized>
      <section id="work" className="work-section section-shell" ref={section}>
        <div className="section-heading" data-reveal>
          <div className="section-label">
            <span className="section-number">01</span>
            <span>INSIDE WORK / RUBRIK & WHATFIX</span>
          </div>
          <h2>
            Good code.
            <br />
            <span className="muted">Real difference.</span>
          </h2>
          <p>
            From the build pipeline
            <br />
            to the people using the product.
          </p>
        </div>
        <div className="impact-layout">
          <div className="impact-chapters">
            {impact.map((item, index) => (
              <article
                key={item.id}
                id={item.id}
                data-index={index}
                className={`impact-chapter ${active === index ? "is-active" : ""}`}
              >
                <div className="chapter-top">
                  <span className="chapter-number">/{item.number}</span>
                  <span className="eyebrow">{item.company}</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                {item.highlights && (
                  <ul className="impact-highlights">
                    {item.highlights.map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                )}
                <div className="tags">
                  {item.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                <div className="mobile-metric">
                  <strong
                    className={item.metric.length > 6 ? "compact-metric" : ""}
                  >
                    {item.metric}
                  </strong>
                  <span>
                    {item.label}
                    <small>
                      {item.visual === "comparison" ? (
                        `${item.from} → ${item.to}`
                      ) : (
                        <>
                          {item.facts[0].value}
                          {" · "}
                          {item.facts[0].label}
                        </>
                      )}
                    </small>
                  </span>
                </div>
                <p className="mobile-metric-context">{item.detail}</p>
                <div className="mobile-work-visual">
                  <ImpactVisual item={item} illustrationOnly />
                </div>
                {item.id === "slack-notify" && (
                  <details className="chapter-demo">
                    <summary>
                      Try the Slack workflow <span aria-hidden="true">+</span>
                    </summary>
                    <SlackNotifySection />
                  </details>
                )}
                {item.benchmarks && (
                  <div className="chapter-benchmarks">
                    <table>
                      <caption>
                        {item.id === "tooling"
                          ? "GO MIGRATION BENCHMARKS"
                          : "SUPPORTING BUILD IMPROVEMENTS"}
                      </caption>
                      <thead>
                        <tr>
                          <th scope="col">Tool / measure</th>
                          <th scope="col">Before</th>
                          <th scope="col">After</th>
                          <th scope="col">Improvement</th>
                        </tr>
                      </thead>
                      <tbody>
                        {item.benchmarks.map((benchmark) => (
                          <tr key={benchmark.name}>
                            <th scope="row">{benchmark.name}</th>
                            <td>{benchmark.before}</td>
                            <td>{benchmark.after}</td>
                            <td>{benchmark.result}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <p>{item.benchmarkNote}</p>
                  </div>
                )}
              </article>
            ))}
          </div>
          <div className="impact-sticky">
            <div className="impact-display">
              <div className="display-top">
                <span className="eyebrow">
                  <i className="status-dot" /> A CLOSER LOOK
                </span>
                <span className="display-cross">+</span>
              </div>
              <ImpactVisual item={selected} key={selected.id} />
              <div className="display-bottom">
                <span className="eyebrow">RUBRIK / WHATFIX</span>
                <span className="eyebrow">
                  {selected.number} / {String(impact.length).padStart(2, "0")}
                </span>
              </div>
            </div>
            <nav className="chapter-nav" aria-label="Impact chapters">
              {impact.map((item, index) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  aria-label={`${t("Read about")} ${t(item.label)}`}
                  aria-current={active === index ? "step" : undefined}
                  onClick={() => setActive(index)}
                >
                  <span />
                  <span>{item.number}</span>
                </a>
              ))}
            </nav>
          </div>
        </div>
      </section>
    </Localized>
  );
}
