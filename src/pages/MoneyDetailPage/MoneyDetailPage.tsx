import { useParams, useNavigate, Link } from 'react-router-dom';
import { Layout } from '../../components/Layout/Layout';
import { VersionCard } from '../../components/VersionCard/VersionCard';
import { getFamily, getVersions, getSiblings } from '../../lib/selectors';
import { localized, t } from '../../lib/i18n';
import { useLang } from '../../lib/LangContext';

export function MoneyDetailPage() {
  const { familyId } = useParams<{ familyId: string }>();
  const navigate = useNavigate();
  const { lang } = useLang();

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
      <div className="flex-1 overflow-y-auto">
        {/* Header bar */}
        <div className="border-b px-4 sm:px-6 lg:px-10 py-4 lg:py-5 bg-white" style={{ borderColor: 'var(--color-border-default)' }}>
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              to="/"
              className="flex items-center gap-2 no-underline px-3 py-2 rounded-lg flex-shrink-0 text-[13px] font-medium"
              style={{
                background: 'var(--color-brand-primary)',
                color: '#FFFFFF',
                transition: 'opacity 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {t('backToList', lang)}
            </Link>

            <div className="flex-1 min-w-0">
              <h2 className="text-lg sm:text-xl lg:text-[22px] font-bold text-text-primary truncate" style={{ lineHeight: 1.3 }}>
                {localized(family.title, lang)}
              </h2>
            </div>

            {versions.length > 1 && (
              <div className="hidden sm:block flex-shrink-0 px-3 py-1 rounded-full text-[13px] font-semibold" style={{
                background: 'var(--color-surface-muted)',
                color: 'var(--color-text-tertiary)',
              }}>
                {versions.length} {t('versions', lang)}
              </div>
            )}
          </div>
        </div>

        {/* Version cards */}
        <div className="px-4 sm:px-6 lg:px-10 py-5 sm:py-6 lg:py-8">
          <div className="flex flex-col gap-5 sm:gap-6 max-w-[1100px] mx-auto">
            {versions.map((version, i) => (
              <VersionCard key={version.versionId} version={version} index={i} />
            ))}
          </div>
        </div>

        {/* Footer navigation — prev / next */}
        {(prev || next) && (
          <div className="px-4 sm:px-6 lg:px-10 pb-6 sm:pb-8">
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
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'var(--color-border-primary)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'var(--color-border-default)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="flex-shrink-0" style={{ color: 'var(--color-brand-primary)' }}>
                    <path d="M11 4L6 9L11 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <div className="min-w-0">
                    <div className="text-[11px] font-semibold uppercase" style={{ color: 'var(--color-text-tertiary)', letterSpacing: '0.04em' }}>{t('previous', lang)}</div>
                    <div className="text-[14px] font-semibold truncate mt-0.5">{localized(prev.title, lang)}</div>
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
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'var(--color-border-primary)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'var(--color-border-default)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div className="min-w-0">
                    <div className="text-[11px] font-semibold uppercase" style={{ color: 'var(--color-text-tertiary)', letterSpacing: '0.04em' }}>{t('next', lang)}</div>
                    <div className="text-[14px] font-semibold truncate mt-0.5">{localized(next.title, lang)}</div>
                  </div>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="flex-shrink-0" style={{ color: 'var(--color-brand-primary)' }}>
                    <path d="M7 4L12 9L7 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
