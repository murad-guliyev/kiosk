import { MoneyVersion } from '../../lib/types';
import { localized, t } from '../../lib/i18n';
import { useLang } from '../../lib/LangContext';

interface VersionCardProps {
  version: MoneyVersion;
}

export function VersionCard({ version }: VersionCardProps) {
  const { lang } = useLang();

  return (
    <div className="bg-surface-default rounded-[var(--radius-card)] shadow-[var(--shadow-card)] p-6 mb-6">
      <h3 className="text-xl font-semibold mb-4">
        {localized(version.title, lang)}
      </h3>

      {/* Images */}
      {(version.frontImage || version.rearImage) && (
        <div className="flex gap-6 mb-6 flex-wrap">
          {version.frontImage && (
            <div className="flex-1 min-w-[200px]">
              <p className="text-xs text-text-secondary mb-2 uppercase tracking-wide">
                {t('front', lang)}
              </p>
              <img
                src={version.frontImage}
                alt={`${localized(version.title, lang)} - ${t('front', lang)}`}
                className="w-full max-h-64 object-contain rounded-lg bg-surface-muted"
              />
            </div>
          )}
          {version.rearImage && (
            <div className="flex-1 min-w-[200px]">
              <p className="text-xs text-text-secondary mb-2 uppercase tracking-wide">
                {t('rear', lang)}
              </p>
              <img
                src={version.rearImage}
                alt={`${localized(version.title, lang)} - ${t('rear', lang)}`}
                className="w-full max-h-64 object-contain rounded-lg bg-surface-muted"
              />
            </div>
          )}
        </div>
      )}

      {/* Description */}
      {version.description && localized(version.description, lang) && (
        <p className="text-text-secondary mb-4 leading-relaxed">
          {localized(version.description, lang)}
        </p>
      )}

      {/* Overview paragraphs */}
      {version.overview.length > 0 && (
        <div className="mb-4 space-y-2">
          {version.overview.map((item, i) => {
            const text = localized(item, lang);
            return text ? (
              <p key={i} className="text-text-secondary leading-relaxed">{text}</p>
            ) : null;
          })}
        </div>
      )}

      {/* Technical attributes */}
      {version.attributes.length > 0 && (
        <div className="border-t border-border-default pt-4 mb-4">
          <div className="grid grid-cols-2 gap-x-8 gap-y-2">
            {version.attributes.map((attr, i) => (
              <div key={i} className="flex gap-2">
                <span className="text-text-secondary text-sm font-medium min-w-[120px]">
                  {localized(attr.label, lang)}:
                </span>
                <span className="text-sm">{localized(attr.value, lang)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Security elements */}
      {version.securityElements.length > 0 && (
        <div className="border-t border-border-default pt-4 mb-4">
          <h4 className="text-sm font-semibold mb-2">{t('securityElements', lang)}</h4>
          <ul className="list-disc list-inside space-y-1">
            {version.securityElements.map((el, i) => {
              const text = localized(el, lang);
              return text ? (
                <li key={i} className="text-sm text-text-secondary">{text}</li>
              ) : null;
            })}
          </ul>
        </div>
      )}

      {/* Brochure link */}
      {version.brochureUrl && (
        <div className="border-t border-border-default pt-4">
          <a
            href={version.brochureUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-brand-primary font-medium hover:underline"
          >
            {t('brochure', lang)} &rarr;
          </a>
        </div>
      )}
    </div>
  );
}
