import { ReactNode, useEffect, useRef } from 'react';
import { Header } from '../Header/Header';
import { setScrolling } from '../../lib/scrollState';

interface LayoutProps {
  children: ReactNode;
  sidebar?: ReactNode;
  /** Optional visual layer rendered behind content (e.g. AnimatedBg on HomePage). */
  backdrop?: ReactNode;
}

const SCROLL_SETTLE_MS = 150;

export function Layout({ children, sidebar, backdrop }: LayoutProps) {
  const mainRef = useRef<HTMLElement | null>(null);

  // Flip a shared flag while the user is actively scrolling so rAF-driven
  // animations (AnimatedBg canvas, etc.) can back off without querying the DOM.
  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    let timeout: number | null = null;
    const onScroll = () => {
      setScrolling(true);
      if (timeout) window.clearTimeout(timeout);
      timeout = window.setTimeout(() => {
        setScrolling(false);
        timeout = null;
      }, SCROLL_SETTLE_MS);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      el.removeEventListener('scroll', onScroll);
      if (timeout) window.clearTimeout(timeout);
      setScrolling(false);
    };
  }, []);

  return (
    <div className="h-full flex flex-col relative overflow-hidden animated-bg">
      {backdrop}
      <div className="relative z-[2] flex-shrink-0 flex justify-center">
        <div className="w-full" style={{ maxWidth: '1200px' }}>
          <Header />
        </div>
      </div>
      {sidebar && (
        <div className="relative z-[2] flex-shrink-0 flex justify-center">
          <div className="w-full" style={{ maxWidth: '1200px' }}>
            {sidebar}
          </div>
        </div>
      )}
      <main ref={mainRef} id="main-scroll" className="relative z-[2] flex-1 overflow-hidden flex flex-col">
        <div className="mx-auto flex flex-col flex-1 overflow-hidden w-full" style={{ maxWidth: '1200px' }}>
          {children}
        </div>
      </main>
    </div>
  );
}
