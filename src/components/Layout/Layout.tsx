import { ReactNode, useState } from 'react';
import { LanguageToggle } from '../LanguageToggle/LanguageToggle';
import { t } from '../../lib/i18n';
import { useLang } from '../../lib/LangContext';

interface LayoutProps {
  children: ReactNode;
  sidebar?: ReactNode;
}

export function Layout({ children, sidebar }: LayoutProps) {
  const { lang } = useLang();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <header className="h-[56px] sm:h-[64px] lg:h-[72px] flex-shrink-0 bg-brand-primary flex items-center justify-between px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
        <div className="relative flex items-center gap-3">
          {/* Mobile menu button */}
          {sidebar && (
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden cursor-pointer flex items-center justify-center w-9 h-9 rounded-lg bg-white/10 text-white"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                {menuOpen ? (
                  <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                ) : (
                  <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                )}
              </svg>
            </button>
          )}
          {/* Logo */}
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
            <span className="text-brand-secondary font-bold text-xs sm:text-sm">CB</span>
          </div>
          <div>
            <h1 className="text-[15px] sm:text-[17px] font-semibold text-white tracking-tight">
              {t('appTitle', lang)}
            </h1>
            <p className="hidden sm:block text-[11px] text-white/40 font-medium tracking-wide uppercase">
              {t('bankSubtitle', lang)}
            </p>
          </div>
        </div>
        <div className="relative">
          <LanguageToggle />
        </div>
      </header>

      {/* Body */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar — desktop: always visible, mobile: overlay */}
        {sidebar && (
          <>
            {/* Mobile overlay */}
            {menuOpen && (
              <div
                className="lg:hidden fixed inset-0 bg-black/30 z-40"
                style={{ top: '56px' }}
                onClick={() => setMenuOpen(false)}
              />
            )}
            <div
              className={`
                lg:relative lg:translate-x-0 lg:z-auto
                fixed top-[56px] sm:top-[64px] lg:top-0 left-0 bottom-0 z-50
                transition-transform duration-200 ease-out
                ${menuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
              `}
            >
              <div onClick={() => setMenuOpen(false)}>
                {sidebar}
              </div>
            </div>
          </>
        )}
        <main className="flex-1 flex overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
