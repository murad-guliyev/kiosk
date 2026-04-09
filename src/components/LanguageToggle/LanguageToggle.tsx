import { useLang } from '../../lib/LangContext';

export function LanguageToggle() {
  const { lang, setLang } = useLang();

  return (
    <div className="flex rounded-lg overflow-hidden border border-border-default">
      <button
        onClick={() => setLang('az')}
        className={`px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
          lang === 'az'
            ? 'bg-brand-primary text-white'
            : 'bg-surface-default text-text-secondary hover:bg-surface-muted'
        }`}
      >
        AZ
      </button>
      <button
        onClick={() => setLang('en')}
        className={`px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
          lang === 'en'
            ? 'bg-brand-primary text-white'
            : 'bg-surface-default text-text-secondary hover:bg-surface-muted'
        }`}
      >
        EN
      </button>
    </div>
  );
}
