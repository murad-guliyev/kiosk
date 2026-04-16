// Tiny shared flag so rAF-driven animations can know if the main scroll
// container is actively scrolling without querying the DOM every frame.
// Layout's scroll listener sets this; AnimatedBg (and others) read it.

let scrolling = false;

export function setScrolling(v: boolean): void {
  scrolling = v;
}

export function isScrolling(): boolean {
  return scrolling;
}
