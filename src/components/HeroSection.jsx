import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrollCanvas from './ScrollCanvas';
import { SEQUENCES, CALENDLY_URL } from '../constants';

const { frameCount: HERO_FRAMES, scrollHeight: HERO_SCROLL } = SEQUENCES.hero;

export default function HeroSection() {
  const sectionRef   = useRef(null);
  const eyebrowRef   = useRef(null);
  const titleRef     = useRef(null);
  const subRef       = useRef(null);
  const ctasRef      = useRef(null);
  const signalRef    = useRef(null);
  const overlayRef   = useRef(null);

  useEffect(() => {
    // Load Calendly lazily
    const timer = setTimeout(() => {
      if (!document.querySelector('script[src*="calendly"]')) {
        const s = document.createElement('script');
        s.src = 'https://assets.calendly.com/assets/external/widget.js';
        document.head.appendChild(s);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const sh = HERO_SCROLL;

      // ── Reveal text as user scrolls into the hero sequence ──────────────
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger:    sectionRef.current,
          start:      'top top',
          end:        `+=${sh}`,
          scrub:      0.4,
        },
      });

      // Initial state — everything below and invisible
      gsap.set([eyebrowRef.current, titleRef.current, subRef.current, ctasRef.current, signalRef.current], {
        opacity: 0,
        y: 24,
      });

      tl
        .to(eyebrowRef.current, { opacity: 1, y: 0, duration: 0.12 }, 0.02)
        .to(titleRef.current,   { opacity: 1, y: 0, duration: 0.15 }, 0.22)
        .to(subRef.current,     { opacity: 1, y: 0, duration: 0.12 }, 0.45)
        .to(ctasRef.current,    { opacity: 1, y: 0, duration: 0.12 }, 0.60)
        .to(signalRef.current,  { opacity: 1, y: 0, duration: 0.10 }, 0.72)
        // Fade everything out at end of hero sequence
        .to(overlayRef.current, { opacity: 0, duration: 0.15 }, 0.87);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  function openCalendly(e) {
    e.preventDefault();
    if (typeof window.Calendly !== 'undefined') {
      window.Calendly.initPopupWidget({ url: CALENDLY_URL });
    } else {
      window.open(CALENDLY_URL, '_blank', 'noopener');
    }
  }

  return (
    <div ref={sectionRef}>
      <ScrollCanvas
        sequence="hero"
        frameCount={HERO_FRAMES}
        scrollHeight={HERO_SCROLL}
        scrimLeft
      >
        {/* Overlay text */}
        <div
          ref={overlayRef}
          className="h-full flex flex-col justify-end px-6 md:px-16 lg:px-24 pb-20 md:pb-24"
          style={{ maxWidth: '640px' }}
        >
          {/* Eyebrow */}
          <p
            ref={eyebrowRef}
            className="section-label mb-4"
          >
            Used by UK importers managing India corridor exposure
          </p>

          {/* Headline */}
          <h1
            ref={titleRef}
            className="font-display mb-6"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 'clamp(2.8rem, 6vw, 5.5rem)',
              fontWeight: 400,
              lineHeight: 1.05,
              color: '#f5f0e8',
              textShadow: '0 2px 16px rgba(0,0,0,0.85), 0 1px 4px rgba(0,0,0,0.7)',
            }}
          >
            Know before it hits
            <br />
            <em style={{ color: '#ffd700', fontStyle: 'italic', fontWeight: 300 }}>
              your bottom line.
            </em>
          </h1>

          {/* Subtext */}
          <p
            ref={subRef}
            className="mb-8 max-w-xl"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '1.05rem',
              color: 'rgba(232, 228, 220, 0.75)',
              lineHeight: 1.65,
            }}
          >
            Weekly trade risk intelligence for UK companies on the UK–India corridor.
            Human-reviewed. No jargon. Free to start.
          </p>

          {/* CTAs */}
          <div ref={ctasRef} className="flex flex-wrap gap-3">
            <a href="#final-cta" className="btn-primary">
              Get the Weekly Pulse
            </a>
            <a href="#how-it-works" className="btn-ghost">
              See How It Works
            </a>
          </div>

          {/* Signal indicator */}
          <div ref={signalRef} className="mt-10 flex items-center gap-3">
            <span
              style={{
                display: 'inline-block',
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: '#ff3b3b',
                boxShadow: '0 0 8px rgba(255,59,59,0.7)',
                animation: 'pulse 2s ease-in-out infinite',
              }}
            />
            <span
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: '0.75rem',
                color: 'rgba(232, 228, 220, 0.55)',
                letterSpacing: '0.06em',
              }}
            >
              UK–India: <span style={{ color: '#ff3b3b' }}>ACTIVE</span>
            </span>
            <span
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '0.6rem',
                letterSpacing: '0.15em',
                color: 'rgba(255,255,255,0.2)',
              }}
            >
              · LAUNCH CORRIDOR
            </span>
          </div>
        </div>
      </ScrollCanvas>

      {/* Pulse keyframe */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.55; transform: scale(1.3); }
        }
      `}</style>
    </div>
  );
}
