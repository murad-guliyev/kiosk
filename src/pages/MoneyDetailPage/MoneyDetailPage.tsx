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
        <div className="flex-1 flex items-center justify-center text-text-secondary text-lg">
          Item not found
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 px-4 py-2 text-sm font-medium text-brand-primary bg-surface-default rounded-lg border border-border-default hover:bg-surface-muted transition-colors cursor-pointer"
          >
            &larr; {t('backToList', lang)}
          </button>

          <h2 className="text-2xl font-bold mb-6">
            {localized(family.title, lang)}
          </h2>

          {versions.map((version) => (
            <VersionCard key={version.versionId} version={version} />
          ))}
        </div>
      </div>
    </Layout>
  );
}
