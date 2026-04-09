import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Layout } from '../../components/Layout/Layout';
import { Sidebar } from '../../components/Sidebar/Sidebar';
import { MoneyList } from '../../components/MoneyList/MoneyList';
import { getFamilies } from '../../lib/selectors';

export function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [categoryId, setCategoryId] = useState<number>(() => {
    const c = searchParams.get('cat');
    return c ? parseInt(c, 10) : 1;
  });

  const [subcategory, setSubcategory] = useState<'banknotes' | 'coins'>(() => {
    const s = searchParams.get('sub');
    return s === 'coins' ? 'coins' : 'banknotes';
  });

  useEffect(() => {
    setSearchParams({ cat: String(categoryId), sub: subcategory }, { replace: true });
  }, [categoryId, subcategory, setSearchParams]);

  const families = getFamilies(categoryId, subcategory);

  const handleSelect = (catId: number, sub: 'banknotes' | 'coins') => {
    setCategoryId(catId);
    setSubcategory(sub);
  };

  return (
    <Layout
      sidebar={
        <Sidebar
          selectedCategory={categoryId}
          selectedSubcategory={subcategory}
          onSelect={handleSelect}
        />
      }
    >
      <MoneyList families={families} />
    </Layout>
  );
}
