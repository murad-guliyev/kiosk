import { useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoneyFamily } from '../../lib/types';
import { localized } from '../../lib/i18n';
import { useLang } from '../../lib/LangContext';
import { getRearImage } from '../../lib/selectors';

interface MoneyCardProps {
  family: MoneyFamily;
  index?: number;
}

export function MoneyCard({ family }: MoneyCardProps) {
  const { lang } = useLang();
  const navigate = useNavigate();
  const tapped = useRef(false);
  const isCoin = family.subcategory === 'coins';
  const rearImage = isCoin ? getRearImage(family.familyId) : null;

  const handleTap = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (tapped.current) return;
    tapped.current = true;
    e.preventDefault();

    const clientX = 'touches' in e ? e.touches[0]?.clientX ?? 0 : e.clientX;
    const clientY = 'touches' in e ? e.touches[0]?.clientY ?? 0 : e.clientY;
    window.dispatchEvent(new CustomEvent('card-glow', { detail: { x: clientX, y: clientY } }));

    setTimeout(() => {
      navigate(`/money/${family.familyId}`);
      tapped.current = false;
    }, 250);
  }, [navigate, family.familyId]);

  const imgStyle = {
    maxWidth: '90%',
    maxHeight: '90%',
    objectFit: 'contain' as const,
    filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.4))',
  };

  return (
    <a
      className="block no-underline card-tap"
      style={{ textAlign: 'center', cursor: 'pointer' }}
      onClick={handleTap}
      onTouchStart={handleTap}
    >
      <div
        className={isCoin && rearImage ? 'coin-scene' : ''}
        style={{
          height: '140px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {family.thumbnailImage ? (
          isCoin && rearImage ? (
            /* Two-sided rotating coin */
            <div className="coin-flipper" style={{ width: '120px', height: '120px' }}>
              {/* Front face */}
              <div className="coin-face">
                <img
                  src={family.thumbnailImage}
                  alt={localized(family.title, lang)}
                  style={imgStyle}
                />
              </div>
              {/* Back face */}
              <div className="coin-face coin-face-back">
                <img
                  src={rearImage}
                  alt={localized(family.title, lang) + ' rear'}
                  style={imgStyle}
                />
              </div>
            </div>
          ) : (
            /* Static image (banknotes or coins without rear) */
            <img
              src={family.thumbnailImage}
              alt={localized(family.title, lang)}
              style={imgStyle}
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
