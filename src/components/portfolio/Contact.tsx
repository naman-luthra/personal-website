"use client";

import { useState, type FormEvent } from "react";
import { Icon } from "./Icon";
import { Localized } from "./Locale";
import { contact } from "./data";

const topics = ["A role on my team", "A project idea", "Just saying hi"];

// Netlify detects the form from public/__forms.html at deploy time; this
// component posts the same fields to that static file.
export default function Contact({
  copyEmail,
  copyState,
}: {
  copyEmail: () => void;
  copyState: "idle" | "copied" | "failed";
}) {
  const [topic, setTopic] = useState(topics[0]);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [sentTo, setSentTo] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    data.set("topic", topic);
    setStatus("sending");
    try {
      const response = await fetch("/__forms.html", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(
          data as unknown as Record<string, string>,
        ).toString(),
      });
      if (!response.ok) throw new Error(String(response.status));
      setSentTo(String(data.get("email") ?? ""));
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  return (
    <Localized>
      <section id="contact" className="contact-section section-shell">
        <div className="contact-intro">
          <div className="section-label">
            <span className="section-number">04</span>
            <span>GOOD THINGS START WITH A CONVERSATION</span>
          </div>
          <h2>
            Looking for an engineer<span>?</span>
          </h2>
          <p>
            Infrastructure, web, or applied AI. Tell me what you’re building and
            I’ll get back to you, usually within a day.
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
          <div className="contact-socials">
            <a href={contact.github} target="_blank" rel="noopener noreferrer">
              <Icon name="github" /> GitHub
            </a>
            <a
              href={contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon name="linkedin" /> LinkedIn
            </a>
          </div>
        </div>
        <form
          className="contact-form"
          name="contact"
          method="POST"
          data-netlify="true"
          netlify-honeypot="bot-field"
          onSubmit={submit}
        >
          <input type="hidden" name="form-name" value="contact" />
          <p className="form-honeypot" aria-hidden="true">
            <label>
              Leave this empty
              <input name="bot-field" tabIndex={-1} autoComplete="off" />
            </label>
          </p>
          <div className="form-bar">
            <span className="window-dots">
              <i />
              <i />
              <i />
            </span>
            <span lang="en" translate="no">
              ~/hello · zsh
            </span>
            <span />
          </div>
          {status === "sent" ? (
            <div className="form-body form-done" role="status">
              <p>
                <span className="form-ok">✓</span> Message delivered.
              </p>
              <p>Thanks for reaching out. I’ll reply soon.</p>
              {sentTo && (
                <p className="eyebrow" lang="en" translate="no">
                  REPLY TO: {sentTo}
                </p>
              )}
              <button
                type="button"
                className="form-reset"
                onClick={() => setStatus("idle")}
              >
                Send another <Icon name="arrow" />
              </button>
            </div>
          ) : (
            <div className="form-body">
              <label className="form-line">
                <span className="form-prompt" lang="en" translate="no">
                  name
                </span>
                <input
                  name="name"
                  required
                  autoComplete="name"
                  placeholder="Your name"
                />
              </label>
              <label className="form-line">
                <span className="form-prompt" lang="en" translate="no">
                  email
                </span>
                <input
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="Where I can reply"
                />
              </label>
              <div className="form-line" role="radiogroup" aria-label="Topic">
                <span className="form-prompt" lang="en" translate="no">
                  topic
                </span>
                <div className="form-chips">
                  {topics.map((item) => (
                    <button
                      type="button"
                      key={item}
                      role="radio"
                      aria-checked={topic === item}
                      onClick={() => setTopic(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
              <label className="form-line">
                <span className="form-prompt" lang="en" translate="no">
                  message
                </span>
                <textarea
                  name="message"
                  required
                  placeholder="What are you building?"
                  rows={4}
                />
              </label>
              {status === "error" && (
                <p className="form-error" role="alert">
                  That didn’t go through. Please email me directly at{" "}
                  <a href={`mailto:${contact.email}`}>{contact.email}</a>.
                </p>
              )}
              <div className="form-submit">
                <span className="eyebrow">GOES STRAIGHT TO MY INBOX</span>
                <button
                  type="submit"
                  className="button button-accent"
                  disabled={status === "sending"}
                >
                  {status === "sending" ? "Sending…" : "Send it"}
                  <Icon name="arrow" />
                </button>
              </div>
            </div>
          )}
        </form>
      </section>
    </Localized>
  );
}
