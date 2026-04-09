import { categories } from '../../lib/categories';
import { localized } from '../../lib/i18n';
import { useLang } from '../../lib/LangContext';

interface SidebarProps {
  selectedCategory: number;
  selectedSubcategory: 'banknotes' | 'coins';
  onSelect: (categoryId: number, subcategory: 'banknotes' | 'coins') => void;
}

const categoryIcons: Record<number, string> = {
  1: '\u25CE',  // circled bullet
  2: '\u2726',  // star
  3: '\u25C7',  // diamond
};

const subcategoryIcons: Record<string, string> = {
  banknotes: '\u25AD', // rectangle
  coins: '\u25CB',     // circle
};

export function Sidebar({ selectedCategory, selectedSubcategory, onSelect }: SidebarProps) {
  const { lang } = useLang();

  return (
    <nav className="w-[280px] min-w-[280px] bg-surface-sidebar h-full overflow-y-auto flex flex-col">
      <div className="flex-1 pt-6 pb-4">
        {categories.map((cat, catIndex) => (
          <div key={cat.id} className={catIndex > 0 ? 'mt-2' : ''}>
            {/* Category header */}
            <div className="px-5 py-2.5 flex items-start gap-2.5">
              <span className="text-brand-accent/60 text-xs mt-0.5">{categoryIcons[cat.id]}</span>
              <span className="text-[11px] uppercase tracking-[0.08em] text-text-sidebar-muted font-semibold leading-tight">
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
                  className={`w-full text-left pl-10 pr-5 py-3 text-[13px] transition-all duration-150 cursor-pointer flex items-center gap-2.5 relative ${
                    isActive
                      ? 'bg-surface-sidebar-active text-white font-medium'
                      : 'text-text-sidebar hover:bg-surface-sidebar-hover hover:text-white'
                  }`}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-brand-accent rounded-r-full" />
                  )}
                  <span className={`text-xs ${isActive ? 'text-brand-accent' : 'text-text-sidebar-muted'}`}>
                    {subcategoryIcons[sub.id]}
                  </span>
                  {localized(sub.label, lang)}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Bottom accent line */}
      <div className="h-px mx-5 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="px-5 py-4">
        <p className="text-[10px] text-text-sidebar-muted/50 tracking-wide">
          {lang === 'az' ? 'CBAR.AZ' : 'CBAR.AZ'} &middot; 2024
        </p>
      </div>
    </nav>
  );
}
