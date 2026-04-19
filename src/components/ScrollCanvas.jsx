import { useRef } from 'react';
import { useFramePreloader } from '../hooks/useFramePreloader';
import { useScrollCanvas } from '../hooks/useScrollCanvas';

// ── ScrollCanvas ───────────────────────────────────────────────────────────
// A scroll-pinned section that drives a WebP/ImageBitmap frame sequence.
//
// Props:
//   sequence     — 'hero' | 'signals' | 'hormuz' | 'roi'
//   frameCount   — total frames in the sequence
//   scrollHeight — total px scrolled while pinned
//   children     — overlay content rendered above the canvas
//   className    — additional classes for the outer section element
export default function ScrollCanvas({
  sequence,
  frameCount,
  scrollHeight,
  children,
  className = '',
  scrimLeft = false,
}) {
  const sectionRef = useRef(null);
  const canvasRef  = useRef(null);

  const { frames, isReady, loadProgress } = useFramePreloader(sequence, frameCount);
  useScrollCanvas(sectionRef, canvasRef, frames, isReady, scrollHeight);

  return (
    <section
      ref={sectionRef}
      className={`relative w-full h-screen overflow-hidden ${className}`}
      style={{ willChange: 'transform' }}
    >
      {/* Canvas — fills entire viewport */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ display: 'block' }}
      />

      {/* Loading overlay — shown until frames are ready */}
      {!isReady && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#070d0a]">
          <span
            className="font-label text-xs tracking-[0.2em] text-[rgba(255,215,0,0.5)] mb-4"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            LOADING SEQUENCE
          </span>
          <div className="w-40 h-px bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#ffd700] transition-all duration-150"
              style={{ width: `${Math.round(loadProgress * 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Gradient scrim — improves text legibility over frames */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background: `
            linear-gradient(to bottom,
              rgba(7,13,10,0.55) 0%,
              rgba(7,13,10,0.1)  30%,
              rgba(7,13,10,0.1)  70%,
              rgba(7,13,10,0.7)  100%
            )
          `,
        }}
      />

      {/* Optional left scrim — darkens left panel for text legibility */}
      {scrimLeft && (
        <div
          className="absolute inset-0 z-[2] pointer-events-none"
          style={{
            background: 'linear-gradient(to right, rgba(7,13,10,0.72) 0%, rgba(7,13,10,0.35) 45%, transparent 75%)',
          }}
        />
      )}

      {/* Overlay — text / UI above the canvas */}
      <div className="relative z-10 h-full w-full pointer-events-none">
        <div className="pointer-events-auto h-full w-full">
          {children}
        </div>
      </div>
    </section>
  );
}
