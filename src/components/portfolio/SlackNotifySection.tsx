"use client";

import { useRef, useState, type FormEvent } from "react";
import { Icon } from "./Icon";

const scenarios = [
  {
    id: "approve",
    label: "Approve",
    title: "A permission. One tap away.",
    description:
      "Approve or decline a tool request directly from a Slack DM, with an optional reason when declining.",
    message: "Claude needs your permission",
    body: "Run the test suite for the changes in this session?",
    command: "npm run test",
  },
  {
    id: "answer",
    label: "Answer",
    title: "A question. Answered anywhere.",
    description:
      "Open a Slack modal to choose an answer or add your own response. Your decision goes straight back to the waiting session.",
    message: "Claude has a question for you",
    body: "Which checks should I run before wrapping up?",
    command: "Waiting for your answer…",
  },
  {
    id: "steer",
    label: "Steer",
    title: "Finished? Give it the next task.",
    description:
      "Reply with a follow-up to keep the session going, or dismiss it when you’re done. The next instruction is just a message away.",
    message: "Claude finished this task",
    body: "The changes are ready and the tests pass. What’s next?",
    command: "Ready for your next instruction.",
  },
] as const;

type Mode = (typeof scenarios)[number]["id"];
type Action = "deny" | "answer" | "reply";

export default function SlackNotifySection() {
  const [mode, setMode] = useState<Mode>("approve");
  const [result, setResult] = useState("");
  const [action, setAction] = useState<Action>("answer");
  const [choice, setChoice] = useState("Focused tests");
  const [reply, setReply] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const scenario = scenarios.find((item) => item.id === mode)!;

  const openDialog = (next: Action) => {
    setAction(next);
    setReply("");
    setChoice("Focused tests");
    dialog.current?.showModal();
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const message = reply.trim();
    if (action === "reply" && !message) return;
    setResult(
      action === "deny"
        ? `Request declined.${message ? ` Reason: ${message}` : " Claude will wait for another instruction."}`
        : action === "answer"
          ? `Answer sent: ${message || choice}. The session can continue.`
          : `Follow-up sent: ${message}. The session is continuing.`,
    );
    dialog.current?.close();
  };

  return (
    <div
      className="notify-embedded"
      lang="en"
      translate="no"
      aria-label="Interactive slack-notify demo"
    >
      <div className="notify-demo-layout">
        <div className="notify-story" data-reveal>
          <span className="eyebrow">YOUR SESSION. WITHIN REACH.</span>
          <div
            className="notify-modes"
            role="group"
            aria-label="Explore slack-notify interactions"
          >
            {scenarios.map((item, index) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={mode === item.id}
                onClick={() => {
                  setMode(item.id);
                  setResult("");
                }}
              >
                <span>0{index + 1}</span>
                {item.label}
                <Icon name="down" />
              </button>
            ))}
          </div>
          <div className="notify-mode-copy">
            <h3>{scenario.title}</h3>
            <p>{scenario.description}</p>
          </div>
          <div className="notify-remote">
            <Icon name="screen" />
            <div>
              <h3>Your laptop can take a break.</h3>
              <p>
                On a DevPod with tmux, sessions keep running after SSH
                disconnects. Close the lid, head out, and unblock the work from
                your phone.
              </p>
            </div>
          </div>
        </div>

        <div className="notify-demo-stage" data-reveal>
          <div className="notify-demo-caption eyebrow">
            <span>
              <i className="status-dot" /> INTERACTIVE DEMO
            </span>
            <span>TRY AN ACTION ↓</span>
          </div>
          <div className="notify-window">
            <div className="notify-window-header">
              <span className="notify-app-mark" aria-hidden="true">
                #
              </span>
              <div>
                <strong>Milano</strong>
                <span>Claude Code · direct message</span>
              </div>
              <span className="notify-app-badge">APP</span>
            </div>
            <div className="notify-message" key={mode}>
              <span className="notify-session eyebrow">
                SESSION / FINISH THE UI UPDATE
              </span>
              <h3>{scenario.message}</h3>
              <p>{scenario.body}</p>
              <div className="notify-command">
                <span aria-hidden="true">›</span>
                <code>{scenario.command}</code>
              </div>
              <details className="notify-context">
                <summary>
                  Show Context <Icon name="plus" />
                </summary>
                <div>
                  <p>
                    <b>You</b> Refine the UI and verify the changes.
                  </p>
                  <p>
                    <b>Claude</b> The update is ready. I’ll check the affected
                    components next.
                  </p>
                </div>
              </details>
              <div className="notify-actions">
                {mode === "approve" ? (
                  <>
                    <button
                      className="notify-primary"
                      disabled={!!result}
                      onClick={() =>
                        setResult(
                          "Approved. The request is unblocked and Claude can run the tests.",
                        )
                      }
                    >
                      <Icon name="check" />
                      Approve
                    </button>
                    <button
                      disabled={!!result}
                      onClick={() => openDialog("deny")}
                    >
                      Deny
                    </button>
                  </>
                ) : mode === "answer" ? (
                  <button
                    className="notify-primary"
                    disabled={!!result}
                    onClick={() => openDialog("answer")}
                  >
                    Answer question <Icon name="down" />
                  </button>
                ) : (
                  <>
                    <button
                      className="notify-primary"
                      disabled={!!result}
                      onClick={() => openDialog("reply")}
                    >
                      Reply & steer <Icon name="down" />
                    </button>
                    <button
                      disabled={!!result}
                      onClick={() =>
                        setResult("Dismissed. This demo session has ended.")
                      }
                    >
                      Dismiss
                    </button>
                  </>
                )}
              </div>
              <div className="notify-response" role="status">
                {result || "Choose an action to see how the session responds."}
              </div>
              {result && (
                <button className="notify-reset" onClick={() => setResult("")}>
                  Try again ↺
                </button>
              )}
            </div>
            <div className="notify-window-footer">
              <span>devpod / tmux</span>
              <span>
                <i className="status-dot" />{" "}
                {result.startsWith("Dismissed")
                  ? "Session ended"
                  : "Session connected"}
              </span>
            </div>
          </div>
          <p className="notify-demo-note">
            Illustrated interaction · this demo stays in your browser.
          </p>
        </div>
      </div>

      <div className="notify-engineering" data-reveal>
        <div className="notify-engineering-heading">
          <div>
            <span className="eyebrow">MY ROLE / FULL-STACK OWNERSHIP</span>
            <h3>Every layer. End to end.</h3>
          </div>
          <p>
            I built the plugin and local Claude hooks, Redis-backed polling,
            Slack service interactions, and the database changes that tie the
            integration together.
          </p>
        </div>
        <ol
          className="notify-architecture"
          aria-label="slack-notify system architecture"
        >
          <li>
            <span className="eyebrow">01 / ON THE DEVPOD</span>
            <h4>Claude hooks</h4>
            <p>
              Ask, approve, and finish events. Local hooks wait for the
              response.
            </p>
          </li>
          <li>
            <span className="eyebrow">02 / THE RETURN PATH</span>
            <h4>Redis cache</h4>
            <p>Polling connects local hooks to remote interactions.</p>
          </li>
          <li>
            <span className="eyebrow">03 / BACKEND INTEGRATION</span>
            <h4>Slack service + DB</h4>
            <p>Service interactions and the underlying database changes.</p>
          </li>
          <li>
            <span className="eyebrow">04 / WHERE YOU ARE</span>
            <h4>Your Slack DM</h4>
            <p>Decisions, answers, and the next instruction.</p>
          </li>
        </ol>
        <div className="notify-footnote">
          <span className="eyebrow">CONTROL THE SIGNAL</span>
          <p>
            Guided setup. Per-action toggles for Ask, Approve, and Finish.
            Notification status right in the Claude Code status line.
          </p>
        </div>
      </div>

      <dialog
        className="notify-dialog"
        ref={dialog}
        aria-labelledby="notify-dialog-title"
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
      >
        <form onSubmit={submit}>
          <div className="notify-dialog-heading">
            <span className="eyebrow">SLACK-NOTIFY / DEMO</span>
            <button
              type="button"
              aria-label="Close dialog"
              onClick={() => dialog.current?.close()}
            >
              <Icon name="close" />
            </button>
          </div>
          <h3 id="notify-dialog-title">
            {action === "deny"
              ? "Decline this request"
              : action === "answer"
                ? "Answer Claude’s question"
                : "Give Claude the next step"}
          </h3>
          {action === "answer" && (
            <fieldset>
              <legend>Which checks should I run?</legend>
              {["Focused tests", "Full test suite"].map((option) => (
                <label className="notify-choice" key={option}>
                  <input
                    type="radio"
                    name="checks"
                    value={option}
                    checked={choice === option}
                    onChange={() => setChoice(option)}
                  />
                  {option}
                </label>
              ))}
            </fieldset>
          )}
          <label className="notify-input-label" htmlFor="notify-reply">
            {action === "deny"
              ? "Reason (optional)"
              : action === "answer"
                ? "Or write your own answer"
                : "Your follow-up"}
          </label>
          <textarea
            id="notify-reply"
            value={reply}
            onChange={(event) => setReply(event.target.value)}
            required={action === "reply"}
            maxLength={500}
            rows={3}
            placeholder={
              action === "reply"
                ? "Check the mobile layout next."
                : "Add a response…"
            }
          />
          <div className="notify-actions">
            <button type="button" onClick={() => dialog.current?.close()}>
              Cancel
            </button>
            <button className="notify-primary" type="submit">
              {action === "deny" ? "Decline request" : "Send response"}
              <Icon name="down" />
            </button>
          </div>
        </form>
      </dialog>
    </div>
  );
}
