import { useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoneyFamily } from '../../lib/types';
import { localized } from '../../lib/i18n';
import { useLang } from '../../lib/LangContext';

interface MoneyCardProps {
  family: MoneyFamily;
}

export function MoneyCard({ family }: MoneyCardProps) {
  const { lang } = useLang();
  const navigate = useNavigate();
  const tapped = useRef(false);

  const handleTap = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    // Prevent double-fire from touch + click
    if (tapped.current) return;
    tapped.current = true;

    e.preventDefault();

    const clientX = 'touches' in e ? e.touches[0]?.clientX ?? 0 : e.clientX;
    const clientY = 'touches' in e ? e.touches[0]?.clientY ?? 0 : e.clientY;
    window.dispatchEvent(new CustomEvent('card-glow', { detail: { x: clientX, y: clientY } }));

    // Short delay so the glow pulse is visible before navigating
    setTimeout(() => {
      navigate(`/money/${family.familyId}`);
      tapped.current = false;
    }, 250);
  }, [navigate, family.familyId]);

  return (
    <a
      className="block no-underline card-tap"
      style={{ textAlign: 'center', cursor: 'pointer' }}
      onClick={handleTap}
      onTouchStart={handleTap}
    >
      {/* Image — floating directly on the dark background */}
      <div
        style={{
          height: '140px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {family.thumbnailImage ? (
          <img
            src={family.thumbnailImage}
            alt={localized(family.title, lang)}
            style={{
              maxWidth: '90%',
              maxHeight: '90%',
              objectFit: 'contain',
              filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.4))',
            }}
          />
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

      {/* Title */}
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
