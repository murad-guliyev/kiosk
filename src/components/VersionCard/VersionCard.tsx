import { useState } from 'react';
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
  const [rearIsPortrait, setRearIsPortrait] = useState(false);
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
      <div className="px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-3" style={{ borderBottom: '1px solid var(--color-border-default)' }}>
        <div
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: 'var(--color-surface-muted)', fontSize: '12px', fontWeight: 700, color: 'var(--color-brand-primary)' }}
        >
          {index + 1}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-text-primary truncate" style={{ margin: 0, fontSize: '1rem' }}>
            {localized(version.title, lang)}
          </h3>
        </div>
        {version.year && (
          <span
            className="text-[11px] sm:text-xs font-semibold flex-shrink-0 px-2 sm:px-3 py-0.5 rounded-full"
            style={{ background: 'var(--color-surface-muted)', color: 'var(--color-text-tertiary)' }}
          >
            {version.year}
          </span>
        )}
      </div>

      {/* Images — side by side */}
      {hasImages && (
        <div
          className="grid grid-cols-1 sm:grid-cols-2"
          style={{ borderBottom: '1px solid var(--color-border-default)' }}
        >
          {version.frontImage && (
            <div
              className="p-3 sm:p-4 flex flex-col items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #F8FAFB 0%, #F0F4F6 100%)',
                borderRight: version.rearImage ? '1px solid var(--color-border-default)' : undefined,
                minHeight: rearIsPortrait ? '150px' : '180px',
              }}
            >
              <span className="text-[10px] uppercase tracking-[0.1em] font-semibold mb-2" style={{ color: 'var(--color-text-tertiary)' }}>
                {t('front', lang)}
              </span>
              <img
                src={version.frontImage}
                alt={`${localized(version.title, lang)} - ${t('front', lang)}`}
                className={rearIsPortrait ? 'max-h-24 sm:max-h-32 lg:max-h-36 w-auto object-contain' : 'max-h-32 sm:max-h-40 lg:max-h-48 w-auto object-contain'}
                style={{ maxWidth: '90%', filter: 'drop-shadow(0 3px 10px rgba(0,0,0,0.10))' }}
              />
            </div>
          )}
          {version.rearImage && (
            <div
              className="p-3 sm:p-4 flex flex-col items-center justify-center overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #F8FAFB 0%, #F0F4F6 100%)',
                minHeight: '150px',
              }}
            >
              <span className="text-[10px] uppercase tracking-[0.1em] font-semibold mb-2" style={{ color: 'var(--color-text-tertiary)' }}>
                {t('rear', lang)}
              </span>
              {rearIsPortrait ? (
                /* Portrait image rotated to landscape — use a square wrapper so the rotated image fits */
                <div style={{ width: '90%', maxWidth: '400px', aspectRatio: '1.7 / 1', position: 'relative' }}>
                  <img
                    src={version.rearImage}
                    alt={`${localized(version.title, lang)} - ${t('rear', lang)}`}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%) rotate(90deg)',
                      maxWidth: '170%',
                      maxHeight: '100%',
                      objectFit: 'contain',
                      filter: 'drop-shadow(0 3px 10px rgba(0,0,0,0.10))',
                    }}
                  />
                </div>
              ) : (
                <img
                  src={version.rearImage}
                  alt={`${localized(version.title, lang)} - ${t('rear', lang)}`}
                  className="max-h-32 sm:max-h-40 lg:max-h-48 w-auto object-contain"
                  onLoad={(e) => {
                    const img = e.currentTarget;
                    if (img.naturalHeight > img.naturalWidth * 1.2) {
                      setRearIsPortrait(true);
                    }
                  }}
                  style={{ maxWidth: '90%', filter: 'drop-shadow(0 3px 10px rgba(0,0,0,0.10))' }}
                />
              )}
            </div>
          )}
        </div>
      )}

      {/* Content — two columns on desktop, stacked on mobile */}
      {(hasOverview || hasAttributes) && (
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left: overview */}
          {hasOverview && (
            <div
              className="p-4 sm:p-6"
              style={{ borderRight: hasAttributes ? undefined : 'none' }}
            >
              {/* Add border-right only on large screens when attributes exist */}
              {hasAttributes && (
                <style>{`@media(min-width:1024px){.ver-left-${index}{border-right:1px solid var(--color-border-default)}}`}</style>
              )}

              {version.overview.length > 0 && (
                <div className={hasSecurity ? 'mb-5' : ''}>
                  {version.overview.map((item, i) => {
                    const text = localized(item, lang);
                    return text ? (
                      <p key={i} className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)', margin: i > 0 ? '8px 0 0' : 0 }}>{text}</p>
                    ) : null;
                  })}
                </div>
              )}

              {version.description && localized(version.description, lang) && (
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)', margin: 0 }}>
                  {localized(version.description, lang)}
                </p>
              )}

              {/* Security elements — hidden for now, kept for future restoration
              {hasSecurity && (
                <div className={hasOverview ? 'mt-5' : ''}>
                  <h4 className="text-xs font-bold uppercase mb-3" style={{ letterSpacing: '0.06em', color: 'var(--color-text-tertiary)' }}>
                    {t('securityElements', lang)}
                  </h4>
                  <div className="flex flex-col gap-2">
                    {version.securityElements.map((el, i) => {
                      const text = localized(el, lang);
                      return text ? (
                        <div key={i} className="flex items-baseline gap-2.5">
                          <span className="text-[6px] flex-shrink-0 mt-1.5" style={{ color: 'var(--color-brand-secondary)' }}>{'\u25CF'}</span>
                          <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)', margin: 0 }}>{text}</p>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
              */}

              {version.brochureUrl && (
                <a
                  href={version.brochureUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-4 text-[13px] font-semibold"
                  style={{ color: 'var(--color-brand-primary)', textDecoration: 'none' }}
                >
                  {t('brochure', lang)} &rarr;
                </a>
              )}
            </div>
          )}

          {/* Right: specs */}
          {hasAttributes && (
            <div className="p-4 sm:p-6 border-t lg:border-t-0 lg:border-l" style={{ borderColor: 'var(--color-border-default)' }}>
              <h4 className="text-xs font-bold uppercase mb-3" style={{ letterSpacing: '0.06em', color: 'var(--color-text-tertiary)' }}>
                {t('specifications', lang)}
              </h4>
              <div className="rounded-lg overflow-hidden" style={{ border: '1px solid var(--color-border-default)' }}>
                {version.attributes.map((attr, i) => {
                  const label = localized(attr.label, lang);
                  const value = localized(attr.value, lang);
                  if (!label || !value) return null;
                  return (
                    <div
                      key={i}
                      className="flex px-3 sm:px-4 py-2.5"
                      style={{
                        borderTop: i > 0 ? '1px solid var(--color-border-default)' : 'none',
                        background: i % 2 === 0 ? 'var(--color-surface-muted)' : '#FFFFFF',
                      }}
                    >
                      <span className="text-sm font-medium w-[120px] sm:w-[150px] flex-shrink-0" style={{ color: 'var(--color-text-tertiary)' }}>
                        {label}
                      </span>
                      <span className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                        {value}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
