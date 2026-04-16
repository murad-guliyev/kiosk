// Shared coin rotation driver — one rAF loop, one CSS variable.
// Slower period (20s) for a calm exhibition feel.

const PERIOD_MS = 20000;
let running = false;

function tick(): void {
  const angle = ((Date.now() % PERIOD_MS) / PERIOD_MS) * 360;
  document.documentElement.style.setProperty('--coin-angle', `${angle}deg`);
  requestAnimationFrame(tick);
}

export function startCoinSpinner(): void {
  if (running) return;
  running = true;
  requestAnimationFrame(tick);
}
