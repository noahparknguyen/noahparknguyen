#!/usr/bin/env node
// Renders the profile README's artwork into assets/*.webp.
//
//   npm install && npm run shoot
//
// Same shape as portfolio/scripts/shoot-docs.mjs and statmon/scripts/shoot-docs.mjs:
// find a real Chrome, render, write the file, report what it wrote. Artwork
// nobody can reproduce goes stale, and this is one command.
//
// Needs the network the first time, for the four Google fonts and the Simple
// Icons marks on the stamp strip. Both are baked into the output, so the
// published images depend on neither.

import { existsSync, mkdirSync, statSync, writeFileSync, rmSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import puppeteer from "puppeteer-core";
import { ALL } from "./templates.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..");
const OUT = resolve(ROOT, "assets");

// 1.5x, matching the portfolio's own screenshot script. The README displays the
// banner at 860px, so 1800 device pixels is comfortably over 2x there, and 2x
// capture only bought file size.
const SCALE = 1.5;

// A scratch file rather than setContent, so a template can reference anything
// beside it by a relative path the way an ordinary page would. It lives at the
// repo root because it is the only file the render needs on disk, and git will
// not carry an empty directory to hold it.
const SCRATCH = resolve(ROOT, ".render.html");

function findChrome() {
  for (const c of [
    process.env.CHROME_PATH,
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
  ]) {
    if (c && existsSync(c)) return c;
  }
  return null;
}

const chrome = findChrome();
if (!chrome) {
  console.error("  no Chrome binary found; set CHROME_PATH");
  process.exit(1);
}

mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: true,
  args: ["--no-sandbox", "--disable-gpu", "--force-color-profile=srgb"],
});

let failed = 0;

for (const piece of ALL) {
  const page = await browser.newPage();

  // A missing webfont or icon renders as a silent fallback, which is exactly
  // the kind of defect that ships unnoticed. Collect the failures and report
  // them instead.
  const missing = [];
  page.on("requestfailed", (r) => missing.push(r.url()));
  page.on("response", (r) => {
    if (r.status() >= 400) missing.push(`${r.status()} ${r.url()}`);
  });

  await page.setViewport({
    width: piece.width,
    height: piece.height,
    deviceScaleFactor: SCALE,
  });

  writeFileSync(SCRATCH, piece.html(), "utf8");
  await page.goto(pathToFileURL(SCRATCH).href, { waitUntil: "networkidle0" });
  await page.evaluateHandle("document.fonts.ready");

  const file = resolve(OUT, `${piece.name}.webp`);
  // `transparent` pieces sit straight on the README, which is a light ground for
  // some viewers and a dark one for others. Omitting the background is what lets
  // one image read on both.
  await page.screenshot({
    path: file,
    type: "webp",
    quality: 92,
    omitBackground: piece.transparent === true,
  });
  await page.close();

  const kb = (statSync(file).size / 1024).toFixed(0);
  const w = piece.width * SCALE;
  const h = piece.height * SCALE;
  console.log(`  ${piece.name}.webp — ${kb} KB, ${w}x${h}`);
  if (missing.length) {
    failed += missing.length;
    for (const m of missing) console.warn(`      could not load: ${m}`);
  }
}

await browser.close();
rmSync(SCRATCH, { force: true });

if (failed) {
  console.error(`\n  ${failed} asset(s) failed to load, so the render is wrong.`);
  process.exit(1);
}
console.log("\n  done");
