# AI-assisted development — prompt log

**Project:** Airbnb listing take-home (`play_power`)  
**Reference:** https://airbnb-clone-umber-two.vercel.app (desktop only)  
**Tooling:** Cursor Agent (Composer), local Chrome QA at **1920×1080**, Vitest  
**Principle:** Original implementation only — no copying reference source or asset hotlinking from the clone repo.

This file records the **sequence of prompts** used to plan, build, audit, and refine the app. Prompts below are taken from the actual Cursor session (wording preserved where it mattered; very long prompts are trimmed with `[…]` only for repetition).

---

## Entry 0 — Reference discovery & planning (no code)

**When:** 2026-10-30 (session start)  
**Goal:** Inspect reference, ask decisions, propose architecture — **do not write files yet**.

### Prompt (excerpt)

> You are acting as a Senior Staff-level Full-Stack Engineer, UI Reverse-Engineering Specialist, and AI-native Engineering Lead.
>
> PROJECT: Build an original implementation of the Airbnb listing-page take-home […] Reference URL: https://airbnb-clone-umber-two.vercel.app
>
> The three required views are: Property listing page, Photo Tour, Lightbox. Desktop-only. Visual fidelity and behavioural parity are primary.
>
> CURRENT STATE: Empty project folder. **Do not create, modify, or delete project files yet.**
>
> PHASE 1 — INSPECT THE REFERENCE [… analyse layout, mosaic, overlays, keyboard, URL/history …]
>
> PHASE 2 — ASK ARCHITECTURAL AND DESIGN QUESTIONS (A–J: icons, media, fonts, Tailwind, animation, backend, testing, QA viewport, deployment …)
>
> PHASE 3 — PROPOSE IMPLEMENTATION PLAN [… stop and wait for approval]

### Outcome

- Reference inspection attempted (Vercel checkpoint noted when automated browser blocked live site).
- Decision questionnaire delivered (Lucide vs SVG, fixture API, Tailwind, Vitest vs Playwright, etc.).
- Implementation plan drafted; **no repository changes** in this step.

---

## Entry 1 — Locked product decisions

**When:** 2026-10-30  
**Goal:** Answer open questions so setup could start.

### Prompt

> A - Lucide React  
> B - Use random as per your convenience  
> C - Use Cereal VF or whichever is similar  
> D - Use Tailwind  
> E - Use framer motion as last option  
> F - yup  
> G - use vitest if not then playwright  
> H - Normal Browser viewport 1920 X 1080  
> J - Whichever looks convenient to you

Follow-up:

> 1. use jakarta sans  
> 2. take random photos but relevant ones  
> 3. vercel

### Outcome (agreed)

| Topic | Decision |
|--------|----------|
| Icons | Lucide React |
| Images | Relevant Unsplash URLs in `fixtures/listing.json` (not reference JPEGs) |
| Font | Plus Jakarta Sans (Cereal substitute) |
| Styling | Tailwind CSS v4 + tokens in `index.css` |
| Motion | CSS transitions first; Framer only if needed |
| Backend | Express + TS, static `listing.json` |
| Tests | Vitest + Testing Library |
| QA viewport | 1920×1080 |
| Deploy | Vercel (SPA + serverless `/api`) |

---

## Entry 2 — Approve monorepo scaffold

**When:** 2026-10-30  

### Prompt

> approve setup

Later:

> continue

### Outcome

- Monorepo: `apps/web`, `apps/api`, `packages/shared`, `fixtures/listing.json`, `api/index.ts`, `vercel.json`.
- Listing page, photo mosaic, booking card, Photo Tour + Lightbox with query-param overlays and keyboard handling.
- README, initial tests on overlay state, local dev (`npm run dev`).

---

## Entry 3 — Read-only engineering audit

**When:** 2026-10-30  
**Goal:** Find gaps before more feature work; **no code changes**.

### Prompt (excerpt)

> Act as a Senior Staff Full-Stack Engineer and Independent Code Reviewer.
>
> Perform a thorough engineering and visual-fidelity audit of the EXISTING repository.
>
> IMPORTANT: Do not implement new features. Do not modify source files. Read-only audit.
>
> PROJECT STRUCTURE: apps/web, apps/api, packages/shared, fixtures/listing.json […]
>
> REFERENCE: https://airbnb-clone-umber-two.vercel.app
>
> AUDIT 1 — ARCHITECTURE […] AUDIT 2 — VISUAL FIDELITY […] deliverables checklist […]
>
> Produce docs/audit-report.md with prioritized roadmap (P0, P1, …).

### Outcome

- `docs/audit-report.md` created (architecture, visual, interaction, deliverables).
- P0 flagged: Escape double `pushState`, Vercel fixture path, hero width padding.
- Submission gaps noted: architecture diagram, Cursor config, full prompt log.

---

## Entry 4 — P0 remediation only

**When:** 2026-10-30  
**Status:** Executed

### Prompt (verbatim core)

> I have reviewed docs/audit-report.md and APPROVE targeted remediation.
>
> Your first task is to fix ONLY P0 findings.
>
> TASK 1 — FIX INT-001: LIGHTBOX ESCAPE HISTORY BUG [… one Escape → one history step … add regression tests]
>
> TASK 2 — VERIFY ARCH-001 AND ARCH-002: VERCEL DEPLOYMENT [… do not deploy without my explicit approval]
>
> TASK 3 — VALIDATION — npm test, npm run build, TypeScript […]
>
> Update docs/audit-report.md and PROMPTS.md. STOP after P0. Do not begin P1.

### Outcome

| Item | Result |
|------|--------|
| INT-001 | Single Escape handler in `App.tsx`; Lightbox arrows only; overlay tests added |
| ARCH-001/002 | `@play/api` in Vercel build; `includeFiles` for fixture; supertest on `/api/listing` |
| VIS-002 | Removed `main` horizontal padding for full 1120px hero |
| Validation | `npm run build`, `npm test` (15), `npm run lint` — pass |
| Deploy smoke | Documented; not run without user deploy approval |

---

## Entry 5 — Brand logo asset

**When:** 2026-10-30  

### Prompt

> use this as logo for our project

*(Attached: coral Airbnb wordmark WebP.)*

### Outcome

- Copied to `apps/web/public/airbnb-logo.webp`.
- Header wired to user asset; later iterations fixed display (see entries 9–11).

---

## Entry 6 — Align with official take-home brief

**When:** 2026-10-30  

### Prompt

> [Pasted full company take-home spec: pixel-perfect clone, three views, architecture diagram, prompt history, Cursor sub-agent config, no public GitHub, no plagiarized code …]

### Outcome

- Gap analysis vs rubric (MVP vs pixel-perfect vs submission bundle).
- Proposed three workstreams: submission pack → fidelity/a11y → page completeness.

---

## Entry 7 — Execute all three workstreams

**When:** 2026-10-30  

### Prompt

> do all the 3 one by one

### Outcome

**Phase 1 — Submission pack**

- `docs/architecture.md`, `docs/diagrams/*.mmd`, `docs/architecture-diagram.png`
- `.cursor/rules/airbnb-takehome.mdc`, `web-components.mdc`
- `.cursor/agents/visual-qa.md`
- README deliverables checklist

**Phase 2 — Fidelity / a11y**

- `useFocusTrap` on Photo Tour, Lightbox, modals
- `inert` on page chrome during URL overlays
- Overlay enter CSS animations
- Header copy: “Any week”, “Airbnb your home”

**Phase 3 — Page completeness**

- Calendar, amenities modal, reviews modal, description expand
- Two sleep cards, highlight rows (self check-in, Superhost)
- Review category bars, host profile card, nearby carousel, footer columns
- Fixture aligned closer to reference copy (Minalya, 4.93, 32 amenities, booking breakdown)

---

## Entry 8 — Header search bar clarification

**When:** 2026-10-30  

### Prompt (Gujarati)

> ahiya kaik images che icons jeva e add nai karvana ?

*(Attached: screenshot of search pill.)*

### Outcome

- Clarified: search pill = **HTML + Lucide**, not a flat PNG.
- Reverted an experimental layout change on user request (entry 9).

---

## Entry 9 — Revert header experiment

**When:** 2026-10-30  

### Prompt

> rever the last change

### Outcome

- `SiteHeader.tsx` search pill restored to prior button layout.

---

## Entry 10 — Reference full-page screenshot review

**When:** 2026-10-30  

### Prompt

> this is the reference website screenshot..... please go thrugh it once

*(Attached: full-page reference capture.)*

### Outcome

- Section-by-section gap list (header, hero photos, highlights, booking breakdown, review bars, host card, footer).
- User approved gap fill in entry 11.

---

## Entry 11 — Close reference gaps

**When:** 2026-10-30  

### Prompt

> Yup go ahead fill the gaps

### Outcome

- Implemented items listed in Entry 7 Phase 3 + fixture/header/booking updates.
- Tests/build still passing after changes.

---

## Entry 12 — Logo display fixes (iterative)

**When:** 2026-10-30  

### Prompts (sequence)

1. > Aibnb logo is not appearing properly, earlier it was perfect  
2. > fix the logo  
3. > no logo is appearing  
4. > use the logo which i provided  
5. *(New WebP attached, no text)*

### Outcome

- Removed broken hand-drawn SVG and `mix-blend-lighten` (invisible on white header).
- **Final approach:** user WebP in `public/airbnb-logo.webp`; display via `airbnb-logo-transparent.png` generated from that file (black matte removed) in `AirbnbLogo.tsx` so the **provided artwork** shows on white without a dark rectangle.

---

## Entry 13 — Status checks (no code tasks)

**When:** 2026-10-30  

### Prompts

> apis are also done ?  
> apde je task ma lakhyu hatu e badhu cover thai gayu ?

### Outcome (documented in chat)

- API: `GET /api/listing`, `GET /api/health`, local + Vercel wiring, supertest — **done for scope**.
- Task coverage: **structure + deliverables largely done**; pixel-perfect vs live reference and final zip/prompt export still user’s last mile.

---

## Workflow patterns we used (for reviewers)

1. **Plan → approve → implement** (Entry 0–2) instead of one-shot codegen.  
2. **Read-only audit** before large fixes (Entry 3–4).  
3. **Minimal diffs** on P0 (Entry 4) — no full rewrite.  
4. **Screenshot-driven** gap analysis (Entry 10–11).  
5. **Cursor rules + agent note** for repeatability (`.cursor/rules`, `visual-qa.md`).  
6. **Verify claims:** `npm run build`, `npm test`, `npm run lint` after substantive changes.

---

## Known limitations (stated in prompts / audit, not hidden)

- Reference photos are **Unsplash**, not the clone’s JPEG set — layout parity possible, photographic parity not.
- **Plus Jakarta Sans** instead of Airbnb Cereal VF.
- **Vercel production** `/api/listing` smoke test documented but not executed in-session without deploy approval.
- This log should be read together with **`docs/audit-report.md`** for finding IDs and evidence.

---

## File index (AI-related deliverables)

| Artifact | Path |
|----------|------|
| This prompt log | `PROMPTS.md` |
| Audit + P0 evidence | `docs/audit-report.md` |
| Architecture write-up | `docs/architecture.md` |
| Diagram export | `docs/architecture-diagram.png` |
| Cursor rules | `.cursor/rules/*.mdc` |
| Visual QA agent template | `.cursor/agents/visual-qa.md` |

*Last updated: 2026-10-30 (session prompt export).*
