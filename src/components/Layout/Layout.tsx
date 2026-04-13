import { ReactNode } from 'react';
import { AnimatedBg } from '../AnimatedBg/AnimatedBg';

interface LayoutProps {
  children: ReactNode;
  sidebar?: ReactNode;
}

const DEAD_ZONE = '80px';

export function Layout({ children, sidebar }: LayoutProps) {
  return (
    <div className="h-full flex justify-center" style={{ background: '#000' }}>
      {/* Left dead zone — full height, blocks all touch on the left edge */}
      <div
        className="flex-shrink-0 h-full"
        style={{
          width: DEAD_ZONE,
          touchAction: 'none',
          pointerEvents: 'none',
        }}
      />

      {/* Center content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden" style={{ maxWidth: '1200px' }}>
        {/* Top navigation */}
        {sidebar && (
          <div className="flex-shrink-0">
            {sidebar}
          </div>
        )}

        {/* Body — animated background */}
        <main className="flex-1 relative overflow-hidden animated-bg">
          <AnimatedBg />
          {/* Content layer — above the animation */}
          <div className="relative z-[2] flex h-full overflow-hidden">
            {children}
          </div>
        </main>
      </div>

      {/* Right dead zone — full height, blocks all touch on the right edge */}
      <div
        className="flex-shrink-0 h-full"
        style={{
          width: DEAD_ZONE,
          touchAction: 'none',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
