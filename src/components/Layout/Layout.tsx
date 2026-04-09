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
      <header className="h-16 flex-shrink-0 bg-surface-default border-b border-border-default flex items-center justify-between px-6">
        <h1 className="text-lg font-bold text-brand-primary">
          {t('appTitle', lang)}
        </h1>
        <LanguageToggle />
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
