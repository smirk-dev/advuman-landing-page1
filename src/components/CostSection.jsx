import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const STATS = [
  {
    number: '£25K',
    color:  '#ff3b3b',
    label:  'Single duty cost a well-timed alert could help avoid',
  },
  {
    number: '15–20 days',
    color:  '#ffd700',
    label:  'Transit extension when key routes reroute around disruption',
  },
  {
    number: '24+ sources',
    color:  '#00c896',
    label:  'Signals monitored per corridor across regulatory, shipping, and cost pressure',
  },
];

export default function CostSection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.cost-card', {
        opacity: 0,
        y: 32,
        stagger: 0.12,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start:   'top 80%',
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="cost"
      style={{ padding: '6rem 2rem', maxWidth: '1100px', margin: '0 auto' }}
    >
      <p className="section-label">The cost of not knowing</p>
      <h2
        className="section-title"
        style={{ marginBottom: '3rem' }}
      >
        Disruption is expensive.<br />
        Surprise is worse.
      </h2>

      <p
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '1rem',
          color: 'rgba(232,228,220,0.75)',
          maxWidth: '580px',
          lineHeight: 1.7,
          marginBottom: '3rem',
        }}
      >
        For UK companies trading with India, the hardest costs are usually the ones
        discovered too late. A duty shock after orders are committed. A reroute you
        didn't plan for. An insurance premium you hadn't priced in.
      </p>

      {/* Stats grid */}
      <div
        className="grid-ruled"
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}
      >
        {STATS.map(({ number, color, label }) => (
          <div
            key={number}
            className="cost-card"
            style={{ padding: '2.5rem 2rem' }}
          >
            <p
              style={{
                fontFamily:    "'Bebas Neue', sans-serif",
                fontSize:      'clamp(2.2rem, 5vw, 3.5rem)',
                color,
                letterSpacing: '0.02em',
                lineHeight:    1,
                marginBottom:  '0.75rem',
              }}
            >
              {number}
            </p>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize:   '0.88rem',
                color:      'rgba(232,228,220,0.70)',
                lineHeight: 1.55,
              }}
            >
              {label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
