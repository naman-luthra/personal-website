export const contact = {
  email: "namanluthra31@gmail.com",
  phone: "+919991343007",
  github: "https://github.com/naman-luthra",
  linkedin: "https://www.linkedin.com/in/namanluthra/",
};

export const experience = [
  {
    company: "Rubrik",
    role: "Software Engineer · G6",
    date: "MAY 2025 — PRESENT",
    note: "Promoted from G5 to G6 in May 2026",
    current: true,
    summary: "Building the UI platform and the products it powers.",
    details: [
      "Authored the RFC and led the Vite-to-Rsbuild migration: dev-server initial page loads dropped from 40s to 8s and reloads from 20s to 5s for 50+ engineers.",
      "Split dev startup into staged prebuilds: 4m 58s became 59s baseline, or 83s with Panda targets. Replaced polling with a native file watcher to bring idle CPU from roughly 80% to near zero.",
      "Proposed the TypeScript-to-Go tooling migration, proved it with a scanner and code generator running in under 1s instead of 70s, and implemented translation-ID and asset generators in collaboration with a Staff Engineer.",
      "Authored the PandaCSS architecture RFC and integrated runtime-to-compile-time CSS infrastructure across a roughly 111-package monorepo. Reworked micro-frontend release pipelines with dual-release CSS loading to maintain backward compatibility; subsequently optimized cold CSS builds from 497s to 71s.",
      "Led the form type-safety initiative: introduced the complex ConditionalPaths type utility and coordinated a crowdsourced, codebase-wide migration with engineers across teams, supported by shared tooling, developer guides, and lint guardrails.",
      "Designed isolated form testing and migrated 1,000+ test files across 40 PRs using AST codemods and AI-assisted developer guides.",
    ],
    stack: "GO / TYPESCRIPT / BAZEL / PANDA CSS / RSBUILD",
  },
  {
    company: "Whatfix",
    role: "Software Engineer",
    date: "JUL 2024 — MAY 2025",
    note: "R&D Global Hackathon 2024 · First place",
    current: false,
    summary:
      "Applied AI, enterprise search, and software that connects people.",
    details: [
      "Improved RAG product accuracy from 42% to 90% with hybrid search and reranking. Built a benchmarking pipeline for observability and experiments using deterministic checks and LLM-as-a-judge evaluations.",
      "Drove a communications and change management product for centrally scheduled organization-wide messages.",
      "Architected an advanced client-side scheduler with configurable time-based event triggers.",
    ],
    stack: "REACT / TYPESCRIPT / PYTHON / JAVA / RAG",
  },
  {
    company: "Whatfix",
    role: "Software Engineer Intern",
    date: "JAN 2024 — JUN 2024",
    note: "Cross-platform systems, from the inside out",
    current: false,
    summary: "One testing framework. Web, hybrid, and native desktop apps.",
    details: [
      "Designed and built a Node.js UI testing framework from scratch for web, hybrid, and native desktop apps on macOS and Windows. Handled application startup, web control through Puppeteer/CDP, and native macOS automation with XCTest. A shared interface lets the same test code drive both web and native interactions; thin adapters reuse existing Java/TestNG test cases through REST and STDIN/OUT IPC.",
      "Contributed to architectural design discussions and spent a month resolving critical customer issues as a Success Engineer.",
    ],
    stack: "NODE.JS / JAVA / TESTNG / IPC",
  },
  {
    company: "Basys.ai",
    role: "Full Stack Intern",
    date: "AUG 2022 — APR 2023",
    note: "Selected from 2,860 candidates",
    current: false,
    summary: "From system architecture to a healthcare product in the wild.",
    details: [
      "Led development of the premier web application for healthcare providers and insurance companies.",
      "Designed the end-to-end architecture and database schema, connecting React and Redux to Node.js, Express, and AWS.",
    ],
    stack: "REACT / REDUX / NODE.JS / AWS",
  },
];

export const projects = [
  {
    number: "01",
    title: "A connection.\nWithout the middleman.",
    name: "P2P Group Video Call",
    type: "REAL-TIME / PEER-TO-PEER",
    description:
      "A fully peer-to-peer video experience with screen sharing, chat, authorized access, and a custom layout engine that finds room for everyone.",
    tags: ["Next.js", "WebRTC", "TypeScript", "WebSockets"],
    links: [
      {
        label: "View code",
        href: "https://github.com/naman-luthra/p2p-webrtc-call",
      },
      {
        label: "Signaling server",
        href: "https://github.com/naman-luthra/signaling-server",
      },
    ],
  },
  {
    number: "02",
    title: "A healthier you.\nA smarter starting point.",
    name: "MakeMeFit",
    type: "APPLIED AI / FULL STACK",
    description:
      "Personalized meal plans, workout routines, and health metrics in one place. Built with OpenAI, a secure Node.js backend, and a thoughtfully simple interface.",
    tags: ["React", "OpenAI", "Node.js", "MySQL"],
    links: [
      { label: "Visit project", href: "https://makemefit.netlify.app/" },
      {
        label: "View code",
        href: "https://github.com/naman-luthra/make-me-fit-ui",
      },
    ],
  },
  {
    number: "03",
    title: "Finding order.\nIn every dimension.",
    name: "Hilbert R-tree",
    type: "ALGORITHMS / SPATIAL DATA STRUCTURES",
    description:
      "A C++ implementation of the Hilbert R-tree, bringing fractal geometry to spatial indexing. Hilbert ordering helps organize multidimensional data for efficient storage and spatial queries.",
    tags: ["C++", "Hilbert curves", "Spatial indexing"],
    links: [
      {
        label: "View code",
        href: "https://github.com/naman-luthra/Hilbert-R-Tree",
      },
    ],
  },
];

// Earlier projects retained from src/content/eng/projects.json.
// Local snapshots preserve projects whose original hosting is no longer relied on.
export const smallProjects = [
  {
    id: "timetable",
    name: "Timetable Generator",
    category: "SCHEDULING / AUTOMATION",
    description:
      "Automated timetable generation for educational institutions, bringing classes, rooms, and resources into one schedule.",
    tags: ["Next.js", "TypeScript", "Express"],
    link: { label: "View code", href: "https://github.com/naman-luthra/dtc" },
  },
  {
    id: "website-v2",
    name: "Personal Website V2",
    category: "WEB / ITERATION 02",
    description:
      "An earlier portfolio built with reusable React components, hooks, and a responsive Tailwind layout.",
    tags: ["React", "Tailwind", "JSON"],
    link: {
      label: "View code",
      href: "https://github.com/naman-luthra/Personal-Website-V2",
    },
  },
  {
    id: "retro",
    name: "Retro Games",
    category: "PLAY / JAVASCRIPT",
    description:
      "Small browser games, including Snake and Simon, exploring JavaScript through a little nostalgia.",
    tags: ["JavaScript", "HTML", "Game logic"],
    link: { label: "View original snapshot", href: "/ProjectSnaps/snake.png" },
  },
  {
    id: "doubts",
    name: "Doubt Redressal",
    category: "EDUCATION / MERN",
    description:
      "A place for students’ questions and answers, built across React, Redux, a Node API, and MongoDB.",
    tags: ["React", "Redux", "MongoDB"],
    link: {
      label: "View code",
      href: "https://github.com/naman-luthra/doubt-redresser",
    },
  },
  {
    id: "health",
    name: "Track My Health",
    category: "HEALTH / DESKTOP + WEB",
    description:
      "Health data visualizations, authentication, and an Electron desktop app built around a full-stack web application.",
    tags: ["Node.js", "Chart.js", "Electron"],
    link: {
      label: "View original snapshot",
      href: "/ProjectSnaps/TrackMyHealth.png",
    },
  },
  {
    id: "dns",
    name: "DNS Server",
    category: "NETWORKS / FULL STACK",
    description:
      "A web interface for querying and managing DNS records, backed by Express, MySQL, and AWS.",
    tags: ["Node.js", "MySQL", "AWS"],
    link: {
      label: "View code",
      href: "https://github.com/naman-luthra/DNS-Server",
    },
  },
  {
    id: "website-v1",
    name: "Personal Website V1",
    category: "WEB / WHERE IT STARTED",
    description:
      "My first personal website. HTML, CSS, Bootstrap, and the beginnings of a habit of building in public.",
    tags: ["HTML", "CSS", "Bootstrap"],
    link: { label: "View code", href: "https://github.com/naman-luthra/home" },
  },
  {
    id: "agro",
    name: "Khurana Agro",
    category: "CLIENT WORK / COLLABORATION",
    description:
      "A commercial website for an agriculture company, built with a peer and deployed on Google Cloud.",
    tags: ["HTML", "Bootstrap", "Google Cloud"],
  },
  {
    id: "cloud",
    name: "30 Days of Google Cloud",
    category: "LEARNING / CLOUD SYSTEMS",
    description:
      "Completed the Cloud Engineering and Data Science & ML tracks, with hands-on work in hosting, Cloud DNS, and Maps APIs.",
    tags: ["Google Cloud", "Cloud DNS", "APIs"],
  },
] as const;
