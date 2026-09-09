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

import {
  existsSync,
  mkdirSync,
  statSync,
  writeFileSync,
  rmSync,
} from "node:fs";
import { dirname, relative, resolve } from "node:path";
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

  // A piece may pin its own scale. `preview` does: GitHub asks for exactly
  // 1280x640 and resizes anything else, so rendering it at 1.5x would only make
  // a bigger file for GitHub to shrink again.
  const scale = piece.scale ?? SCALE;
  await page.setViewport({
    width: piece.width,
    height: piece.height,
    deviceScaleFactor: scale,
  });

  writeFileSync(SCRATCH, piece.html(), "utf8");
  await page.goto(pathToFileURL(SCRATCH).href, { waitUntil: "networkidle0" });
  await page.evaluateHandle("document.fonts.ready");

  // A piece may name its own destination. `preview` does, because GitHub's
  // social preview upload takes PNG and not WebP, and because it belongs in
  // docs/ rather than with the README's own artwork.
  const file = piece.file
    ? resolve(ROOT, piece.file)
    : resolve(OUT, `${piece.name}.webp`);
  const type = file.endsWith(".png") ? "png" : "webp";
  mkdirSync(dirname(file), { recursive: true });
  // A piece with a selector is cropped to that element, so its image is only as
  // wide as its content. Everything else fills the viewport edge to edge.
  const target = piece.selector ? await page.$(piece.selector) : page;
  if (piece.selector && !target) {
    console.error(`      ${piece.name}: no element matched ${piece.selector}`);
    process.exitCode = 1;
    await page.close();
    continue;
  }

  // Off-centre by a pixel or two looks fine on its own and wrong beside
  // anything else, and a social image is the first thing anyone sees. Measured
  // rather than trusted. This has to run before the page is closed.
  if (piece.centre) {
    const off = await page.evaluate((sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return Math.abs((r.left + r.right) / 2 - window.innerWidth / 2);
    }, piece.centre);
    if (off === null) {
      console.error(`      ${piece.name}: nothing matched ${piece.centre}`);
      process.exitCode = 1;
    } else if (off > 2) {
      console.error(
        `      ${piece.name}: ${piece.centre} is ${off.toFixed(1)}px off centre`,
      );
      process.exitCode = 1;
    }
  }

  // `transparent` pieces sit straight on the README, which is a light ground for
  // some viewers and a dark one for others. Omitting the background is what lets
  // one image read on both.
  await target.screenshot({
    path: file,
    type,
    // `quality` is a WebP/JPEG option; passing it with type "png" throws.
    ...(type === "webp" ? { quality: 92 } : {}),
    omitBackground: piece.transparent === true,
  });
  await page.close();

  const kb = (statSync(file).size / 1024).toFixed(0);
  // Selector-cropped pieces are only as big as their element, so report what
  // was actually written rather than the viewport it was rendered in.
  const shown = piece.selector
    ? "cropped to content"
    : `${piece.width * scale}x${piece.height * scale}`;
  console.log(`  ${relative(ROOT, file)} — ${kb} KB, ${shown}`);
  if (missing.length) {
    failed += missing.length;
    for (const m of missing) console.warn(`      could not load: ${m}`);
  }
}

await browser.close();
rmSync(SCRATCH, { force: true });

if (failed) {
  console.error(
    `\n  ${failed} asset(s) failed to load, so the render is wrong.`,
  );
  process.exit(1);
}
console.log("\n  done");
