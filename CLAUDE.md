# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## What This Is

This is the **Advuman landing page** — the primary marketing and conversion surface for [advuman.com](https://advuman.com).

**Advuman** is a trade risk intelligence platform. It monitors 24+ OSINT sources per corridor daily, classifies signals across three pressure layers (Regulatory / Logistics / Cost), and produces corridor health states plus weekly intelligence briefs for UK SMEs trading with the Global South (India, Egypt, Vietnam).

**Primary audience:** UK SMEs actively importing/exporting on the UK–India or UK–Egypt corridor.  
**Primary CTA:** Book a 15-minute call (Calendly popup).  
**Secondary CTA:** Email waitlist signup.

---

## Commands

```bash
npm run dev      # Start Vite dev server (localhost:5173)
npm run build    # Production build → dist/
npm run preview  # Preview the production build locally
```

No test suite. No linting config. Edit and reload.

---

## Stack

- **React 19** + **Vite 6** — component-based, standard JSX
- **Tailwind CSS v4** (via `@tailwindcss/vite`) — utility classes throughout
- **GSAP + ScrollTrigger** — powers the scroll-pinned canvas sections
- **@headlessui/react** — accessible UI primitives

---

## Architecture

### Entry Points

`index.html` → `src/main.jsx` → `src/App.jsx`

`src/App.jsx` assembles all sections in DOM order with `<Ornament />` dividers between them.

### Section Map

| Section | Component | Notes |
| --- | --- | --- |
| Nav | `Nav.jsx` | Fixed/sticky |
| Hero | `HeroSection.jsx` | Scroll-canvas (sequence1) |
| Corridor Strip | `CorridorStrip.jsx` | Live state badges |
| Cost of Not Knowing | `CostSection.jsx` | |
| How It Works | `SignalsSection.jsx` | Scroll-canvas (sequence2) |
| Hormuz Proof | `HormuzSection.jsx` | Scroll-canvas (sequence3, placeholder) |
| Pricing | `PricingSection.jsx` | |
| Corridor Health States | `HealthStates.jsx` | |
| ROI / The Maths | `RoiSection.jsx` | Scroll-canvas (sequence4, placeholder) |
| UK–India Context (CETA) | `CetaBlock.jsx` | |
| Getting Started | `OnboardingSection.jsx` | |
| Final CTA + Email Form | `FinalCTA.jsx` | Waitlist form, Calendly |
| Footer | `Footer.jsx` | |

### Constants (`src/constants.js`)

Single source of truth for all configuration:

- `CALENDLY_URL` — update when the booking link changes
- `TALLY_FALLBACK_URL` — waitlist form fallback
- `STUB_CORRIDOR_STATUS` — hardcoded fallback when `/api/corridor-status` is unavailable; update manually when the API is not deployed
- `SEQUENCES` — per-section frame-sequence configuration (see below)
- `COLORS` — brand hex values for canvas use

### Scroll-Canvas System

Four sections use a scroll-pinned frame animation: Hero, Signals, Hormuz, ROI.

**Data flow:**

```text
SEQUENCES[key] in constants.js
  → useFramePreloader (src/hooks/useFramePreloader.js)
      Loads PNG/WebP frames from /public/sequence* with fallback paths
      placeholder: true → generates dark frames via OffscreenCanvas (no files needed)
  → useScrollCanvas (src/hooks/useScrollCanvas.js)
      GSAP ScrollTrigger pins the section and maps scroll progress → frame index
      DPR-aware canvas resize with object-fit: cover draw math
  → ScrollCanvas (src/components/ScrollCanvas.jsx)
      Reusable component wrapping both hooks
      Accepts overlay children rendered above the canvas
```

To add a new scroll-canvas section:

1. Add a key to `SEQUENCES` in `constants.js`
2. Drop frames in `/public/sequenceN/` (or set `placeholder: true`)
3. Use `<ScrollCanvas sequence="key" ...>` in your component

### API Endpoints

All calls go to relative `/api/...` (requires live host or local proxy). All fall back to stub data on failure.

| Endpoint | Description |
| --- | --- |
| `GET /api/corridor-status` | `{ corridors: [{ id, state, score, updated }] }` |
| `GET /api/signals` | `{ signals: [{ date, type, severity, description, impact }] }` |
| `GET /api/alerts` | `{ alerts: [{ id, date, corridor, title, severity }] }` |
| `GET /api/corridor-history` | `{ history: [{ corridor, week, score, state }] }` |
| `GET /api/visitor-count` | `{ count: number }` |
| `POST /api/subscribe` | Body: `{ email, corridor, tier }` → 201 or error |

**Corridor IDs:** `uk-india` | `uk-egypt` | `uk-vietnam` (Vietnam: paused)

**Corridor states:** `ACTIVE` (red, highest severity) → `WATCH` (amber) → `STABLE` (teal) → `RECOVERY` (blue)

### Conversion Components

**Calendly popup** — loaded lazily after page load. CTAs call `Calendly.initPopupWidget({ url: CALENDLY_URL })`. `CALENDLY_URL` is in `constants.js`.

**Waitlist form** (`FinalCTA.jsx`) — POSTs to `/api/subscribe`. On failure falls back to `TALLY_FALLBACK_URL`.

---

## What NOT to Do

- **Don't add a test framework or build-time lint** — this project has none intentionally.
- **Don't eject from Vite** or add Webpack/Rollup config.
- **Don't rewrite `useScrollCanvas`** without understanding the DPR-aware resize + GSAP ScrollTrigger interaction — incorrect resize logic causes blank canvases.
- **Don't hardcode specific dates** in hero/section stats. The Hormuz timeline uses fixed historical dates — those are intentional.
- **Don't remove `STUB_CORRIDOR_STATUS`** — the page must function without a backend.
