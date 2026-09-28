type ImpactBase = {
  id: string;
  number: string;
  company: string;
  title: string;
  description: string;
  tags: string[];
  metric: string;
  label: string;
  detail: string;
  highlights?: string[];
  benchmarks?: {
    name: string;
    before: string;
    after: string;
    result: string;
  }[];
  benchmarkNote?: string;
};

export type ImpactStory = ImpactBase &
  (
    | {
        visual: "comparison";
        from: string;
        to: string;
        before: number;
        after: number;
      }
    | { visual: "facts"; facts: { value: string; label: string }[] }
  );

// Selected, measured outcomes from Naman's CV and February to July 2026 review.
// Keep benchmark conditions alongside the results; forecasts are not shipped work.
export const impact: ImpactStory[] = [
  {
    id: "app-bundler",
    number: "01",
    company: "RUBRIK / DEV SERVER ARCHITECTURE",
    title: "Giving time back\nto the builders.",
    description:
      "Vite’s unbundled dev-server approach had become a bottleneck for our large UI codebase. I independently investigated the problem, authored the RFC, and led the development server’s migration to Rust-based Rsbuild. Initial page loads dropped from 40s to 8s and reloads from 20s to 5s, saving time for 50+ engineers every day.",
    tags: ["Rsbuild", "Rust-based tooling", "Developer infrastructure"],
    metric: "5×",
    label: "faster initial page loads",
    detail:
      "Reloads: 20s → 5s. Recognized with an organization-wide shout-out.",
    visual: "comparison",
    from: "40s",
    to: "8s",
    before: 100,
    after: 20,
  },
  {
    id: "dev-experience",
    number: "02",
    company: "RUBRIK / DEVELOPER EXPERIENCE",
    title: "Start building.\nLet the rest catch up.",
    description:
      "I decomposed the monolithic Bazel prebuild into two stages: non-TypeScript bootstrap targets first, then GraphQL type generation in the background while the dev server starts serving. Parallel prebuilds and event-driven compile signals helped bring a roughly five-minute wait below a minute in the baseline workflow.",
    highlights: [
      "Parallelized stage-one prebuilds: 39.5s → 30.9s.",
      "Replaced polling with a native watcher: roughly 80% → near-zero idle CPU, and 500 MB → 100 MB of watcher memory.",
    ],
    tags: ["Bazel", "Staged builds", "Native file watching"],
    metric: "5.1×",
    label: "faster baseline dev startup",
    detail: "59s baseline; 83s with Panda targets included (3.6× faster).",
    visual: "comparison",
    from: "4m 58s",
    to: "59s",
    before: 100,
    after: (59 / 298) * 100,
  },
  {
    id: "tooling",
    number: "03",
    company: "RUBRIK / TYPESCRIPT → GO MIGRATION",
    title: "A little less waiting.\nA lot more building.",
    description:
      "I proposed migrating frontend infrastructure tooling from TypeScript to Go and proved the approach with a concurrent codebase scanner and code generator: 70 seconds became less than one. We made heavy use of goroutines for parallel work and mutexes to coordinate shared state. Working with a Staff Engineer on the wider migration, I also implemented the translation-ID and Aura illustration, animation, and icon generators.",
    tags: ["Go", "Goroutines", "Mutexes", "Code generation"],
    metric: ">70×",
    label: "faster scanner and code generation",
    detail:
      "One tooling migration, from the original proof of concept to production generators.",
    visual: "comparison",
    from: "70s",
    to: "<1s",
    before: 100,
    after: (1 / 70) * 100,
    benchmarks: [
      {
        name: "Scanner + codegen",
        before: "70s",
        after: "<1s",
        result: ">70×",
      },
      {
        name: "Translation IDs",
        before: "79.8s",
        after: "6.3s",
        result: "~12.7×",
      },
      {
        name: "Illustrations",
        before: "16.89s",
        after: "0.014s",
        result: "~1,200×",
      },
      {
        name: "Animations",
        before: "16.05s",
        after: "0.015s",
        result: "~1,070×",
      },
      { name: "Icons", before: "20.60s", after: "1.23s", result: "~17×" },
    ],
    benchmarkNote:
      "Translation-ID timings include Bazel across all packages. Direct Go execution: <0.5s for all translation IDs; 95ms for icons.",
  },
  {
    id: "css-builds",
    number: "04",
    company: "RUBRIK / CSS INFRASTRUCTURE & RELEASES",
    title: "Compile-time CSS.\nBuilt for the whole platform.",
    description:
      "I authored the architecture RFC and led the infrastructure integration for moving a roughly 111-package codebase from runtime Emotion CSS-in-JS to compile-time PandaCSS. The work spanned the build system, developer tooling, and complex release pipelines, enabling the migration alongside independently shipped micro-frontends.",
    highlights: [
      "Built per-package Bazel CSS generation, a shared merge-and-deduplication target, and Rsbuild/Vite watchers.",
      "Changed micro-frontend deployment pipelines and introduced dual-release CSS loading (n−1 + n) to preserve backward compatibility across asynchronous release groups.",
    ],
    tags: ["PandaCSS", "Bazel", "Release architecture", "Micro-frontends"],
    metric: "~111",
    label: "packages in the migration’s infrastructure scope",
    detail:
      "Runtime → compile-time CSS, with backward-compatible releases throughout the transition.",
    visual: "facts",
    facts: [
      {
        value: "Compile-time",
        label: "CSS generation moved out of the browser",
      },
      {
        value: "Per-package",
        label: "Bazel generation with merged, deduplicated output",
      },
      { value: "n−1 + n", label: "Dual-release CSS compatibility" },
    ],
    benchmarks: [
      {
        name: "Cold CSS builds",
        before: "497s",
        after: "71s",
        result: "7× faster",
      },
      {
        name: "Bazel actions",
        before: "18,734",
        after: "181",
        result: "~103× fewer",
      },
      {
        name: "Merged CSS build",
        before: "48.6s",
        after: "34.3s",
        result: "~30% less time",
      },
    ],
    benchmarkNote:
      "Supporting performance work: cold-build benchmarks covered 33,852 cache-busted source files. Incremental CSS generation stays under 3s.",
  },
  {
    id: "typed-forms",
    number: "05",
    company: "RUBRIK / ENGINEERING INITIATIVES",
    title: "The form type-safety\ninitiative.",
    description:
      "I made our form library type-safe by introducing the complex ConditionalPaths type utility, which validates nested field names and value types at compile time. I led the codebase-wide migration as a crowdsourced initiative, with engineers across teams contributing through shared tooling, developer guides, and lint guardrails.",
    tags: ["TypeScript", "Formik", "Static analysis", "Migration leadership"],
    metric: "2,160",
    label: "form field usages stress-tested",
    detail:
      "A migration I led, with contributions from engineers across the codebase.",
    visual: "facts",
    facts: [
      { value: "52.5%", label: "Coverage in the recorded stress test" },
      { value: "~26s", label: "TsGo compile time in that test" },
      { value: "Applause", label: "Award for the type-safety initiative" },
    ],
  },
  {
    id: "slack-notify",
    number: "06",
    company: "RUBRIK / AI DEVELOPER TOOLING",
    title: "Your session.\nWherever you are.",
    description:
      "I built slack-notify end to end so engineers could approve, answer, and steer their Claude Code sessions from Slack. Milano brings the session to your DMs when it needs you. Running on a DevPod with tmux, the work keeps going even when your laptop is asleep.",
    highlights: [
      "Owned the full stack: local Claude hooks, Redis-backed polling, Slack service interactions, and database changes.",
      "Approve or decline with a reason, answer questions, view session context, and send the next instruction, all from a Slack DM.",
    ],
    tags: ["Claude Code", "Slack", "Redis", "Full-stack engineering"],
    metric: "10,000+",
    label: "requests in the first 2 days",
    detail:
      "From local hooks to your phone, with the session context alongside every decision.",
    visual: "facts",
    facts: [
      { value: "Approve · Answer · Steer", label: "Control from a Slack DM" },
      { value: "Hooks ↔ Redis ↔ Slack", label: "Full-stack integration" },
    ],
  },
  {
    id: "intelligence",
    number: "07",
    company: "WHATFIX / APPLIED AI",
    title: "Better answers.\nBuilt from the ground up.",
    description:
      "I introduced hybrid search and a reranking model into Whatfix’s retrieval-augmented generation pipeline, improving product accuracy from 42% to 90%. I also built a benchmarking pipeline for observability and experiments, combining deterministic checks with LLM-as-a-judge evaluations, an approach that was still relatively novel at the time.",
    tags: ["RAG", "Hybrid search", "Reranking", "LLM evaluation"],
    metric: "90%",
    label: "RAG product accuracy",
    detail:
      "Up from a 42% baseline, through retrieval-pipeline improvements and tuning.",
    visual: "comparison",
    from: "42%",
    to: "90%",
    before: 42,
    after: 90,
  },
  {
    id: "hybrid-testing",
    number: "08",
    company: "WHATFIX / CROSS-PLATFORM TESTING",
    title: "One framework.\nWeb and native, together.",
    description:
      "I designed and built a Node.js UI testing framework from scratch for web, hybrid, and native desktop applications on macOS and Windows. It handles application startup and uses Puppeteer over the Chrome DevTools Protocol (CDP) for web interactions, alongside XCTest for native macOS automation. A common interface lets the same test code drive web and native UI. Thin adapters reuse Java/TestNG test cases, with REST and STDIN/OUT pipes connecting the processes.",
    tags: ["Node.js", "Java / TestNG", "Puppeteer / CDP", "XCTest", "IPC"],
    metric: "One",
    label: "framework for web, hybrid, and native apps",
    detail:
      "Shared test code covers native and web interactions within the same hybrid application.",
    visual: "facts",
    facts: [
      { value: "macOS + Windows", label: "Desktop platforms" },
      { value: "Java / TestNG", label: "Existing test cases reused" },
      { value: "REST + stdio", label: "Communication between processes" },
    ],
  },
];
