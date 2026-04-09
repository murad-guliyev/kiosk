import { MoneyFamily } from '../../lib/types';
import { MoneyCard } from '../MoneyCard/MoneyCard';
import { t } from '../../lib/i18n';
import { useLang } from '../../lib/LangContext';
import { categories } from '../../lib/categories';
import { localized } from '../../lib/i18n';

interface MoneyListProps {
  families: MoneyFamily[];
  categoryId?: number;
  subcategory?: 'banknotes' | 'coins';
}

export function MoneyList({ families, categoryId, subcategory }: MoneyListProps) {
  const { lang } = useLang();

  const cat = categories.find(c => c.id === categoryId);
  const sub = cat?.subcategories.find(s => s.id === subcategory);

  if (families.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-border-light flex items-center justify-center">
            <span className="text-3xl text-text-tertiary">&#x1F50D;</span>
          </div>
          <p className="text-text-secondary text-base">{t('noItems', lang)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Section header */}
      <div className="px-8 pt-7 pb-2">
        {cat && (
          <p className="text-[11px] uppercase tracking-[0.1em] text-text-tertiary font-semibold mb-1">
            {localized(cat.label, lang)}
          </p>
        )}
        <div className="flex items-baseline justify-between">
          <h2 className="text-2xl font-bold text-text-primary tracking-tight">
            {sub ? localized(sub.label, lang) : ''}
          </h2>
          <span className="text-sm text-text-tertiary font-medium">
            {families.length} {t('itemCount', lang)}
          </span>
        </div>
      </div>

      {/* Grid of cards — image-dominant, multi-column */}
      <div className="px-8 pb-8 pt-4">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '24px',
        }}>
          {families.map((family) => (
            <MoneyCard key={family.familyId} family={family} />
          ))}
        </div>
      </div>
    </div>
  );
}
