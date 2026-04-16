import { getAllImageUrls } from './selectors';

// Hold strong references so the browser keeps cached Image objects alive
// for the lifetime of the app (kiosk session). Without this, GC can evict
// decoded bitmaps and the HTTP cache entries are the only thing left.
const kept: HTMLImageElement[] = [];

const CONCURRENCY = 4;

function preloadOne(url: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    // 'low' — never compete with above-the-fold rendering
    if ('fetchPriority' in img) {
      (img as HTMLImageElement & { fetchPriority: string }).fetchPriority = 'low';
    }
    img.decoding = 'async';
    img.loading = 'eager';
    img.onload = () => {
      kept.push(img);
      resolve();
    };
    img.onerror = () => resolve(); // don't let one failure stall the queue
    img.src = url;
  });
}

/**
 * Warm the browser cache with every image in the dataset, in priority order,
 * with bounded concurrency so we don't saturate the network or WebView decoder.
 * Runs in the background after idle — safe to call on app mount.
 */
export async function preloadAllImages(): Promise<void> {
  const urls = getAllImageUrls();
  let index = 0;

  async function worker() {
    while (index < urls.length) {
      const i = index++;
      await preloadOne(urls[i]);
    }
  }

  const workers: Promise<void>[] = [];
  for (let i = 0; i < CONCURRENCY; i++) workers.push(worker());
  await Promise.all(workers);
}

/** Start the preloader at the earliest idle slot after app boot. */
export function startImagePreload(): void {
  const kick = () => {
    preloadAllImages().catch(() => { /* ignore — best-effort */ });
  };
  if (typeof (window as Window & { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number }).requestIdleCallback === 'function') {
    (window as Window & { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => number }).requestIdleCallback(kick, { timeout: 2000 });
  } else {
    setTimeout(kick, 800);
  }
}
