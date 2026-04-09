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
      className="flex items-center gap-5 p-4 bg-surface-default rounded-[var(--radius-card)] shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-shadow no-underline"
    >
      <div className="w-28 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-surface-muted">
        {family.thumbnailImage ? (
          <img
            src={family.thumbnailImage}
            alt={localized(family.title, lang)}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-secondary text-xs">
            No image
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-semibold text-text-primary truncate">
          {localized(family.title, lang)}
        </h3>
        {family.versionCount > 1 && (
          <p className="text-sm text-text-secondary mt-1">
            {family.versionCount} {t('versions', lang)}
          </p>
        )}
      </div>
      <div className="text-text-secondary text-xl flex-shrink-0">&rsaquo;</div>
    </Link>
  );
}
