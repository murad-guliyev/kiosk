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
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-border-light flex items-center justify-center">
              <span className="text-3xl">&#x2753;</span>
            </div>
            <p className="text-text-secondary text-base">Item not found</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex-1 overflow-y-auto">
        {/* Top bar with back button and title */}
        <div className="px-8 pt-7 pb-5">
          <button
            onClick={() => navigate(-1)}
            className="group inline-flex items-center gap-2 text-[13px] font-medium text-text-secondary hover:text-brand-primary transition-colors cursor-pointer mb-4"
          >
            <span className="w-7 h-7 rounded-full bg-surface-default shadow-card flex items-center justify-center group-hover:bg-brand-primary/5 transition-colors">
              <span className="text-sm">&larr;</span>
            </span>
            {t('backToList', lang)}
          </button>

          <h2 className="text-[28px] font-bold text-text-primary tracking-tight">
            {localized(family.title, lang)}
          </h2>
          {versions.length > 1 && (
            <p className="text-sm text-text-tertiary mt-1">
              {versions.length} {t('versions', lang)}
            </p>
          )}
        </div>

        {/* Version cards */}
        <div className="px-8 pb-8">
          <div className="max-w-4xl space-y-6">
            {versions.map((version, i) => (
              <VersionCard key={version.versionId} version={version} index={i} />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
