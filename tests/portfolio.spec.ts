import { expect, test } from "@playwright/test";

test("renders the introduction without browser errors and remembers motion preferences", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Hi, I’m Naman." }),
  ).toBeVisible();
  await expect(page.locator(".bento-tile")).toHaveCount(7);
  await page.getByRole("button", { name: "Motion on" }).click();
  await expect(
    page.getByRole("button", { name: "Motion off" }),
  ).toHaveAttribute("aria-pressed", "false");
  await page.reload();
  await expect(page.getByRole("button", { name: "Motion off" })).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("data-motion", "off");
  expect(errors).toEqual([]);
});

test("introduces Naman before work, experience, and personal projects", async ({
  page,
}) => {
  await page.goto("/");
  const intro = page.locator("#home");
  await expect(page.locator(".bento-intro")).toContainText("UI infrastructure");
  await expect(page.locator(".bento-intro")).toContainText("Whatfix");
  await expect(page.locator(".bento-photo img")).toBeVisible();
  await expect(page.locator(".bento-now")).toContainText(
    "Software Engineer, G6",
  );
  await expect(page.locator(".bento-edu")).toContainText("BITS Pilani");
  await expect(page.locator(".bento-place")).toContainText("Bengaluru");
  await expect(intro.getByRole("link", { name: /Read it/ })).toHaveAttribute(
    "href",
    /docs\.google\.com\/document\/d\/.+\/preview$/,
  );
  await expect(
    intro.getByRole("link", { name: /Download PDF/ }),
  ).toHaveAttribute("href", /export\?format=pdf$/);
  // Headline metrics belong to the work stories, not the introduction.
  await expect(intro).not.toContainText("90%");
  await expect(intro).not.toContainText("Rust");
  expect(
    await page
      .locator("main > section")
      .evaluateAll((sections) => sections.map((section) => section.id)),
  ).toEqual(["home", "work", "journey", "projects", "contact"]);
  await expect(page.locator("#work #slack-notify")).toHaveCount(1);
  await expect(page.locator(".manifesto, .ticker")).toHaveCount(0);
});

test("restores all five languages with persistent translated content and working layouts", async ({
  page,
}) => {
  await page.setViewportSize({ width: 973, height: 936 });
  await page.goto("/");
  const trigger = page.locator(".lang-trigger");
  const choose = async (code: string) => {
    await trigger.click();
    await page.locator(`#lang-${code}`).click();
  };
  for (const [code, lang, greeting, work, project] of [
    ["hin", "hi", "नमस्ते, मैं नमन हूँ", "मैंने", "टाइमटेबल जनरेटर"],
    [
      "fre",
      "fr",
      "Bonjour, moi c’est Naman",
      "développement",
      "Générateur d’emplois du temps",
    ],
    ["spa", "es", "Hola, soy Naman", "desarrollo", "Generador de horarios"],
    ["chi", "zh", "你好，我是 Naman", "开发服务器", "课程表生成器"],
  ]) {
    await choose(code);
    await expect(page.locator("html")).toHaveAttribute("lang", lang);
    await expect(page.locator("h1")).toContainText(greeting);
    await expect(page.locator("#app-bundler > p").first()).toContainText(work);
    await expect(page.locator(".small-project h4").first()).toHaveText(project);
    await expect(page.locator("#tooling")).toContainText("0.014s");
    for (const width of [973, 390, 320]) {
      await page.setViewportSize({ width, height: 936 });
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `${code} at ${width}px`,
      ).toBe(true);
      const headerFits = await page
        .locator(".nav-shell")
        .evaluate((element) =>
          [...element.children]
            .filter((child) => getComputedStyle(child).display !== "none")
            .every(
              (child) => child.getBoundingClientRect().right <= innerWidth,
            ),
        );
      expect(headerFits, `${code} header at ${width}px`).toBe(true);
    }
  }
  await choose("spa");
  await page.reload();
  await expect(trigger).toContainText("Español");
  await expect(page.locator("h1")).toContainText("Hola, soy Naman");
  await expect(page.locator("html")).toHaveAttribute("lang", "es");
  // The menu is keyboard operable: open, move, select, and close with Escape.
  await trigger.focus();
  await page.keyboard.press("ArrowDown");
  await expect(page.getByRole("listbox")).toBeVisible();
  await page.keyboard.press("Home");
  await page.keyboard.press("Enter");
  await expect(page.locator("h1")).toHaveText("Hi, I’m Naman.");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("listbox")).toHaveCount(0);
});

test("scrolling and chapter links select the matching impact visualization", async ({
  page,
}) => {
  await page.goto("/");
  // Freeze continuous motion so this tests chapter selection independently.
  await page.getByRole("button", { name: "Motion on" }).click();
  for (const [id, value] of [
    ["app-bundler", "5×"],
    ["dev-experience", "5.1×"],
    ["tooling", ">70×"],
    ["css-builds", "~111"],
    ["typed-forms", "2,160"],
    ["slack-notify", "10,000+"],
    ["intelligence", "90%"],
    ["hybrid-testing", "One"],
  ]) {
    await page.locator(`#${id}`).evaluate((element) => {
      element.scrollIntoView({ block: "center", behavior: "instant" });
    });
    await expect(page.locator(".metric-value")).toContainText(value);
    const panel = await page.locator(".impact-display").boundingBox();
    expect(
      panel?.y,
      `${id} card remains visible at the reading position`,
    ).toBeGreaterThanOrEqual(0);
  }
  await page
    .getByRole("link", { name: "Read about faster initial page loads" })
    .click();
  await expect(page.locator(".metric-value")).toContainText("5×");
  await expect(
    page.locator('.chapter-nav a[aria-current="step"]'),
  ).toHaveAttribute("href", "#app-bundler");
});

test("outcome panels keep benchmark and architecture context", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  // Keep both adjacent chapters in view; the panel should follow the reading line.
  await page.locator("#typed-forms").evaluate((element) => {
    window.scrollTo({
      top: element.getBoundingClientRect().top + scrollY - 40,
      behavior: "instant",
    });
  });
  await expect(page.locator(".metric-value")).toContainText("2,160");
  await expect(page.locator(".impact-facts")).toContainText("52.5%");
  await expect(page.locator(".impact-facts")).toContainText("~26s");
  await expect(page.locator(".comparison")).toHaveCount(0);
  const goBenchmarks = page.locator("#tooling table");
  await expect(
    goBenchmarks.getByRole("row", { name: /Scanner \+ codegen/ }),
  ).toContainText("70s");
  await expect(
    goBenchmarks.getByRole("row", { name: /Illustrations/ }),
  ).toContainText("0.014s");
  await expect(
    goBenchmarks.getByRole("row", { name: /Animations/ }),
  ).toContainText("0.015s");
  await expect(
    goBenchmarks.getByRole("row", { name: /Translation IDs/ }),
  ).toContainText("6.3s");
  await expect(goBenchmarks.getByRole("row", { name: /Icons/ })).toContainText(
    "1.23s",
  );
  await expect(page.locator("#css-builds .impact-highlights")).toContainText(
    "backward compatibility across asynchronous release groups",
  );
  await expect(page.locator(".review-highlights")).toHaveCount(0);
});

test("slack-notify demo supports decisions, answers, follow-ups and keyboard dialogs", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#slack-notify");
  const section = page.locator("#slack-notify");
  await section.locator(".chapter-demo > summary").click();
  const modes = section.getByRole("group", {
    name: "Explore slack-notify interactions",
  });
  const actions = section.locator(".notify-message .notify-actions");
  const status = section.getByRole("status");
  const dialog = section.getByRole("dialog");
  await expect(section).toContainText("10,000+");
  await expect(section).toContainText("requests in the first 2 days");
  await section.locator(".notify-context summary").focus();
  await page.keyboard.press("Enter");
  await expect(section.locator(".notify-context")).toHaveAttribute("open", "");
  await actions.getByRole("button", { name: "Approve", exact: true }).click();
  await expect(status).toContainText("Approved.");
  await expect(
    actions.getByRole("button", { name: "Approve", exact: true }),
  ).toBeDisabled();
  await section.getByRole("button", { name: "Try again" }).click();
  await actions.getByRole("button", { name: "Deny", exact: true }).click();
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(
    actions.getByRole("button", { name: "Deny", exact: true }),
  ).toBeFocused();
  await actions.getByRole("button", { name: "Deny", exact: true }).click();
  await dialog.getByLabel("Reason (optional)").fill("Run focused checks first");
  await dialog.getByRole("button", { name: "Decline request" }).click();
  await expect(status).toContainText(
    "Request declined. Reason: Run focused checks first",
  );
  await modes.getByRole("button", { name: "Answer" }).click();
  await actions.getByRole("button", { name: "Answer question" }).click();
  await dialog.getByLabel("Full test suite", { exact: true }).check();
  await dialog.getByRole("button", { name: "Send response" }).click();
  await expect(status).toContainText("Answer sent: Full test suite");
  await section.getByRole("button", { name: "Try again" }).click();
  await actions.getByRole("button", { name: "Answer question" }).click();
  await dialog
    .getByLabel("Or write your own answer")
    .fill("Check the responsive layouts");
  await dialog.getByRole("button", { name: "Send response" }).click();
  await expect(status).toContainText(
    "Answer sent: Check the responsive layouts",
  );
  await modes.getByRole("button", { name: "Steer" }).click();
  await actions.getByRole("button", { name: "Reply & steer" }).click();
  await dialog
    .getByLabel("Your follow-up")
    .fill("Check the mobile layout next");
  await dialog.getByRole("button", { name: "Send response" }).click();
  await expect(status).toContainText(
    "Follow-up sent: Check the mobile layout next",
  );
  await section.getByRole("button", { name: "Try again" }).click();
  await actions.getByRole("button", { name: "Dismiss" }).click();
  await expect(status).toContainText("Dismissed.");
  await expect(section.locator(".notify-window-footer")).toContainText(
    "Session ended",
  );
});

test("work and education timelines expand, and email can be copied", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/");
  const groups = page.locator("#journey .tl-group");
  await expect(groups.nth(0).locator(".tl-group-head")).toContainText("Work");
  await expect(groups.nth(0).locator(".tl-item")).toHaveCount(4);
  await expect(groups.nth(1)).toHaveAttribute("id", "education");
  await expect(groups.nth(1).locator(".tl-item").first()).toContainText(
    "BITS Pilani",
  );
  const rubrik = groups.nth(0).locator(".tl-item").first();
  await expect(rubrik).toContainText("40s to 8s");
  await expect(rubrik).not.toContainText("1,000+ test files");
  const more = rubrik.getByRole("button", { name: "4 more" });
  await more.click();
  await expect(rubrik).toContainText("1,000+ test files");
  await expect(
    rubrik.getByRole("button", { name: "Show less" }),
  ).toHaveAttribute("aria-expanded", "true");
  await rubrik.getByRole("button", { name: "Show less" }).click();
  await expect(rubrik).not.toContainText("1,000+ test files");
  await expect(groups.nth(0).locator(".tl-item").nth(1)).toContainText(
    "42% to 90%",
  );
  await page.getByRole("button", { name: "Copy email address" }).click();
  await expect(page.locator("#contact").getByRole("status")).toHaveText(
    "Email copied!",
  );
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    "namanluthra31@gmail.com",
  );
  await expect(page.locator(".email-group a")).toHaveAttribute(
    "href",
    "mailto:namanluthra31@gmail.com",
  );
});

test("mobile navigation supports touch, Escape, and section links", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const menu = page.getByRole("button", { name: "Open navigation" });
  await menu.click();
  await expect(
    page.getByRole("navigation", { name: "Main navigation" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(menu).toBeFocused();
  await expect(menu).toHaveAttribute("aria-expanded", "false");
  await menu.click();
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Projects", exact: true })
    .click();
  await expect(page).toHaveURL(/#projects$/);
  await expect(menu).toHaveAttribute("aria-expanded", "false");
  await expect(page.locator("#projects h2").first()).toBeInViewport();
});

test("respects reduced motion and has no horizontal overflow across screen sizes", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "off");
  await expect(page.getByRole("button", { name: "Motion off" })).toBeVisible();
  for (const width of [320, 390, 768, 973, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `overflow at ${width}px`,
    ).toBe(true);
    const titleFits = await page
      .locator(".bento-intro h1")
      .evaluateAll((elements) =>
        elements.every(
          (element) => element.getBoundingClientRect().right <= innerWidth,
        ),
      );
    expect(titleFits, `headline fits at ${width}px`).toBe(true);
    const tablesFit = await page
      .locator(".chapter-benchmarks table")
      .evaluateAll((tables) =>
        tables.every(
          (table) => table.getBoundingClientRect().right <= innerWidth,
        ),
      );
    expect(tablesFit, `benchmark tables fit at ${width}px`).toBe(true);
  }
});

test("the content and tech icons remain usable without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3000");
  await expect(
    page.getByRole("heading", { name: "Hi, I’m Naman." }),
  ).toBeVisible();
  await expect(page.locator(".bento-stack")).toBeVisible();
  await expect(page.locator(".bento-marquee svg").first()).toBeVisible();
  await expect(page.locator(".impact-chapter")).toHaveCount(8);
  await expect(page.locator(".project-row")).toHaveCount(3);
  await expect(page.locator("#hilbert-r-tree .hilbert-map")).toBeVisible();
  await expect(page.locator(".small-project")).toHaveCount(9);
  await expect(page.locator(".small-project-drawing")).toHaveCount(9);
  await expect(page.locator("#slack-notify")).toContainText(
    "slack-notify end to end",
  );
  await expect(page.locator(".email-group a")).toHaveAttribute(
    "href",
    "mailto:namanluthra31@gmail.com",
  );
  await context.close();
});

test("contact form posts to Netlify Forms and falls back to email on failure", async ({
  page,
}) => {
  let body = "";
  await page.route("**/__forms.html", async (route) => {
    body = route.request().postData() ?? "";
    await route.fulfill({ status: 200, body: "" });
  });
  await page.goto("/#contact");
  const form = page.locator("form.contact-form");
  await form.getByPlaceholder("Your name").fill("Ada");
  await form.getByPlaceholder("Where I can reply").fill("ada@example.com");
  await form.getByRole("radio", { name: "A project idea" }).click();
  await form.getByPlaceholder("What are you building?").fill("A compiler");
  await form.getByRole("button", { name: /Send it/ }).click();
  await expect(form.getByRole("status")).toContainText("Message delivered.");
  const fields = new URLSearchParams(body);
  expect(fields.get("form-name")).toBe("contact");
  expect(fields.get("name")).toBe("Ada");
  expect(fields.get("email")).toBe("ada@example.com");
  expect(fields.get("topic")).toBe("A project idea");
  expect(fields.get("message")).toBe("A compiler");
  expect(fields.get("bot-field")).toBe("");

  await form.getByRole("button", { name: /Send another/ }).click();
  await page.unroute("**/__forms.html");
  await page.route("**/__forms.html", (route) =>
    route.fulfill({ status: 500, body: "" }),
  );
  await form.getByPlaceholder("Your name").fill("Ada");
  await form.getByPlaceholder("Where I can reply").fill("ada@example.com");
  await form.getByPlaceholder("What are you building?").fill("A compiler");
  await form.getByRole("button", { name: /Send it/ }).click();
  await expect(form.getByRole("alert").getByRole("link")).toHaveAttribute(
    "href",
    "mailto:namanluthra31@gmail.com",
  );
});
