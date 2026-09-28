# Naman Luthra — personal website

An interactive engineering portfolio built with Next.js, React, TypeScript, Three.js, and GSAP. The visual direction combines VS Code–inspired blue, dark editor neutrals, cool light surfaces, and locally hosted Bricolage Grotesque typography.

## Run locally

```sh
npm install
npm run dev
```

Open http://localhost:3000. For a production preview, run `npm run build` followed by `npm start`.

## Where to edit

- `src/components/portfolio/data.ts`: experience, projects, and contact details.
- `src/components/portfolio/impact.ts`: eight featured outcomes, grouped Go benchmarks, PandaCSS architecture, the form type-safety initiative, Whatfix hybrid testing, and slack-notify.
- `src/components/portfolio/ImpactSection.tsx`: scroll-selected work chapters and embedded Slack demo.
- `src/components/portfolio/SlackNotifySection.tsx`: interactive Slack workflow demo and full-stack architecture, within the slack-notify work chapter.
- `src/components/portfolio/Locale.tsx` and `translations.json`: five-language selection and translated portfolio copy; keeps the original `language_code` preference.
- `src/components/portfolio/Portfolio.tsx`: personal introduction, employment and education, projects, navigation, and interactions.
- `src/components/portfolio/ImpactVisual.tsx`: project-specific build comparisons, release diagrams, typed code, hybrid testing, and Slack visuals.
- `src/components/portfolio/HilbertPreview.tsx`: the Hilbert spatial-ordering illustration and curve.
- `src/components/portfolio/SmallProjects.tsx`: nine earlier projects and learning entries with custom SVG illustrations.
- `src/components/portfolio/Monogram.tsx` and `monogramPaths.ts`: exact vector paths from the original `public/icons/nl.svg`, used by the header.
- `src/components/portfolio/TechStack.tsx` and `techStackItems.ts`: responsive placement and SVG fallbacks for React, TypeScript, Go, Python, and Node.js around the portrait.
- `src/components/portfolio/Sculpture.tsx`: raised tech logos on beveled tiles, rendered in one canvas with gentle pointer/scroll response.
- `src/components/portfolio/usePortfolioMotion.ts`: GSAP scroll reveals and dimensional project animations.
- `src/app/globals.css`: responsive layout, typography, colors, and CSS motion.
- `src/app/layout.tsx` and `src/app/opengraph-image.tsx`: metadata and the generated social preview.

English, Hindi, French, Spanish, and Chinese are available in the header. The introduction, work stories, career, projects, contact, and navigation are translated locally, without a translation service. Technical product mockups and the interactive Slack demo retain English.

The project previews are illustrative interface concepts. Project links point to repositories, the live MakeMeFit app, or archived local screenshots. The previous site's content remains in the repository for reference.

## Motion and accessibility

The motion control persists the visitor's preference. The site honors `prefers-reduced-motion`; the 3D render loop stops when paused, outside the viewport, or when the tab is hidden. Pixel density is capped for mobile performance. The SVG tech icons remain visible if WebGL is unavailable. Content is server-rendered and remains readable without JavaScript.

Navigation, native career disclosures, email copying, and focus indicators support keyboard use. Mobile layouts show each impact metric inline instead of the desktop sticky display.

## Verify

```sh
npm run lint
npx tsc --noEmit
npm run build
npm run test:e2e
```

Browser tests use locally installed Google Chrome and start the production server if needed. They cover the 3D scene, motion preferences, scroll chapters, Slack demo actions and keyboard dialogs, career disclosures, clipboard behavior, mobile navigation, responsive widths, reduced motion, and JavaScript/WebGL fallbacks.

With the server running, `npm run preview:check` captures desktop and mobile screenshots to `/tmp/naman-portfolio-preview` and reports runtime errors and horizontal overflow.

The font license is in `src/app/fonts/OFL.txt`.
