# Airbnb listing take-home (React + Express)

Desktop-focused Airbnb-style listing page with **Photo Tour** and **Lightbox**, backed by a static listing fixture and Express API.

## Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React, Plus Jakarta Sans
- **Backend:** Express 5 + TypeScript
- **Tests:** Vitest + Testing Library
- **Deploy:** Vercel **Services** (`web` + `api` in root `vercel.json`)

## Prerequisites

- Node.js 20+ (22 recommended)

## Local development

```bash
npm install
npm run dev
```

- Web: http://localhost:5173 (proxies `/api` → http://localhost:3001)
- API: http://localhost:3001/api/listing

## Scripts

| Command | Description |
|--------|-------------|
| `npm run dev` | API + web concurrently |
| `npm run build` | Build shared, API, and web |
| `npm test` | Vitest (web) |

## Project layout

```text
apps/web/          Vite React app (Vercel service: web)
apps/api/          Express API (Vercel service: api)
fixtures/          listing.json
packages/shared/   Shared TypeScript types
```

## Overlay URLs

- Photo tour: `?modal=PHOTO_TOUR_SCROLLABLE`
- Lightbox: `?modal=PHOTO_TOUR_SCROLLABLE&modalItem=<photoId>`

Keyboard: **Escape** closes lightbox → tour → listing; **ArrowLeft/ArrowRight** in lightbox.

## Vercel (multi-service)

Root `vercel.json` defines two services:

| Service | Root | Public route |
|---------|------|----------------|
| **web** | `apps/web` (Vite) | `/` (catch-all) |
| **api** | `apps/api` (Express) | `/api/*` via rewrite |

The browser calls `fetch('/api/listing')` on the same domain; top-level rewrites send `/api/*` to the **api** service. No service binding is required (the web app does not call the API from server-side code).

Local alternative: `npm run dev` (web proxy → API on :3001). For services locally: `vercel dev` from repo root (requires Vercel CLI).

**Project settings:** Root Directory = repository root (where `vercel.json` lives). Each service runs `install` / `build` from the monorepo root (`cd ../..`) so npm workspaces link `@play/shared`.

## Visual QA

Primary viewport: **1920×1080** in Chrome. Compare listing hero, sticky nav, booking card, photo tour, and lightbox against the reference brief.

## Take-home deliverables checklist

| Item | Location |
|------|----------|
| Application source | This repo (`apps/web`, `apps/api`, `fixtures/`) |
| Architecture write-up | `docs/architecture.md` |
| Diagram source | `docs/diagrams/*.mmd` |
| Diagram export (PNG) | `docs/architecture-diagram.png` (generate via commands in architecture doc) |
| AI prompt log | `PROMPTS.md` |
| Cursor rules | `.cursor/rules/*.mdc` |
| Subagent notes | `.cursor/agents/visual-qa.md` |
| Engineering audit | `docs/audit-report.md` |

**Submission:** Zip the project (exclude `node_modules`), include diagram PNG/PDF and prompt log. Do **not** publish to a public GitHub repo per assignment instructions.

## Zip command (submission)

From the **repository root** (`play_power`):

```bash
python scripts/create-submission-zip.py
```

Creates **`airbnb_clone_app.zip`** excluding `node_modules/`, `dist/`, `.vite/`, and `.git/`.

Manual alternative (Git Bash with `zip` installed):

```bash
zip -r airbnb_clone_app.zip . \
  -x "*/node_modules/*" \
  -x "node_modules/*" \
  -x "*/dist/*" \
  -x ".git/*" \
  -x "*/.vite/*" \
  -x "*/.vite-temp/*" \
  -x "airbnb_clone_app.zip"
```
