import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const browser = await chromium.launch({ channel: "chrome", headless: true });
const output = "/tmp/naman-portfolio-preview";
await mkdir(output, { recursive: true });
const errors = [];
const projectsOnly = process.argv.includes("--projects-only");
const workOnly = process.argv.includes("--work-only");
const feedback = process.argv.includes("--feedback");
const introOnly = process.argv.includes("--intro-only");
const page = await browser.newPage({
  viewport: feedback
    ? { width: 973, height: 936 }
    : { width: 1440, height: 1000 },
  deviceScaleFactor: 1,
});
page.on("pageerror", (error) => errors.push(error.message));
page.on("console", (message) => {
  if (message.type() === "error") errors.push(message.text());
});
await page.goto("http://127.0.0.1:3000", { waitUntil: "networkidle" });
await page.waitForTimeout(1800);
await page.screenshot({
  animations: "disabled",
  path: `${output}/desktop-hero.png`,
});
for (const [selector, filename] of [
  ["#work", "desktop-impact"],
  ["#tooling", "desktop-go-migrations"],
  ["#css-builds", "desktop-pandacss"],
  ["#typed-forms", "desktop-forms"],
  ["#intelligence", "desktop-rag"],
  ["#hybrid-testing", "desktop-hybrid-testing"],
  ["#slack-notify", "desktop-slack-notify"],
  [".notify-demo-layout", "desktop-slack-demo"],
  [".notify-engineering", "desktop-slack-architecture"],
  ["#projects", "desktop-projects"],
  ["#hilbert-r-tree", "desktop-hilbert"],
  ["#small-projects", "desktop-small-projects"],
  ["#journey", "desktop-experience"],
  ["#contact", "desktop-contact"],
]) {
  if (
    introOnly ||
    (projectsOnly &&
      !["#hilbert-r-tree", "#small-projects"].includes(selector)) ||
    (workOnly && !["#hybrid-testing", "#slack-notify"].includes(selector))
  )
    continue;
  if (selector.startsWith(".notify-")) {
    await page.locator("#slack-notify .chapter-demo").evaluate((element) => {
      element.open = true;
    });
  }
  await page.locator(selector).evaluate((element) =>
    window.scrollTo({
      top: element.getBoundingClientRect().top + scrollY - 40,
      behavior: "instant",
    }),
  );
  await page.waitForTimeout(selector === "#hilbert-r-tree" ? 2700 : 1300);
  await page.screenshot({
    animations: "disabled",
    path: `${output}/${filename}.png`,
  });
}
if (!projectsOnly && !workOnly && !feedback && !introOnly) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += 650) {
      window.scrollTo({ top: y, behavior: "instant" });
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  });
  await page.waitForTimeout(1000);
  await page.screenshot({
    animations: "disabled",
    path: `${output}/desktop-full.png`,
    fullPage: true,
  });
}
console.log(
  "Desktop overflow:",
  await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
);
if (feedback) {
  for (const code of ["hin", "fre", "spa", "chi", "eng"]) {
    await page.locator(".lang-trigger").click();
    await page.locator(`#lang-${code}`).click();
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await page.waitForTimeout(900);
    await page.screenshot({
      path: `${output}/language-${code}.png`,
      animations: "disabled",
    });
  }
}
await page.setViewportSize({ width: 390, height: 844 });
await page.goto("http://127.0.0.1:3000", { waitUntil: "networkidle" });
await page.waitForTimeout(1800);
await page.screenshot({
  animations: "disabled",
  path: `${output}/mobile-hero.png`,
});
for (const [selector, filename] of [
  ["#tooling .chapter-benchmarks", "mobile-go-benchmarks"],
  ["#css-builds", "mobile-pandacss"],
  ["#hybrid-testing", "mobile-hybrid-testing"],
  ["#slack-notify", "mobile-slack-notify"],
  [".notify-demo-stage", "mobile-slack-demo"],
  [".notify-engineering", "mobile-slack-architecture"],
  ["#hilbert-r-tree", "mobile-hilbert"],
  ["#small-projects", "mobile-small-projects"],
]) {
  if (
    introOnly ||
    (projectsOnly &&
      !["#hilbert-r-tree", "#small-projects"].includes(selector)) ||
    (workOnly && !["#hybrid-testing", "#slack-notify"].includes(selector))
  )
    continue;
  if (selector.startsWith(".notify-")) {
    await page.locator("#slack-notify .chapter-demo").evaluate((element) => {
      element.open = true;
    });
  }
  await page.locator(selector).evaluate((element) =>
    window.scrollTo({
      top: element.getBoundingClientRect().top + scrollY - 35,
      behavior: "instant",
    }),
  );
  await page.waitForTimeout(selector === "#hilbert-r-tree" ? 2700 : 1000);
  await page.screenshot({
    animations: "disabled",
    path: `${output}/${filename}.png`,
  });
}
if (introOnly) {
  await page.locator(".bento-stack").scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await page.screenshot({
    path: `${output}/mobile-intro-tiles.png`,
    animations: "disabled",
  });
  const fallbackContext = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 320, height: 844 },
  });
  const fallbackPage = await fallbackContext.newPage();
  await fallbackPage.goto("http://127.0.0.1:3000");
  await fallbackPage.locator(".bento-stack").scrollIntoViewIfNeeded();
  await fallbackPage.screenshot({ path: `${output}/mobile-intro-no-js.png` });
  await fallbackContext.close();
}
console.log(
  "Mobile overflow:",
  await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
);
if (!projectsOnly && !workOnly && !feedback && !introOnly) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += 500) {
      window.scrollTo({ top: y, behavior: "instant" });
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  });
  await page.waitForTimeout(1000);
  await page.screenshot({
    animations: "disabled",
    path: `${output}/mobile-full.png`,
    fullPage: true,
  });
}
console.log("Runtime errors:", errors);
console.log("Screenshots:", output);
await browser.close();
