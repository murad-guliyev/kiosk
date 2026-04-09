import { MoneyFamily } from '../../lib/types';
import { MoneyCard } from '../MoneyCard/MoneyCard';
import { t } from '../../lib/i18n';
import { useLang } from '../../lib/LangContext';

interface MoneyListProps {
  families: MoneyFamily[];
}

export function MoneyList({ families }: MoneyListProps) {
  const { lang } = useLang();

  if (families.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-text-secondary text-lg">
        {t('noItems', lang)}
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="grid gap-4 max-w-4xl">
        {families.map((family) => (
          <MoneyCard key={family.familyId} family={family} />
        ))}
      </div>
    </div>
  );
}
