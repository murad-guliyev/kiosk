import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Register service worker for PWA/offline support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

// Auto-update: check for new version every 30 minutes, reload if changed
const CHECK_INTERVAL = 30 * 60 * 1000; // 30 minutes
let currentVersion: string | null = null;

async function checkForUpdate() {
  try {
    const res = await fetch('/version.json?t=' + Date.now(), { cache: 'no-store' });
    if (!res.ok) return;
    const data = await res.json();
    const newVersion = data.version;

    if (currentVersion === null) {
      // First check — just store the version
      currentVersion = newVersion;
    } else if (newVersion !== currentVersion) {
      // Version changed — clear SW cache and reload
      if ('caches' in window) {
        const names = await caches.keys();
        await Promise.all(names.map(name => caches.delete(name)));
      }
      window.location.reload();
    }
  } catch {
    // Network error — skip this check
  }
}

checkForUpdate();
setInterval(checkForUpdate, CHECK_INTERVAL);
