import { t } from '../../lib/i18n';
import { useLang } from '../../lib/LangContext';
// import { LanguageToggle } from '../LanguageToggle/LanguageToggle';

interface SidebarProps {
  selectedSubcategory: 'banknotes' | 'coins';
  onSelect: (subcategory: 'banknotes' | 'coins') => void;
}

export function Sidebar({ selectedSubcategory, onSelect }: SidebarProps) {
  const { lang } = useLang();

  return (
    <nav
      className="w-full flex-shrink-0"
      style={{ background: 'linear-gradient(180deg, #001F39 0%, #002A4A 100%)' }}
    >

      <div className="relative flex items-center gap-4 py-4 px-4">
        {(['banknotes', 'coins'] as const).map((sub) => {
          const isActive = selectedSubcategory === sub;
          return (
            <button
              key={sub}
              onClick={() => onSelect(sub)}
              className="flex-1 flex items-center justify-center gap-4 relative"
              style={{
                border: 'none',
                borderRadius: '16px',
                padding: '22px 32px',
                fontSize: '1.15rem',
                fontWeight: 600,
                letterSpacing: '0.02em',
                color: isActive ? '#fff' : 'rgba(255,255,255,0.4)',
                background: isActive
                  ? 'linear-gradient(135deg, rgba(75,200,182,0.2) 0%, rgba(0,73,118,0.4) 100%)'
                  : 'rgba(255,255,255,0.03)',
                backdropFilter: isActive ? 'blur(8px)' : undefined,
                transition: 'all 0.25s ease',
                overflow: 'hidden',
              }}
            >
              {/* Glow border for active */}
              {isActive && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '16px',
                    border: '1px solid rgba(75,200,182,0.4)',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 0 20px rgba(75,200,182,0.15)',
                    pointerEvents: 'none',
                  }}
                />
              )}

              {/* Accent line on left */}
              {isActive && (
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: '20%',
                    bottom: '20%',
                    width: '3px',
                    borderRadius: '0 3px 3px 0',
                    background: 'linear-gradient(180deg, #4BC8B6, #0B9ED0)',
                  }}
                />
              )}

              <svg width="28" height="28" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
                {sub === 'banknotes' ? (
                  <>
                    <rect x="1.5" y="4" width="15" height="10" rx="1.5"
                      stroke={isActive ? '#4BC8B6' : 'rgba(255,255,255,0.3)'}
                      strokeWidth="1.3" fill="none" />
                    <circle cx="9" cy="9" r="2.2"
                      stroke={isActive ? '#4BC8B6' : 'rgba(255,255,255,0.3)'}
                      strokeWidth="1.1" fill="none" />
                  </>
                ) : (
                  <>
                    <circle cx="9" cy="9" r="7"
                      stroke={isActive ? '#4BC8B6' : 'rgba(255,255,255,0.3)'}
                      strokeWidth="1.3" fill="none" />
                    <circle cx="9" cy="9" r="3.5"
                      stroke={isActive ? '#4BC8B6' : 'rgba(255,255,255,0.3)'}
                      strokeWidth="1" fill="none" />
                  </>
                )}
              </svg>

              {t(sub, lang)}

              {/* Subtle shine sweep on active */}
              {isActive && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: '-30%',
                    width: '50%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)',
                    transform: 'skewX(-15deg)',
                    pointerEvents: 'none',
                  }}
                />
              )}
            </button>
          );
        })}

        {/* Language toggle — hidden for now
        <div className="flex-shrink-0">
          <LanguageToggle />
        </div>
        */}
      </div>
    </nav>
  );
}
