import { Localized, useLocale } from "./Locale";
import type { CSSProperties } from "react";
import type { ImpactStory } from "./impact";

function Illustration({ item }: { item: ImpactStory }) {
  switch (item.id) {
    case "css-builds":
      return (
        <Localized>
          <div
            lang="en"
            translate="no"
            className="work-illustration release-visual"
            aria-label="Per-package CSS generation, deduplicated output, and compatible releases"
          >
            <div className="release-packages">
              <span>ui /</span>
              <span>core /</span>
              <span>+109</span>
            </div>
            <div className="visual-connector" />
            <div className="release-compiler">
              <span className="eyebrow">BUILD TIME</span>
              <strong>Generate. Merge. Deduplicate.</strong>
              <code>styles.css</code>
            </div>
            <div className="visual-connector" />
            <div className="release-versions">
              <div>
                <span>RELEASE n−1</span>
                <b>Compatible</b>
              </div>
              <div>
                <span>RELEASE n</span>
                <b>Compatible</b>
              </div>
            </div>
            <p>Independently released. Styled together.</p>
          </div>
        </Localized>
      );
    case "typed-forms":
      return (
        <Localized>
          <div
            lang="en"
            translate="no"
            className="work-illustration types-visual"
            aria-label="ConditionalPaths validates nested form fields at compile time"
          >
            <div className="visual-editor-title">
              <span className="window-dots">
                <i />
                <i />
                <i />
              </span>
              <span>form-fields.tsx</span>
            </div>
            <div className="type-code">
              <code>
                <span>type</span> FieldName =<br />
                &nbsp; ConditionalPaths&lt;
                <br />
                &nbsp;&nbsp;&nbsp;FormState, <span>string</span>
                <br />
                &nbsp; &gt;;
              </code>
            </div>
            <div className="type-check">
              <code>&quot;cluster.network.ip&quot;</code>
              <span>✓ Valid path</span>
            </div>
            <div className="type-check invalid">
              <code>&quot;cluster.netwrok.ip&quot;</code>
              <span>× Type error</span>
            </div>
            <p>One type utility. A migration across teams.</p>
          </div>
        </Localized>
      );
    case "hybrid-testing":
      return (
        <Localized>
          <div
            lang="en"
            translate="no"
            className="work-illustration hybrid-visual"
            aria-label="Shared Java TestNG tests connect through REST and stdio to a Node framework for web and native applications"
          >
            <div className="hybrid-source">
              <code>Java / TestNG</code>
              <span>The same test code</span>
            </div>
            <div className="hybrid-bridge">
              <span>REST</span>
              <i />
              <span>STDIN / OUT</span>
            </div>
            <div className="hybrid-node">Node.js · application lifecycle</div>
            <div className="hybrid-targets">
              <div>
                <span className="visual-editor-title">
                  WEB / PUPPETEER + CDP
                </span>
                <div className="fake-input" />
                <div className="fake-button" />
              </div>
              <div>
                <span className="visual-editor-title">
                  NATIVE / XCTEST (macOS)
                </span>
                <div className="native-lines">
                  <i />
                  <i />
                  <i />
                </div>
              </div>
            </div>
            <p>macOS + Windows · web, hybrid, and native</p>
          </div>
        </Localized>
      );
    case "slack-notify":
      return (
        <Localized>
          <div
            lang="en"
            translate="no"
            className="work-illustration slack-visual"
            aria-label="Slack connects a permission request and a reply back to a remote Claude Code session"
          >
            <div className="slack-mini-header">
              <span>#</span>
              <div>
                <b>Milano</b>
                <small>Claude Code · Slack DM</small>
              </div>
            </div>
            <div className="slack-mini-message">
              <strong>Claude needs your permission</strong>
              <p>Run the tests for this session?</p>
              <div>
                <span>✓ Approve</span>
                <span>Deny</span>
              </div>
            </div>
            <div className="slack-mini-reply">
              Approved. The session can continue.
            </div>
            <div className="slack-signal">
              <span>Claude hooks</span>
              <i>↔</i>
              <span>Redis + service</span>
              <i>↔</i>
              <span>Slack</span>
            </div>
          </div>
        </Localized>
      );
    case "dev-experience":
      return (
        <Localized>
          <div
            lang="en"
            translate="no"
            className="work-illustration build-visual"
            aria-label="Bootstrap completes first; the server starts while type generation continues in the background"
          >
            <div className="build-step">
              <span>01</span>
              <b>Bootstrap</b>
              <small>Ready to serve</small>
            </div>
            <div className="build-parallel">
              <div>
                <i className="status-dot" />
                <b>Dev server live</b>
              </div>
              <div>
                <span className="build-dashes" />
                <span>GraphQL type generation continues</span>
              </div>
            </div>
          </div>
        </Localized>
      );
    case "tooling":
      return (
        <Localized>
          <div
            lang="en"
            translate="no"
            className="work-illustration go-visual"
            aria-label="TypeScript tools migrated to concurrent Go generators"
          >
            <div>
              <span className="language-chip">TS</span>
              <span className="migration-line" />
              <span className="language-chip go-chip">Go</span>
            </div>
            <p>Scanner · translations · illustrations · animations · icons</p>
          </div>
        </Localized>
      );
    case "intelligence":
      return (
        <Localized>
          <div
            lang="en"
            translate="no"
            className="work-illustration retrieval-visual"
            aria-label="Retrieval pipeline from question to relevant context to answer"
          >
            <span>Question</span>
            <i>→</i>
            <div>
              <span>Retrieve</span>
              <div className="retrieval-docs">
                <i />
                <i />
                <i />
              </div>
              <small>Hybrid search + reranking</small>
            </div>
            <i>→</i>
            <span>Answer</span>
          </div>
        </Localized>
      );
    default:
      return (
        <Localized>
          <div
            lang="en"
            translate="no"
            className="work-illustration bundler-visual"
          >
            <span className="window-dots">
              <i />
              <i />
              <i />
            </span>
            <code>localhost /</code>
            <span>
              <i className="status-dot" /> Ready in 8s
            </span>
          </div>
        </Localized>
      );
  }
}

export default function ImpactVisual({
  item,
  illustrationOnly = false,
}: {
  item: ImpactStory;
  illustrationOnly?: boolean;
}) {
  const { t } = useLocale();
  if (illustrationOnly) return <Illustration item={item} />;
  return (
    <Localized>
      <div className={`metric-content metric-${item.id}`}>
        <div
          className={`metric-value ${item.metric.length > 6 ? "compact-metric" : ""}`}
        >
          {item.metric}
        </div>
        <p className="metric-label">{item.label}</p>
        <Illustration item={item} />
        {item.visual === "comparison" ? (
          <div
            className="comparison"
            aria-label={`${t("Before")}: ${item.from}. ${t("After")}: ${item.to}.`}
          >
            {[
              {
                label: "BEFORE",
                value: item.from,
                width: item.before,
                style: "before-bar",
              },
              {
                label: "AFTER",
                value: item.to,
                width: item.after,
                style: "after-bar",
              },
            ].map((bar) => (
              <div className="comparison-row" key={bar.label}>
                <div>
                  <span>{bar.label}</span>
                  <b>{bar.value}</b>
                </div>
                <div className="bar-track">
                  <div
                    className={`bar ${bar.style}`}
                    style={{ "--bar-width": `${bar.width}%` } as CSSProperties}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : item.id === "typed-forms" ? (
          <dl className="impact-facts compact-facts">
            {item.facts.map((fact) => (
              <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
        <p className="metric-detail">{item.detail}</p>
      </div>
    </Localized>
  );
}
