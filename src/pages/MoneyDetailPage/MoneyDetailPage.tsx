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
            <p className="text-text-secondary text-base">{t('itemNotFound', lang)}</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex-1 overflow-y-auto">
        {/* Header bar — full width, with back + title inline */}
        <div
          className="border-b"
          style={{
            padding: '20px 40px',
            borderColor: 'var(--color-border-default)',
            background: '#FFFFFF',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {/* Back button */}
            <button
              onClick={() => navigate(-1)}
              className="cursor-pointer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                border: '1px solid var(--color-border-default)',
                background: 'var(--color-surface-default)',
                color: 'var(--color-text-secondary)',
                fontSize: '16px',
                transition: 'all 0.15s',
                flexShrink: 0,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--color-brand-primary)';
                e.currentTarget.style.color = 'var(--color-brand-primary)';
                e.currentTarget.style.background = 'var(--color-surface-muted)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--color-border-default)';
                e.currentTarget.style.color = 'var(--color-text-secondary)';
                e.currentTarget.style.background = 'var(--color-surface-default)';
              }}
            >
              &larr;
            </button>

            {/* Title + version count */}
            <div style={{ flex: 1 }}>
              <h2
                style={{
                  fontSize: '22px',
                  fontWeight: 700,
                  color: 'var(--color-text-primary)',
                  margin: 0,
                  lineHeight: 1.3,
                }}
              >
                {localized(family.title, lang)}
              </h2>
            </div>

            {/* Version badge */}
            {versions.length > 1 && (
              <div
                style={{
                  padding: '4px 14px',
                  borderRadius: '20px',
                  background: 'var(--color-surface-muted)',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--color-text-tertiary)',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                {versions.length} {t('versions', lang)}
              </div>
            )}
          </div>
        </div>

        {/* Version cards — centered, full width usage */}
        <div style={{ padding: '32px 40px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1100px', margin: '0 auto' }}>
            {versions.map((version, i) => (
              <VersionCard key={version.versionId} version={version} index={i} />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
