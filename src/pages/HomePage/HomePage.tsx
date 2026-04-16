import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Layout } from '../../components/Layout/Layout';
import { Sidebar } from '../../components/Sidebar/Sidebar';
import { MoneyList } from '../../components/MoneyList/MoneyList';
import { AnimatedBg } from '../../components/AnimatedBg/AnimatedBg';
import { getFamilies } from '../../lib/selectors';
import { categories } from '../../lib/categories';

// Banknotes is the left tab, coins is the right tab.
// When switching to coins, content slides in from the right.
// When switching to banknotes, content slides in from the left.
const TAB_ORDER: Array<'banknotes' | 'coins'> = ['banknotes', 'coins'];

export function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [subcategory, setSubcategory] = useState<'banknotes' | 'coins'>(() => {
    const s = searchParams.get('sub');
    if (s === 'coins' || s === 'banknotes') return s;
    const saved = sessionStorage.getItem('home-sub');
    if (saved === 'coins' || saved === 'banknotes') return saved;
    return 'banknotes';
  });

  const prevSub = useRef(subcategory);
  const prevIdx = TAB_ORDER.indexOf(prevSub.current);
  const curIdx = TAB_ORDER.indexOf(subcategory);
  const slideFrom = curIdx > prevIdx ? '80px' : curIdx < prevIdx ? '-80px' : '80px';
  prevSub.current = subcategory;

  useEffect(() => {
    setSearchParams({ sub: subcategory }, { replace: true });
  }, [subcategory, setSearchParams]);

  // Restore scroll position when returning from a detail page
  useEffect(() => {
    const saved = sessionStorage.getItem('home-scroll');
    if (!saved) return;
    sessionStorage.removeItem('home-scroll');
    requestAnimationFrame(() => {
      const el = document.querySelector('.anim-tab-switch');
      if (el) el.scrollTop = Number(saved);
    });
  }, []);

  // Get families grouped by category
  const grouped = categories.map((cat) => ({
    category: cat,
    families: getFamilies(cat.id, subcategory),
  }));

  return (
    <Layout
      backdrop={<AnimatedBg />}
      sidebar={
        <Sidebar
          selectedSubcategory={subcategory}
          onSelect={setSubcategory}
        />
      }
    >
      <div
        key={subcategory}
        className="flex-1 overflow-y-auto anim-tab-switch"
        style={{ ['--tab-slide-from' as string]: slideFrom }}
      >
        <MoneyList grouped={grouped} subcategory={subcategory} />
      </div>
    </Layout>
  );
}
