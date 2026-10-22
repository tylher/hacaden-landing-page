// Shared helpers for the liquid-fill logo effect (used by the footer badge;
// the loader can import these too instead of keeping its own copies).

export const LOGO_W = 1152;
export const LOGO_H = 1150;

// a completely filled logo (mask path that covers everything)
export const FULL_FILL = `M0,0 H${LOGO_W} V${LOGO_H} H0 Z`;

// slow primary swell plus a faster ripple, so it reads as water
export function buildWavePoints(levelFrac, amplitude, phase) {
  const levelY = LOGO_H - levelFrac * LOGO_H;
  const step = 18;
  const points = [];
  for (let x = 0; x <= LOGO_W; x += step) {
    const primary = Math.sin((x / LOGO_W) * Math.PI * 4 + phase) * amplitude;
    const ripple =
      Math.sin((x / LOGO_W) * Math.PI * 9 + phase * 1.7) * (amplitude * 0.28);
    points.push([x, levelY + primary + ripple]);
  }
  return points;
}

export function buildFillPath(points) {
  let d = `M0,${LOGO_H} L${points[0][0]},${points[0][1].toFixed(1)} `;
  for (const [x, y] of points) d += `L${x},${y.toFixed(1)} `;
  d += `L${LOGO_W},${LOGO_H} Z`;
  return d;
}
