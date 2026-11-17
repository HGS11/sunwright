[![make.fun · best-game-01](https://make.fun/badge/best-game-01.svg)](https://make.fun/bounty/best-game-01?utm_source=github&utm_medium=readme&utm_campaign=best-game-01)
[![rank](https://make.fun/badge/best-game-01/HGS11/sunwright/rank.svg)](https://make.fun/bounty/best-game-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-game-01)
[![reward](https://make.fun/badge/best-game-01/HGS11/sunwright/reward.svg)](https://make.fun/bounty/best-game-01?utm_source=github&utm_medium=readme&utm_campaign=best-game-01)

![License: MIT](https://img.shields.io/badge/license-MIT-d9bc76)
![HTML5 game](https://img.shields.io/badge/game-HTML5-659c85)
![Competition](https://img.shields.io/badge/competition-best--game--01-c48d69)

# SUNWRIGHT

Catch the sun in a garden of glass, turning its wandering light into a defence for your last living spring. Beetles hunger for the fountain, and only your mirrors, lenses and little wonders can hold them through nine suns.

Serve the `game` directory using any static file server, then open its `index.html` in a modern browser. For example, from this directory run `python3 -m http.server 8080 --directory game`, then open the server in your browser. No build, installation, libraries or network services are needed. All artwork is procedural canvas drawing; all audio is synthesized locally using WebAudio.

Choose Gentle, Bright or Blazing and enter the garden. Plant glass on free lawn cells, angle it across the stone paths, then release the sun. Every glass catches sunlight; beams can chain through four more pieces, dealing damage along each segment. Earn motes from scorched beetles and cleared waves, polish each glass twice, and choose a permanent charm after each sun. Survive all 27 waves without letting the fountain run dry.

Mirrors reflect the incoming light. Lenses focus along their arrow and pierce armour. Prisms fan into three beams. Amber stacks burning embers and slows shells. Sunstones amplify routed light. Use lenses against Bulwarks and either focused or amplified light against shiny Glints; the Titan arrives at the end of suns three, six and nine.

| Control | Action |
| --- | --- |
| Mouse | Choose glass, plant on lawn, select planted glass, activate buttons |
| 1–5 | Select Mirror, Lens, Prism, Amber or Sunstone |
| R | Rotate selected glass or placement ghost 15 degrees |
| U / X | Upgrade / sell selected glass |
| Escape | Cancel placement, deselect, or close help |
| Space | Start the next wave |
| F | Toggle double speed |
| P | Pause / resume |
| M | Mute / unmute |
| H | Open / close the field guide |

Content: **5 glass types**, each with **2 upgrades**; **4 ordinary beetle types** and **1 Titan boss type** with three increasingly strong encounters; **9 named suns**, **27 waves**, **12 permanent charms**, and **3 difficulties**. Best scores are saved in browser local storage. Selling normally refunds 70%; Second Chances grants a full refund. Free glass vouchers are visible in the build bar.

Deterministic scenes use `?shot=title&seed=42`, with `play`, `titan`, `victory` and `defeat` also supported. Each scene uses a fixed seeded state, draws once, and then sets `window.__shotReady = true`.

The root `main.ts` runs on Node 22 with TypeScript support. It copies `game/` and `screenshots/` to `MAKEFUN_OUTPUT_DIR` (default `/output`) and builds `dossier.json` with the vendored dossier helper. Screenshot images are supplied separately; the helper rejects a dossier without them.

Original code, procedural artwork and synthesized sound. Copyright 2026 Haygs. Licensed under the MIT license; see `LICENSE`.
