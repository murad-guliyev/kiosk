import { MoneyVersion } from '../../lib/types';
import { localized, t } from '../../lib/i18n';
import { useLang } from '../../lib/LangContext';

interface VersionCardProps {
  version: MoneyVersion;
  index: number;
}

export function VersionCard({ version, index }: VersionCardProps) {
  const { lang } = useLang();
  const hasImages = version.frontImage || version.rearImage;
  const hasAttributes = version.attributes.length > 0;
  const hasOverview = version.overview.length > 0 || (version.description && localized(version.description, lang));
  const hasSecurity = version.securityElements.length > 0;

  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: 'var(--radius-card)',
        boxShadow: 'var(--shadow-card)',
        overflow: 'hidden',
        border: '1px solid var(--color-border-default)',
      }}
    >
      {/* Version header */}
      <div
        style={{
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          borderBottom: '1px solid var(--color-border-default)',
        }}
      >
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'var(--color-surface-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '13px',
            fontWeight: 700,
            color: 'var(--color-brand-primary)',
            flexShrink: 0,
          }}
        >
          {index + 1}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-text-primary)', margin: 0 }}>
            {localized(version.title, lang)}
          </h3>
        </div>
        {version.year && (
          <span
            style={{
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--color-text-tertiary)',
              background: 'var(--color-surface-muted)',
              padding: '3px 10px',
              borderRadius: '12px',
              flexShrink: 0,
            }}
          >
            {version.year}
          </span>
        )}
      </div>

      {/* Images — large, side by side, taking full width */}
      {hasImages && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: version.frontImage && version.rearImage ? '1fr 1fr' : '1fr',
            gap: '1px',
            background: 'var(--color-border-default)',
          }}
        >
          {version.frontImage && (
            <div
              style={{
                background: 'linear-gradient(135deg, #F8FAFB 0%, #F0F4F6 100%)',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <span
                style={{
                  fontSize: '10px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: 'var(--color-text-tertiary)',
                  fontWeight: 600,
                  marginBottom: '12px',
                }}
              >
                {t('front', lang)}
              </span>
              <img
                src={version.frontImage}
                alt={`${localized(version.title, lang)} - ${t('front', lang)}`}
                style={{
                  maxHeight: '280px',
                  width: 'auto',
                  maxWidth: '100%',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.12))',
                }}
              />
            </div>
          )}
          {version.rearImage && (
            <div
              style={{
                background: 'linear-gradient(135deg, #F8FAFB 0%, #F0F4F6 100%)',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <span
                style={{
                  fontSize: '10px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: 'var(--color-text-tertiary)',
                  fontWeight: 600,
                  marginBottom: '12px',
                }}
              >
                {t('rear', lang)}
              </span>
              <img
                src={version.rearImage}
                alt={`${localized(version.title, lang)} - ${t('rear', lang)}`}
                style={{
                  maxHeight: '280px',
                  width: 'auto',
                  maxWidth: '100%',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.12))',
                }}
              />
            </div>
          )}
        </div>
      )}

      {/* Content area — two columns: overview left, attributes right */}
      {(hasOverview || hasAttributes || hasSecurity) && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: hasAttributes && hasOverview ? '1fr 1fr' : '1fr',
            gap: '0',
          }}
        >
          {/* Left column: overview + security */}
          {(hasOverview || hasSecurity) && (
            <div
              style={{
                padding: '24px',
                borderRight: hasAttributes ? '1px solid var(--color-border-default)' : 'none',
              }}
            >
              {/* Overview */}
              {version.overview.length > 0 && (
                <div style={{ marginBottom: hasSecurity ? '20px' : 0 }}>
                  {version.overview.map((item, i) => {
                    const text = localized(item, lang);
                    return text ? (
                      <p key={i} style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.7, margin: i > 0 ? '8px 0 0' : 0 }}>
                        {text}
                      </p>
                    ) : null;
                  })}
                </div>
              )}

              {version.description && localized(version.description, lang) && (
                <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.7, margin: 0 }}>
                  {localized(version.description, lang)}
                </p>
              )}

              {/* Security elements */}
              {hasSecurity && (
                <div style={{ marginTop: hasOverview ? '20px' : 0 }}>
                  <h4
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      color: 'var(--color-text-tertiary)',
                      margin: '0 0 10px',
                    }}
                  >
                    {t('securityElements', lang)}
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {version.securityElements.map((el, i) => {
                      const text = localized(el, lang);
                      return text ? (
                        <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                          <span style={{ color: 'var(--color-brand-secondary)', fontSize: '6px', flexShrink: 0, marginTop: '4px' }}>{'\u25CF'}</span>
                          <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>{text}</p>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              )}

              {/* Brochure */}
              {version.brochureUrl && (
                <a
                  href={version.brochureUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginTop: '16px',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: 'var(--color-brand-primary)',
                    textDecoration: 'none',
                  }}
                >
                  {t('brochure', lang)} &rarr;
                </a>
              )}
            </div>
          )}

          {/* Right column: technical attributes */}
          {hasAttributes && (
            <div style={{ padding: '24px' }}>
              <h4
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: 'var(--color-text-tertiary)',
                  margin: '0 0 12px',
                }}
              >
                {t('specifications', lang)}
              </h4>
              <div
                style={{
                  borderRadius: '8px',
                  overflow: 'hidden',
                  border: '1px solid var(--color-border-default)',
                }}
              >
                {version.attributes.map((attr, i) => {
                  const label = localized(attr.label, lang);
                  const value = localized(attr.value, lang);
                  if (!label || !value) return null;
                  return (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        padding: '10px 14px',
                        borderTop: i > 0 ? '1px solid var(--color-border-default)' : 'none',
                        background: i % 2 === 0 ? 'var(--color-surface-muted)' : '#FFFFFF',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '12px',
                          fontWeight: 500,
                          color: 'var(--color-text-tertiary)',
                          width: '140px',
                          flexShrink: 0,
                        }}
                      >
                        {label}
                      </span>
                      <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-primary)' }}>
                        {value}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* If no overview but has attributes, show security below attributes full width */}
          {!hasOverview && hasSecurity && hasAttributes && (
            <div style={{ padding: '0 24px 24px', gridColumn: '1 / -1' }}>
              <h4
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: 'var(--color-text-tertiary)',
                  margin: '0 0 10px',
                }}
              >
                {t('securityElements', lang)}
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {version.securityElements.map((el, i) => {
                  const text = localized(el, lang);
                  return text ? (
                    <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                      <span style={{ color: 'var(--color-brand-secondary)', fontSize: '6px', flexShrink: 0, marginTop: '4px' }}>{'\u25CF'}</span>
                      <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>{text}</p>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
