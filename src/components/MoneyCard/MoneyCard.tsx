import { Link } from 'react-router-dom';
import { MoneyFamily } from '../../lib/types';
import { localized, t } from '../../lib/i18n';
import { useLang } from '../../lib/LangContext';

interface MoneyCardProps {
  family: MoneyFamily;
}

export function MoneyCard({ family }: MoneyCardProps) {
  const { lang } = useLang();

  return (
    <Link
      to={`/money/${family.familyId}`}
      className="group block rounded-card overflow-hidden no-underline bg-surface-default"
      style={{
        boxShadow: 'var(--shadow-card)',
        transition: 'box-shadow 0.3s, transform 0.3s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = 'var(--shadow-card)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Image — the hero of the card */}
      <div
        style={{
          height: '220px',
          background: 'linear-gradient(135deg, #f8f9fb 0%, #eef0f4 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {family.thumbnailImage ? (
          <img
            src={family.thumbnailImage}
            alt={localized(family.title, lang)}
            style={{
              maxWidth: '85%',
              maxHeight: '85%',
              objectFit: 'contain',
              filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))',
              transition: 'transform 0.5s ease',
            }}
            className="group-hover:scale-110"
          />
        ) : (
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <span style={{ fontSize: '32px', color: 'var(--color-text-tertiary)' }}>
              {family.subcategory === 'coins' ? '\u25CB' : '\u25AD'}
            </span>
          </div>
        )}

        {/* Version count badge */}
        {family.versionCount > 1 && (
          <div style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'rgba(15, 39, 68, 0.85)',
            backdropFilter: 'blur(4px)',
            color: 'white',
            fontSize: '10px',
            fontWeight: 700,
            padding: '3px 8px',
            borderRadius: '20px',
            letterSpacing: '0.03em',
          }}>
            {family.versionCount} {t('versions', lang)}
          </div>
        )}
      </div>

      {/* Title strip */}
      <div style={{
        padding: '12px 16px',
        borderTop: '1px solid var(--color-border-light)',
        textAlign: 'center',
      }}>
        <h3
          className="group-hover:text-brand-primary"
          style={{
            fontSize: '14px',
            fontWeight: 600,
            color: 'var(--color-text-primary)',
            lineHeight: 1.3,
            transition: 'color 0.2s',
            margin: 0,
          }}
        >
          {localized(family.title, lang)}
        </h3>
      </div>
    </Link>
  );
}
