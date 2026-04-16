import { useEffect, useRef, useState, CSSProperties } from 'react';
import './BanknoteFlipViewer.css';

/* eslint-disable react-hooks/exhaustive-deps */

export interface BanknoteFlipViewerProps {
  frontImage: string;
  backImage: string;
  /** Controlled flip state. `false` = front visible, `true` = back visible. */
  isFlipped: boolean;
  /** Optional — called when the user taps the banknote itself. Parents that
   *  render their own Flip button can ignore this and drive isFlipped directly. */
  onFlip?: () => void;
  /** Animation duration in ms. Range 700–1200 recommended. Default 950. */
  animationDuration?: number;
  /** How aggressive the 3D perspective feels. 1 = calm, 2 = dramatic. Default 1. */
  perspectiveIntensity?: number;
  frontAlt?: string;
  backAlt?: string;
  className?: string;
  style?: CSSProperties;
}

/**
 * Museum-grade banknote flip.
 *
 * Implementation notes
 * --------------------
 * - The flip runs as two keyframe animations (front↔back) so we can sculpt the
 *   mid-flight tilt, lift, and scale curve individually — a single CSS
 *   transition on `transform` can't give the paper-turning "through the air"
 *   feel because the intermediate keyframes need to breathe outward, not
 *   linearly interpolate.
 * - Resting transforms match the final keyframe of their animation, so when
 *   the animation class is removed there's no visual jump.
 * - The shadow beneath the note has its own keyframe that softens and spreads
 *   at the peak of the lift, reinforcing depth without a heavy filter.
 * - `backface-visibility: hidden` on both faces prevents the reverse side
 *   from showing through, which is what breaks most naïve card-flip demos.
 * - The back face image is rendered with `transform: rotateY(180deg)` so that
 *   it reads left-to-right when revealed (no mirroring).
 */
export function BanknoteFlipViewer({
  frontImage,
  backImage,
  isFlipped,
  onFlip,
  animationDuration = 700,
  perspectiveIntensity = 1,
  frontAlt = 'Banknote front',
  backAlt = 'Banknote back',
  className = '',
  style,
}: BanknoteFlipViewerProps) {
  // Shadow softens at the mid-flip. We only want that keyframe to fire during
  // the actual transition window, so track "is animating" briefly after each
  // isFlipped change.
  const prevFlipped = useRef(isFlipped);
  const [animating, setAnimating] = useState(false);
  useEffect(() => {
    if (prevFlipped.current === isFlipped) return;
    prevFlipped.current = isFlipped;
    setAnimating(true);
    const t = window.setTimeout(() => setAnimating(false), animationDuration);
    return () => window.clearTimeout(t);
  }, [isFlipped, animationDuration]);

  const currentTransform = isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)';

  // Perspective = 1400 at intensity 1. At 2 we tighten it to ~900 so the
  // foreshortening becomes more dramatic.
  const perspective = Math.round(1400 / perspectiveIntensity);
  const liftPeakPx = Math.round(60 * perspectiveIntensity);

  return (
    <div
      className={`bv-root ${className}`}
      style={
        {
          ...style,
          perspective: `${perspective}px`,
          ['--flip-duration' as string]: `${animationDuration}ms`,
          ['--flip-lift' as string]: `${liftPeakPx}px`,
        } as CSSProperties
      }
    >
      <div className={`bv-shadow ${animating ? 'is-animating' : ''}`} aria-hidden="true" />

      <button
        type="button"
        onClick={onFlip}
        className="bv-flipper"
        style={{ transform: currentTransform }}
        aria-pressed={isFlipped}
        aria-label={isFlipped ? 'Show front of banknote' : 'Show back of banknote'}
      >
        <div className="bv-face bv-face-front">
          <img src={frontImage} alt={frontAlt} draggable={false} />
        </div>
        <div className="bv-face bv-face-back">
          <img src={backImage} alt={backAlt} draggable={false} />
        </div>
      </button>
    </div>
  );
}
