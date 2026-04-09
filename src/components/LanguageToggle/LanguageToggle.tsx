import { useLang } from '../../lib/LangContext';

export function LanguageToggle() {
  const { lang, setLang } = useLang();

  return (
    <div className="flex rounded-full bg-white/10 p-0.5 backdrop-blur-sm">
      <button
        onClick={() => setLang('az')}
        className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 cursor-pointer tracking-wide ${
          lang === 'az'
            ? 'bg-white text-brand-primary shadow-sm'
            : 'text-white/60 hover:text-white'
        }`}
      >
        AZ
      </button>
      <button
        onClick={() => setLang('en')}
        className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 cursor-pointer tracking-wide ${
          lang === 'en'
            ? 'bg-white text-brand-primary shadow-sm'
            : 'text-white/60 hover:text-white'
        }`}
      >
        EN
      </button>
    </div>
  );
}
