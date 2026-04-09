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
    <nav className="w-72 min-w-72 bg-surface-sidebar text-text-sidebar h-full overflow-y-auto flex flex-col">
      {/* Logo placeholder */}
      <div className="p-6 border-b border-white/10">
        <div className="h-12 rounded-lg bg-white/10 flex items-center justify-center text-text-sidebar-muted text-sm">
          LOGO
        </div>
      </div>

      <div className="flex-1 py-4">
        {categories.map((cat) => (
          <div key={cat.id} className="mb-2">
            <div className="px-5 py-3 text-xs uppercase tracking-wider text-text-sidebar-muted font-semibold">
              {localized(cat.label, lang)}
            </div>
            {cat.subcategories.map((sub) => {
              const isActive = selectedCategory === cat.id && selectedSubcategory === sub.id;
              return (
                <button
                  key={`${cat.id}-${sub.id}`}
                  onClick={() => onSelect(cat.id, sub.id)}
                  className={`w-full text-left px-8 py-3 text-sm transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-surface-sidebar-active text-white font-medium'
                      : 'text-text-sidebar hover:bg-surface-sidebar-hover'
                  }`}
                >
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
