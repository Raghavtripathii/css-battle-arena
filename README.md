# ⚔️ CSS Battle Arena

A browser-based CSS challenge game. You're given a target design and an empty stylesheet — match the target as closely as possible before the clock runs out. Every submission is scored by an actual **pixel-by-pixel comparison** between your rendered output and the target, not a guess or a checklist.

Built with React 18, TypeScript, Vite, Tailwind CSS v4, CodeMirror 6, and Framer Motion.

## How it works

1. Pick a level from the grid — each one shows a piece of fixed HTML markup and a target visual.
2. Write CSS in the CodeMirror editor to make your `.container` (rendered in a live iframe) match the target.
3. As you type, both the target and your version are rendered off-DOM, screenshotted via an SVG `foreignObject` trick, and compared canvas-to-canvas with a per-channel RGB tolerance.
4. Hit a score at or above the level's pass threshold and you clear it. Run out of time and the level fails — you can always retry.
5. After clearing, the Solution panel reveals a reference CSS implementation to compare against your own.

There's no single "correct" CSS for any level — the reference solution is one clean way to solve it, and the scoring engine doesn't care how you got there, only what it looks like on screen.

## Features

- 🎯 **Pixel comparison engine** — real canvas-based scoring via `html2canvas`, not heuristics
- ⏱️ **Timed challenges** — each level has its own time limit and pass threshold
- ✅ **Deterministic Submit** — always lands on a clear pass/fail result, never a silent no-op
- 🏆 **Personal bests & win streaks** — tracked per level
- 💾 **Autosave** — your CSS is saved to `localStorage` on every keystroke and restored if you leave and come back
- 📖 **Solution reveal** — compare your CSS against a reference implementation after completing a level
- 🔢 **Animated score reveal** — the result score counts up with easing instead of popping in
- 📊 **Progress stats** — completion count, streak, average score, and best score on the level-select screen

## Tech stack

| Layer | Choice |
|---|---|
| UI | React 18 + TypeScript |
| Build tool | Vite 5 |
| Styling | Tailwind CSS v4 (via `@tailwindcss/vite`) |
| Code editor | CodeMirror 6 (`@codemirror/*`, CSS language support, One Dark theme) |
| Animation | Framer Motion |
| State | A single `useReducer` store (no external state library) |
| Persistence | `localStorage` (per-level saved code, completion flag, personal best) |

No backend, no database, no auth — everything runs client-side in the browser.

## Getting started

```bash
# install dependencies
npm install

# start the dev server
npm run dev

# type-check + build for production
npm run build

# preview the production build
npm run preview
```

## Project structure

```
src/
├── App.tsx                  # Screen router (home / levelSelect / playing / complete / failed)
├── main.tsx                 # React entry point
├── index.css                # Tailwind import + global/editor styles
├── types/
│   └── index.ts              # Level, GameState, GameAction, and related types
├── data/
│   └── levels.ts              # All levels: markup, target CSS, hints, time limit, pass score
├── hooks/
│   ├── useGameReducer.ts      # Core game state machine (screens, score, timer, hints, persistence)
│   └── useScoreAnimation.ts   # RAF-driven eased number animation for score displays
└── components/
    ├── GameScreen.tsx         # The main play screen: editor, target/user iframes, live + submit scoring
    ├── SolutionPanel.tsx      # Post-completion screen with animated score + reference solution
    ├── ProgressStats.tsx      # Aggregate stats card on the level-select screen
    └── ErrorBoundary.tsx      # Class-based fallback UI for uncaught render errors
```

## How scoring works

There's no server-side rendering or headless browser involved — everything happens in the client:

1. The level's fixed HTML is combined with either the **target CSS** or the **player's CSS** into a full HTML document and loaded into a sandboxed `<iframe srcdoc="...">`.
2. Each iframe's rendered DOM is captured to an off-screen `<canvas>` using [`html2canvas`](https://html2canvas.hertzen.com/), which walks the real DOM and paints each element's computed styles directly onto the canvas.
   > Earlier versions used an SVG `<foreignObject>` + `Image` + canvas trick instead. That approach reliably tainted the canvas in Chrome — even for fully local, same-origin content — causing `getImageData()` to throw and every score to silently read 0%, regardless of how correct the CSS was. `html2canvas` avoids this entirely since there's no image-decode step for the browser to taint.
3. Both canvases (400×300, matching the fixed preview size) are read with `getImageData`, and every pixel's RGB channels are compared with a tolerance of ±10 per channel — this absorbs minor anti-aliasing/font-rendering differences across browsers so a visually perfect match doesn't get penalized down to ~85%.
4. Live scoring (the bar under the editor) runs 600ms after the last keystroke (see `SCORE_DELAY` in `GameScreen.tsx`). Clicking **Submit** (or `Ctrl/Cmd + Enter`) runs an independent, immediate capture-and-compare pass and always routes you to a definitive result screen — pass (`complete`) or fail (`failed`) — rather than only reacting when you clear the pass threshold.

**Known limitation:** `html2canvas` doesn't render `backdrop-filter`, `clip-path`, or `mix-blend-mode` reliably, so levels are intentionally written to avoid depending on those properties for scoring accuracy.

## Adding a new level

Levels are plain data — no code changes needed elsewhere. Add an entry to `LEVELS` in `src/data/levels.ts`:

```ts
{
  id: 31,
  title: 'Your Level Name',
  difficulty: 'easy' | 'medium' | 'hard',
  description: 'One-line description shown in the header.',
  timeLimit: 120,       // seconds
  pointsToWin: 85,      // % match required to pass
  html: `<div class="container">...</div>`,   // fixed markup — players only write CSS
  targetCSS: `.container { ... }`,             // the "answer" — also shown in the solution reveal
  hints: ['hint 1', 'hint 2', 'hint 3'],
}
```

The `.container` (or whatever top-level class you use) should size itself to fill the fixed 400×300px preview — see existing levels for the pattern.

## Known limitations

- `html2canvas` doesn't fully support `backdrop-filter`, `clip-path`, or `mix-blend-mode` — levels are written to avoid depending on those properties, but hand-written custom CSS using them may score lower than it visually deserves.
- Scoring tolerance (±10 per RGB channel) is a fixed global constant — it isn't tuned per level.
- Progress (completion, personal bests, in-progress code) is stored in `localStorage` only, so it's per-browser and not synced across devices.

## License

No license file is currently included — treat this as private/unlicensed unless one is added.