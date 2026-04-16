import { MoneyFamily } from '../../lib/types';
import { MoneyCard } from '../MoneyCard/MoneyCard';
import { t, localized } from '../../lib/i18n';
import { useLang } from '../../lib/LangContext';
import { CategoryNode } from '../../lib/types';

interface MoneyListProps {
  grouped: { category: CategoryNode; families: MoneyFamily[] }[];
  subcategory: 'banknotes' | 'coins';
}

export function MoneyList({ grouped }: MoneyListProps) {
  const { lang } = useLang();

  const totalCount = grouped.reduce((sum, g) => sum + g.families.length, 0);

  if (totalCount === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
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
    <div className="flex-1">
      {grouped.map((group) => {
        if (group.families.length === 0) return null;
        return (
          <div key={group.category.id}>
            {/* Category section header */}
            <div className="px-4 lg:px-8 pt-7 pb-3">
              <div
                className="flex items-center gap-4"
                style={{ position: 'relative' }}
              >
                {/* Label */}
                <div className="flex-1 flex items-center justify-between">
                  <h2
                    style={{
                      margin: 0,
                      fontSize: '1.3rem',
                      fontWeight: 700,
                      color: '#fff',
                      letterSpacing: '0.02em',
                    }}
                  >
                    {localized(group.category.label, lang)}
                  </h2>
                </div>
              </div>

            </div>

            {/* Grid of cards */}
            <div className="px-4 lg:px-8 pb-4 pt-1">
              <div data-category-grid={group.category.id} style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 220px), 1fr))',
                gap: '16px',
              }}>
                {group.families.map((family, i) => (
                  <MoneyCard key={family.familyId} family={family} index={i} />
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
