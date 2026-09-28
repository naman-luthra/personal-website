"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Icon } from "./Icon";
import LanguageMenu from "./LanguageMenu";
import { Localized } from "./Locale";
import Monogram from "./Monogram";

const items = [
  { id: "work", label: "Work" },
  { id: "journey", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

// Floating pill navigation with a sliding indicator for the section in view.
export default function SiteNav({ activeSection }: { activeSection: string }) {
  const list = useRef<HTMLElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const [indicator, setIndicator] = useState<{
    left: number;
    width: number;
  } | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useLayoutEffect(() => {
    const link = list.current?.querySelector<HTMLElement>(
      `[data-id="${activeSection}"]`,
    );
    setIndicator(
      link ? { left: link.offsetLeft, width: link.offsetWidth } : null,
    );
  }, [activeSection]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <Localized>
      <header
        className={`site-nav ${scrolled ? "is-scrolled" : ""} ${open ? "is-open" : ""}`}
      >
        <div className="nav-shell">
          <a href="#home" className="nav-mark" aria-label="Naman Luthra, home">
            <Monogram />
          </a>
          <nav
            aria-label="Main navigation"
            id="main-navigation"
            className="nav-links"
            ref={list}
          >
            <span
              className="nav-indicator"
              aria-hidden="true"
              style={
                indicator
                  ? {
                      transform: `translateX(${indicator.left}px)`,
                      width: indicator.width,
                      opacity: 1,
                    }
                  : { opacity: 0 }
              }
            />
            {items.map((item) => (
              <a
                key={item.id}
                data-id={item.id}
                href={`#${item.id}`}
                aria-current={
                  activeSection === item.id ? "location" : undefined
                }
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <LanguageMenu />
          <a href="#contact" className="nav-cta">
            Let’s talk <Icon name="arrow" />
          </a>
          <button
            ref={menuButton}
            className="nav-menu"
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
            aria-controls="main-navigation"
            onClick={() => setOpen(!open)}
          >
            <Icon name={open ? "close" : "menu"} />
          </button>
        </div>
      </header>
    </Localized>
  );
}
