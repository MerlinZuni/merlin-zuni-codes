// Analog clock — local wall time. Bauhaus palette on .page-clock-bauhaus; neutral dial elsewhere.

let centerX;
let centerY;
const R_HOUR = 72;
const R_MINUTE = 104;
const R_SECOND = 128;
const TAU = Math.PI * 2;

const TRAIL_LEN_SEC = 120;
const TRAIL_LEN_MIN = 72;
const TRAIL_LEN_HOUR = 48;

/** Echo arcs per sample, stepped inward from the hand radius toward the next inner hand. */
const TRAIL_RINGS_PER_SAMPLE = 9;

let secTrail = [];
let minTrail = [];
let hourTrail = [];

const HOUR_HAND_FOLLOWS_MINUTES = true;

/** Same face as the site (site-shared.css @font-face); canvas text resolves it like HTML. */
const CLOCK_TEXT_FONT = 'TBJInterval, monospace';

/** Filled synchronously from IANA zone, then replaced with city/region from geo lookup when available. */
let viewerPlaceLabel = '';

function prettyIanaZone(iana) {
    if (!iana) return 'Local';
    const tail = iana.split('/').pop();
    return tail.replace(/_/g, ' ');
}

/** Rough place name for the viewer (IP-based); falls back to e.g. "Los Angeles" from `America/Los_Angeles`. */
function initViewerPlaceLabel() {
    viewerPlaceLabel = prettyIanaZone(Intl.DateTimeFormat().resolvedOptions().timeZone);

    fetch('https://get.geojs.io/v1/ip/geo.json')
        .then((r) => {
            if (!r.ok) throw new Error(String(r.status));
            return r.json();
        })
        .then((data) => {
            const city = (data.city || '').trim();
            const region = (data.region || '').trim();
            let label = '';
            if (city && region && region.toLowerCase() !== city.toLowerCase()) label = `${city}, ${region}`;
            else if (city) label = city;
            else if (region) label = region;
            else if (data.country) label = String(data.country).trim();
            if (label) viewerPlaceLabel = label;
            redraw();
        })
        .catch(() => redraw());
}

function isBauhausPage() {
    return document.body && document.body.classList.contains('page-clock-bauhaus');
}

function dialXY(cx, cy, r, value, fullTurn) {
    const t = (value / fullTurn) * TAU;
    return {
        x: cx + r * Math.sin(t),
        y: cy - r * Math.cos(t),
    };
}

/** True if `a` (p5 `arc()` angle, 0 = 3 o'clock, CW) lies in the black bottom-right PIE wedge. */
function p5AngleInBlackWedge(a) {
    const n = ((a % TAU) + TAU) % TAU;
    return n >= 0 && n <= HALF_PI;
}

/** Smallest magnitude difference between two angles on the circle, radians. */
function angularSeparation(a, b) {
    let d = Math.abs(a - b);
    if (d > TAU / 2) d = TAU - d;
    return d;
}

/** Angular position from 12 o'clock CW, radians — same convention as dialXY inner `t`. */
function pushTrail(arr, angleRad, maxLen, minSeparation = 0) {
    if (minSeparation > 0 && arr.length > 0 && angularSeparation(angleRad, arr[0]) < minSeparation) {
        return;
    }
    arr.unshift(angleRad);
    if (arr.length > maxLen) arr.length = maxLen;
}

/** Quarter-turn sweep: streak ends on the hand ray, opens backward on the dial (CCW from the tip). */
const TRAIL_ARC_SWEEP = TAU / 4;

/**
 * Concentric ring echoes: one solid `rgb` per hand. Each sample is a ¼-turn arc that
 * ends on the radial hand line (not centered on it), opens backward, fades along the streak,
 * fades along the temporal tail (older = fainter), and fades inward (smaller radius = fainter).
 */
function drawFadingCascadingTrails(cx, cy, rOuter, rInner, trail, rgb, strokeW, rgbInWedge) {
    if (trail.length === 0) return;
    const denom = Math.max(1, trail.length - 1);
    const rings = TRAIL_RINGS_PER_SAMPLE;
    const CH = 18;
    noFill();
    strokeCap(SQUARE);
    for (let i = trail.length - 1; i >= 0; i--) {
        const ageAlpha = map(i, 0, denom, 56, 0);
        for (let k = rings - 1; k >= 0; k--) {
            const tK = rings <= 1 ? 0 : k / (rings - 1);
            const r = lerp(rOuter, rInner, tK);
            const inwardFade = pow(1 - tK, 1.25);
            const baseAlpha = ageAlpha * inwardFade;
            const sw = max(0.85, lerp(strokeW, strokeW * 0.62, tK));
            const tRad = trail[i];
            const aOnHand = -HALF_PI + tRad;
            const aStart = aOnHand - TRAIL_ARC_SWEEP;
            const aEnd = aOnHand;
            for (let j = 0; j < CH; j++) {
                const s0 = lerp(aStart, aEnd, j / CH);
                const s1 = lerp(aStart, aEnd, (j + 1) / CH);
                const u = (j + 0.5) / CH;
                const streakTailFade = map(u, 0, 1, 0.04, 1);
                const useWedge =
                    rgbInWedge && p5AngleInBlackWedge((s0 + s1) * 0.5);
                const pick = useWedge ? rgbInWedge : rgb;
                stroke(pick[0], pick[1], pick[2], baseAlpha * streakTailFade);
                strokeWeight(sw);
                arc(cx, cy, r * 2, r * 2, s0, s1, OPEN);
            }
        }
    }
}

function setup() {
    const canvas = createCanvas(600, 600);
    canvas.parent('clock-container');
    centerX = width * 0.5;
    centerY = height * 0.5;
    if (isBauhausPage()) initViewerPlaceLabel();
}

/** Hands and locale string use the viewer's system local wall clock (no fixed timezone). */
function getLocalClockState() {
    const now = new Date();
    const s = now.getSeconds() + now.getMilliseconds() / 1000;
    const m = now.getMinutes() + s / 60;
    let h = now.getHours() % 12;
    if (HOUR_HAND_FOLLOWS_MINUTES) {
        h += m / 60;
    }

    return {
        hourDial: h,
        minuteDial: m,
        secondDial: s,
        localeString: now.toLocaleTimeString(undefined, {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
            timeZoneName: 'short',
        }),
    };
}

function drawBauhaus(st) {
    const bg = [236, 232, 226];
    const coral = [226, 78, 68];
    const yellow = [220, 175, 45];
    const blue = [28, 56, 120];
    const black = [16, 16, 18];
    const whiteOnWedge = [255, 255, 255];

    background(bg[0], bg[1], bg[2]);
    noStroke();

    pushTrail(secTrail, (st.secondDial / 60) * TAU, TRAIL_LEN_SEC);
    pushTrail(minTrail, (st.minuteDial / 60) * TAU, TRAIL_LEN_MIN, 0.025);
    pushTrail(hourTrail, (st.hourDial / 12) * TAU, TRAIL_LEN_HOUR, 0.018);

    const faceR = 148;
    // Coral face (inspired by poster clock motif)
    noStroke();
    fill(coral[0], coral[1], coral[2]);
    circle(centerX, centerY, faceR * 2);

    // Black “missing” quadrant — bottom-right slice (flat graphic)
    fill(black[0], black[1], black[2]);
    arc(centerX, centerY, faceR * 2 + 4, faceR * 2 + 4, 0, Math.PI / 2, PIE);

    // Bold hour ticks on coral ring only (skip wedge area roughly)
    stroke(black[0], black[1], black[2]);
    strokeWeight(4);
    const tickOut = faceR - 2;
    const tickIn = faceR - 22;
    for (let hr = 0; hr < 12; hr++) {
        const a = dialXY(centerX, centerY, tickIn, hr, 12);
        const b = dialXY(centerX, centerY, tickOut, hr, 12);
        line(a.x, a.y, b.x, b.y);
    }

    // Cascading ring echoes (solid hand colors); hour → minute → second paint order
    const rHub = 46;
    drawFadingCascadingTrails(centerX, centerY, R_HOUR, rHub, hourTrail, black, 1.85, whiteOnWedge);
    drawFadingCascadingTrails(centerX, centerY, R_MINUTE, R_HOUR, minTrail, yellow, 2.2);
    drawFadingCascadingTrails(centerX, centerY, R_SECOND, R_MINUTE, secTrail, blue, 1.65);

    const hourPt = dialXY(centerX, centerY, R_HOUR, st.hourDial, 12);
    const minPt = dialXY(centerX, centerY, R_MINUTE, st.minuteDial, 60);
    const secPt = dialXY(centerX, centerY, R_SECOND, st.secondDial, 60);

    // Hands: black hour (white over black wedge), yellow minute, blue second
    const hourP5Angle = -HALF_PI + (st.hourDial / 12) * TAU;
    const hourRgb = p5AngleInBlackWedge(hourP5Angle) ? whiteOnWedge : black;
    stroke(hourRgb[0], hourRgb[1], hourRgb[2]);
    strokeWeight(8);
    strokeCap(PROJECT);
    line(centerX, centerY, hourPt.x, hourPt.y);

    strokeCap(ROUND);
    stroke(yellow[0], yellow[1], yellow[2]);
    strokeWeight(5);
    line(centerX, centerY, minPt.x, minPt.y);

    stroke(blue[0], blue[1], blue[2]);
    strokeWeight(2);
    strokeCap(ROUND);
    line(centerX, centerY, secPt.x, secPt.y);

    fill(252, 250, 247);
    stroke(black[0], black[1], black[2]);
    strokeWeight(3);
    circle(centerX, centerY, 14);

    noStroke();
    push();
    textAlign(LEFT, TOP);
    textFont(CLOCK_TEXT_FONT);

    const tx = 28;
    const textW = width - tx * 2;
    let ty = height - 68;

    fill(black[0], black[1], black[2]);
    textStyle(BOLD);
    textSize(15);
    text(st.localeString, tx, ty);
    ty += 21;

    textStyle(NORMAL);
    textSize(11);
    textLeading(15);
    fill(60, 58, 56);
    textWrap(WORD);
    text(viewerPlaceLabel || prettyIanaZone(Intl.DateTimeFormat().resolvedOptions().timeZone), tx, ty, textW);
    pop();
}

function drawNeutral(st) {
    background(225, 225, 228);
    noFill();

    stroke(197, 203, 211);
    strokeWeight(8);
    circle(centerX, centerY, width / 1.5);

    stroke(187, 52, 47);
    strokeWeight(4);
    circle(centerX, centerY, 200);

    const rTickOuter = R_SECOND + 18;
    const rTickInner = R_SECOND + 6;
    stroke(100, 100, 110);
    strokeWeight(2);
    for (let h = 0; h < 12; h++) {
        const a = dialXY(centerX, centerY, rTickInner, h, 12);
        const b = dialXY(centerX, centerY, rTickOuter, h, 12);
        line(a.x, a.y, b.x, b.y);
    }

    const hourPt = dialXY(centerX, centerY, R_HOUR, st.hourDial, 12);
    const minPt = dialXY(centerX, centerY, R_MINUTE, st.minuteDial, 60);
    const secPt = dialXY(centerX, centerY, R_SECOND, st.secondDial, 60);

    noFill();
    stroke(197, 203, 211);
    strokeWeight(5);
    line(centerX, centerY, hourPt.x, hourPt.y);

    stroke(187, 52, 47);
    strokeWeight(3);
    line(centerX, centerY, minPt.x, minPt.y);

    stroke(140, 188, 185);
    strokeWeight(2);
    line(centerX, centerY, secPt.x, secPt.y);

    fill(197, 203, 211);
    stroke(80, 80, 88);
    strokeWeight(2);
    circle(centerX, centerY, 12);

    noStroke();
    fill(60, 60, 68);
    textAlign(CENTER, TOP);
    textSize(14);
    textFont('monospace');
    text(st.localeString, centerX, height - 52);
    textSize(11);
    fill(100, 100, 108);
    text(
        HOUR_HAND_FOLLOWS_MINUTES
            ? 'Mechanical-style hour (moves with minutes).'
            : 'Hour snaps to numeral.',
        centerX,
        height - 34
    );
    text('Top tick = 12.', centerX, height - 18);
}

function draw() {
    const st = getLocalClockState();
    if (isBauhausPage()) {
        drawBauhaus(st);
    } else {
        drawNeutral(st);
    }
}
