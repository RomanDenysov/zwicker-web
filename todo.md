# Homepage Redesign — TODO

Translating the Figma homepage (`docs/homepage-redesign.md` §5) into the live `home` page.
Strategy: **full seed automation** — extend the seed to upload photos + rewrite the `home`
layout to the §5 order. All four optional block extensions included.

> Design system (tokens, fonts, Logo, HoursStrip, brand-morph hero, all blocks) is already
> built — we are NOT rebuilding it. Only closing the layout/content gap + small block extensions.

---

## Automated (Claude) — DONE

### 1. GalleryStrip — collage + scroll variants  (§4.7)
- [x] `config.ts`: add `variant` (`collage` | `scroll`, default `scroll`) + `background` (`default` | `warm` | `brown`)
- [x] `Component.tsx`: branch on variant — marquee for `scroll`, static 12-col collage for `collage`; bg via token classes; brown sets `data-theme=dark`; `motion-reduce:animate-none` on the marquee

### 2. ImageBanner — CTA + position + ©-watermark  (§4.4, §4.9)
- [x] `config.ts`: add `linkGroup` (maxRows 1), `overlayPosition` (`center` | `topRight`), `showCopyMark` checkbox
- [x] `Component.tsx`: render CTA, position overlay, optional `.copy-mark` © watermark (decorative, aria-hidden)

### 3. MenuPreview — optional photo pair  (§4.8)
- [x] `config.ts`: add optional `images` upload (hasMany, maxRows 2)
- [x] `Component.tsx`: render two photos (840 + flex) below the menu when present

### 4. Seed — media upload helper
- [x] `src/endpoints/seed/media.ts` — uploads `public/assets/*` into `media`, returns id map
- [x] Add `media` to `collectionsToClear` (avoid duplicate uploads on re-seed)
- [x] 17 homepage photos uploaded (per §4b mapping); all filenames verified on disk

### 5. Seed — rewrite `home` layout to §5 order
- [x] hero `highImpact` + media (hero food)
- [x] `imageBanner` Horses — lg, ©-watermark, CTA "Spoznajte nás", center
- [x] `pillars` dark — Reštaurácia / Penzión / Svadby (3 rows + images)
- [x] `chefsHighlight` — dark image, sage heading, 65 € / 2× mesačne
- [x] `galleryStrip` collage / warm
- [x] `menuPreview` + photo pair
- [x] `imageBanner` Interiér — lg, top-right overlay, CTA "Spoznajte viac"
- [x] `roomsGrid` brown
- [x] `galleryStrip` scroll / brown (real venue photos)

### 6. Regenerate + verify
- [x] `pnpm generate:types` — OK (new fields present in `payload-types.ts`)
- [x] `pnpm exec tsc --noEmit` — OK (exit 0; used instead of build)
- [ ] `pnpm lint` — BLOCKED: pre-existing ESLint config error (`Converting circular structure to JSON` during eslintrc validation; fails before any file is read — unrelated to these changes)

---

## Manual (you)
1. **Run the seed** — `POST /next/seed` requires being logged into `/admin` (403 otherwise). Log in, trigger it. ~1 min for image processing. *(Want a no-auth `tsx` seed script instead? Ask.)*
2. **Swap the real hero photo** — seed uses `FOOD EXTENDED 01 1.jpg` as a stand-in (Figma hero wasn't exportable). Replace in `/admin` → home → Hero → media.
3. **English (`en`) locale** — seed fills `sk`; add `en` translations in `/admin` where wanted.
4. **Settings global** — verify Otváracie hodiny + Kontakt; fill `instagram` / `facebook` (empty in seed).
5. **Header / Footer** — confirm nav order + sage "Rezervovať" CTA, footer columns/contact/GDPR.
6. **Photo curation** — swap any auto-picked photo you don't like in `/admin`.
7. **Final QA** — compare `/` vs `../figma-homepage/index.html` at 1440px & 390px; dark tokens, grain, reduced-motion.
