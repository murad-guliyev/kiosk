import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '../../components/Layout/Layout';
import { VersionCard } from '../../components/VersionCard/VersionCard';
import { getFamily, getVersions } from '../../lib/selectors';
import { localized, t } from '../../lib/i18n';
import { useLang } from '../../lib/LangContext';

export function MoneyDetailPage() {
  const { familyId } = useParams<{ familyId: string }>();
  const navigate = useNavigate();
  const { lang } = useLang();

  const family = familyId ? getFamily(familyId) : undefined;
  const versions = familyId ? getVersions(familyId) : [];

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
            <button
              onClick={() => navigate(-1)}
              className="cursor-pointer flex items-center gap-2 px-3 py-2 rounded-lg flex-shrink-0 text-[13px] font-medium"
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
            </button>

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
      </div>
    </Layout>
  );
}
