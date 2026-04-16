// Current layout (as of commit "Detail page redesign: images stacked left, specs right, description below"):
//   ┌──────────────────────────────────────┐
//   │  Header (index badge + title)        │
//   ├─────────────────┬────────────────────┤
//   │  Front image    │                    │
//   ├─────────────────┤   Specifications   │
//   │  Rear image     │                    │
//   ├─────────────────┴────────────────────┤
//   │  Description / overview / brochure   │
//   └──────────────────────────────────────┘
//
// TO REVERT TO THE PREVIOUS DESIGN (front+rear images side-by-side on top,
// then two-column row with overview on the left and specs on the right):
//   1. Check out the commit before this redesign: `git log --oneline -- src/components/VersionCard/VersionCard.tsx`
//      and `git show <prev-hash>:src/components/VersionCard/VersionCard.tsx > VersionCard.tsx`.
//   2. The previous design is preserved in git history; no hidden flags or dead code kept here.
//   3. The previous image heights were `max-h-32 sm:max-h-40 lg:max-h-48` (vs. fixed `h-20/24/28` now).
//   4. The previous design had a CSS-injected `.ver-left-${index}` for the inner border; the new one
//      uses `.ver-specs-${index}`. If reverting, rename accordingly.

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
      </div>

      {/* Content: images float left, specs + description flow beside them.
           When text extends past the images it wraps to full width. */}
      {(hasImages || hasAttributes || hasOverview) && (
        <div className="p-4 sm:p-6" style={{ overflow: 'hidden' }}>
          {/* Images — floated left on lg, full-width on mobile. Natural height
              so they don't stretch when the right-side content is longer. */}
          {hasImages && (
            <>
              <style>{`@media(min-width:1024px){.ver-imgs-${index}{float:right;width:48%;margin-left:20px;margin-bottom:12px;}}`}</style>
              <div
                className={`ver-imgs-${index}`}
                style={{
                  background: 'linear-gradient(135deg, #F8FAFB 0%, #F0F4F6 100%)',
                  borderRadius: '8px',
                  border: '1px solid var(--color-border-default)',
                  overflow: 'hidden',
                }}
              >
                {version.frontImage && (
                  <div
                    className="p-3 sm:p-4 flex flex-col items-center justify-center"
                    style={{
                      borderBottom: version.rearImage ? '1px solid var(--color-border-default)' : undefined,
                      minHeight: '100px',
                    }}
                  >
                    <span className="text-[10px] uppercase tracking-[0.1em] font-semibold mb-2" style={{ color: 'var(--color-text-tertiary)' }}>
                      {t('front', lang)}
                    </span>
                    <img
                      src={version.frontImage}
                      alt={`${localized(version.title, lang)} - ${t('front', lang)}`}
                      className="h-20 sm:h-24 lg:h-28 w-auto object-contain"
                      style={{ maxWidth: '90%', filter: 'drop-shadow(0 3px 10px rgba(0,0,0,0.10))' }}
                    />
                  </div>
                )}
                {version.rearImage && (
                  <div
                    className="p-3 sm:p-4 flex flex-col items-center justify-center"
                    style={{ minHeight: '100px' }}
                  >
                    <span className="text-[10px] uppercase tracking-[0.1em] font-semibold mb-2" style={{ color: 'var(--color-text-tertiary)' }}>
                      {t('rear', lang)}
                    </span>
                    <img
                      src={version.rearImage}
                      alt={`${localized(version.title, lang)} - ${t('rear', lang)}`}
                      className="h-20 sm:h-24 lg:h-28 w-auto object-contain"
                      style={{ maxWidth: '90%', filter: 'drop-shadow(0 3px 10px rgba(0,0,0,0.10))' }}
                    />
                  </div>
                )}
              </div>
            </>
          )}

          {/* Specs table — flows beside the floated images on lg */}
          {hasAttributes && (
            <div className="mb-4">
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

          {/* Description — flows beside images while they last, then full width */}
          {hasOverview && (
            <div>
              {version.overview.length > 0 && (
                <div>
                  {version.overview.map((item, i) => {
                    const text = localized(item, lang);
                    return text ? (
                      <p key={i} className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)', margin: i > 0 ? '8px 0 0' : 0 }}>{text}</p>
                    ) : null;
                  })}
                </div>
              )}

              {version.description && localized(version.description, lang) && (
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)', margin: version.overview.length > 0 ? '8px 0 0' : 0 }}>
                  {localized(version.description, lang)}
                </p>
              )}

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
        </div>
      )}
    </div>
  );
}
