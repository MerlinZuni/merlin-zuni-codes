# Merlin Zuni Codes

### [→ merlinzuni.github.io/merlin-zuni-codes](https://merlinzuni.github.io/merlin-zuni-codes/)

A portal to a collection of creative coding experiments made while studying at the [Zürcher Hochschule der Künste (ZHdK)](https://www.zhdk.ch/). Each piece explores a different aspect of generative visuals, motion, and interaction built entirely in the browser.

---

## Experiments

| Page | Description |
|---|---|
| `clock-experiment.html` | A rotating typographic clock |
| `molnar-boxes.html` | Generative compositions inspired by Vera Molnár |
| `particle-waves.html` | Particle systems driven by wave functions |
| `moving-waves.html` | Animated wave fields |

---

## How it was made

### Particle Animation

The background is a real-time particle system written in vanilla JavaScript using the [p5.js](https://p5js.org/) canvas and [simplex-noise.js](https://github.com/jwagner/simplex-noise.js) for smooth, organic movement.

Each particle is spawned near the centre of the screen and drifts outward along a spiral path shaped by two forces working together: a **tangential spin** that pulls particles in a circular arc, and a **3D simplex noise flow field** that introduces subtle organic turbulence. Particles vary in size and opacity based on a `depth` value assigned at birth — small, dim particles read as distant; large, brighter ones read as close — giving the field a sense of three-dimensional depth without any blur or shadow.

Particles fade in and out over their lifetime using a sine curve, so they swell smoothly into view and dissolve again. Three colours are drawn from a palette — white, warm sand (`#c9a98f`), and warm yellow (`#fbde6d`) — weighted so white dominates and the warm tones appear as occasional subtle accents.

For performance, particles are grouped into **alpha bins** before drawing. Instead of one GPU draw call per particle, all particles sharing a similar opacity level are batched into a single `beginPath / fill` call. With 800 particles across 3 colours and 10 opacity levels, the renderer makes at most 30 draw calls per frame — compared to the 800+ that a naïve implementation would require. `shadowBlur` is not used; all depth is achieved through size and opacity alone, avoiding the most expensive Canvas 2D operation.

---

### Glass Effect

The frosted glass panels behind the navigation links are built entirely with **CSS `backdrop-filter`**. This browser-native property composites everything rendered beneath an element — including live canvas animations — and applies real-time filters to it.

Three properties work together:

- `blur()` — frosts the background behind the element, creating the out-of-focus glass look
- `brightness()` and `saturate()` — tone the glass to feel slightly darkened and desaturated, as if light is passing through a tinted surface
- `background: rgba(255, 255, 255, tint)` — adds a very faint white surface tint

A lens distortion effect is layered on top using an **SVG displacement filter** (`feTurbulence` + `feDisplacementMap`). This generates a noise field and uses it to warp pixel positions across the element, simulating the slight optical distortion of thick glass or crystal.

All glass parameters are exposed as **CSS custom properties** (`--glass-blur`, `--glass-tint`, `--glass-brightness`, `--glass-saturate`) and can be tuned live from the on-screen dev panel.

---

### Typography

The typeface used throughout is **[TRT Interval](https://supply.family/shop/trt-interval/?srsltid=AfmBOortz47mQSxFpDy17U3jn2h8cOk0G54wLkY6eKFDMVEGp0mbBj5l)**, designed by The Rodina and distributed by [Supply Family](https://supply.family/).

TRT Interval is a strict monospaced grotesque where every character — letters, numbers, and punctuation — occupies exactly the same width. The grid-perfect spacing makes it well suited to the column-based link layout on this page, where each letter sits centred in its own cell and words are separated by empty cells that preserve the rhythm of the grid.

Three weights are used: **Bold** for the title and link labels, **Light** for the subtitle, and **Regular** for navigation text.

---

## Stack

- Vanilla HTML, CSS, and JavaScript — no build tools, no frameworks
- [p5.js](https://p5js.org/) — canvas API wrapper for the animation loop
- [simplex-noise.js](https://github.com/jwagner/simplex-noise.js) — smooth noise for the flow field
- [lil-gui](https://lil-gui.georgealways.com/) — lightweight dev panel for tweaking parameters at runtime
- CSS `backdrop-filter` — native browser glass effect
- SVG filters (`feTurbulence` / `feDisplacementMap`) — lens distortion

---

## Running locally

No build step required. Serve the folder with any static HTTP server:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080` in your browser.

---

## License

Code is open source under the [MIT License](https://opensource.org/licenses/MIT).  
The TRT Interval font files are licensed separately — see the [Supply Family shop](https://supply.family/shop/trt-interval/) for details.
