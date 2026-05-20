#!/usr/bin/env node
const fs = require("node:fs");
const path = require("node:path");
const { createRequire } = require("node:module");
const { pathToFileURL } = require("node:url");

function loadPlaywright() {
  try {
    return require("playwright");
  } catch (firstError) {
    const packageJson = path.join(process.cwd(), "package.json");
    if (fs.existsSync(packageJson)) {
      try {
        return createRequire(packageJson)("playwright");
      } catch {
        throw firstError;
      }
    }
    throw firstError;
  }
}

const { chromium } = loadPlaywright();

const guidePath = path.resolve(process.argv[2] || "guide.html");
const screenshotPath = path.resolve(process.argv[3] || "guide-preview.png");

function fail(message) {
  console.error(`[verify-guide] ${message}`);
  process.exitCode = 1;
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function staticChecks(html) {
  const forbidden = [
    { pattern: /\bTODO\b/i, label: "TODO" },
    { pattern: /\bTBD\b/i, label: "TBD" },
    { pattern: /placeholder/i, label: "placeholder" },
    { pattern: /\.slide\b/i, label: ".slide" },
    { pattern: /scroll-snap/i, label: "scroll-snap" },
    { pattern: /presentation-controls?/i, label: "presentation controls" },
    { pattern: /nav-dots?/i, label: "nav dots" },
    { pattern: /keydown[\s\S]{0,120}(ArrowRight|ArrowLeft|PageDown|PageUp)/i, label: "keyboard pagination" },
  ];

  for (const item of forbidden) {
    assert(!item.pattern.test(html), `Forbidden pattern found: ${item.label}`);
  }

  assert(/data-progress-bar/.test(html), "Missing reading progress bar");
  assert(/data-copy-target/.test(html), "Missing copy buttons");
  assert(/data-copy-source/.test(html), "Missing canonical copy sources");
  assert(/data-typewriter|prompt-template/.test(html), "Missing Command Typewriter or prompt-template");
}

async function checkViewport(page, viewport, label) {
  await page.setViewportSize(viewport);
  await page.goto(pathToFileURL(guidePath).href, { waitUntil: "networkidle" });

  const metrics = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    sections: document.querySelectorAll("main section[id], article section[id]").length,
    navLinks: document.querySelectorAll("nav a[href^='#']").length,
    copyButtons: document.querySelectorAll("[data-copy-target]").length,
    progressState: (() => {
      const style = getComputedStyle(document.querySelector("[data-progress-bar]"));
      return `${style.transform}|${style.width}`;
    })(),
  }));

  assert(metrics.scrollWidth <= metrics.clientWidth + 1, `${label}: horizontal overflow ${metrics.scrollWidth} > ${metrics.clientWidth}`);
  assert(metrics.sections >= 7, `${label}: expected at least 7 sections`);
  assert(metrics.navLinks >= metrics.sections, `${label}: expected nav links for sections`);
  assert(metrics.copyButtons >= 6, `${label}: expected at least 6 copy buttons`);

  const unresolved = await page.evaluate(() =>
    Array.from(document.querySelectorAll("nav a[href^='#']")).filter((link) => !document.querySelector(link.getAttribute("href"))).map((link) => link.getAttribute("href"))
  );
  assert(unresolved.length === 0, `${label}: unresolved nav links: ${unresolved.join(", ")}`);

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.55));
  await page.waitForTimeout(150);

  const afterScroll = await page.evaluate(() => ({
    progressState: (() => {
      const style = getComputedStyle(document.querySelector("[data-progress-bar]"));
      return `${style.transform}|${style.width}`;
    })(),
    activeHref: document.querySelector("nav a.is-active, nav a[aria-current='location']")?.getAttribute("href") || "",
    visibleSection: (() => {
      const sections = Array.from(document.querySelectorAll("main section[id], article section[id]"));
      const marker = window.scrollY + window.innerHeight * 0.32;
      let active = sections[0] ? `#${sections[0].id}` : "";
      for (const section of sections) {
        if (section.offsetTop <= marker) active = `#${section.id}`;
      }
      return active;
    })(),
  }));

  assert(afterScroll.progressState !== metrics.progressState, `${label}: progress bar did not change after scroll`);
  assert(afterScroll.activeHref, `${label}: active sidebar link missing after scroll`);
  assert(afterScroll.activeHref === afterScroll.visibleSection, `${label}: active sidebar ${afterScroll.activeHref} does not match visible section ${afterScroll.visibleSection}`);
}

async function checkCopyButtons(page) {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.addInitScript(() => {
    let clipboardText = "";
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async (text) => {
          clipboardText = String(text);
        },
        readText: async () => clipboardText,
      },
    });
  });
  await page.goto(pathToFileURL(guidePath).href, { waitUntil: "networkidle" });

  const buttons = await page.$$("[data-copy-target]");
  assert(buttons.length > 0, "No copy buttons to test");

  for (let index = 0; index < buttons.length; index += 1) {
    const result = await buttons[index].evaluate(async (button) => {
      const source = document.getElementById(button.dataset.copyTarget);
      const expected = source?.textContent || "";
      button.click();
      await new Promise((resolve) => setTimeout(resolve, 80));
      const copied = await navigator.clipboard.readText();
      return { expected, copied, label: button.dataset.copyTarget };
    });
    assert(result.expected.length > 0, `Copy source is empty for ${result.label}`);
    assert(result.copied === result.expected, `Copy mismatch for ${result.label}`);
  }
}

async function main() {
  assert(fs.existsSync(guidePath), `Guide not found: ${guidePath}`);
  const html = fs.readFileSync(guidePath, "utf8");
  staticChecks(html);

  const browser = await chromium.launch();
  const page = await browser.newPage();
  try {
    await checkViewport(page, { width: 1440, height: 1000 }, "desktop");
    await checkViewport(page, { width: 390, height: 844 }, "mobile");
    await checkCopyButtons(page);
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(pathToFileURL(guidePath).href, { waitUntil: "networkidle" });
    await page.screenshot({ path: screenshotPath, fullPage: true });
  } finally {
    await browser.close();
  }

  if (process.exitCode) process.exit(process.exitCode);
  console.log(`[verify-guide] passed: ${guidePath}`);
  console.log(`[verify-guide] screenshot: ${screenshotPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

