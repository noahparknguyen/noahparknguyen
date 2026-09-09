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
    font-size: 13px; font-weight: 600; text-transform: uppercase;
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
  height: 215,
  html: () =>
    shell(
      420,
      215,
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
  .blurb { font-size:14px; line-height:1.45; margin-top:6px; color:#4b4468; }
  .tags { display:flex; flex-wrap:wrap; gap:5px; margin-top:auto; padding-top:10px; }
  .tag {
    font-size:10px; font-weight:700; letter-spacing:.04em; text-transform:uppercase;
    border:2px solid var(--ink); background:var(--paper); padding:2px 6px;
  }
  .note { font-family:"Caveat", cursive; font-size:18px; white-space:nowrap; color:var(--label); margin-top:7px; line-height:1; }`,
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
  {
    slug: "openjdk",
    label: "Java",
    tint: "var(--rose-soft)",
    href: "https://www.java.com",
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
  width: 130,
  height: 104,
  transparent: true,
  href: s.href,
  label: s.label,
  html: () =>
    shell(
      130,
      104,
      `
  <div class="stamp">
    <img src="https://cdn.simpleicons.org/${s.slug}/3d3660" alt="">
    <span>${s.label}</span>
  </div>`,
      `
  .stamp {
    width:100%; height:100%; background:${s.tint};
    border:3px solid var(--ink);
    display:flex; flex-direction:column; align-items:center; justify-content:center;
  }
  .stamp img { width:32px; height:32px; display:block; }
  .stamp span {
    display:block; margin-top:6px;
    font-family:"Fredoka", system-ui, sans-serif;
    font-size:15px; font-weight:600; color:var(--ink);
  }`,
    ),
}));

export const ALL = [banner, ...cards, ...stamps];
