// The artwork for the profile README, as HTML that gets rendered to WebP by
// shoot-profile.mjs.
//
// WHY THIS EXISTS AT ALL: a GitHub README is Markdown plus sanitised HTML. No
// <style>, no classes, no CSS. The only way to carry the portfolio's look onto
// the profile is to bake it into images, so these templates are the source and
// assets/*.webp is the build output.
//
// The tokens below are copied from portfolio/src/index.css and must stay in
// step with it. They are duplicated rather than imported because this repo has
// no build step and no dependency on the portfolio, which is the right trade
// for a handful of small images.
//
// EACH PIECE IS THE SITE'S OWN, AT THE SITE'S OWN SIZE. The masthead, the
// stamps, the labels, and the contact cards copy the site's markup and its CSS
// sizes, so they are the same objects rather than lookalikes. The README then
// shows every piece at one zoom, ZOOM below, so they keep the proportions they
// have to each other on the site. The project cards are the one piece the site
// doesn't have, and they are built from its parts: the pinned card, the pin,
// and a book cover's type.
//
// Each piece is captured on a transparent canvas a few pixels bigger than the
// object, so its shadow and its tilted corners aren't clipped. The masthead is
// the site's solid panel (App.jsx → bg-primary-soft), never the pink sky behind
// it: the site never puts the wordmark on the sky, and the gradient type blends
// straight into it.

const TOKENS = `
  --ink: #3d3660;
  --paper: #fbf3e9;
  --label: #5a5393;
  --primary-soft: #eceaf8;
  --rose: #f58fbe;
  --blue: #9dbee6;
  --rose-soft: #f3c9dc;
  --violet-soft: #d8cfee;
  --blue-soft: #cbdcf0;
  --orchid-soft: #eccfe8;
  --wordmark-from: #5b82be;
  --wordmark-via: #8e7dc4;
  --wordmark-to: #d77ba9;
  --white: #ffffff;
  --gray-600: oklch(44.6% 0.03 256.802);
  --gray-700: oklch(37.3% 0.034 259.733);
`;
// The two grays are Tailwind's, which the site uses for body copy.

// Fredoka is the display face, Nunito the body, Lilita One the wordmark and
// Caveat the handwriting. The same request the site's `npm run vendor:fonts`
// makes, so the render gets the files the site serves.
const FONTS =
  "https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700" +
  "&family=Nunito:wght@400;600;700&family=Lilita+One&family=Caveat:wght@400;600&display=swap";

// The masthead band is 736px wide on the site from md up: max-w-3xl less the
// page's padding (App.jsx). Its 4px shadow makes the banner 740px wide, and the
// README shows it 846px wide, which is GitHub's README column on a desktop. Every
// other piece takes the same zoom, so the profile keeps the site's proportions.
const MASTHEAD = 736;
const SHADOW = 4;
export const README_COLUMN = 846;
export const ZOOM = README_COLUMN / (MASTHEAD + SHADOW);

function shell(width, height, body, extraCss = "") {
  return `<!doctype html>
<html><head><meta charset="utf-8">
<link rel="stylesheet" href="${FONTS}">
<style>
  :root {${TOKENS}}
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html { line-height: 1.5; }
  html, body { width: ${width}px; height: ${height}px; }
  body {
    font-family: "Nunito", system-ui, sans-serif;
    color: var(--ink);
    background: transparent;
    overflow: hidden;
  }
  /* Headings inherit their weight, as under Tailwind's preflight. Lilita One
     has one weight, and a bold h1 would make Chrome fake a heavier one. */
  h1, h2, h3 { font-size: inherit; font-weight: inherit; }
  /* The site's Overline role (the eyebrow utility), in its default tone. */
  .eyebrow {
    font-family: "Nunito", system-ui, sans-serif;
    font-size: 12px; line-height: 16px; font-weight: 600;
    text-transform: uppercase; letter-spacing: .025em; color: var(--label);
  }
  /* shadow-sticker: a hard ink offset with no blur, the site's only shadow. */
  .sticker { box-shadow: ${SHADOW}px ${SHADOW}px 0 0 var(--ink); }
  /* What gets captured. Its padding is the room for the shadow and the tilt. */
  #piece { display: inline-block; }
  ${extraCss}
</style></head><body><div id="piece">${body}</div></body></html>`;
}

// ─── Masthead ──────────────────────────────────────────────────────────────
// The site's Banner.jsx: the wordmark between two eyebrows, over a rule with the
// Hollow Knight pair standing on it. The gradient is filled behind an ink
// stroke, and `paint-order: stroke fill` keeps that stroke outside the
// letterform instead of eating into it.
const MASTHEAD_HTML = `
  <div class="name">
    <p class="eyebrow">Hey there, I&rsquo;m</p>
    <h1 class="wordmark">Noah Park-Nguyen</h1>
    <p class="eyebrow right">A Full-Stack Developer</p>
  </div>
  <div class="rule">
    <span class="line"></span><span class="dot"></span>
    <img src="vendor/hk-the-hollow-knight-and-knight.webp" alt="" width="144" height="84">
    <span class="dot"></span><span class="line"></span>
  </div>`;

const MASTHEAD_CSS = `
  .name { display:inline-block; text-align:left; }
  .wordmark {
    font-family: "Lilita One", cursive;
    font-size: 48px; line-height: 1; text-transform: uppercase;
    color: transparent;
    background-image: linear-gradient(100deg, var(--wordmark-from), var(--wordmark-via), var(--wordmark-to));
    -webkit-background-clip: text; background-clip: text;
    -webkit-text-stroke: 2px var(--ink);
    paint-order: stroke fill;
  }
  .right { text-align:right; }
  .rule { display:flex; align-items:flex-end; justify-content:center; gap:8px; }
  .line { flex:1; height:2px; margin-bottom:4px; background:var(--ink); }
  .dot { width:6px; height:6px; margin-bottom:2px; border-radius:50%; background:var(--ink); }
  .rule img { display:block; width:72px; height:auto; margin-bottom:-2px; }`;

// The band without the nav under it, so it closes with its own bottom border.
export const banner = {
  name: "banner",
  width: 800,
  height: 220,
  transparent: true,
  selector: "#piece",
  html: () =>
    shell(
      800,
      220,
      `<div class="band sticker"><header>${MASTHEAD_HTML}</header></div>`,
      `
  #piece { padding: 0 ${SHADOW}px ${SHADOW}px 0; }
  .band { width:${MASTHEAD}px; background:var(--primary-soft); border:4px solid var(--ink); }
  header { padding:16px 32px 4px; text-align:center; }
  ${MASTHEAD_CSS}`,
    ),
};

// ─── GitHub social preview ─────────────────────────────────────────────────
// 1280x640, the 2:1 GitHub asks for. It appears when the REPO is linked in
// Slack, a tweet, a Discord paste. It is NOT the card for the profile page
// itself, which GitHub builds from the avatar, and it is often rendered around
// 500px wide, so this is the masthead at twice its size rather than a showcase.
//
// PNG, not WebP: GitHub's social preview upload accepts PNG, JPG and GIF only.
// And it lives in docs/ rather than assets/ because GitHub stores the real one
// outside the repo, so this is the checked-in copy of something uploaded by
// hand. Same convention as statmon's docs/preview.png.
//
// Opaque and edge to edge, unlike the README's pieces, because the sites that
// show it pick their own background.
export const preview = {
  name: "preview",
  width: 1280,
  height: 640,
  file: "docs/preview.png",
  scale: 1,
  // Asserted, not eyeballed. A social image that is subtly off centre looks
  // fine in isolation and wrong beside anything else, and it is the first thing
  // anyone sees. Same guard statmon's shoot script runs.
  centre: ".wordmark",
  html: () =>
    shell(
      1280,
      640,
      `<div class="panel"><div class="block">${MASTHEAD_HTML}
        <div class="foot">
          <span class="eyebrow">Ottawa, Ontario</span>
          <span class="eyebrow">noahpn.dev</span>
        </div>
      </div></div>`,
      `
  #piece { display:block; width:100%; height:100%; }
  .panel {
    width:100%; height:100%;
    background: var(--primary-soft); border:8px solid var(--ink);
    display:flex; align-items:center; justify-content:center;
  }
  .block { zoom:2; width:550px; text-align:center; }
  .foot { display:flex; justify-content:space-between; margin-top:8px; }
  ${MASTHEAD_CSS}`,
    ),
};

// ─── Contact cards ─────────────────────────────────────────────────────────
// The site's Links.jsx index cards: a tinted card with a tab standing on its
// top edge, which holds the glyph. The site's three are GitHub, LinkedIn and
// Email. On GitHub the first would point at the page you're on, so the
// portfolio takes its place, its blue, and its tab on the left, with the
// site's favicon, the pin, as its glyph. Each card is narrower than the
// site's, so three fit across the README column.
//
// LinkedIn's mark is Font Awesome Free's bare "in" (react-icons' FaLinkedinIn),
// the same fallback the site makes, since Simple Icons dropped LinkedIn at the
// rights holder's request. CC BY 4.0: see CREDITS.md. Email has no brand mark,
// so it gets the site's drawn envelope.
const GLYPHS = {
  pin: `<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="7" style="fill:var(--rose);stroke:var(--ink);stroke-width:2"/><circle cx="6" cy="6" r="2" style="fill:var(--paper)"/></svg>`,
  linkedin: `<svg viewBox="0 0 448 512" aria-hidden="true" style="fill:var(--ink)"><path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"/></svg>`,
  envelope: `<svg viewBox="0 0 16 16" aria-hidden="true" style="fill:none;stroke:var(--ink);stroke-width:2"><rect x="1.5" y="3.5" width="13" height="9"/><path d="M1.5 4 L8 9 L14.5 4" style="stroke-linecap:round;stroke-linejoin:round"/></svg>`,
};

// The tints and tilts are the site's, in its order. Each tab sits where the
// site's does: left, centre, right.
const CONTACTS = [
  {
    id: "portfolio",
    label: "Portfolio",
    handle: "noahpn.dev",
    tint: "var(--blue-soft)",
    rotate: -1.5,
    tab: "left:12px;",
    glyph: GLYPHS.pin,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    handle: "in/noahparknguyen",
    tint: "var(--rose-soft)",
    rotate: 1,
    tab: "left:50%; transform:translateX(-50%);",
    glyph: GLYPHS.linkedin,
  },
  {
    id: "email",
    label: "Email",
    handle: "noahparknguyen@gmail.com",
    tint: "var(--violet-soft)",
    rotate: -1,
    tab: "right:12px;",
    glyph: GLYPHS.envelope,
  },
];

export const contacts = CONTACTS.map((c) => ({
  name: `contact-${c.id}`,
  width: 320,
  height: 160,
  transparent: true,
  selector: "#piece",
  fits: ".handle",
  html: () =>
    shell(
      320,
      160,
      `
  <div class="index sticker">
    <span class="tab">${c.glyph}</span>
    <div class="label">${c.label}</div>
    <div class="handle">${c.handle}</div>
  </div>`,
      `
  /* The tab stands 18px over the card, and the tilt lifts one corner. */
  #piece { padding:22px 8px 10px 4px; }
  .index {
    position:relative; width:224px; padding:12px;
    background:${c.tint}; border:2px solid var(--ink);
    transform:rotate(${c.rotate}deg);
  }
  /* No bottom border, and 2px down over the card's top border, in the card's
     tint, which joins the two. */
  .tab {
    position:absolute; bottom:calc(100% - 2px); ${c.tab}
    width:40px; height:20px; display:flex; align-items:center; justify-content:center;
    background:${c.tint}; border:2px solid var(--ink); border-bottom:0;
  }
  .tab svg { width:16px; height:16px; flex-shrink:0; display:block; }
  .label {
    border-bottom:2px solid var(--ink); padding-bottom:4px;
    font-family:"Fredoka", system-ui, sans-serif;
    font-size:18px; font-weight:700; line-height:1.25; color:var(--ink);
  }
  .handle {
    margin-top:4px; padding-bottom:2px; border-bottom:1px solid var(--blue);
    overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
    font-size:12px; line-height:16px; color:var(--gray-600);
  }`,
    ),
}));

// ─── Project cards ─────────────────────────────────────────────────────────
// One image per project so each can be its own link in the README. A pinned
// card (PinnedCard.jsx) with the site's pin on its top edge, and a book cover's
// type: the title in the card role, the summary in gray-700 at text-sm, and a
// handwritten note in ink. The summaries are the site's own (projects.js), and
// the tints are the books' covers. The portfolio has no book, so it takes the
// blue the other four leave free.
//
// In the README's order, which matches the pinned repos: two rows of two, then
// the fifth card centred below, under both cards of the second row. On a phone
// the cards stack in one column, in the same order. Touching cards never share
// a tint in either layout: re-check both if you reorder or add one.
const CARDS = [
  {
    id: "hubspot",
    title: "HubSpot Recommendation Tool",
    tint: "var(--blue-soft)",
    blurb:
      "A discovery tool built for Inbox, a HubSpot partner. Paste in a website&rsquo;s URL to see what it&rsquo;s built with, and which HubSpot product could replace each piece.",
    tags: ["Node", "React", "Docker", "Jest"],
    note: "hubspot-recommendation-tool.onrender.com",
  },
  {
    id: "elbaite",
    title: "Elbaite",
    tint: "var(--rose-soft)",
    blurb:
      "Emulators written in Java. The first, Achroite, runs CHIP-8 games on Windows and Linux with nothing else to install.",
    tags: ["Java", "Swing", "Maven", "JUnit"],
    note: "github.com/noahparknguyen/elbaite",
  },
  {
    id: "statmon",
    title: "Statmon",
    tint: "var(--violet-soft)",
    blurb:
      "A set of Pokémon tools: a stat comparison, the whole dex in one table, and a type chart, plus two games. Each one can be read as of any generation.",
    tags: ["React", "Vite", "Tailwind", "Cloudflare"],
    note: "statmon.noahpn.dev",
  },
  {
    id: "portfolio",
    title: "Portfolio",
    tint: "var(--blue-soft)",
    blurb:
      "My personal website. A bulletin board where I show off both my professional work and hobbies.",
    tags: ["React", "Vite", "Tailwind", "Cloudflare"],
    note: "noahpn.dev",
  },
  {
    id: "lite-type",
    title: "lite-type",
    tint: "var(--orchid-soft)",
    blurb:
      "A typing test for the desktop, with real code to practise on as well as words. It runs on Windows and Linux with nothing else to install.",
    tags: ["Java", "JavaFX", "Maven", "JUnit"],
    note: "github.com/noahparknguyen/lite-type",
  },
];

export const cards = CARDS.map((c) => ({
  name: `card-${c.id}`,
  width: 420,
  height: 280,
  transparent: true,
  selector: "#piece",
  // Every card is the same height, so the longest summary sets it. This fails
  // the render if any text spills out of a card, the note included.
  fits: ".card",
  html: () =>
    shell(
      420,
      280,
      `
  <div class="card sticker">
    <span class="pin"><i></i></span>
    <h2>${c.title}</h2>
    <p class="blurb">${c.blurb}</p>
    <div class="tags">${c.tags.map((t) => `<span class="tag">${t}</span>`).join("")}</div>
    <p class="note">${c.note}</p>
  </div>`,
      `
  #piece { padding:8px; }
  .card {
    position:relative; width:342px; height:218px;
    background:${c.tint}; border:2px solid var(--ink);
    padding:16px;
    display:flex; flex-direction:column;
  }
  /* Pin.jsx, placed as the site places it on a pinned card. */
  .pin {
    position:absolute; top:-8px; left:50%; transform:translateX(-50%);
    display:block; width:16px; height:16px; border-radius:50%;
    border:2px solid var(--ink); background:var(--rose);
  }
  .pin i { display:block; width:4px; height:4px; border-radius:50%; background:var(--paper); margin:2px 0 0 2px; }
  h2 { font-family:"Fredoka", system-ui, sans-serif; font-size:20px; font-weight:600; line-height:1.25; }
  .blurb { font-size:14px; line-height:20px; margin-top:8px; color:var(--gray-700); }
  .tags { display:flex; flex-wrap:wrap; gap:5px; margin-top:auto; padding-top:10px; }
  .tag {
    font-size:12px; line-height:16px; font-weight:700; letter-spacing:.04em; text-transform:uppercase;
    border:2px solid var(--ink); background:var(--paper); padding:2px 6px;
  }
  .note { font-family:"Caveat", cursive; font-size:20px; line-height:1; white-space:nowrap; color:var(--ink); margin-top:8px; }`,
    ),
}));

// ─── Tech stamps ───────────────────────────────────────────────────────────
// The site's TechStack stamps. Each one renders as its own image so the README
// can link it to that tool's homepage, the same way the site's stamps are
// links. One combined strip could only ever carry one link, which is why this
// is one file per stamp.
//
// The list is the career stack: skills I'm at least familiar with and have a
// real thing to talk about, with Java first. It runs from the backend to the
// frontend. The site's strip is my wider toolset, and its first six are these,
// in this order. The hrefs follow the site's (TechStack.jsx), and the tilts
// follow its alternation by position. The tint order is solved, not chosen.
// The row wraps on narrow screens with each line centred, so a stamp on a
// wrapped line sits under one or two of the stamps above it. With six stamps,
// at two to six to a line, only three pairs never touch: Java and React, Java
// and Tailwind, and Spring Boot and Tailwind. With four tints, Java and React
// must share one, and so must Spring Boot and Tailwind. The site's phone layout
// stacks both pairs, so it can't follow: Java, PostgreSQL, Node.js, and
// Tailwind match the site, while Spring Boot and React differ. Re-check the
// wraps if you reorder or add one.
//
// Editors are deliberately absent, because this row is the stack. The site's
// toolset has them.
const STAMPS = [
  // Java isn't in Simple Icons, which dropped it at the rights holder's request.
  // The site uses react-icons' FaJava, which is Font Awesome Free's coffee cup,
  // so that same glyph is inlined here rather than swapped for OpenJDK's Duke.
  // Font Awesome Free, CC BY 4.0: see CREDITS.md.
  {
    label: "Java",
    tint: "var(--rose-soft)",
    rotate: -3,
    href: "https://www.java.com",
    viewBox: "0 0 384 512",
    path: "M277.74 312.9c9.8-6.7 23.4-12.5 23.4-12.5s-38.7 7-77.2 10.2c-47.1 3.9-97.7 4.7-123.1 1.3-60.1-8 33-30.1 33-30.1s-36.1-2.4-80.6 19c-52.5 25.4 130 37 224.5 12.1zm-85.4-32.1c-19-42.7-83.1-80.2 0-145.8C296 53.2 242.84 0 242.84 0c21.5 84.5-75.6 110.1-110.7 162.6-23.9 35.9 11.7 74.4 60.2 118.2zm114.6-176.2c.1 0-175.2 43.8-91.5 140.2 24.7 28.4-6.5 54-6.5 54s62.7-32.4 33.9-72.9c-26.9-37.8-47.5-56.6 64.1-121.3zm-6.1 270.5a12.19 12.19 0 0 1-2 2.6c128.3-33.7 81.1-118.9 19.8-97.3a17.33 17.33 0 0 0-8.2 6.3 70.45 70.45 0 0 1 11-3c31-6.5 75.5 41.5-20.6 91.4zM348 437.4s14.5 11.9-15.9 21.2c-57.9 17.5-240.8 22.8-291.6.7-18.3-7.9 16-19 26.8-21.3 11.2-2.4 17.7-2 17.7-2-20.3-14.3-131.3 28.1-56.4 40.2C232.84 509.4 401 461.3 348 437.4zM124.44 396c-78.7 22 47.9 67.4 148.1 24.5a185.89 185.89 0 0 1-28.2-13.8c-44.7 8.5-65.4 9.1-106 4.5-33.5-3.8-13.9-15.2-13.9-15.2zm179.8 97.2c-78.7 14.8-175.8 13.1-233.3 3.6 0-.1 11.8 9.7 72.4 13.6 92.2 5.9 233.8-3.3 237.1-46.9 0 0-6.4 16.5-76.2 29.7zM260.64 353c-59.2 11.4-93.5 11.1-136.8 6.6-33.5-3.5-11.6-19.7-11.6-19.7-86.8 28.8 48.2 61.4 169.5 25.9a60.37 60.37 0 0 1-21.1-12.8z",
  },
  {
    slug: "springboot",
    label: "Spring Boot",
    file: "spring-boot",
    tint: "var(--blue-soft)",
    rotate: 2,
    href: "https://spring.io/projects/spring-boot",
  },
  {
    slug: "postgresql",
    label: "PostgreSQL",
    tint: "var(--violet-soft)",
    rotate: -2,
    href: "https://www.postgresql.org",
  },
  {
    slug: "nodedotjs",
    label: "Node.js",
    file: "node",
    tint: "var(--orchid-soft)",
    rotate: 3,
    href: "https://nodejs.org",
  },
  {
    slug: "react",
    label: "React",
    tint: "var(--rose-soft)",
    rotate: -3,
    href: "https://react.dev",
  },
  {
    slug: "tailwindcss",
    label: "Tailwind",
    tint: "var(--blue-soft)",
    rotate: 2,
    href: "https://tailwindcss.com",
  },
];

export const stamps = STAMPS.map((s) => ({
  name: `stamp-${s.file ?? s.label.toLowerCase()}`,
  width: 140,
  height: 120,
  transparent: true,
  selector: "#piece",
  // A label too long for the stamp fails the render rather than spilling out.
  fits: ".stamp span",
  href: s.href,
  label: s.label,
  html: () =>
    shell(
      140,
      120,
      `
  <div class="stamp sticker">
    ${
      s.path
        ? `<svg viewBox="${s.viewBox}" aria-hidden="true" style="fill:var(--ink)"><path d="${s.path}"/></svg>`
        : `<img src="https://cdn.simpleicons.org/${s.slug}/3d3660" alt="">`
    }
    <span>${s.label}</span>
  </div>`,
      `
  #piece { padding:3px 7px 7px 3px; }
  .stamp {
    width:80px; padding:8px; text-align:center;
    background:${s.tint}; border:2px solid var(--ink);
    transform:rotate(${s.rotate}deg);
  }
  .stamp svg, .stamp img { display:block; width:28px; height:28px; margin:0 auto; }
  /* The site's stamps only hold short names. Spring Boot and PostgreSQL are
     67px against the 60 between the padding, so a label may use the padding's
     width rather than wrap onto a second line. */
  .stamp span {
    display:block; margin:4px -8px 0; white-space:nowrap;
    font-size:12px; line-height:16px; font-weight:700; color:var(--ink);
  }`,
    ),
}));

// ─── Section labels ────────────────────────────────────────────────────────
// The site's LabelTag: a white strip inside a 2px ink border, lifted by the
// same hard offset shadow and tilted a degree, as Home's are. On the site
// these sit above a widget or a section, and they do the same job here. In
// sentence case, like Home's.
const LABELS = [
  { name: "label-projects", text: "My projects" },
  { name: "label-stack", text: "My current tech stack" },
];

export const labels = LABELS.map((l) => ({
  name: l.name,
  width: 400,
  height: 100,
  transparent: true,
  selector: "#piece",
  html: () =>
    shell(
      400,
      100,
      `<div class="label sticker"><h2>${l.text}</h2></div>`,
      `
  #piece { padding:3px 7px 7px 3px; }
  .label {
    display:inline-block; background:var(--white);
    border:2px solid var(--ink); padding:4px 12px;
    transform:rotate(1deg);
  }
  .label h2 {
    font-family:"Fredoka", system-ui, sans-serif;
    font-size:20px; line-height:28px; font-weight:600; color:var(--ink);
  }`,
    ),
}));

export const ALL = [banner, preview, ...contacts, ...labels, ...cards, ...stamps];
