import type { SVGProps } from "react";

type IconName =
  | "arrow"
  | "down"
  | "github"
  | "linkedin"
  | "plus"
  | "copy"
  | "check"
  | "sun"
  | "pause"
  | "play"
  | "close"
  | "menu"
  | "mic"
  | "video"
  | "phone"
  | "screen";

const paths: Record<IconName, React.ReactNode> = {
  arrow: <path d="M5 19 19 5M5 5h14v14" />,
  down: <path d="M12 4v16m-7-7 7 7 7-7" />,
  github: (
    <>
      <path
        d="M9 19c-4 1.5-4-2-6-2m12 5v-4a3.5 3.5 0 0 0-1-2.7c3.3-.4 6.8-1.6 6.8-7.3A5.7 5.7 0 0 0 19.3 4c.2-.7.7-2.4-.2-4 0 0-1.2-.4-4 1.5a14 14 0 0 0-7.2 0C5.1-.4 3.9 0 3.9 0 3 1.6 3.5 3.3 3.7 4a5.7 5.7 0 0 0-1.5 4c0 5.7 3.5 6.9 6.8 7.3A3.5 3.5 0 0 0 8 18v4"
        transform="translate(1 1) scale(.9)"
      />
    </>
  ),
  linkedin: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M7 10v7m0-10v.1M11 17v-7m0 3a3 3 0 0 1 6 0v4" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  copy: (
    <>
      <rect x="8" y="8" width="12" height="12" rx="2" />
      <path d="M16 8V4H4v12h4" />
    </>
  ),
  check: <path d="m5 12 4 4L19 6" />,
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1 1m12 12 1 1M5 19l1-1M18 6l1-1" />
    </>
  ),
  pause: <path d="M8 5v14M16 5v14" strokeWidth="3" />,
  play: <path d="m8 5 11 7-11 7Z" />,
  close: <path d="m5 5 14 14M5 19 19 5" />,
  menu: <path d="M4 8h16M4 16h16" />,
  mic: (
    <>
      <rect x="9" y="3" width="6" height="12" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v4m-4 0h8" />
    </>
  ),
  video: (
    <>
      <rect x="3" y="6" width="12" height="12" rx="2" />
      <path d="m15 10 6-4v12l-6-4" />
    </>
  ),
  phone: <path d="M5 16H2v-5c5-5 15-5 20 0v5h-5v-4a15 15 0 0 0-10 0v4Z" />,
  screen: (
    <>
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M12 17v4m-5 0h10m-9-10 4-4 4 4m-4-4v7" />
    </>
  ),
};

export function Icon({
  name,
  ...props
}: SVGProps<SVGSVGElement> & { name: IconName }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {paths[name]}
    </svg>
  );
}
