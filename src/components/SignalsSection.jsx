import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrollCanvas from './ScrollCanvas';
import { SEQUENCES } from '../constants';

const { frameCount: SIG_FRAMES, scrollHeight: SIG_SCROLL } = SEQUENCES.signals;

const STEPS = [
  {
    num:    '01',
    title:  'Monitor the corridor',
    body:   'We track regulatory notices, port updates, carrier changes, and cost signals across the UK–India trade lane.',
    tag:    'Regulatory · Shipping · Cost',
  },
  {
    num:    '02',
    title:  'Read what matters',
    body:   'Signals are grouped into the three types of pressure that actually affect operators: compliance, shipping, and landed cost.',
    tag:    'What changed · Where pressure sits',
  },
  {
    num:    '03',
    title:  'Get the weekly pulse',
    body:   'Start with the free weekly corridor pulse. Upgrade for the full report, ranked threats, and broader checks delivered every Monday in plain English.',
    tag:    'Free pulse → Full report',
  },
];

export default function SignalsSection() {
  const sectionRef = useRef(null);
  const step1Ref   = useRef(null);
  const step2Ref   = useRef(null);
  const step3Ref   = useRef(null);
  const headerRef  = useRef(null);

  const stepRefs = [step1Ref, step2Ref, step3Ref];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const sh = SIG_SCROLL;

      gsap.set([headerRef.current, ...stepRefs.map(r => r.current)], {
        opacity: 0, y: 24,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start:   'top top',
          end:     `+=${sh}`,
          scrub:   0.4,
        },
      });

      // One phase at a time: header → step1 → step2 → step3
      tl
        .to(headerRef.current,  { opacity: 1, y: 0, duration: 0.10 }, 0.03)
        .to(step1Ref.current,   { opacity: 1, y: 0, duration: 0.10 }, 0.15)
        .to([headerRef.current, step1Ref.current], { opacity: 0, y: -10, duration: 0.08 }, 0.28)
        .to(step2Ref.current,   { opacity: 1, y: 0, duration: 0.10 }, 0.33)
        .to(step2Ref.current,   { opacity: 0, y: -10, duration: 0.08 }, 0.50)
        .to(step3Ref.current,   { opacity: 1, y: 0, duration: 0.10 }, 0.55)
        .to(step3Ref.current,   { opacity: 0, y: -10, duration: 0.08 }, 0.82);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} id="how-it-works">
      <ScrollCanvas
        sequence="signals"
        frameCount={SIG_FRAMES}
        scrollHeight={SIG_SCROLL}
        scrimLeft
      >
        <div className="h-full relative">

          {/* Header — top-left, fades in first, then out before step 2 */}
          <div
            ref={headerRef}
            style={{
              position: 'absolute',
              top: 'clamp(5rem, 10vh, 7rem)',
              left: 'clamp(1.5rem, 8vw, 6rem)',
              maxWidth: '540px',
            }}
          >
            <p className="section-label">How Advuman works</p>
            <h2
              className="section-title"
              style={{
                maxWidth: '540px',
                textShadow: '0 2px 16px rgba(0,0,0,0.85), 0 1px 4px rgba(0,0,0,0.7)',
              }}
            >
              Three pressure layers.<br />
              <em style={{ fontStyle: 'italic', color: '#ffd700', fontWeight: 300 }}>
                One clear corridor state.
              </em>
            </h2>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '1rem',
              color: 'rgba(232,228,220,0.75)',
              maxWidth: '480px',
              lineHeight: 1.65,
              textShadow: '0 1px 8px rgba(0,0,0,0.7)',
            }}>
              We turn scattered trade signals into one weekly read on where risk is
              building across the UK–India corridor.
            </p>
          </div>

          {/* Steps — bottom-left, each revealed one at a time */}
          {STEPS.map(({ num, title, body, tag }, i) => (
            <div
              key={num}
              ref={stepRefs[i]}
              style={{
                position: 'absolute',
                bottom: 'clamp(4rem, 8vh, 6rem)',
                left: 'clamp(1.5rem, 8vw, 6rem)',
                maxWidth: '540px',
                padding: '2rem 2.25rem',
                background: 'rgba(7,13,10,0.82)',
                border: '1px solid rgba(255,215,0,0.15)',
                borderRadius: '3px',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
              }}
            >
              <p style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '0.8rem',
                letterSpacing: '0.18em',
                color: 'rgba(255,215,0,0.7)',
                marginBottom: '0.75rem',
              }}>
                {num}
              </p>
              <h3 style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: '1.6rem',
                fontWeight: 400,
                color: '#ffffff',
                marginBottom: '0.75rem',
                textShadow: '0 1px 8px rgba(0,0,0,0.5)',
              }}>
                {title}
              </h3>
              <p style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.9rem',
                color: 'rgba(232,228,220,0.78)',
                lineHeight: 1.65,
                marginBottom: '1.1rem',
              }}>
                {body}
              </p>
              <span style={{
                display: 'inline-block',
                fontFamily: "'DM Mono', monospace",
                fontSize: '0.68rem',
                letterSpacing: '0.06em',
                color: 'rgba(255,215,0,0.65)',
                background: 'rgba(255,215,0,0.08)',
                padding: '0.25rem 0.65rem',
                borderRadius: '2px',
                border: '1px solid rgba(255,215,0,0.12)',
              }}>
                {tag}
              </span>
            </div>
          ))}
        </div>
      </ScrollCanvas>
    </div>
  );
}
