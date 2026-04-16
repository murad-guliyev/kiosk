import { memo, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoneyFamily } from '../../lib/types';
import { localized } from '../../lib/i18n';
import { useLang } from '../../lib/LangContext';
import { getFrontImage } from '../../lib/selectors';

interface MoneyCardProps {
  family: MoneyFamily;
  index?: number;
}

const TAP_MOVE_THRESHOLD = 18; // px — bigger fingers on a 75" kiosk need slack
const TAP_TIME_THRESHOLD = 500; // ms
const SYNTHETIC_CLICK_WINDOW = 700; // ms after touch in which we ignore synthetic mouse clicks

function MoneyCardInner({ family }: MoneyCardProps) {
  const { lang } = useLang();
  const navigate = useNavigate();
  const navigating = useRef(false);
  const touchStart = useRef<{ x: number; y: number; t: number } | null>(null);
  const wasScroll = useRef(false);
  const lastTouchEnd = useRef(0);
  const isCoin = family.subcategory === 'coins';
  const frontImage = getFrontImage(family.familyId) ?? family.thumbnailImage;

  const goToDetail = useCallback((x: number, y: number) => {
    if (navigating.current) return;
    navigating.current = true;
    window.dispatchEvent(new CustomEvent('card-glow', { detail: { x, y } }));
    const scrollEl = document.querySelector('.anim-tab-switch');
    if (scrollEl) sessionStorage.setItem('home-scroll', String(scrollEl.scrollTop));
    sessionStorage.setItem('home-sub', family.subcategory);
    setTimeout(() => {
      navigate(`/money/${family.familyId}`);
      navigating.current = false;
    }, 250);
  }, [navigate, family.familyId]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const t = e.touches[0];
    if (!t) return;
    touchStart.current = { x: t.clientX, y: t.clientY, t: Date.now() };
    wasScroll.current = false;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const start = touchStart.current;
    if (!start) return;
    const t = e.touches[0];
    if (!t) return;
    const dx = Math.abs(t.clientX - start.x);
    const dy = Math.abs(t.clientY - start.y);
    if (dx > TAP_MOVE_THRESHOLD || dy > TAP_MOVE_THRESHOLD) {
      wasScroll.current = true;
    }
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const start = touchStart.current;
    touchStart.current = null;
    lastTouchEnd.current = Date.now();
    if (!start) return;
    if (wasScroll.current) return;
    const t = e.changedTouches[0];
    if (!t) return;
    const dt = Date.now() - start.t;
    if (dt > TAP_TIME_THRESHOLD) return;
    goToDetail(t.clientX, t.clientY);
  }, [goToDetail]);

  const handleTouchCancel = useCallback(() => {
    touchStart.current = null;
    wasScroll.current = true;
    lastTouchEnd.current = Date.now();
  }, []);

  const handleClick = useCallback((e: React.MouseEvent) => {
    // If a touch just happened, this click is synthetic — ignore it (touchend already handled it).
    if (Date.now() - lastTouchEnd.current < SYNTHETIC_CLICK_WINDOW) {
      e.preventDefault();
      return;
    }
    goToDetail(e.clientX, e.clientY);
  }, [goToDetail]);

  const banknoteImgStyle = {
    width: '100%',
    aspectRatio: '2 / 1',
    objectFit: 'contain' as const,
  };

  const coinImgStyle = {
    maxWidth: '90%',
    maxHeight: '90%',
    objectFit: 'contain' as const,
  };

  return (
    <a
      className="block no-underline card-tap"
      style={{ textAlign: 'center', cursor: 'pointer' }}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
    >
      <div
        style={{
          height: '140px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {frontImage ? (
          isCoin ? (
            /* Static coin thumbnail */
            <img
              src={frontImage}
              alt={localized(family.title, lang)}
              style={coinImgStyle}
              loading="lazy"
              decoding="async"
            />
          ) : (
            /* Static banknote thumbnail */
            <img
              src={frontImage}
              alt={localized(family.title, lang)}
              style={banknoteImgStyle}
              loading="lazy"
              decoding="async"
            />
          )
        ) : (
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <span style={{ fontSize: '24px', color: 'rgba(255,255,255,0.3)' }}>
              {family.subcategory === 'coins' ? '\u25CB' : '\u25AD'}
            </span>
          </div>
        )}
      </div>

      <h3
        style={{
          fontSize: '0.78rem',
          fontWeight: 500,
          color: 'rgba(255,255,255,0.7)',
          lineHeight: 1.3,
          margin: '6px 0 0',
          padding: '0 4px',
        }}
      >
        {localized(family.title, lang)}
      </h3>
    </a>
  );
}

// The card props are stable per family — re-render only when the family object changes.
export const MoneyCard = memo(MoneyCardInner, (prev, next) => prev.family === next.family);
