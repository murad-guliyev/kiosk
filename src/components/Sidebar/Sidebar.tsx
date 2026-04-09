import { categories } from '../../lib/categories';
import { localized } from '../../lib/i18n';
import { useLang } from '../../lib/LangContext';

interface SidebarProps {
  selectedCategory: number;
  selectedSubcategory: 'banknotes' | 'coins';
  onSelect: (categoryId: number, subcategory: 'banknotes' | 'coins') => void;
}

export function Sidebar({ selectedCategory, selectedSubcategory, onSelect }: SidebarProps) {
  const { lang } = useLang();

  return (
    <nav
      className="w-[280px] min-w-[280px] h-full overflow-y-auto flex flex-col border-r"
      style={{
        background: '#FFFFFF',
        borderColor: 'var(--color-border-default)',
      }}
    >
      <div className="flex-1 pt-4 pb-4">
        {categories.map((cat, catIndex) => (
          <div key={cat.id} className={catIndex > 0 ? 'mt-1' : ''}>
            {/* Category header */}
            <div className="px-5 pt-4 pb-2">
              <span
                className="text-[11px] uppercase font-bold leading-tight"
                style={{
                  letterSpacing: '0.06em',
                  color: 'var(--color-text-tertiary)',
                }}
              >
                {localized(cat.label, lang)}
              </span>
            </div>

            {/* Subcategory buttons */}
            {cat.subcategories.map((sub) => {
              const isActive = selectedCategory === cat.id && selectedSubcategory === sub.id;
              return (
                <button
                  key={`${cat.id}-${sub.id}`}
                  onClick={() => onSelect(cat.id, sub.id)}
                  className="w-full text-left cursor-pointer flex items-center gap-3 relative transition-all duration-150"
                  style={{
                    padding: '10px 20px 10px 24px',
                    fontSize: '14px',
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? 'var(--color-brand-primary)' : 'var(--color-text-secondary)',
                    background: isActive ? 'var(--color-surface-muted)' : 'transparent',
                    borderRadius: '0 8px 8px 0',
                    marginRight: '12px',
                  }}
                  onMouseEnter={e => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'var(--color-surface-muted)';
                      e.currentTarget.style.color = 'var(--color-text-primary)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'var(--color-text-secondary)';
                    }
                  }}
                >
                  {isActive && (
                    <div
                      className="absolute left-0 top-1/2 -translate-y-1/2"
                      style={{
                        width: '3px',
                        height: '20px',
                        background: 'var(--color-brand-primary)',
                        borderRadius: '0 3px 3px 0',
                      }}
                    />
                  )}
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
                    {sub.id === 'banknotes' ? (
                      /* Paper money icon — rectangle with lines */
                      <>
                        <rect x="1.5" y="4" width="15" height="10" rx="1.5" stroke={isActive ? 'var(--color-brand-primary)' : 'var(--color-text-tertiary)'} strokeWidth="1.4" fill="none" />
                        <circle cx="9" cy="9" r="2.2" stroke={isActive ? 'var(--color-brand-primary)' : 'var(--color-text-tertiary)'} strokeWidth="1.2" fill="none" />
                      </>
                    ) : (
                      /* Coin icon — circle with inner detail */
                      <>
                        <circle cx="9" cy="9" r="7" stroke={isActive ? 'var(--color-brand-primary)' : 'var(--color-text-tertiary)'} strokeWidth="1.4" fill="none" />
                        <circle cx="9" cy="9" r="3.5" stroke={isActive ? 'var(--color-brand-primary)' : 'var(--color-text-tertiary)'} strokeWidth="1" fill="none" />
                      </>
                    )}
                  </svg>
                  {localized(sub.label, lang)}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </nav>
  );
}
