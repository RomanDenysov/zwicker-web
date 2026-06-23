# Homepage Redesign – Implementation Guide

Translating the Figma homepage into the existing Payload + Next.js app.

## Source of truth

- **Figma:** node `679:785` ("Homepage Miro Version") → frame `679:786` "Homepage – Desktop" (1440px) and `679:876` "Homepage – Mobile (390px)".
  `https://www.figma.com/design/cFgXavBOptIwi0kCgFbYbr/Zwicker-Web?node-id=679-786`
- **Static reference:** `../../figma-homepage/index.html` — a faithful, self-contained HTML repro of the desktop frame with all 17 section images downloaded into `figma-homepage/assets/`. Use it as the pixel reference and as a source for the photography.

## TL;DR – current state vs. gap

Most of the system is already in place. Don't rebuild it.

**Already done**
- Full Figma palette + semantic tokens in `src/app/(frontend)/globals.css` (explicitly "aligned with Figma redesign (679:785)").
- Typography scale utilities: `.text-display`, `.text-h1`…`.text-h3`, `.text-label`, `.text-nav`, `.text-price`, `.text-eyebrow`, `.section-label(-dark|-center)`, `.copy-mark`.
- Grain texture overlay, `--radius: 3px`, dark-mode tokens, `data-theme="dark"` convention.
- Hero brand-morph `ZWICKER → ZW©KR` animation: `src/heros/HighImpact/index.tsx` + `.brand-morph` CSS.
- `HoursStrip` component, rendered automatically right after the hero by `src/heros/RenderHero.tsx`.
- **Every** section block exists and is registered in both `src/collections/Pages/index.ts` and `src/blocks/RenderBlocks.tsx`.

**Gap status**
1. **Display font — DONE.** Real **Bagoss Condensed** (licensed) is now wired via `next/font/local` + DM Sans for body. → see §2 for what changed and the one caveat.
2. **The `home` page is still the stock template** (`src/endpoints/seed/home-static.ts` = "Payload Website Template", `lowImpact` hero). It needs to be re-assembled from the blocks below. → **the remaining gap**, see §5.

Everything else is field content + light per-block polish.

---

## 1. Design tokens (already wired — just use them)

Pull from `globals.css`; reference via Tailwind v4 color utilities. Do **not** hardcode hex.

| Figma value | Role | CSS token | Tailwind class |
|---|---|---|---|
| `#a09976` | HoursBar / Pillars bg | `--background-olive` | `bg-background-olive` |
| `#603d24` | Rooms bg, menu prices | `--background-brown` / `--price` | `bg-background-brown`, `text-price` |
| `#d2cac0` | Restaurant section bg | `--background-warm` | `bg-background-warm` |
| `#c4d2c5` | Sage (Chef's heading, CTA on dark) | `--foreground-sage` / `--color-sage-300` | `text-foreground-sage`, `text-sage-300` |
| `#e5f0cb` | Pale lime (pillar numbers, footer logo) | `--color-sage-200` | `text-sage-200` |
| `#f5f4f0` / `#f2ede4` | On-dark text / hero cream | `--dark-foreground` / `--dark-foreground-soft` | `text-dark-foreground(-soft)` |
| `#1c1c1a` | Ink / default fg | `--foreground` / `--dark` | `text-foreground`, `bg-dark` |
| `rgba(255,255,255,.4)` | Muted-on-dark | `--dark-muted` | `text-dark-muted` |
| `rgba(28,28,26,.08)` | Hairline border | `--border` | `border-border` |
| `3px` | Corner radius | `--radius` | `rounded` |

Dark sections set `data-theme="dark"` on the `<section>` (see `PillarsBlock`) so on-dark tokens resolve correctly.

---

## 2. Fonts — DONE (real Bagoss Condensed)

Figma uses two families, now both wired:
- **Bagoss Condensed** (licensed) → all display/headings, nav, labels, menu item names. Exposed as `--font-display`.
- **DM Sans** → body, prices, phone numbers, addresses, fine print. Exposed as `--font-sans`.

### What was changed
1. **Font files** live in **`public/fonts/`** (`BagossCondensed-Regular/Medium` in woff2/woff/ttf/otf). Only the two `.woff2` are referenced for the web.
2. **`src/app/(frontend)/fonts.ts`** (new) — central font module. Exports `dmSans` (`next/font/google`, `subsets: ['latin','latin-ext']` for Slovak diacritics → `--font-dm-sans`), `bagoss` (`next/font/local` → `public/fonts/*.woff2`, weights 400/500 → `--font-bagoss`), `geistMono`, and a combined **`fontVariables`** className. `layout.tsx` now just does `import { fontVariables } from './fonts'` and sets `<html className={fontVariables}>`.
3. **`globals.css` `@theme`** — `--font-sans: var(--font-dm-sans), …` and `--font-display: var(--font-bagoss), 'Bagoss Condensed', …`. (Distinct var names avoid a self-referential loop with the `next/font` variables.)
4. **`globals.css` `@layer components`** — `font-family: var(--font-display)` added to `.text-display/.text-h1/.text-h2/.text-h3/.text-label/.text-nav/.text-eyebrow`; `.text-price` deliberately stays on DM Sans. `.brand-morph` (hero) also set to `--font-display`.

### The one caveat — no Light weight
This license includes only **Regular (400)** and **Medium (500)**. Figma's largest display type (hero `ZW©KR`, `©HEF'S TABLE`, footer logo, `Penzión Zwicker`) is drawn in **Bagoss Condensed Light (300)**. The `.text-display`/`.text-h1` utilities were therefore set to `font-weight: 400` (was 200) — the real typeface, ~one step heavier than the comp. If exact parity matters, obtain **Bagoss Condensed Light**, drop the `.woff2` into the same folder, add a `{ weight: '300' }` entry to the `localFont` `src`, and set those two utilities back toward 300.

> Validated by rendering the standalone reference (`figma-homepage/index.html`, updated to the same fonts): `document.fonts.check` passes and Slovak diacritics (Ý/Í/Ó/Š/Č) render correctly.

---

## 3. Section → block mapping

Figma top-to-bottom, mapped to existing blocks. All blocks are registered; status is about **content + visual parity**, not wiring.

| # | Figma section | Block / component | `blockType` | Status |
|---|---|---|---|---|
| 1 | NavBar | `Header` global + `src/Header/Component.client.tsx` | — (global) | Built; transparent-on-dark + scroll state done. Verify links + "Rezervovať" CTA. |
| 2 | Hero `ZW©KR` | `HighImpact` hero | `hero.type` | Built (brand-morph). Set `media` + dark theme. |
| 3 | HoursBar | `HoursStrip` | — (auto via `RenderHero`) | Built. Content from `Settings` global (Otváracie hodiny / Kontakt). |
| 4 | Horses Banner (image + © watermark) | `ImageBanner` | `imageBanner` | Built. Set image, `overlayHeading`, CTA, `height: lg`. © watermark = extra (see §4.4). |
| 5 | Pillars (Reštaurácia / Penzión / Svadby) | `PillarsBlock` | `pillars` | Built & matches Figma. Add 3 rows, `background: dark`. |
| 6 | Chef's Table | `ChefsHighlight` | `chefsHighlight` | Built (logo/heading/quote/details/badge). Use dark image. |
| 7 | Gallery collage | `GalleryStrip` | `galleryStrip` | Built. Confirm collage vs. row layout (Figma desktop is a loose collage). |
| 8 | Restaurant (menu + images) | `MenuPreview` (+ `MediaBlock` or images) | `menuPreview` | Built; pulls categories/items. `bg-background-warm`. |
| 9 | Interier (full-bleed + overlay) | `ImageBanner` | `imageBanner` | Built. Overlay text top-right, `height: lg`. |
| 10 | Rooms | `RoomsGrid` | `roomsGrid` | Built. `bg-background-brown`, overlay RoomCards. |
| 11 | Gallery strip (6 thumbs, brown) | `GalleryStrip` | `galleryStrip` | Built. Horizontal scroll variant on brown bg. |
| 12 | Footer | `Footer` global + `src/Footer/Component.tsx` | — (global) | Built. Verify brand `ZW©KR`, columns, contact, GDPR row. |

Other available blocks that map to subpages / the mobile frame (Intro carousel, Family Lunch, Pricing, Stats, Steps, ContactCards, Map, ChefsCourseMenu, ChefsRow, DailyMenuImage, EnSection) are out of scope for the homepage but already exist.

---

## 4. Per-section notes (parity checklist)

Only the things to verify/adjust — the structure already exists.

**4.1 Header (NavBar)** — links order: Jedálny lístok, Chef's Table, Rodinný obed, Galéria, Ubytovanie, Kontakt, + sage "Rezervovať" button (`bg-sage-300 text-foreground`, `rounded`, `.text-nav`). **Logo — DONE:** `src/components/Logo/Logo.tsx` now takes `variant: 'wordmark' | 'mark'`; the circular ©-monogram (`public/zwicker-logo.svg`, inlined with `fill="currentColor"` so it adapts to the dark/light header) is rendered via `variant="mark"` in the navbar, and the footer keeps `variant="wordmark"` (ZW©KR). Edit nav link content in the **Header** global, not the component.

**4.2 Hero** — `data-theme="dark"`, full-height, parallax dark image (`brightness-[0.55]`), `rgba(28,28,26,0.12)` overlay. Letters use `.brand-letter` (≈186px, tracking ≈126px). Already correct; just attach a hero `media` image.

**4.3 HoursBar** — olive bar; label "OTVÁRACIE HODINY", three day-ranges, phone block right-aligned. Data is read from the `Settings` global — fill **Otváracie hodiny** and **Kontakt** there, don't hardcode.

**4.4 Horses Banner** — `ImageBanner`, `overlayHeading` = "Jedlo ktoré by malo mať svoj copywright" (uppercase, `.text-h2`-ish), CTA "Spoznajte nás →". The oversized translucent `©` watermark (Figma ~600px) is decorative; if wanted, add an optional `showCopyMark` checkbox to `ImageBanner/config.ts` and render an absolutely-positioned `©` in `.copy-mark` at low opacity. Otherwise omit.

**4.5 Pillars** — `PillarsBlock` already renders number (`01`/`02`/`03` in `text-sage-200`), uppercase title, muted body, arrow CTA, `4/5` image, hover saturate/scale. Add 3 rows: Reštaurácia, Penzión, Svadby. `background: dark` → olive bg.

**4.6 Chef's Table** — `ChefsHighlight`: `logo` = "©HEF'S TABLE", `heading`/`quote` = "Spomaľte. Každý chod je okamih, ktorý sa už nezopakuje.", `details` = `[{value:"65 €", label:"5-chodové menu / osoba"}, {value:"2× mesačne", label:"Soboty, na rezerváciu"}]`, dark food `image`. Heading in `text-foreground-sage`.

**4.7 / 4.11 Gallery** — two distinct treatments share `galleryStrip`: §7 is a desktop collage on `--background-warm`; §11 is a 6-up horizontal scroll on `--background-brown`. If the block only supports one layout, add a `variant: 'collage' | 'scroll'` select to `GalleryStrip/config.ts`.

**4.8 Restaurant** — `MenuPreview` reads live menu categories/items; header quote "Obed, ktorý chutí ako večerný fine-dining." + "Celý jedálny lístok →". Prices in `.text-price` (brown, tabular). Two photos below (840 + flex) via `MediaBlock` or extend the block.

**4.9 Interier** — `ImageBanner`, `height: lg`, overlay text top-right "Prostredie ktoré si získa nejedného hosťa" + "Spoznajte viac →".

**4.10 Rooms** — `RoomsGrid` on brown; overlay RoomCards (title, "Od 70 € / noc", amenities Klimatizácia/LCD TV/WiFi/Raňajky), centered "Zistiť dostupnosť →". The RoomCard `overlay` variant is the homepage one (per Figma component doc).

**4.12 Footer** — brand `ZW©KR` (`text-sage-200`, wide tracking), description, Instagram/Facebook, columns Reštaurácia / Ubytovanie / Kontakt (Bardejovská 48/B, Prešov-Ľubotice 080 06; 051 286 61 66; penzion@zwicker.sk), bottom row "© 2026 Zwicker…" / Ochrana súkromia / GDPR. Edit the **Footer** global.

---

## 4b. Photography (`public/assets/`)

Real brand + stock photography is staged in `public/assets/`. For the CMS these get **uploaded to the `media` collection** and referenced from each block's image field (don't hardcode `/assets/*` paths in components — only the seed/admin content points at them). Suggested mapping (validated in the static reference, which now uses these exact photos):

| Section | Photo(s) |
|---|---|
| Hero | `FOOD EXTENDED 01 1.jpg` (dark, dappled overhead — works under the centred wordmark) |
| Pillars | Reštaurácia `A7401829 1.jpg` · Penzión `mesut-cicen-…pp8…jpg` (bed) · Svadby `stacey-vandas-…jpg` (bouquet/shoes) |
| Chef's Table | `chefs-table-3.jpg` (moody) — or `chefs-table-1/2/4` for the lighter variant |
| Gallery collage (warm) | `chefs-table-1.jpg`, `chefs-table-2.jpg`, `A7401977 1.jpg`, plus food shots |
| Restaurant images | `A7401829 1.jpg` + `chefs-table-4.jpg` (hand plating) |
| Interiér | `yevhenii-deshko-…jpg` (dim interior) |
| Rooms | `mesut-cicen-…jpg`, `mk-s-Avk0ThNbEt8-…jpg` (beds/linen) |
| Gallery strip (brown) | the six `zwicker_restaurant_*…_n 1.jpg` real venue photos |

The remaining `karolina-grabowska-*`, `anita-austvika-*`, curtain/linen/hand shots are wabi-sabi texture/mood — use for secondary galleries, posts, and subpages. Source files are large (2–14 MB); resize/compress on upload (Payload + `sharp` will generate the responsive sizes).

## 5. Assemble the homepage

The `home` Page must become: `highImpact` hero + the ordered block layout.

**Block order (layout array):**
```
imageBanner   (Horses Banner)
pillars
chefsHighlight
galleryStrip  (collage, warm)
menuPreview   (+ images)
imageBanner   (Interier)
roomsGrid
galleryStrip  (scroll, brown)
```
(HoursBar and Footer are not blocks — HoursStrip renders via `RenderHero`, Footer is a global.)

**Two ways to apply it:**
- **Admin (recommended for content):** at `/admin`, open the `home` page, set Hero → High Impact + image, then add the blocks above in order. Fill localized `sk` fields (the `en` locale can follow).
- **Seed (recommended for repeatable setup):** rewrite `src/endpoints/seed/home-static.ts` so `hero.type = 'highImpact'` (with a `media` upload) and `layout = [...]` in the order above, then re-run the seed route (`/next/seed`) or `pnpm dev` seed flow.

**After any block field change:** run `pnpm generate:types` (updates `src/payload-types.ts`), then `pnpm lint`. If you add custom admin components, also `pnpm generate:importmap`.

---

## 6. Action checklist

1. ~~**Fonts** — wire the display + body fonts.~~ **DONE** — real Bagoss Condensed + DM Sans (§2). Optional follow-up: add Bagoss **Light (300)** for exact display-weight parity.
2. **Settings global** — fill Otváracie hodiny + Kontakt (drives HoursBar + Footer).
3. **Header / Footer globals** — set nav links, CTA, footer columns/contact (§4.1, §4.12). *(Logo wiring itself is DONE — §4.1.)*
4. **Optional block extensions** — `showCopyMark` on `ImageBanner` (§4.4); `variant` on `GalleryStrip` (§4.7); restaurant photo pair (§4.8). Run `pnpm generate:types` after each.
5. **Assemble `home`** — highImpact hero + ordered layout (§5).
6. **Content** — populate all sk fields; upload photography from `public/assets/` to the `media` collection per the §4b mapping.
7. **QA** — compare against `figma-homepage/index.html` at 1440px and 390px; check dark sections resolve on-dark tokens; verify grain overlay and reduced-motion.

---

## Notes & caveats

- The static HTML reference (`figma-homepage/`) now uses the real Bagoss Condensed too. Its hero image is a reused restaurant photo (the Figma hero fill wasn't exportable on the Starter MCP plan) — get the real hero photo from the design owner.
- Keep all admin labels in **Slovak** (project convention); front-end strings respect `sk`/`en` locales.
- Don't hardcode colors/spacing — use the tokens and `.text-*` utilities so the design stays single-sourced.
