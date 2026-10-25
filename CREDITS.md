# Credits

The profile artwork in [`assets/`](assets/) is rendered by `npm run shoot` from
the templates in [`scripts/templates.mjs`](scripts/templates.mjs). It borrows a
few things, and they are credited here for the same reason the site's
[Colophon](https://noahpn.dev/credits) exists.

## Images

- **Technology marks** on the stamp strip — [Simple Icons](https://simpleicons.org),
  CC0 1.0. Fetched at render time and baked into the WebP, so the published
  image has no runtime dependency on the service. Each mark remains the
  trademark of its respective owner.
- **Java coffee cup** on the stack strip, and **LinkedIn's "in"** on its
  contact card — [Font Awesome Free](https://fontawesome.com), CC BY 4.0.
  Neither is in Simple Icons, which dropped both at the rights holders'
  request, so the site falls back to Font Awesome for them and this repo
  inlines the same glyphs.
- **Hollow Knight cameo** on the banner's rule
  (`vendor/hk-the-hollow-knight-and-knight.webp`) — Team Cherry. Used
  decoratively, as on the site, and it is not covered by this repo's licence.

## Fonts

Rendered from [Google Fonts](https://fonts.google.com), all under the SIL Open
Font License:

- **Lilita One** — the wordmark
- **Fredoka** — titles and labels
- **Nunito** — body copy, the small capitals, and the stamp labels
- **Caveat** — the handwriting in the card margins

## Licence

The code in `scripts/` is MIT, see [`LICENSE`](LICENSE). The writing, and the
rendered artwork insofar as it is mine, are not: the borrowed pieces above keep
their own terms.
