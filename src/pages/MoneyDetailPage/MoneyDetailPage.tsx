import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { Layout } from '../../components/Layout/Layout';
import { VersionCard } from '../../components/VersionCard/VersionCard';
import { getFamily, getVersions, getSiblings } from '../../lib/selectors';
import { localized, t } from '../../lib/i18n';
import { useLang } from '../../lib/LangContext';
// import { LanguageToggle } from '../../components/LanguageToggle/LanguageToggle';

export function MoneyDetailPage() {
  const { familyId } = useParams<{ familyId: string }>();
  const { lang } = useLang();
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const handleBack = () => {
    const el = containerRef.current;
    if (el) {
      el.classList.add('anim-page-exit');
      setTimeout(() => navigate(-1), 300);
    } else {
      navigate(-1);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => setShowScrollTop(el.scrollTop > 400);
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const family = familyId ? getFamily(familyId) : undefined;
  const versions = familyId ? getVersions(familyId) : [];
  const { prev, next } = familyId ? getSiblings(familyId) : { prev: null, next: null };

  if (!family) {
    return (
      <Layout>
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-border-light flex items-center justify-center">
              <span className="text-3xl">&#x2753;</span>
            </div>
            <p className="text-text-secondary text-base">{t('itemNotFound', lang)}</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex-1 overflow-y-auto relative" ref={(el) => { scrollRef.current = el; containerRef.current = el; }}>
        {/* Header bar */}
        <div
          className="px-4 sm:px-6 lg:px-10 py-4 lg:py-5 anim-header-enter"
          style={{ background: 'linear-gradient(180deg, #001F39 0%, #002A4A 100%)' }}
        >
          <div className="flex items-center relative">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium anim-btn-enter"
              style={{
                background: 'rgba(75,200,182,0.12)',
                border: '1px solid rgba(75,200,182,0.25)',
                color: '#4BC8B6',
                cursor: 'pointer',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {t('backToList', lang)}
            </button>

            {/* Versions badge & language toggle — hidden for now
            {versions.length > 1 && (
              <div className="hidden sm:block flex-shrink-0 px-3 py-1 rounded-full text-[13px] font-semibold" style={{
                background: 'rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.5)',
              }}>
                {versions.length} {t('versions', lang)}
              </div>
            )}
            <div className="flex-shrink-0">
              <LanguageToggle />
            </div>
            */}
          </div>
        </div>

        {/* Version cards */}
        <div className="px-4 sm:px-6 lg:px-10 py-5 sm:py-6 lg:py-8">
          <div className="flex flex-col gap-5 sm:gap-6 max-w-[1100px] mx-auto">
            {versions.map((version, i) => (
              <div
                key={version.versionId}
                className="anim-card-rise"
                style={{ animationDelay: `${0.15 + i * 0.1}s` }}
              >
                <VersionCard version={version} index={i} />
              </div>
            ))}
          </div>
        </div>

        {/* Footer navigation — prev / next */}
        {(prev || next) && (
          <div
            className="px-4 sm:px-6 lg:px-10 pb-6 sm:pb-8 anim-slide-up"
            style={{ animationDelay: `${0.15 + versions.length * 0.1 + 0.1}s` }}
          >
            <div className="flex items-stretch gap-4 max-w-[1100px] mx-auto">
              {prev && (
                <Link
                  to={`/money/${prev.familyId}`}
                  className="no-underline flex-1 flex items-center gap-3 px-4 sm:px-5 py-4 rounded-xl min-w-0"
                  style={{
                    background: 'var(--color-surface-default)',
                    border: '1px solid var(--color-border-default)',
                    color: 'var(--color-text-primary)',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="flex-shrink-0" style={{ color: 'var(--color-brand-primary)' }}>
                    <path d="M11 4L6 9L11 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <div className="min-w-0">
                    <div className="text-[11px] font-semibold uppercase" style={{ color: 'var(--color-text-tertiary)', letterSpacing: '0.04em' }}>{t('previous', lang)}</div>
                    <div className="text-sm font-semibold truncate mt-0.5">{localized(prev.title, lang)}</div>
                  </div>
                </Link>
              )}
              {next && (
                <Link
                  to={`/money/${next.familyId}`}
                  className="no-underline flex-1 flex items-center gap-3 px-4 sm:px-5 py-4 rounded-xl min-w-0 justify-end text-right"
                  style={{
                    background: 'var(--color-surface-default)',
                    border: '1px solid var(--color-border-default)',
                    color: 'var(--color-text-primary)',
                  }}
                >
                  <div className="min-w-0">
                    <div className="text-[11px] font-semibold uppercase" style={{ color: 'var(--color-text-tertiary)', letterSpacing: '0.04em' }}>{t('next', lang)}</div>
                    <div className="text-sm font-semibold truncate mt-0.5">{localized(next.title, lang)}</div>
                  </div>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="flex-shrink-0" style={{ color: 'var(--color-brand-primary)' }}>
                    <path d="M7 4L12 9L7 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Scroll to top — fixed circle on right */}
        <button
          onClick={() => scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
          className="cursor-pointer"
          style={{
            position: 'sticky',
            bottom: '28px',
            float: 'right',
            marginRight: '28px',
            marginTop: '-60px',
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            background: 'var(--color-brand-primary)',
            color: '#FFFFFF',
            border: 'none',
            boxShadow: '0 4px 20px rgba(0,73,118,0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'opacity 0.25s, transform 0.25s',
            opacity: showScrollTop ? 1 : 0,
            pointerEvents: showScrollTop ? 'auto' : 'none',
            transform: showScrollTop ? 'scale(1)' : 'scale(0.7)',
            zIndex: 30,
          }}
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M11 17V5M11 5L5 11M11 5L17 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </Layout>
  );
}
