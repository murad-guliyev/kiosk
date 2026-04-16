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
      style={{
        background: 'rgba(0, 20, 40, 0.68)',
      }}
    >
      <div className="relative flex items-stretch gap-3 py-3 px-4">
        {(['banknotes', 'coins'] as const).map((sub) => {
          const isActive = selectedSubcategory === sub;
          return (
            <button
              key={sub}
              onClick={(e) => {
                const el = e.currentTarget;
                el.classList.remove('tab-press');
                // Force reflow so the animation re-runs on repeat taps
                void el.offsetWidth;
                el.classList.add('tab-press');
                onSelect(sub);
              }}
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
              {/* Static glow border when active — no infinite animation */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '14px',
                  border: isActive
                    ? '1px solid rgba(75,200,182,0.3)'
                    : '1px solid rgba(255,255,255,0.06)',
                  pointerEvents: 'none',
                  transition: 'border 0.3s ease',
                }}
              />

              {/* Static top accent line when active */}
              <div
                style={{
                  height: '2px',
                  background: isActive
                    ? 'linear-gradient(90deg, transparent, #4BC8B6, #0B9ED0, transparent)'
                    : 'transparent',
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
                    transition: 'all 0.3s ease',
                  }}
                >
                  {sub === 'banknotes' ? (
                    <svg width="30" height="30" viewBox="0 0 32 32" fill="none">
                      {/* Clean, clearly-a-banknote icon: wide rounded rectangle with ₼ in the center */}
                      <rect
                        x="3" y="9" width="26" height="14" rx="2"
                        fill={isActive ? '#4BC8B6' : 'rgba(255,255,255,0.22)'}
                      />
                      <rect
                        x="5" y="11" width="22" height="10" rx="1"
                        fill="none"
                        stroke={isActive ? 'rgba(0,30,50,0.6)' : 'rgba(0,0,0,0.25)'}
                        strokeWidth="0.8"
                      />
                      <text
                        x="16" y="20"
                        textAnchor="middle"
                        fontSize="9"
                        fontWeight="700"
                        fontFamily="system-ui, sans-serif"
                        fill={isActive ? '#00334A' : 'rgba(0,0,0,0.55)'}
                      >₼</text>
                    </svg>
                  ) : (
                    <svg width="30" height="30" viewBox="0 0 32 32" fill="none">
                      {/* Clean, clearly-a-coin icon: solid circle with ₼ in the center */}
                      <circle
                        cx="16" cy="16" r="12"
                        fill={isActive ? '#4BC8B6' : 'rgba(255,255,255,0.22)'}
                      />
                      <circle
                        cx="16" cy="16" r="9.5"
                        fill="none"
                        stroke={isActive ? 'rgba(0,30,50,0.6)' : 'rgba(0,0,0,0.25)'}
                        strokeWidth="0.8"
                      />
                      <text
                        x="16" y="20"
                        textAnchor="middle"
                        fontSize="12"
                        fontWeight="700"
                        fontFamily="system-ui, sans-serif"
                        fill={isActive ? '#00334A' : 'rgba(0,0,0,0.55)'}
                      >₼</text>
                    </svg>
                  )}
                </div>

                {/* Label */}
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
                </div>
              </div>

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
