import { useEffect, useRef, useCallback } from 'react';
import { isScrolling } from '../../lib/scrollState';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  layer: 0 | 1; // 0 = back (dim, slow), 1 = front (bright, normal)
}

const FRONT_COUNT = 45;
const FRONT_SPEED = 0.55;
const FRONT_CONNECT = 160;
const FRONT_R_MIN = 1.2;
const FRONT_R_MAX = 3;
const FRONT_DOT_ALPHA = 0.75;
const FRONT_LINE_ALPHA = 0.35;

// Back layer — smaller, dimmer, slower
const BACK_COUNT = 25;
const BACK_SPEED = 0.22;
const BACK_CONNECT = 120;
const BACK_R_MIN = 0.5;
const BACK_R_MAX = 1.2;
const BACK_DOT_ALPHA = 0.25;
const BACK_LINE_ALPHA = 0.12;

const TOUCH_RADIUS = 200;
const TOUCH_FORCE = 8;


// Color cycle: deep blue → teal → cyan → back (CBAR palette)
const COLORS = [
  [0, 73, 118],    // deep blue  #004976
  [75, 200, 182],  // teal       #4BC8B6
  [11, 158, 208],  // cyan       #0B9ED0
  [75, 200, 182],  // teal again (smooth loop)
];
const COLOR_CYCLE_DURATION = 300; // frames per color transition (~5s at 60fps)

function lerpColor(a: number[], b: number[], t: number): number[] {
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ];
}

function getLineColor(frame: number): number[] {
  const totalCycle = COLOR_CYCLE_DURATION * COLORS.length;
  const pos = (frame % totalCycle) / COLOR_CYCLE_DURATION;
  const idx = Math.floor(pos);
  const t = pos - idx;
  const from = COLORS[idx % COLORS.length];
  const to = COLORS[(idx + 1) % COLORS.length];
  return lerpColor(from, to, t);
}

interface GlowPulse {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
}

export function AnimatedBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const animId = useRef<number>(0);
  const frame = useRef<number>(0);
  const glowPulses = useRef<GlowPulse[]>([]);
  const touchPoint = useRef<{ x: number; y: number; active: boolean; fade: number }>({
    x: 0, y: 0, active: false, fade: 0,
  });

  const handleTouch = useCallback((e: TouchEvent | MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    touchPoint.current = {
      x: clientX - rect.left,
      y: clientY - rect.top,
      active: true,
      fade: 1,
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Pause canvas entirely during scroll so the compositor has full budget.

    const parent = canvas.parentElement;
    if (!parent) return;

    const resize = () => {
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    };

    const initParticles = () => {
      particles.current = [];
      // Back layer — give every particle a full-speed random direction
      for (let i = 0; i < BACK_COUNT; i++) {
        const angle = Math.random() * Math.PI * 2;
        particles.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: Math.cos(angle) * BACK_SPEED,
          vy: Math.sin(angle) * BACK_SPEED,
          r: Math.random() * (BACK_R_MAX - BACK_R_MIN) + BACK_R_MIN,
          layer: 0,
        });
      }
      // Front layer — every particle starts at full base speed
      for (let i = 0; i < FRONT_COUNT; i++) {
        const angle = Math.random() * Math.PI * 2;
        particles.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: Math.cos(angle) * FRONT_SPEED,
          vy: Math.sin(angle) * FRONT_SPEED,
          r: Math.random() * (FRONT_R_MAX - FRONT_R_MIN) + FRONT_R_MIN,
          layer: 1,
        });
      }
    };

    const draw = () => {
      if (isScrolling()) {
        animId.current = requestAnimationFrame(draw);
        return;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const pts = particles.current;
      const w = canvas.width;
      const h = canvas.height;
      const tp = touchPoint.current;

      // Touch repulsion (affects both layers, front more than back)
      if (tp.fade > 0.01) {
        for (const p of pts) {
          const dx = p.x - tp.x;
          const dy = p.y - tp.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < TOUCH_RADIUS && dist > 0) {
            const layerMult = p.layer === 1 ? 1 : 0.3;
            const force = (1 - dist / TOUCH_RADIUS) * TOUCH_FORCE * tp.fade * layerMult;
            p.vx += (dx / dist) * force * 0.05;
            p.vy += (dy / dist) * force * 0.05;
          }
        }
        // Ripple glow — uses current cycle color
        const rc = getLineColor(frame.current);
        const gradient = ctx.createRadialGradient(tp.x, tp.y, 0, tp.x, tp.y, TOUCH_RADIUS);
        gradient.addColorStop(0, `rgba(${rc[0]}, ${rc[1]}, ${rc[2]}, ${0.15 * tp.fade})`);
        gradient.addColorStop(0.5, `rgba(${rc[0]}, ${rc[1]}, ${rc[2]}, ${0.05 * tp.fade})`);
        gradient.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(tp.x, tp.y, TOUCH_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        tp.fade *= 0.96;
        if (tp.fade < 0.01) tp.active = false;
      }

      // Move particles — keep each near its base speed so the whole field stays in motion
      for (const p of pts) {
        const baseSpeed = p.layer === 1 ? FRONT_SPEED : BACK_SPEED;

        // Tiny random jitter so motion doesn't feel mechanical
        p.vx += (Math.random() - 0.5) * 0.04;
        p.vy += (Math.random() - 0.5) * 0.04;

        // Light damping, then normalize velocity toward baseSpeed
        p.vx *= 0.995;
        p.vy *= 0.995;
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy) || 0.0001;
        const target = baseSpeed;
        const blend = 0.05; // pull velocity toward baseSpeed magnitude
        const factor = (1 - blend) + blend * (target / speed);
        p.vx *= factor;
        p.vy *= factor;

        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
      }

      // Draw & update glow pulses from card taps
      const pulses = glowPulses.current;
      for (let i = pulses.length - 1; i >= 0; i--) {
        const gp = pulses[i];
        gp.radius += 4;
        gp.alpha *= 0.97;

        if (gp.alpha < 0.01 || gp.radius > gp.maxRadius) {
          pulses.splice(i, 1);
          continue;
        }

        const gc = getLineColor(frame.current);
        // Expanding ring
        ctx.beginPath();
        ctx.arc(gp.x, gp.y, gp.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${gc[0]}, ${gc[1]}, ${gc[2]}, ${gp.alpha * 0.5})`;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Inner glow fill
        const grad = ctx.createRadialGradient(gp.x, gp.y, 0, gp.x, gp.y, gp.radius);
        grad.addColorStop(0, `rgba(${gc[0]}, ${gc[1]}, ${gc[2]}, ${gp.alpha * 0.15})`);
        grad.addColorStop(0.7, `rgba(${gc[0]}, ${gc[1]}, ${gc[2]}, ${gp.alpha * 0.04})`);
        grad.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(gp.x, gp.y, gp.radius, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Push nearby particles outward
        for (const p of pts) {
          const dx = p.x - gp.x;
          const dy = p.y - gp.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < gp.radius + 30 && dist > gp.radius - 30 && dist > 0) {
            const force = gp.alpha * 0.3;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
        }
      }

      // Color cycle
      frame.current++;
      const color = getLineColor(frame.current);
      const [cr, cg, cb] = color;

      // --- Draw back layer (batched: one beginPath + stroke per layer) ---
      ctx.lineWidth = 0.4;
      ctx.strokeStyle = `rgba(${cr}, ${cg}, ${cb}, ${BACK_LINE_ALPHA})`;
      ctx.beginPath();
      for (let i = 0; i < pts.length; i++) {
        if (pts[i].layer !== 0) continue;
        for (let j = i + 1; j < pts.length; j++) {
          if (pts[j].layer !== 0) continue;
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          if (dx * dx + dy * dy < BACK_CONNECT * BACK_CONNECT) {
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
          }
        }
      }
      ctx.stroke();

      ctx.fillStyle = `rgba(255, 255, 255, ${BACK_DOT_ALPHA})`;
      ctx.beginPath();
      for (const p of pts) {
        if (p.layer !== 0) continue;
        ctx.moveTo(p.x + p.r, p.y);
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      }
      ctx.fill();

      // --- Draw front layer (batched) ---
      ctx.lineWidth = 0.8;
      ctx.strokeStyle = `rgba(${cr}, ${cg}, ${cb}, ${FRONT_LINE_ALPHA})`;
      ctx.beginPath();
      for (let i = 0; i < pts.length; i++) {
        if (pts[i].layer !== 1) continue;
        for (let j = i + 1; j < pts.length; j++) {
          if (pts[j].layer !== 1) continue;
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          if (dx * dx + dy * dy < FRONT_CONNECT * FRONT_CONNECT) {
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
          }
        }
      }
      ctx.stroke();

      ctx.fillStyle = `rgba(255, 255, 255, ${FRONT_DOT_ALPHA})`;
      ctx.beginPath();
      for (const p of pts) {
        if (p.layer !== 1) continue;
        ctx.moveTo(p.x + p.r, p.y);
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      }
      ctx.fill();

      animId.current = requestAnimationFrame(draw);
    };

    resize();
    initParticles();
    draw();

    parent.addEventListener('touchstart', handleTouch, { passive: true });
    parent.addEventListener('touchmove', handleTouch, { passive: true });
    parent.addEventListener('mousedown', handleTouch);

    // Card glow pulse listener
    const handleCardGlow = (e: Event) => {
      const { x, y } = (e as CustomEvent).detail;
      const rect = canvas.getBoundingClientRect();
      glowPulses.current.push({
        x: x - rect.left,
        y: y - rect.top,
        radius: 0,
        maxRadius: 350,
        alpha: 1,
      });
    };
    window.addEventListener('card-glow', handleCardGlow);

    const ro = new ResizeObserver(resize);
    ro.observe(parent);

    return () => {
      cancelAnimationFrame(animId.current);
      parent.removeEventListener('touchstart', handleTouch);
      parent.removeEventListener('touchmove', handleTouch);
      parent.removeEventListener('mousedown', handleTouch);
      window.removeEventListener('card-glow', handleCardGlow);
      ro.disconnect();
    };
  }, [handleTouch]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
