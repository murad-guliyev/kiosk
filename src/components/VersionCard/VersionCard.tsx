import { MoneyVersion } from '../../lib/types';
import { localized, t } from '../../lib/i18n';
import { useLang } from '../../lib/LangContext';

interface VersionCardProps {
  version: MoneyVersion;
  index: number;
}

export function VersionCard({ version, index }: VersionCardProps) {
  const { lang } = useLang();

  return (
    <div className="bg-surface-default rounded-card shadow-card overflow-hidden">
      {/* Version header */}
      <div className="px-6 py-4 flex items-center gap-3 border-b border-border-light">
        <div className="w-8 h-8 rounded-full bg-brand-primary/5 flex items-center justify-center flex-shrink-0">
          <span className="text-xs font-bold text-brand-primary">{index + 1}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-text-primary truncate">
            {localized(version.title, lang)}
          </h3>
          {version.year && (
            <p className="text-xs text-text-tertiary mt-0.5">{version.year}</p>
          )}
        </div>
      </div>

      {/* Images — side by side, large */}
      {(version.frontImage || version.rearImage) && (
        <div className="grid grid-cols-2 gap-px bg-border-light">
          {version.frontImage && (
            <div className="bg-gradient-to-br from-surface-muted to-white p-5 flex flex-col items-center">
              <span className="text-[10px] uppercase tracking-[0.12em] text-text-tertiary font-semibold mb-3">
                {t('front', lang)}
              </span>
              <img
                src={version.frontImage}
                alt={`${localized(version.title, lang)} - ${t('front', lang)}`}
                className="max-h-56 w-auto object-contain drop-shadow-md"
              />
            </div>
          )}
          {version.rearImage && (
            <div className="bg-gradient-to-br from-surface-muted to-white p-5 flex flex-col items-center">
              <span className="text-[10px] uppercase tracking-[0.12em] text-text-tertiary font-semibold mb-3">
                {t('rear', lang)}
              </span>
              <img
                src={version.rearImage}
                alt={`${localized(version.title, lang)} - ${t('rear', lang)}`}
                className="max-h-56 w-auto object-contain drop-shadow-md"
              />
            </div>
          )}
        </div>
      )}

      <div className="p-6 space-y-5">
        {/* Description / Overview */}
        {version.overview.length > 0 && (
          <div className="space-y-2">
            {version.overview.map((item, i) => {
              const text = localized(item, lang);
              return text ? (
                <p key={i} className="text-[13px] text-text-secondary leading-relaxed">{text}</p>
              ) : null;
            })}
          </div>
        )}

        {version.description && localized(version.description, lang) && (
          <p className="text-[13px] text-text-secondary leading-relaxed">
            {localized(version.description, lang)}
          </p>
        )}

        {/* Technical attributes — styled grid */}
        {version.attributes.length > 0 && (
          <div className="rounded-sm bg-surface-muted/60 border border-border-light overflow-hidden">
            {version.attributes.map((attr, i) => {
              const label = localized(attr.label, lang);
              const value = localized(attr.value, lang);
              if (!label || !value) return null;
              return (
                <div
                  key={i}
                  className={`flex items-baseline px-4 py-2.5 ${
                    i > 0 ? 'border-t border-border-light' : ''
                  }`}
                >
                  <span className="text-[12px] font-medium text-text-tertiary uppercase tracking-wide w-[160px] flex-shrink-0">
                    {label}
                  </span>
                  <span className="text-[13px] text-text-primary font-medium">{value}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Security elements — collapsible-style */}
        {version.securityElements.length > 0 && (
          <div>
            <h4 className="text-[12px] font-semibold text-text-primary uppercase tracking-wide mb-3 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-brand-accent/10 flex items-center justify-center">
                <span className="text-brand-accent text-[10px]">&#x1F6E1;</span>
              </span>
              {t('securityElements', lang)}
            </h4>
            <div className="space-y-2 pl-7">
              {version.securityElements.map((el, i) => {
                const text = localized(el, lang);
                return text ? (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-brand-accent/40 text-[8px] mt-1.5 flex-shrink-0">{'\u25C6'}</span>
                    <p className="text-[12px] text-text-secondary leading-relaxed">{text}</p>
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
            className="inline-flex items-center gap-2 text-[13px] text-brand-primary font-semibold hover:text-brand-accent transition-colors"
          >
            <span className="w-6 h-6 rounded-full bg-brand-primary/5 flex items-center justify-center text-xs">&#x1F4C4;</span>
            {t('brochure', lang)}
          </a>
        )}
      </div>
    </div>
  );
}
