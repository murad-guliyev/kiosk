import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Layout } from '../../components/Layout/Layout';
import { Sidebar } from '../../components/Sidebar/Sidebar';
import { MoneyList } from '../../components/MoneyList/MoneyList';
import { getFamilies } from '../../lib/selectors';
import { categories } from '../../lib/categories';

export function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [subcategory, setSubcategory] = useState<'banknotes' | 'coins'>(() => {
    const s = searchParams.get('sub');
    return s === 'coins' ? 'coins' : 'banknotes';
  });

  useEffect(() => {
    setSearchParams({ sub: subcategory }, { replace: true });
  }, [subcategory, setSearchParams]);

  // Get families grouped by category
  const grouped = categories.map((cat) => ({
    category: cat,
    families: getFamilies(cat.id, subcategory),
  }));

  return (
    <Layout
      sidebar={
        <Sidebar
          selectedSubcategory={subcategory}
          onSelect={setSubcategory}
        />
      }
    >
      <MoneyList grouped={grouped} subcategory={subcategory} />
    </Layout>
  );
}
