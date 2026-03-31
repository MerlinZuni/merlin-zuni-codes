# Merlin Zuni Codes

### [→ merlinzuni.github.io/merlin-zuni-codes](https://merlinzuni.github.io/merlin-zuni-codes/)

A collection of creative coding experiments made while studying at the [Zürcher Hochschule der Künste (ZHdK)](https://www.zhdk.ch/). Each piece explores a different idea in generative visuals, motion, and interaction — built entirely in the browser with no frameworks or build tools.

---

## Experiments

### [The Rotating Clock](clock-experiment.html)
A Bauhaus-influenced analog clock built with [p5.js](https://p5js.org/). Three hands represent hours (black), minutes (yellow), and seconds (blue), each leaving behind a fading quarter-turn arc trail. The trails step inward across concentric rings and fade both with age and towards the centre. When the hour hand enters the black bottom-right quadrant of the dial, the hand and its traces turn white for visibility. The clock displays the viewer's local time and city, fetched via IP geolocation with a timezone fallback.

### [Molnar Boxes](molnar-boxes.html)
A generative grid of rectangles inspired by the systematic variation work of [Vera Molnár](https://en.wikipedia.org/wiki/Vera_Moln%C3%A1r). A 14×14 field of SVG shapes continuously animates between random size and color states every four seconds, interpolating smoothly at constant speed. Each cell carries a vertical gradient sampled from a procedural warm-to-cool color field, with a film-grain SVG filter clipped tightly to each shape.

### [Particle Waves](particle-waves.html)
A static generative field of short line strokes placed using simplex noise. Thousands of red and teal lines are distributed across the canvas using `noise2D` values to vary their vertical position, building up a layered wave-like texture.

### [Moving Waves](moving-waves.html)
A live animated flow field using [simplex-noise.js](https://github.com/jwagner/simplex-noise.js). Two layers of rotating line strokes are updated every frame via `requestAnimationFrame`, driven by 3D simplex noise in `(x, y, time)` space. The result is a continuously shifting field of red and teal lines that ripple and breathe over time.

### [Moving Grid Systems](moving-grid.html)
A typographic and generative piece referencing the grid-systems tradition of Josef Müller-Brockmann. A white dot grid is centred on an orange background; each dot stretches into a line radiating outward in a wave that expands from a randomly chosen origin — centre, corners, top-to-bottom, or spinning. The intensity scales toward the edges so outer dots stretch further. Moving the mouse creates a calm zone that suppresses the effect nearby. The wave origin switches smoothly every five seconds. Title and description are set in English and German.

---

## Shared system

All experiment pages share:

- **`site-shared.css`** — base reset, TBJInterval font stack, fixed glass header, `.site-main` typography
- **`site-nav.js`** — builds the character-cell navigation (each letter in its own bordered cell, `{` `}` brackets on hover/active), handles horizontal scroll, drag, and auto-scrolls the active item into view

---

## Stack

- Vanilla HTML, CSS, and JavaScript — no build tools, no frameworks
- [p5.js](https://p5js.org/) — canvas drawing for the clock
- [simplex-noise.js](https://github.com/jwagner/simplex-noise.js) — flow fields for the wave experiments
- SVG — animated grid for Molnar Boxes (gradients, grain filter, `requestAnimationFrame`)
- Canvas 2D — dot-grid stretch animation for Moving Grid
- CSS `backdrop-filter` — frosted glass nav panels
- **TBJInterval** by The Rodina / [Supply Family](https://supply.family/) — monospaced grotesque used throughout

---

## Running locally

No build step required. Serve the folder with any static server:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

---

## License

Code is open source under the [MIT License](https://opensource.org/licenses/MIT).  
The TBJInterval font files are licensed separately — see the [Supply Family shop](https://supply.family/) for details.
