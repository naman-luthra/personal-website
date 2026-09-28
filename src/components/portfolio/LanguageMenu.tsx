"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Icon } from "./Icon";
import { languages, useLocale } from "./Locale";

const englishNames: Record<string, string> = {
  eng: "English",
  hin: "Hindi",
  fre: "French",
  spa: "Spanish",
  chi: "Chinese",
};

// A styled listbox replacing the native select, which renders with OS chrome.
export default function LanguageMenu() {
  const { code, setLanguage, t } = useLocale();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const current = languages.find((language) => language.code === code)!;

  useEffect(() => {
    if (!open) return;
    setActive(languages.findIndex((language) => language.code === code));
    list.current?.focus();
    const onPointer = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [open, code]);

  const choose = (index: number) => {
    setLanguage(languages[index].code);
    setOpen(false);
    button.current?.focus();
  };

  const onListKey = (event: KeyboardEvent) => {
    const last = languages.length - 1;
    if (event.key === "ArrowDown") setActive(active === last ? 0 : active + 1);
    else if (event.key === "ArrowUp")
      setActive(active === 0 ? last : active - 1);
    else if (event.key === "Home") setActive(0);
    else if (event.key === "End") setActive(last);
    else if (event.key === "Enter" || event.key === " ") choose(active);
    else if (event.key === "Escape") {
      setOpen(false);
      button.current?.focus();
    } else if (event.key === "Tab") setOpen(false);
    else return;
    if (event.key !== "Tab") event.preventDefault();
  };

  return (
    <div className={`lang-menu ${open ? "is-open" : ""}`} ref={root}>
      <button
        ref={button}
        className="lang-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${t("Choose language")}: ${current.name}`}
        onClick={() => setOpen(!open)}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            setOpen(true);
          }
        }}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3 5h12M9 3v2m4 0c-1 6-4 9-9 11m1-8c1 4 4 7 8 8m1 5 4-11 4 11m-6-4h4" />
        </svg>
        <span lang={current.lang}>{current.name}</span>
        <svg className="lang-chevron" viewBox="0 0 24 24" aria-hidden="true">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open && (
        <ul
          ref={list}
          className="lang-list"
          role="listbox"
          tabIndex={-1}
          aria-label={t("Choose language")}
          aria-activedescendant={`lang-${languages[active].code}`}
          onKeyDown={onListKey}
        >
          {languages.map((language, index) => (
            <li
              key={language.code}
              id={`lang-${language.code}`}
              role="option"
              aria-selected={language.code === code}
              className={index === active ? "is-active" : ""}
              onPointerEnter={() => setActive(index)}
              onClick={() => choose(index)}
            >
              <span lang={language.lang}>{language.name}</span>
              <small>{englishNames[language.code]}</small>
              {language.code === code && <Icon name="check" />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
