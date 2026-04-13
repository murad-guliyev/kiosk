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
      style={{ background: 'linear-gradient(180deg, #000D1A 0%, #001529 100%)' }}
    >
      <div className="relative flex items-stretch gap-3 py-3 px-4">
        {(['banknotes', 'coins'] as const).map((sub) => {
          const isActive = selectedSubcategory === sub;
          return (
            <button
              key={sub}
              onClick={() => onSelect(sub)}
              className="flex-1 relative"
              style={{
                border: 'none',
                borderRadius: '14px',
                padding: '0',
                overflow: 'hidden',
                background: isActive
                  ? 'linear-gradient(135deg, rgba(75,200,182,0.1) 0%, rgba(75,200,182,0.15) 50%, rgba(11,158,208,0.1) 100%)'
                  : 'rgba(255,255,255,0.02)',
                transition: 'all 0.3s ease',
              }}
            >
              {/* Glow border — pulses when active */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '14px',
                  border: isActive
                    ? '1px solid rgba(75,200,182,0.3)'
                    : '1px solid rgba(255,255,255,0.06)',
                  animation: isActive ? 'tab-glow-pulse 4s ease-in-out infinite' : 'none',
                  pointerEvents: 'none',
                  transition: 'border 0.3s ease',
                }}
              />

              {/* Top accent line — shifts colors when active */}
              <div
                style={{
                  height: '2px',
                  background: isActive
                    ? 'linear-gradient(90deg, transparent, #4BC8B6, #4BC8B6, #0B9ED0, #4BC8B6, transparent)'
                    : 'transparent',
                  backgroundSize: isActive ? '200% 100%' : '100% 100%',
                  animation: isActive ? 'tab-accent-shift 6s ease-in-out infinite' : 'none',
                  transition: 'background 0.3s ease',
                }}
              />

              {/* Content */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '14px',
                  padding: '18px 24px',
                }}
              >
                {/* Icon with glow circle behind it */}
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    background: isActive
                      ? 'linear-gradient(135deg, rgba(75,200,182,0.15), rgba(75,200,182,0.12))'
                      : 'rgba(255,255,255,0.04)',
                    border: isActive
                      ? '1px solid rgba(75,200,182,0.25)'
                      : '1px solid rgba(255,255,255,0.06)',
                    animation: isActive ? 'tab-icon-glow 3s ease-in-out infinite' : 'none',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 18 18" fill="none">
                    {sub === 'banknotes' ? (
                      <>
                        <rect x="1.5" y="4" width="15" height="10" rx="1.5"
                          stroke={isActive ? '#4BC8B6' : 'rgba(255,255,255,0.25)'}
                          strokeWidth="1.3" fill="none" />
                        <circle cx="9" cy="9" r="2.2"
                          stroke={isActive ? '#4BC8B6' : 'rgba(255,255,255,0.25)'}
                          strokeWidth="1.1" fill="none" />
                      </>
                    ) : (
                      <>
                        <circle cx="9" cy="9" r="7"
                          stroke={isActive ? '#4BC8B6' : 'rgba(255,255,255,0.25)'}
                          strokeWidth="1.3" fill="none" />
                        <circle cx="9" cy="9" r="3.5"
                          stroke={isActive ? '#4BC8B6' : 'rgba(255,255,255,0.25)'}
                          strokeWidth="1" fill="none" />
                      </>
                    )}
                  </svg>
                </div>

                {/* Label + subtitle */}
                <div style={{ textAlign: 'left' }}>
                  <div
                    style={{
                      fontSize: '1.05rem',
                      fontWeight: 600,
                      color: isActive ? '#fff' : 'rgba(255,255,255,0.4)',
                      letterSpacing: '0.01em',
                      lineHeight: 1.2,
                      transition: 'color 0.3s ease',
                    }}
                  >
                    {t(sub, lang)}
                  </div>
                  <div
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 400,
                      color: isActive ? 'rgba(75, 200, 182, 0.65)' : 'rgba(255,255,255,0.2)',
                      marginTop: '2px',
                      transition: 'color 0.3s ease',
                    }}
                  >
                    {sub === 'banknotes'
                      ? (lang === 'az' ? 'Kağız pul nişanları' : 'Paper currency')
                      : (lang === 'az' ? 'Metal pul nişanları' : 'Metal currency')
                    }
                  </div>
                </div>
              </div>

              {/* Animated shimmer sweep on active */}
              {isActive && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '40%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), rgba(75,200,182,0.04), transparent)',
                    animation: 'tab-shimmer 5s ease-in-out infinite',
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
