"use client";

import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import messages from "./translations.json";

export const languages = [
  { code: "eng", lang: "en", name: "English" },
  { code: "hin", lang: "hi", name: "हिंदी" },
  { code: "fre", lang: "fr", name: "Français" },
  { code: "spa", lang: "es", name: "Español" },
  { code: "chi", lang: "zh", name: "中文" },
] as const;
type LanguageCode = (typeof languages)[number]["code"];
const isLanguage = (value: string | null): value is LanguageCode =>
  languages.some((language) => language.code === value);
const normalize = (text: string) => text.trim().replace(/\s+/g, " ");
const catalogs = ["hin", "fre", "spa", "chi"].map(
  (_, index) =>
    new Map(
      (messages as string[][]).map((row) => [
        normalize(row[0]),
        row[index + 1],
      ]),
    ),
);
const LocaleContext = createContext({
  code: "eng" as LanguageCode,
  setLanguage: (_code: LanguageCode) => {},
  t: (text: string) => text,
});

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [code, setCode] = useState<LanguageCode>("eng");
  useEffect(() => {
    try {
      const saved = localStorage.getItem("language_code");
      if (isLanguage(saved)) setCode(saved);
    } catch {
      /* Language switching still works when storage is unavailable. */
    }
  }, []);
  useEffect(() => {
    document.documentElement.lang = languages.find(
      (language) => language.code === code,
    )!.lang;
    // Translations change element heights and therefore scroll-trigger positions.
    const frame = requestAnimationFrame(() =>
      window.dispatchEvent(new Event("resize")),
    );
    return () => cancelAnimationFrame(frame);
  }, [code]);
  const value = useMemo(
    () => ({
      code,
      setLanguage: (next: LanguageCode) => {
        setCode(next);
        try {
          localStorage.setItem("language_code", next);
        } catch {
          /* Optional persistence. */
        }
      },
      t: (text: string) => {
        const index =
          languages.findIndex((language) => language.code === code) - 1;
        if (index < 0) return text;
        const translated = catalogs[index].get(normalize(text));
        if (!translated) return text;
        return text.replace(/\S[\s\S]*\S|\S/, () => translated);
      },
    }),
    [code],
  );
  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export const useLocale = () => useContext(LocaleContext);

// Translate React text and accessible labels, never mutate the DOM. Each child
// component owns a boundary; stable IDs, links, technical identifiers, and code
// stay intact. New copy falls back to English until its translation is supplied.
export function Localized({ children }: { children: ReactNode }) {
  const { t } = useLocale();
  const visit = (nodes: ReactNode): ReactNode =>
    Children.map(nodes, (node) => {
      if (typeof node === "string") return t(node);
      if (!isValidElement(node)) return node;
      const element = node as ReactElement<Record<string, unknown>>;
      if (
        element.props.translate === "no" ||
        element.props.lang === "en" ||
        element.type === "code" ||
        element.type === "svg"
      )
        return node;
      const props: Record<string, unknown> = {};
      for (const key of ["aria-label", "title", "placeholder", "alt"]) {
        if (typeof element.props[key] === "string")
          props[key] = t(element.props[key] as string);
      }
      if (element.props.children !== undefined)
        props.children = visit(element.props.children as ReactNode);
      return cloneElement(element, props);
    });
  return <>{visit(children)}</>;
}

export function LanguageSwitcher() {
  const { code, setLanguage, t } = useLocale();
  return (
    <label className="language-switcher">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 5h12M9 3v2m4 0c-1 6-4 9-9 11m1-8c1 4 4 7 8 8m1 5 4-11 4 11m-6-4h4" />
      </svg>
      <select
        aria-label={t("Choose language")}
        value={code}
        onChange={(event) => {
          if (isLanguage(event.target.value)) setLanguage(event.target.value);
        }}
      >
        {languages.map((language) => (
          <option
            key={language.code}
            value={language.code}
            lang={language.lang}
          >
            {language.name}
          </option>
        ))}
      </select>
    </label>
  );
}
