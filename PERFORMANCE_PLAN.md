# Performance Report — CBAR Kiosk

Target: 75-inch Android touch kiosk (weak WebView GPU). Current symptom: animations feel janky, scrolling fights continuous effects.

## Method

Inventoried every animation, continuous effect, and per-frame cost in the codebase and ranked by impact on the Android WebView compositor + GPU. The list below is ordered by **biggest suspected win first**.

---

## Top culprits (ranked)

### 1. `filter: blur()` in entrance animations 🔥
`anim-page-zoom-in`, `anim-header-drop`, `anim-card-flip-in` all use `filter: blur(8–18px)`. Blur is **not compositor-friendly** — every frame the GPU rasterizes the blurred region from scratch, over the full screen area. On weak mobile GPUs this is the #1 frame-time sink. Multiple `VersionCard`s blurring simultaneously = compound cost.

**Fix:** remove the blur component, keep the transform + opacity. Visual impact is minor; perf gain is large.

### 2. `backdrop-filter: blur(12px)` on Header + Sidebar 🔥
Translucent blur behind the header and tab nav forces a per-frame repaint of everything underneath. Android WebView's backdrop-filter implementation is notoriously slow on low-end GPUs.

**Fix:** replace with a plain semi-transparent dark color (e.g., `rgba(0,20,40,0.75)`). Visually almost identical, 10–20× cheaper.

### 3. AnimatedBg particle density & O(N²) connections
70 front + 50 back particles = 120. Line-connection check is O(N²) per layer → ~2,415 + 1,225 = ~3,600 distance calcs per frame, plus canvas stroke draws.

**Fix:** halve the counts (30 front + 15 back), shorten connection radius by 20%. ~4× fewer math ops, barely noticeable visually.

### 4. Four continuous infinite animations on the active tab
`tab-shimmer` (5s), `tab-glow-pulse` (4s), `tab-accent-shift` (6s), `tab-icon-glow` (3s). Box-shadow pulses in particular repaint every frame. These run **forever**, even when the user is idle.

**Fix:** keep one subtle shimmer (or none), drop the other three. Or remove all and rely on a static active color.

### 5. `filter: drop-shadow()` on every coin/banknote image
Each `drop-shadow` filter disables GPU compositing for that element and forces CPU/GPU rasterization on every frame it's touched.

**Fix:** replace with a `box-shadow` on the wrapper div (compositor-friendly), or drop the shadow.

### 6. Animated linear gradients
Minor but: `tab-accent-shift` animates `background-position` on a gradient, forcing per-frame repaint of the gradient.

### 7. 3D perspective + rotateY on ~20 coin cards simultaneously
Each coin is its own GPU layer. Adds up on low-GPU devices.

**Fix:** keep the 3D flip, but consider showing only the front face on the home grid and doing the flip on the detail page only. Big reduction in layer count.

### 8. AnimatedBg runs on every route
Even on the detail page (dense content, user won't notice the backdrop).

**Fix:** mount `AnimatedBg` only on `HomePage`, not in `Layout`.

---

## Proposed plan, in order

### Phase 1 — instant wins, zero-risk (target: 70% of the improvement)
1. Strip `filter: blur()` from entrance animations (keep transform + opacity).
2. Replace `backdrop-filter: blur()` with solid `rgba(0,20,40,0.75)` on Header/Sidebar.
3. Halve AnimatedBg particle counts and shorten connect radius.
4. Drop 3 of the 4 continuous tab animations.
5. Remove or convert `filter: drop-shadow()` → `box-shadow` on images.

### Phase 2 — scope trimming
6. Mount `AnimatedBg` only on `HomePage`.
7. On detail page, simplify `anim-card-flip-in` to fade + translateY (no 3D, no blur).
8. Keep the coin 3D flip only on the detail page (home shows static front face).

### Phase 3 — device-aware (optional)
9. Detect `navigator.hardwareConcurrency <= 4` → downgrade animations further and skip `AnimatedBg`.
10. Respect `prefers-reduced-motion`.

---

## What NOT to touch

- **Image preloader**, **selectors index maps**, **`memo` on `MoneyCard`** — all already tight.
- **Shared `--coin-angle` driver** — cheap, one var update per frame, all coins read from it (no per-card animation).
- **Layout scroll container**, **touch handlers** — lightweight.

---

## Recommended execution order

Start with Phase 1 items **#1, #2, #4**. These three alone should noticeably smooth things out on the device. Ship, test, then iterate based on what's still slow.

## File map (where the changes land)

| Concern | File |
|---|---|
| Entrance animation blur + 3D | `src/index.css` (`@keyframes page-zoom-in`, `header-drop`, `card-flip-in`) |
| Backdrop blur | `src/components/Header/Header.tsx`, `src/components/Sidebar/Sidebar.tsx` |
| Particle counts | `src/components/AnimatedBg/AnimatedBg.tsx` (`FRONT_COUNT`, `BACK_COUNT`, `*_CONNECT`) |
| Continuous tab animations | `src/index.css` (`tab-shimmer`, `tab-glow-pulse`, `tab-accent-shift`, `tab-icon-glow`) + `src/components/Sidebar/Sidebar.tsx` |
| drop-shadow filters | `src/components/MoneyCard/MoneyCard.tsx` (`imgStyle`) |
| AnimatedBg scoping | `src/components/Layout/Layout.tsx` → move to `src/pages/HomePage/HomePage.tsx` |
| Coin flip scoping | `src/components/MoneyCard/MoneyCard.tsx` (grid) vs `src/pages/MoneyDetailPage/MoneyDetailPage.tsx` (detail) |
| Device heuristic | new `src/lib/deviceTier.ts` |
