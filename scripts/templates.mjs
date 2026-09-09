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
// EVERY PIECE IS FLUSH. The artwork fills its own frame edge to edge, with no
// margin and no backdrop. An earlier pass set all of it on the site's pink sky,
// which was wrong twice over: the sky is the page background BEHIND the board,
// and the site never puts the wordmark on it, so the gradient type blended
// straight into it. The masthead is a solid panel (App.jsx → bg-primary-soft),
// and that is what the banner reproduces.

const TOKENS = `
  --ink: #3d3660;
  --paper: #fbf3e9;
  --label: #5a5393;
  --primary-soft: #eceaf8;
  --rose: #f58fbe;
  --rose-soft: #f3c9dc;
  --violet-soft: #d8cfee;
  --blue-soft: #cbdcf0;
  --orchid-soft: #eccfe8;
  --wordmark-from: #5b82be;
  --wordmark-via: #8e7dc4;
  --wordmark-to: #d77ba9;
`;

// Fredoka is the display face, Nunito the body, Lilita One the wordmark and
// Caveat the handwriting. Same four the site loads, from the same place, so the
// render matches the site rather than approximating it.
const FONTS =
  "https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700" +
  "&family=Nunito:wght@400;600;700&family=Lilita+One&family=Caveat:wght@400;600&display=swap";

function shell(width, height, body, extraCss = "") {
  return `<!doctype html>
<html><head><meta charset="utf-8">
<link rel="stylesheet" href="${FONTS}">
<style>
  :root {${TOKENS}}
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: ${width}px; height: ${height}px; }
  body {
    font-family: "Nunito", system-ui, sans-serif;
    color: var(--ink);
    background: transparent;
    overflow: hidden;
  }
  .eyebrow {
    font-family: "Nunito", system-ui, sans-serif;
    font-size: 15px; font-weight: 600; text-transform: uppercase;
    letter-spacing: .08em; color: var(--ink);
  }
  ${extraCss}
</style></head><body>${body}</body></html>`;
}

// ─── Banner ────────────────────────────────────────────────────────────────
// The site's masthead: a solid lavender-white panel inside a heavy ink border,
// carrying the Lilita One wordmark. The gradient is filled behind an ink
// stroke, and `paint-order: stroke fill` is what keeps that stroke outside the
// letterform instead of eating into it.
export const banner = {
  name: "banner",
  width: 1200,
  height: 260,
  html: () =>
    shell(
      1200,
      260,
      `
  <div class="panel">
    <span class="bracket tl"></span><span class="bracket tr"></span>
    <span class="bracket bl"></span><span class="bracket br"></span>
    <div class="block">
      <p class="eyebrow">Hey there, I&rsquo;m</p>
      <h1 class="wordmark">Noah Park-Nguyen</h1>
      <p class="eyebrow right">A Full-Stack Developer</p>
      <div class="rule"><span class="line"></span><span class="dot"></span><span class="line"></span></div>
    </div>
  </div>`,
      `
  .panel {
    position:relative; width:100%; height:100%;
    background: var(--primary-soft); border:4px solid var(--ink);
    display:flex; align-items:center; justify-content:center;
  }
  .bracket { position:absolute; width:18px; height:18px; opacity:.5; }
  .tl { top:14px; left:14px; border-left:3px solid var(--ink); border-top:3px solid var(--ink); }
  .tr { top:14px; right:14px; border-right:3px solid var(--ink); border-top:3px solid var(--ink); }
  .bl { bottom:14px; left:14px; border-left:3px solid var(--ink); border-bottom:3px solid var(--ink); }
  .br { bottom:14px; right:14px; border-right:3px solid var(--ink); border-bottom:3px solid var(--ink); }
  .block { text-align:left; }
  .wordmark {
    font-family: "Lilita One", cursive;
    font-size: 78px; line-height: .95; text-transform: uppercase;
    color: transparent;
    background-image: linear-gradient(100deg, var(--wordmark-from), var(--wordmark-via), var(--wordmark-to));
    -webkit-background-clip: text; background-clip: text;
    -webkit-text-stroke: 2.5px var(--ink);
    paint-order: stroke fill;
    margin: 3px 0 5px;
  }
  .right { text-align:right; }
  .rule { display:flex; align-items:center; gap:8px; margin-top:12px; }
  .line { height:3px; flex:1; background:var(--ink); }
  .dot { width:8px; height:8px; border-radius:50%; background:var(--ink); }`,
    ),
};

// ─── Project cards ─────────────────────────────────────────────────────────
// One image per project so each can be its own link in the README. The card
// fills the whole frame, so the render is a clean rectangle with the ink border
// on its outside edge. The pin sits inside the card rather than straddling the
// top edge, which is what a tilt and a margin used to make room for.
const CARDS = [
  {
    id: "statmon",
    title: "Statmon",
    tint: "var(--violet-soft)",
    blurb:
      "A simple set of Pokémon tools. Compare stats, view type matchups, and play games.",
    tags: ["React", "Vite", "Tailwind", "Cloudflare"],
    note: "statmon.noahparknguyen.workers.dev",
  },
  {
    id: "hubspot",
    title: "HubSpot Tool",
    tint: "var(--blue-soft)",
    blurb:
      "A discovery tool that lets you see what your website is built with, and recommends HubSpot products that could replace them.",
    tags: ["Node", "React", "Docker", "Jest"],
    note: "hubspot-recommendation-tool.onrender.com",
  },
  {
    id: "portfolio",
    title: "Portfolio",
    tint: "var(--orchid-soft)",
    blurb:
      "My personal website. A bulletin board where I show off both my professional work and hobbies.",
    tags: ["React", "Vite", "Tailwind", "Cloudflare"],
    note: "noahpn.dev",
  },
];

export const cards = CARDS.map((c) => ({
  name: `card-${c.id}`,
  width: 420,
  height: 245,
  html: () =>
    shell(
      420,
      245,
      `
  <div class="card">
    <span class="pin"><i></i></span>
    <h2>${c.title}</h2>
    <p class="blurb">${c.blurb}</p>
    <div class="tags">${c.tags.map((t) => `<span class="tag">${t}</span>`).join("")}</div>
    <p class="note">${c.note}</p>
  </div>`,
      `
  .card {
    position:relative; width:100%; height:100%;
    background: ${c.tint}; border:3px solid var(--ink);
    padding:16px 18px 14px;
    display:flex; flex-direction:column;
  }
  .pin {
    display:block; width:15px; height:15px; border-radius:50%;
    border:2px solid var(--ink); background:var(--rose);
    position:absolute; top:12px; right:16px;
  }
  .pin i { display:block; width:4px; height:4px; border-radius:50%; background:var(--paper); margin:2px 0 0 2px; }
  h2 { font-family:"Fredoka", system-ui, sans-serif; font-size:26px; font-weight:600; line-height:1.1; padding-right:28px; }
  .blurb { font-size:16px; line-height:1.45; margin-top:6px; color:#4b4468; }
  .tags { display:flex; flex-wrap:wrap; gap:5px; margin-top:auto; padding-top:10px; }
  .tag {
    font-size:12px; font-weight:700; letter-spacing:.04em; text-transform:uppercase;
    border:2px solid var(--ink); background:var(--paper); padding:3px 7px;
  }
  .note { font-family:"Caveat", cursive; font-size:21px; white-space:nowrap; color:var(--label); margin-top:7px; line-height:1; }`,
    ),
}));

// ─── Tech stamps ───────────────────────────────────────────────────────────
// The site's TechStack widget, which is a row of stamps. Each one renders as
// its OWN image so the README can link it to that tool's homepage, the same way
// the site's stamps are links. One combined strip could only ever carry one
// link, which is why this is seven files rather than one.
//
// The hrefs are the same ones the site uses (TechStack.jsx). The tint order is
// solved, not chosen: two stamps touch whenever they sit 1, 3 or 4 apart once
// the row wraps, so no pair at those distances may share a hue. Re-run the
// solver in the commit that added this if you reorder or add one.
//
// Editors are deliberately absent. The strip is things I build WITH, and an IDE
// is where I sit, not part of the stack. That rule is inherited from the site.
const STAMPS = [
  {
    slug: "react",
    label: "React",
    tint: "var(--rose-soft)",
    href: "https://react.dev",
  },
  {
    slug: "tailwindcss",
    label: "Tailwind",
    tint: "var(--violet-soft)",
    href: "https://tailwindcss.com",
  },
  // Java is NOT in Simple Icons, which dropped it at the rights holder's request.
  // The site uses react-icons' FaJava, which is Font Awesome Free's coffee cup, so
  // that same glyph is inlined here rather than swapped for OpenJDK's Duke. It is
  // the fallback the site already makes for both Java and LinkedIn.
  // Font Awesome Free, CC BY 4.0 — see CREDITS.md.
  {
    label: "Java",
    tint: "var(--rose-soft)",
    href: "https://www.java.com",
    viewBox: "0 0 384 512",
    path: "M277.74 312.9c9.8-6.7 23.4-12.5 23.4-12.5s-38.7 7-77.2 10.2c-47.1 3.9-97.7 4.7-123.1 1.3-60.1-8 33-30.1 33-30.1s-36.1-2.4-80.6 19c-52.5 25.4 130 37 224.5 12.1zm-85.4-32.1c-19-42.7-83.1-80.2 0-145.8C296 53.2 242.84 0 242.84 0c21.5 84.5-75.6 110.1-110.7 162.6-23.9 35.9 11.7 74.4 60.2 118.2zm114.6-176.2c.1 0-175.2 43.8-91.5 140.2 24.7 28.4-6.5 54-6.5 54s62.7-32.4 33.9-72.9c-26.9-37.8-47.5-56.6 64.1-121.3zm-6.1 270.5a12.19 12.19 0 0 1-2 2.6c128.3-33.7 81.1-118.9 19.8-97.3a17.33 17.33 0 0 0-8.2 6.3 70.45 70.45 0 0 1 11-3c31-6.5 75.5 41.5-20.6 91.4zM348 437.4s14.5 11.9-15.9 21.2c-57.9 17.5-240.8 22.8-291.6.7-18.3-7.9 16-19 26.8-21.3 11.2-2.4 17.7-2 17.7-2-20.3-14.3-131.3 28.1-56.4 40.2C232.84 509.4 401 461.3 348 437.4zM124.44 396c-78.7 22 47.9 67.4 148.1 24.5a185.89 185.89 0 0 1-28.2-13.8c-44.7 8.5-65.4 9.1-106 4.5-33.5-3.8-13.9-15.2-13.9-15.2zm179.8 97.2c-78.7 14.8-175.8 13.1-233.3 3.6 0-.1 11.8 9.7 72.4 13.6 92.2 5.9 233.8-3.3 237.1-46.9 0 0-6.4 16.5-76.2 29.7zM260.64 353c-59.2 11.4-93.5 11.1-136.8 6.6-33.5-3.5-11.6-19.7-11.6-19.7-86.8 28.8 48.2 61.4 169.5 25.9a60.37 60.37 0 0 1-21.1-12.8z",
  },
  {
    slug: "python",
    label: "Python",
    tint: "var(--violet-soft)",
    href: "https://www.python.org",
  },
  {
    slug: "figma",
    label: "Figma",
    tint: "var(--blue-soft)",
    href: "https://www.figma.com",
  },
  {
    slug: "obsidian",
    label: "Obsidian",
    tint: "var(--orchid-soft)",
    href: "https://obsidian.md",
  },
  {
    slug: "spring",
    label: "Spring",
    tint: "var(--blue-soft)",
    href: "https://spring.io",
  },
];

export const stamps = STAMPS.map((s) => ({
  name: `stamp-${s.label.toLowerCase()}`,
  width: 138,
  height: 112,
  transparent: true,
  href: s.href,
  label: s.label,
  html: () =>
    shell(
      138,
      112,
      `
  <div class="stamp">
    ${
      s.path
        ? `<svg viewBox="${s.viewBox}" fill="#3d3660" aria-hidden="true"><path d="${s.path}"/></svg>`
        : `<img src="https://cdn.simpleicons.org/${s.slug}/3d3660" alt="">`
    }
    <span>${s.label}</span>
  </div>`,
      `
  .stamp {
    width:100%; height:100%; background:${s.tint};
    border:3px solid var(--ink);
    display:flex; flex-direction:column; align-items:center; justify-content:center;
  }
  .stamp svg, .stamp img { width:34px; height:34px; display:block; }
  .stamp span {
    display:block; margin-top:6px;
    font-family:"Fredoka", system-ui, sans-serif;
    font-size:17px; font-weight:600; color:var(--ink);
  }`,
    ),
}));

// ─── Section labels ────────────────────────────────────────────────────────
// The site's LabelTag: a white strip inside a 2px ink border, lifted by the
// same hard offset shadow (LabelTag.jsx). On the site these sit above a widget
// or a section, and they do the same job here.
//
// These are captured by SELECTOR rather than by viewport, so the image is
// whatever width the text needs. A fixed canvas would either clip a long label
// or pad a short one with dead space, and the two labels are different lengths.
const LABELS = [
  { name: "label-projects", text: "My Projects" },
  { name: "label-stack", text: "My Current Tech Stack" },
];

export const labels = LABELS.map((l) => ({
  name: l.name,
  width: 700,
  height: 160,
  transparent: true,
  selector: "#tag",
  html: () =>
    shell(
      700,
      160,
      `<div id="tag"><span class="label">${l.text}</span></div>`,
      `
  /* The wrapper is what gets captured, and its padding is what stops the
     offset shadow being clipped at the edge of the crop. */
  #tag { display:inline-block; padding:3px 7px 7px 3px; }
  .label {
    display:inline-block; background:#ffffff;
    border:2px solid var(--ink); box-shadow:4px 4px 0 0 var(--ink);
    padding:6px 14px;
    font-family:"Fredoka", system-ui, sans-serif;
    font-size:21px; font-weight:600; color:var(--ink); line-height:1.2;
  }`,
    ),
}));

// ─── GitHub social preview ─────────────────────────────────────────────────
// 1280x640, the 2:1 GitHub asks for. It appears when the REPO is linked in
// Slack, a tweet, a Discord paste. It is NOT the card for the profile page
// itself, which GitHub builds from the avatar, and it is often rendered around
// 500px wide, so this is a few words at a large size rather than a showcase.
//
// PNG, not WebP: GitHub's social preview upload accepts PNG, JPG and GIF only.
// And it lives in docs/ rather than assets/ because GitHub stores the real one
// outside the repo, so this is the checked-in copy of something uploaded by
// hand. Same convention as statmon's docs/preview.png.
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
      `
  <div class="panel">
    <span class="bracket tl"></span><span class="bracket tr"></span>
    <span class="bracket bl"></span><span class="bracket br"></span>
    <div class="block">
      <p class="eyebrow">Hey there, I&rsquo;m</p>
      <h1 class="wordmark">Noah Park-Nguyen</h1>
      <p class="eyebrow right">A Full-Stack Developer</p>
      <div class="rule"><span class="line"></span><span class="dot"></span><span class="line"></span></div>
      <div class="foot">
        <span class="eyebrow">Ottawa, Ontario</span>
        <span class="eyebrow">noahpn.dev</span>
      </div>
    </div>
  </div>`,
      `
  .panel {
    position:relative; width:100%; height:100%;
    background: var(--primary-soft); border:8px solid var(--ink);
    display:flex; align-items:center; justify-content:center;
  }
  /* Content stays well inside the edge, because some surfaces crop a 2:1 card
     to their own ratio rather than letterboxing it. */
  .bracket { position:absolute; width:34px; height:34px; opacity:.5; }
  .tl { top:34px; left:34px; border-left:5px solid var(--ink); border-top:5px solid var(--ink); }
  .tr { top:34px; right:34px; border-right:5px solid var(--ink); border-top:5px solid var(--ink); }
  .bl { bottom:34px; left:34px; border-left:5px solid var(--ink); border-bottom:5px solid var(--ink); }
  .br { bottom:34px; right:34px; border-right:5px solid var(--ink); border-bottom:5px solid var(--ink); }
  .block { text-align:left; }
  .block .eyebrow { font-size:24px; letter-spacing:.1em; }
  .wordmark {
    font-family: "Lilita One", cursive;
    font-size: 104px; line-height: .95; text-transform: uppercase;
    color: transparent;
    background-image: linear-gradient(100deg, var(--wordmark-from), var(--wordmark-via), var(--wordmark-to));
    -webkit-background-clip: text; background-clip: text;
    -webkit-text-stroke: 3.5px var(--ink);
    paint-order: stroke fill;
    margin: 6px 0 8px;
  }
  .right { text-align:right; }
  .rule { display:flex; align-items:center; gap:12px; margin-top:22px; }
  .line { height:4px; flex:1; background:var(--ink); }
  .dot { width:11px; height:11px; border-radius:50%; background:var(--ink); }
  .foot { display:flex; justify-content:space-between; margin-top:16px; }`,
    ),
};

export const ALL = [banner, preview, ...labels, ...cards, ...stamps];
