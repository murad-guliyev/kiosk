import { ReactNode } from 'react';
import { LanguageToggle } from '../LanguageToggle/LanguageToggle';
import { t } from '../../lib/i18n';
import { useLang } from '../../lib/LangContext';

interface LayoutProps {
  children: ReactNode;
  sidebar?: ReactNode;
}

export function Layout({ children, sidebar }: LayoutProps) {
  const { lang } = useLang();

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <header className="h-[72px] flex-shrink-0 bg-brand-primary flex items-center justify-between px-8 relative overflow-hidden">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
        <div className="relative flex items-center gap-4">
          {/* Logo placeholder */}
          <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
            <span className="text-brand-secondary font-bold text-sm">CB</span>
          </div>
          <div>
            <h1 className="text-[17px] font-semibold text-white tracking-tight">
              {t('appTitle', lang)}
            </h1>
            <p className="text-[11px] text-white/40 font-medium tracking-wide uppercase">
              {lang === 'az' ? 'Azərbaycan Respublikasının Mərkəzi Bankı' : 'Central Bank of Azerbaijan'}
            </p>
          </div>
        </div>
        <div className="relative">
          <LanguageToggle />
        </div>
      </header>

      {/* Body */}
      <div className="flex-1 flex overflow-hidden">
        {sidebar}
        <main className="flex-1 flex overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
