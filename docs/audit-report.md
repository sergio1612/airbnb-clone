# Engineering & Visual Fidelity Audit Report

**Project:** Airbnb listing clone (`play_power`)  
**Audit date:** 2026-10-30  
**Auditor role:** Senior Staff Full-Stack Engineer (read-only)  
**Reference:** https://airbnb-clone-umber-two.vercel.app  

**Audit scope:** Repository source, local runtime at `http://localhost:5173` (1920×1080), Vitest/oxlint execution, browser interaction probes.  
**Reference access:** Live reference URL returned **Vercel Security Checkpoint** in the audit browser session; side-by-side live reference comparison was **not** possible during this audit. Reference expectations below combine (a) verified measurements from the prior reference inspection in this project’s discovery phase, (b) local implementation measurements, and (c) explicit gaps where neither source confirms parity.

---

## Executive summary

The codebase delivers a **credible first-pass** desktop listing with Photo Tour and Lightbox, sensible monorepo boundaries, and working local API + Vite proxy. It is **not yet assignment-complete** for visual fidelity, interaction polish, production deployment confidence, testing depth, or several stated deliverables (Cursor config, architecture diagram, prompt history).

**Highest-risk issues:** duplicate `Escape` handling causing **double `history.pushState`**; **Vercel API + fixture path** uncertainty; **hero/content width** reduced by `main` horizontal padding; **large missing reference sections** (calendar, amenities modal, nearby stays, footer); **no focus trap / inert background** for overlays.

---

## Findings

### AUDIT 1 — Architecture

#### ARCH-001
| Field | Detail |
|---|---|
| **Severity** | **Critical** |
| **Location** | `vercel.json`, `api/index.ts`, `apps/api/src/app.ts` |
| **Current behaviour** | Vercel `buildCommand` builds only `@play/shared` and `@play/web`. Serverless entry imports `createApp()` from `../apps/api/src/app.js` (TypeScript source). Fixture loading uses filesystem paths relative to compiled `__dirname`. |
| **Expected behaviour** | Production `/api/listing` reliably returns fixture JSON on Vercel with a deterministic build/deploy path. |
| **Evidence** | `vercel.json` lines 3–4; `loadListing()` tries multiple paths in `apps/api/src/app.ts`; no `@play/api` build in Vercel command; no integration test against serverless handler. |
| **Recommended correction** | Bundle API for Vercel explicitly (build `@play/api` or colocate handler + fixture in `api/`), add deploy smoke test for `/api/listing`, include `fixtures/` in function bundle verification. |

#### ARCH-002
| Field | Detail |
|---|---|
| **Severity** | **High** |
| **Location** | `vercel.json` rewrites |
| **Current behaviour** | Rewrite `{ "source": "/api/(.*)", "destination": "/api" }` forwards to Express app mounted at `/api/listing`. |
| **Expected behaviour** | Express receives paths matching route definitions (`/api/listing`). |
| **Evidence** | Common Vercel + Express mismatch when destination strips or alters path prefix; not validated in CI or deploy preview during audit. |
| **Recommended correction** | Verify `req.url` in serverless context; add logging/test on Vercel preview; adjust routes or use `app.use('/api', router)` pattern documented for Vercel. |

#### ARCH-003
| Field | Detail |
|---|---|
| **Severity** | **Medium** |
| **Location** | `packages/shared/src/index.ts`, `fixtures/listing.json` |
| **Current behaviour** | Shared types are compile-time only; fixture JSON is not validated at API startup or client fetch. |
| **Expected behaviour** | Runtime schema validation (even minimal) to fail fast on corrupt fixtures. |
| **Evidence** | API `JSON.parse` cast to `ListingResponse`; client `res.json()` cast. |
| **Recommended correction** | Add Zod (or similar) in `@play/shared` or API layer; validate once in `loadListing()`. |

#### ARCH-004
| Field | Detail |
|---|---|
| **Severity** | **Medium** |
| **Location** | `apps/web/src/App.tsx` |
| **Current behaviour** | Single root component owns data fetch, scroll listeners, overlay keyboard handling, and layout composition (~127 lines). |
| **Expected behaviour** | Acceptable for MVP; clearer separation as features grow. |
| **Evidence** | All orchestration in `App.tsx`; no router, no data layer beyond `fetchListing()`. |
| **Recommended correction** | Optional: extract `ListingPage` container + overlay provider; not urgent if scope stays single listing. |

#### ARCH-005
| Field | Detail |
|---|---|
| **Severity** | **Low** |
| **Location** | `apps/web/src/lib/overlayState.ts`, `apps/web/src/hooks/useOverlayNavigation.ts` |
| **Current behaviour** | `reduceOverlay()` exists but hook uses inline state objects; reducer tested only in unit tests. |
| **Expected behaviour** | Single state machine path for overlay transitions (DRY). |
| **Evidence** | `reduceOverlay` used in tests only (`overlayState.test.ts`). |
| **Recommended correction** | Route all transitions through `reduceOverlay` in the hook or delete unused reducer. |

#### ARCH-006
| Field | Detail |
|---|---|
| **Severity** | **Low** |
| **Location** | `apps/api/src/app.ts` |
| **Current behaviour** | `express.json()` middleware enabled with no POST routes. |
| **Expected behaviour** | Minimal middleware surface for read-only API. |
| **Evidence** | Only GET handlers registered. |
| **Recommended correction** | Remove unused middleware unless future endpoints need it. |

#### ARCH-007
| Field | Detail |
|---|---|
| **Severity** | **Low** |
| **Location** | Repo root |
| **Current behaviour** | No `.env.example`, no documented env vars (`PORT` only implied in API). |
| **Expected behaviour** | Documented configuration for local vs Vercel. |
| **Evidence** | README mentions ports; no env file template. |
| **Recommended correction** | Add `.env.example` with `PORT=3001` and Vercel notes. |

#### ARCH-008
| Field | Detail |
|---|---|
| **Severity** | **Low** |
| **Location** | `apps/web/src/assets/` |
| **Current behaviour** | Vite starter assets remain (`hero.png`, `react.svg`, `App.css`) unused by current app. |
| **Expected behaviour** | No dead template artifacts in deliverable. |
| **Evidence** | `App.tsx` no longer imports them; `App.css` orphaned. |
| **Recommended correction** | Remove unused starter files in a future cleanup pass. |

#### ARCH-009
| Field | Detail |
|---|---|
| **Severity** | **Medium** |
| **Location** | Monorepo scripts |
| **Current behaviour** | No CI workflow (GitHub Actions / Vercel checks) defined in repo. |
| **Expected behaviour** | `build` + `test` on PR for assignment quality gate. |
| **Evidence** | No `.github/workflows` present. |
| **Recommended correction** | Add CI running `npm run build` and `npm test`. |

**Architecture positives:** Clear workspace split; typed listing model; Express factory `createApp()` reusable for local + Vercel; Vite dev proxy for `/api`; strict TS flags in web app; sensible component folder layout (`layout/`, `listing/`, `overlays/`).

---

### AUDIT 2 — Visual fidelity

**Reference comparison status:** Live reference blocked by **Vercel Security Checkpoint** during this audit. Prior verified reference metrics (1440×900 inspection) noted: content column **1120px**, hero **1120×494**, header **~89px**, booking column **372px**, `:root` tokens matching Airbnb palette, **Airbnb Cereal VF** font. Local app measured at **1920×1080** (see evidence).

**Important:** Unsplash placeholders **cannot** achieve photographic parity with the Candolim listing; layout/behaviour can still be scored.

#### VIS-001
| Field | Detail |
|---|---|
| **Severity** | **Critical** |
| **Location** | `fixtures/listing.json`, all image components |
| **Current behaviour** | Hero, tour, and lightbox use generic Unsplash stock photography (modern houses, city towers, etc.). |
| **Expected behaviour** | Reference listing photography (Candolim patio/jacuzzi/bedroom sequence) for pixel comparison. |
| **Evidence** | Local screenshot at 1920×1080 shows unrelated hero mosaic; reference uses specific property JPEGs. |
| **Recommended correction** | Replace with user-approved local assets or licensed equivalents matching reference composition; keep URLs stable in fixture. |

#### VIS-002
| Field | Detail |
|---|---|
| **Severity** | **High** |
| **Location** | `apps/web/src/App.tsx` (`main` wrapper), `PhotoMosaic.tsx` |
| **Current behaviour** | `main` uses `max-w-[1120px] px-6`; hero grid measures **1072×473** inside main (not full 1120 content width). |
| **Expected behaviour** | Reference hero spans full **1120px** content width with **1120/494** aspect (prior reference measurement). |
| **Evidence** | CDP on local app: `main.w=1120`, `hero.w=1072`, `hero.h=473`; reference hero `1120×494` at 1440 viewport. |
| **Recommended correction** | Move horizontal padding off mosaic column or use breakout layout so `#heroGrid` is 1120px within centered container. |

#### VIS-003
| Field | Detail |
|---|---|
| **Severity** | **High** |
| **Location** | `apps/web/src/index.css` |
| **Current behaviour** | Plus Jakarta Sans via Google Fonts CDN. |
| **Expected behaviour** | Reference uses **Airbnb Cereal VF** (proprietary); closest legal substitute was agreed, but metrics differ. |
| **Evidence** | `@import` Google Fonts in `index.css`; reference `@font-face` Airbnb Cereal VF. |
| **Recommended correction** | Tune font-size/weight/letter-spacing against reference screenshots at 1920×1080; document substitute choice. |

#### VIS-004
| Field | Detail |
|---|---|
| **Severity** | **High** |
| **Location** | `apps/web/src/components/layout/SiteHeader.tsx` |
| **Current behaviour** | Simplified Bélo-like SVG path; search pill and menu approximate Airbnb. |
| **Expected behaviour** | Reference logo, search pill proportions, divider weights, and host menu match Airbnb chrome. |
| **Evidence** | Visual compare local screenshot vs prior reference screenshot; logo path is generic heart/blob hybrid. |
| **Recommended correction** | Replace with accurate Bélo SVG and measured search bar dimensions from reference DevTools. |

#### VIS-005
| Field | Detail |
|---|---|
| **Severity** | **High** |
| **Location** | Missing components (not implemented) |
| **Current behaviour** | No availability **calendar**, no **“Show original”** translation row, no **nearby stays** carousel, no site **footer**, no full **amenities modal** grid. |
| **Expected behaviour** | Reference listing page includes these sections between amenities and footer (verified in prior reference DOM ids: calendar, `amenModal`, nearby carousel). |
| **Evidence** | Local snapshot lacks calendar/nearby/footer; `ListingContent.tsx` stops at “Things to know”. |
| **Recommended correction** | Implement or explicitly scope-out with stakeholder sign-off; for assignment fidelity, treat as gaps. |

#### VIS-006
| Field | Detail |
|---|---|
| **Severity** | **Medium** |
| **Location** | `ListingContent.tsx` guest favourite block |
| **Current behaviour** | Text-only “Guest favourite” with Lucide stars; no laurel wreath assets. |
| **Expected behaviour** | Reference uses laurel PNGs flanking badge + structured rating/reviews columns in bordered card. |
| **Evidence** | Prior reference assets `/assets/images/ui/laurel-left.png`; local component lines 24–48. |
| **Recommended correction** | Recreate bordered badge layout and laurel imagery (or SVG equivalents). |

#### VIS-007
| Field | Detail |
|---|---|
| **Severity** | **Medium** |
| **Location** | `BookingCard.tsx` |
| **Current behaviour** | Card approximates sticky booking (372px width, gradient Reserve, date grid). Promo banner simplified; padding `p-6` vs reference ~22–24px vertical rhythm. |
| **Expected behaviour** | Reference promo chip styling, price typography, and shadow/border match (`--shadow-card`, specific label casing). |
| **Evidence** | Local booking `w=372` matches reference; promo truncates via `split('.')[0]` losing “Terms apply” styling. |
| **Recommended correction** | Match reference promo markup; verify padding and label uppercase sizes (`CHECK-IN` etc.). |

#### VIS-008
| Field | Detail |
|---|---|
| **Severity** | **Medium** |
| **Location** | `StickySectionNav.tsx` |
| **Current behaviour** | Fixed bar height **67px**; shows after `#photos` bottom `< 80`. |
| **Expected behaviour** | Reference bar ~67px with slide transition tied to scroll past mosaic (~838px scroll prior reference). |
| **Evidence** | Class `h-[67px]` matches reference; threshold not calibrated to reference scroll curve. |
| **Recommended correction** | Align trigger with reference intersection observer target (title row or hero bottom). |

#### VIS-009
| Field | Detail |
|---|---|
| **Severity** | **Medium** |
| **Location** | `PhotoTour.tsx` |
| **Current behaviour** | Structure matches reference pattern (88px header, 1024 inner, 8-col category grid, 2-col room sections, 3:2 images). **No enter/exit animation** (always `opacity-100 translate-y-0`). |
| **Expected behaviour** | Reference tour opens with ~300ms fade + `translateY(28px→0)` (prior CSS `._KpcKWX._PjnNJs`). |
| **Evidence** | `PhotoTour.tsx` static open classes; reference transition rules documented earlier. |
| **Recommended correction** | Add open/close animation classes tied to overlay mount (CSS first per project decision). |

#### VIS-010
| Field | Detail |
|---|---|
| **Severity** | **Medium** |
| **Location** | `Lightbox.tsx` |
| **Current behaviour** | Layout aligns broadly (72px top bar, side arrows, counter, `object-contain` stage). |
| **Expected behaviour** | Reference stage padding **88px 96px** and arrow positions at `left/right: 20px`. |
| **Evidence** | Local uses `px-24 py-[88px]` and `left-5/right-5` (20px) — close; animation on open missing. |
| **Recommended correction** | Verify image max dimensions against reference at 1920×1080; add fade transition. |

#### VIS-011
| Field | Detail |
|---|---|
| **Severity** | **Medium** |
| **Location** | `ListingContent.tsx` reviews |
| **Current behaviour** | Simplified reviews (4 cards, numeric category rows). |
| **Expected behaviour** | Reference includes histogram, “How reviews work”, category pills (Comfort, Hot tub, etc.), and richer review cards. |
| **Evidence** | Prior reference snapshot buttons `Comfort 6`, `Hot tub 5`, etc.; not present locally. |
| **Recommended correction** | Implement reference reviews module or document intentional reduction. |

#### VIS-012
| Field | Detail |
|---|---|
| **Severity** | **Low** |
| **Location** | `TitleRow.tsx`, `ListingContent.tsx` |
| **Current behaviour** | H1 **26px** matches reference; Share/Save underlined text + Lucide icons. |
| **Expected behaviour** | Reference icon stroke weights and underline spacing match Airbnb. |
| **Evidence** | Local `h1Font: 26px` CDP measurement; reference `._WQsVLm` 26/30. |
| **Recommended correction** | Minor icon sizing tweaks after screenshot diff. |

#### VIS-013
| Field | Detail |
|---|---|
| **Severity** | **Low** |
| **Location** | `fixtures/listing.json` + UI copy |
| **Current behaviour** | Button reads **“Show all 50 amenities”** but fixture defines **20** amenities. |
| **Expected behaviour** | Copy matches data (reference shows 50). |
| **Evidence** | `grep "label":` count 26 includes non-amenity labels; amenities array length 20 in fixture structure. |
| **Recommended correction** | Expand fixture to 50 or change label to actual count. |

**Visual fidelity positives:** CSS tokens for ink/muted/rausch/reserve gradient; mosaic grid template `35fr 17fr 17fr` + `gap-2` (8px) + `rounded-xl` (12px); booking width 372px; tour max-width 1024px; lightbox counter format `N of 43` aligns with photo count.

---

### AUDIT 3 — Interactions

#### INT-001
| Field | Detail |
|---|---|
| **Severity** | **Critical** |
| **Location** | `apps/web/src/App.tsx` (Escape handler), `apps/web/src/components/overlays/Lightbox.tsx` (Escape handler) |
| **Current behaviour** | Pressing **Escape** in lightbox fires **two** handlers; each calls `closeLightbox()` → **two** `history.pushState` calls per Escape. |
| **Expected behaviour** | One history step lightbox → tour per Escape. |
| **Evidence** | CDP test: `history.length` **3 → 5** after one Escape from lightbox (expected 4); URL correct but stack polluted. Second Escape: 5 → 6, URL `/`. |
| **Recommended correction** | Handle Escape in one place only, or `stopImmediatePropagation` in Lightbox; prefer central overlay controller. |

#### INT-002
| Field | Detail |
|---|---|
| **Severity** | **High** |
| **Location** | Overlays (`PhotoTour`, `Lightbox`), `App.tsx` |
| **Current behaviour** | No focus trap; background listing links/buttons remain focusable (no `inert` on `main`). |
| **Expected behaviour** | Modal dialogs trap focus and restore focus to trigger on close (reference accessibility pattern). |
| **Evidence** | Snapshot shows listing nav links while tour open; no `focus-trap` library or manual roving tabindex. |
| **Recommended correction** | Add focus trap + `aria-hidden`/`inert` on background while overlay active; restore focus to last trigger. |

#### INT-003
| Field | Detail |
|---|---|
| **Severity** | **Medium** |
| **Location** | `TitleRow.tsx`, `PhotoTour.tsx` Share/Save |
| **Current behaviour** | Share/Save buttons render with no `onClick`, clipboard, or share sheet. |
| **Expected behaviour** | Reference provides interactive share/save affordances (at minimum UI feedback). |
| **Evidence** | Buttons have no handlers; static underline styling only. |
| **Recommended correction** | Stub toast/modal or Web Share API with graceful fallback. |

#### INT-004
| Field | Detail |
|---|---|
| **Severity** | **Medium** |
| **Location** | `PhotoMosaic.tsx` |
| **Current behaviour** | All five hero tiles call `onOpenTour()` only (not lightbox per tile). |
| **Expected behaviour** | Matches **prior verified reference behaviour** (hero click opened Photo Tour, not direct lightbox). |
| **Evidence** | `onClick={() => onOpenTour()}` lines 30–31; prior reference URL `?modal=PHOTO_TOUR_SCROLLABLE` on hero/show-all clicks. |
| **Recommended correction** | None if parity goal is reference clone; document as intentional. |

#### INT-005
| Field | Detail |
|---|---|
| **Severity** | **Low** |
| **Location** | `useOverlayNavigation.ts` |
| **Current behaviour** | Opening tour/lightbox uses `pushState`; `popstate` syncs React state from URL. |
| **Expected behaviour** | Back/forward navigates overlay stack correctly. |
| **Evidence** | URL updated to `?modal=PHOTO_TOUR_SCROLLABLE&modalItem=1000` on lightbox open; manual Escape sequence reaches `/`. |
| **Recommended correction** | After fixing INT-001, retest back stack; consider `replaceState` when closing to tour if reference uses replace (verify against reference). |

#### INT-006
| Field | Detail |
|---|---|
| **Severity** | **Low** |
| **Location** | `Lightbox.tsx` |
| **Current behaviour** | ArrowLeft/ArrowRight keyboard handlers call `onNavigate`; Next/Prev buttons disabled at ends. |
| **Expected behaviour** | Reference advances `modalItem` in URL and counter. |
| **Evidence** | Handlers present lines 20–35; not fully exercised in audit beyond Escape test. |
| **Recommended correction** | Add RTL/Playwright test confirming URL increments (`1000→1001`). |

#### INT-007
| Field | Detail |
|---|---|
| **Severity** | **Low** |
| **Location** | `App.tsx` body overflow effect |
| **Current behaviour** | `document.body.style.overflow = 'hidden'` when any overlay open. |
| **Expected behaviour** | Background scroll locked; tour scroll container scrolls independently. |
| **Evidence** | Effect lines 68–73; `#tourScroll` has `overflow-y-auto`. |
| **Recommended correction** | Optional: preserve scroll position with `overflow: hidden` + fixed body pattern for iOS parity (desktop-only task: low priority). |

#### INT-008
| Field | Detail |
|---|---|
| **Severity** | **Medium** |
| **Location** | `PhotoTour.tsx` category nav |
| **Current behaviour** | `scrollIntoView` on section ids `tour-room-${category.id}`. |
| **Expected behaviour** | Reference category jumps scroll tour body to room sections. |
| **Evidence** | onClick handler lines 78–80; sections exist with matching ids. |
| **Recommended correction** | Scroll within `#tourScroll` container only (avoid scrolling listing underlay if body lock fails). |

#### INT-009
| Field | Detail |
|---|---|
| **Severity** | **Medium** |
| **Location** | `ListingContent.tsx`, amenity/review buttons |
| **Current behaviour** | “Show more”, “Show all 50 amenities”, “Show all 19 reviews” non-functional. |
| **Expected behaviour** | Reference expands description, opens amenities modal, opens reviews drawer/modal. |
| **Evidence** | Buttons without handlers. |
| **Recommended correction** | Wire modals or remove until implemented to avoid false affordances. |

**Interaction positives:** Query param scheme matches reference (`PHOTO_TOUR_SCROLLABLE`, `modalItem`); tour back closes to listing; lightbox grid icon returns to tour; sticky nav hidden while overlays open; deep-link parse on initial load via `parseOverlayFromSearch`.

---

### AUDIT 4 — Testing

**Commands run (audit):**
- `npm test` — **PASS** (4 tests, `overlayState.test.ts`)
- `npm run lint` (oxlint) — **PASS** (no issues reported)

#### TEST-001
| Field | Detail |
|---|---|
| **Severity** | **High** |
| **Location** | `apps/web/src/**/*.test.*` |
| **Current behaviour** | Only pure unit tests for overlay URL parser/reducer. |
| **Expected behaviour** | Coverage for listing render, API integration, tour/lightbox UI, keyboard, focus, loading/error. |
| **Evidence** | Single test file; `@testing-library/react` installed but unused. |
| **Recommended correction** | Add RTL tests for App loading/error; mock `fetchListing`; test Escape/history with jsdom + spies. |

#### TEST-002
| Field | Detail |
|---|---|
| **Severity** | **High** |
| **Location** | API layer |
| **Current behaviour** | No tests for `createApp()` or fixture loading paths. |
| **Expected behaviour** | Supertest (or similar) verifies `/api/listing` and `/api/health`. |
| **Evidence** | No tests under `apps/api`. |
| **Recommended correction** | Add API integration tests with temp fixture file. |

#### TEST-003
| Field | Detail |
|---|---|
| **Severity** | **Medium** |
| **Location** | E2E |
| **Current behaviour** | No Playwright/Cypress suite despite README mention as optional. |
| **Expected behaviour** | Browser tests for three-view flow at 1920×1080. |
| **Evidence** | No `e2e/` directory or Playwright config. |
| **Recommended correction** | Add Playwright smoke: open tour → open lightbox → Escape chain → back button. |

#### TEST-004
| Field | Detail |
|---|---|
| **Severity** | **Medium** |
| **Location** | Regression for INT-001 |
| **Current behaviour** | No test detects double `pushState` on Escape. |
| **Expected behaviour** | Test asserts `history.pushState` called once per Escape. |
| **Evidence** | Manual CDP repro only. |
| **Recommended correction** | Add unit/integration test immediately after bugfix. |

#### TEST-005
| Field | Detail |
|---|---|
| **Severity** | **Low** |
| **Location** | Visual regression |
| **Current behaviour** | No screenshot baseline or Percy/Playwright snapshot pipeline. |
| **Expected behaviour** | Repeatable visual QA vs reference at agreed viewport. |
| **Evidence** | README suggests manual comparison only. |
| **Recommended correction** | Store reference screenshots in repo; optional Playwright `toHaveScreenshot`. |

---

### AUDIT 5 — AI workflow & project deliverables

#### WF-001
| Field | Detail |
|---|---|
| **Severity** | **High** |
| **Location** | `.cursor/rules` |
| **Current behaviour** | **Missing** |
| **Expected behaviour** | Project rules for desktop-only scope, fidelity standards, no scraping reference code. |
| **Evidence** | Glob returned 0 files under `.cursor/`. |
| **Recommended correction** | Add Cursor rules per assignment deliverables. |

#### WF-002
| Field | Detail |
|---|---|
| **Severity** | **High** |
| **Location** | `.cursor/agents`, `.cursor/skills` |
| **Current behaviour** | **Missing** |
| **Expected behaviour** | Documented agent/skill plan if required by assignment rubric. |
| **Evidence** | No project-local agent config. |
| **Recommended correction** | Add minimal agents/skills or document N/A in README. |

#### WF-003
| Field | Detail |
|---|---|
| **Severity** | **High** |
| **Location** | `PROMPTS.md` |
| **Current behaviour** | **Missing** |
| **Expected behaviour** | Full prompt history for AI-native engineering lead deliverable. |
| **Evidence** | File not in repository. |
| **Recommended correction** | Export chat prompts/decisions into `PROMPTS.md` (sanitized). |

#### WF-004
| Field | Detail |
|---|---|
| **Severity** | **High** |
| **Location** | Architecture diagram |
| **Current behaviour** | **Missing** (no `docs/architecture.*`, no exported PNG/SVG) |
| **Expected behaviour** | Diagram source + exported artifact showing web/API/fixtures/overlays. |
| **Evidence** | No docs folder before this audit report. |
| **Recommended correction** | Add Mermaid source + export for submission bundle. |

#### WF-005
| Field | Detail |
|---|---|
| **Severity** | **Low** |
| **Location** | `README.md` |
| **Current behaviour** | Adequate setup/run/deploy overview; references Vitest/Playwright generically. |
| **Expected behaviour** | Assignment checklist with deliverable status and QA viewport. |
| **Evidence** | README exists; no deliverables matrix. |
| **Recommended correction** | Extend README with deliverable checklist and known gaps. |

---

### AUDIT 6 — Required deliverables checklist

| Deliverable | Status | Notes |
|---|---|---|
| Complete application source | **Present** | Monorepo with web, api, shared, fixture |
| Architecture diagram source | **Missing** | WF-004 |
| Exported architecture diagram | **Missing** | WF-004 |
| Cursor configuration | **Missing** | WF-001, WF-002 |
| Full prompt history | **Missing** | WF-003; not in repo |
| Setup instructions | **Partial** | README covers local dev |
| Tests | **Partial** | 4 unit tests only |
| This audit report | **Created** | `docs/audit-report.md` |

---

## Overall assessments

### 1. Engineering assessment
**Grade: B− (functional MVP, deployment and quality gates immature)**

Strengths: clean monorepo, typed domain model, separation of overlay URL logic, working dev proxy, production build succeeds locally. Weaknesses: Vercel serverless path/build uncertainty, no CI, minimal tests, duplicate keyboard handling bug, dead template files, no runtime validation of fixture data.

### 2. Visual fidelity assessment
**Grade: C+ (structure partially aligned, content and chrome materially diverge)**

Layout tokens and several key dimensions (1120 column target, 372 booking, mosaic grid recipe, tour 1024 shell) show intentional reference study. However, **photography**, **header/logo fidelity**, **missing major sections**, **guest favourite treatment**, **reviews/calendar modules**, and **hero width padding bug** prevent calling this visually parity-ready. Live reference could not be re-verified during this audit due to Vercel checkpoint.

### 3. Interaction assessment
**Grade: B− (core flows work, polish and a11y gaps)**

Photo Tour and Lightbox open with correct query params; keyboard navigation largely implemented. **Critical history bug on Escape**, missing focus trap/inert background, and many inert buttons reduce parity and usability.

### 4. Security and deployment assessment
**Grade: C (acceptable for static demo, production risks remain)**

Open CORS on read-only API is fine for public fixture. Risks: unverified Vercel Express routing, fixture path resolution in serverless, no security headers, external Google Maps iframe and Unsplash/Google Fonts CDNs (privacy/availability). BotID on reference does not apply to this clone.

### 5. Missing deliverables
Architecture diagram (source + export), Cursor rules/agents/skills, `PROMPTS.md`, comprehensive tests, CI, visual regression assets, and several reference page sections/modals.

---

## Prioritized implementation roadmap

| Priority | Item | Finding IDs | Outcome |
|---|---|---|---|
| **P0** | Fix duplicate Escape → double `pushState` | INT-001, TEST-004 | Correct back stack behaviour |
| **P0** | Validate/fix Vercel `/api/listing` + fixture bundling | ARCH-001, ARCH-002 | Deployed app loads data |
| **P0** | Fix hero/content width (1120 mosaic inside container) | VIS-002 | Layout parity |
| **P1** | Focus trap + `inert` background for overlays | INT-002 | Accessibility + interaction parity |
| **P1** | Photo tour/lightbox enter transitions | VIS-009, VIS-010 | Motion parity (CSS) |
| **P1** | Replace or license photography aligned to reference | VIS-001 | Visual credibility |
| **P1** | RTL + API tests; Playwright happy path | TEST-001–003 | Regression safety |
| **P2** | Calendar, amenities modal, reviews expansion, nearby stays, footer | VIS-005, VIS-011, INT-009 | Page completeness |
| **P2** | Header/logo/search pill pixel pass at 1920×1080 | VIS-004 | Chrome fidelity |
| **P2** | Guest favourite laurel card | VIS-006 | Badge parity |
| **P3** | Deliverables: Mermaid diagram, `.cursor/rules`, `PROMPTS.md` | WF-001–004 | Assignment compliance |
| **P3** | Remove dead Vite template assets; amenity count copy fix | ARCH-008, VIS-013 | Polish |
| **P3** | CI workflow (`build`, `test`) | ARCH-009 | Engineering maturity |

---

## Audit methodology notes

- **Repository:** Read-only inspection of all `apps/web/src` components, API, shared types, configs, fixture.  
- **Runtime:** Local dev server confirmed running; measurements at **1920×1080**.  
- **Reference:** Attempted navigation blocked by **Vercel Security Checkpoint**; prior reference measurements cited where noted.  
- **Tests:** `npm test` and `npm run lint` executed successfully during audit.  

---

**End of report.** Awaiting approval before any corrective implementation work.

---

## P0 remediation (2026-10-30)

**Scope:** Approved targeted fixes for P0 only. No P1 work started. **Production Vercel deploy was not executed** (per instruction); local/build verification only.

### Validation executed

| Check | Result |
|---|---|
| `npm run build` | **PASS** (`@play/shared`, `@play/api`, `@play/web`) |
| `npm test` | **PASS** — 15 tests total (3 API + 12 web) |
| `npm run lint` | **PASS** (oxlint, web workspace) |
| TypeScript | **PASS** via `tsc -b` / workspace builds in `npm run build` |
| Live Vercel deploy | **NOT RUN** — procedure documented below |

### Changed files

| File | Change |
|---|---|
| `apps/web/src/components/overlays/Lightbox.tsx` | Removed duplicate Escape handler (Arrow keys only) |
| `apps/web/src/App.tsx` | Removed `px-6` from `main` (hero full 1120px width) |
| `apps/api/src/app.ts` | Eager fixture load; exported `loadListing()`; removed unused `express.json()` |
| `api/index.ts` | Import compiled `createApp` from `apps/api/dist/app.js` (no `listen()`) |
| `vercel.json` | Build `@play/api`; `includeFiles` for fixture; unchanged SPA/API rewrites |
| `package.json` (root) | `npm test` runs API + web |
| `apps/api/package.json` | supertest + vitest; `test` script |
| `apps/api/vitest.config.ts` | **Added** |
| `apps/api/src/app.test.ts` | **Added** — `/api/listing`, `/api/health`, fixture load |
| `apps/web/src/App.overlay.test.tsx` | **Added** — Escape regression (single `pushState`) |
| `apps/web/src/components/overlays/Lightbox.test.tsx` | **Added** — Escape does not call `onClose` |
| `apps/web/src/hooks/useOverlayNavigation.test.tsx` | **Added** — history + popstate sync |
| `PROMPTS.md` | **Added** — prompt log |

### Finding status (P0)

#### INT-001 — **FIXED**
- **Root cause:** `App.tsx` and `Lightbox.tsx` both handled `Escape`, each calling `closeLightbox()` → two `pushState` calls.
- **Fix:** Centralize Escape in `App.tsx` only; Lightbox ignores Escape.
- **Evidence:** `App.overlay.test.tsx` — `pushState` called **once** after single Escape from lightbox; repeated Escape closes tour then listing. `Lightbox.test.tsx` — Escape does not invoke `onClose`.

#### TEST-004 — **FIXED** (partial — regression tests added)
- **Evidence:** Tests above + existing `overlayState.test.ts` (4 tests).

#### ARCH-001 — **REMEDIATED (local verified; deploy pending your approval)**
- **Changes:** Vercel `buildCommand` includes `@play/api`; `api/index.ts` uses compiled Express app; fixture loaded at module init with path candidates + `functions.api/index.ts.includeFiles`.
- **Local evidence:** `apps/api/src/app.test.ts` — `loadListing()` returns `candolim-jacuzzi-1bhk`; supertest `GET /api/listing` → 200 with Candolim title.
- **Deploy limitation:** Cannot confirm Vercel serverless routing without a deploy preview.

#### ARCH-002 — **REMEDIATED (local verified; deploy pending your approval)**
- **Changes:** Routes remain `GET /api/listing` and `GET /api/health`; rewrite unchanged.
- **Local evidence:** supertest hits `/api/listing` successfully against `createApp()` (same app exported to Vercel).
- **Deploy verification procedure (when you approve deploy):**
  1. Deploy branch to Vercel.
  2. `curl -sS https://<preview-url>/api/listing | head` — expect JSON with `listing.title`.
  3. `curl -sS -o /dev/null -w "%{http_code}" https://<preview-url>/api/health` — expect `200`.
  4. Open preview `/` — listing loads (no perpetual “Loading…”).
  5. If step 2 fails with 404/500, inspect function logs for fixture path errors.

#### VIS-002 — **FIXED**
- **Fix:** Removed horizontal padding on `#main` so `#heroGrid` spans full **1120px** container width.
- **Evidence:** Layout change in `App.tsx`; re-measure at 1920×1080 recommended after deploy (not re-run in this pass).

### P0 roadmap rows (updated)

| Priority | Item | Status |
|---|---|---|
| P0 | INT-001 / TEST-004 | **Done** |
| P0 | ARCH-001 / ARCH-002 | **Done locally** — Vercel smoke test pending deploy approval |
| P0 | VIS-002 | **Done** |

### Still open (not P0)

All **P1+** findings remain open (INT-002, VIS-001, VIS-004–VIS-011, WF-001–004, etc.).

