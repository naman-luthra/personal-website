# Naman Luthra · personal website

An interactive engineering portfolio built with Next.js, React, TypeScript, and GSAP. The visual direction combines VS Code inspired blue, dark editor neutrals, cool light surfaces, and locally hosted Bricolage Grotesque typography.

## Run locally

```sh
npm install
npm run dev
```

Open http://localhost:3000. For a production preview, run `npm run build` followed by `npm start`.

## Where to edit

- `src/components/portfolio/data.ts`: experience, projects, contact details, and the résumé link.
- `src/components/portfolio/impact.ts`: eight featured outcomes, grouped Go benchmarks, PandaCSS architecture, the form type-safety initiative, Whatfix hybrid testing, and slack-notify.
- `src/components/portfolio/ImpactSection.tsx`: scroll-selected work chapters and embedded Slack demo.
- `src/components/portfolio/SlackNotifySection.tsx`: interactive Slack workflow demo and full-stack architecture, within the slack-notify work chapter.
- `src/components/portfolio/Locale.tsx` and `translations.json`: five-language selection and translated portfolio copy; keeps the original `language_code` preference.
- `src/components/portfolio/Portfolio.tsx`: page composition, projects, footer, and shared interactions.
- `src/components/portfolio/Hero.tsx`: the bento introduction: intro, portrait, Rubrik and BITS Pilani tiles, toolbox, résumé, and location.
- `src/components/portfolio/Journey.tsx`: separate work and education timelines.
- `src/components/portfolio/Contact.tsx` and `public/__forms.html`: the contact form, submitted through Netlify Forms. Keep the field names in both files in sync.
- `src/components/portfolio/SiteNav.tsx` and `LanguageMenu.tsx`: the floating navigation and the custom language menu.
- `src/components/portfolio/ImpactVisual.tsx`: project-specific build comparisons, release diagrams, typed code, hybrid testing, and Slack visuals.
- `src/components/portfolio/HilbertPreview.tsx`: the Hilbert spatial-ordering illustration and curve.
- `src/components/portfolio/SmallProjects.tsx`: nine earlier projects and learning entries with custom SVG illustrations.
- `src/components/portfolio/Monogram.tsx` and `monogramPaths.ts`: exact vector paths from the original `public/icons/nl.svg`, used by the navigation.
- `public/logos`: the Rubrik mark and BITS Pilani crest used in the introduction.
- `src/components/portfolio/usePortfolioMotion.ts`: GSAP scroll reveals and dimensional project animations.
- `src/app/globals.css`: responsive layout, typography, colors, and CSS motion.
- `src/app/layout.tsx` and `src/app/opengraph-image.tsx`: metadata and the generated social preview.

English, Hindi, French, Spanish, and Chinese are available from the navigation. The introduction, work stories, career, projects, contact, and navigation are translated locally, without a translation service. Technical product mockups and the interactive Slack demo retain English.

The project previews are illustrative interface concepts. Project links point to repositories, the live MakeMeFit app, or archived local screenshots. The previous site's content remains in the repository for reference.

## Motion and accessibility

The motion control persists the visitor's preference and pauses the toolbox marquee and scroll animations. The site honors `prefers-reduced-motion`. Content is server-rendered and remains readable without JavaScript.

Navigation, the language menu, timeline expanders, the contact form, email copying, and focus indicators support keyboard use. Mobile layouts show each impact metric inline instead of the desktop sticky display.

## Verify

```sh
npm run lint
npx tsc --noEmit
npm run build
npm run test:e2e
```

Browser tests use locally installed Google Chrome and start the production server if needed. They cover the introduction, motion preferences, the language menu, scroll chapters, Slack demo actions and keyboard dialogs, the work and education timelines, clipboard behavior, the Netlify contact form, mobile navigation, responsive widths, reduced motion, and the no-JavaScript fallback.

With the server running, `npm run preview:check` captures desktop and mobile screenshots to `/tmp/naman-portfolio-preview` and reports runtime errors and horizontal overflow.

## Contact form

Submissions go to the Netlify dashboard. Form detection must be enabled once under Site configuration → Forms, and an email notification can be added there for the `contact` form. Locally the POST has no handler, so the form shows the direct email fallback.

The font license is in `src/app/fonts/OFL.txt`.
