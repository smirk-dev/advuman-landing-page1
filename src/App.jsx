import Nav             from './components/Nav';
import HeroSection     from './components/HeroSection';
import CorridorStrip   from './components/CorridorStrip';
import CostSection     from './components/CostSection';
import SignalsSection  from './components/SignalsSection';
import HormuzSection   from './components/HormuzSection';
import PricingSection  from './components/PricingSection';
import HealthStates    from './components/HealthStates';
import RoiSection      from './components/RoiSection';
import CetaBlock       from './components/CetaBlock';
import OnboardingSection from './components/OnboardingSection';
import FinalCTA        from './components/FinalCTA';
import Footer          from './components/Footer';

// Ornament divider — preserved from original design
function Ornament() {
  return (
    <div className="ornament" aria-hidden="true">
      <span style={{
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        fontSize:   '0.7rem',
        color:      'white',
      }}>
        ✦
      </span>
    </div>
  );
}

export default function App() {
  return (
    <div style={{ background: '#070d0a', minHeight: '100vh' }}>
      {/* Fixed nav */}
      <Nav />

      {/* ── Hero (scroll-canvas, pinned) ──────────────────── */}
      <HeroSection />

      {/* ── Corridor Status Strip ─────────────────────────── */}
      <CorridorStrip />

      <Ornament />

      {/* ── Cost of Not Knowing ───────────────────────────── */}
      <CostSection />

      <Ornament />

      {/* ── How It Works (scroll-canvas, pinned) ──────────── */}
      <SignalsSection />

      {/* ── Hormuz Proof Timeline (scroll-canvas, pinned) ─── */}
      <HormuzSection />

      <Ornament />

      {/* ── Pricing ───────────────────────────────────────── */}
      <PricingSection />

      <Ornament />

      {/* ── Health States ─────────────────────────────────── */}
      <HealthStates />

      <Ornament />

      {/* ── ROI (scroll-canvas, pinned) ───────────────────── */}
      <RoiSection />

      <Ornament />

      {/* ── UK–India Context (CETA) ───────────────────────── */}
      <CetaBlock />

      <Ornament />

      {/* ── Getting Started ───────────────────────────────── */}
      <OnboardingSection />

      <Ornament />

      {/* ── Final CTA + Email Form ────────────────────────── */}
      <FinalCTA />

      <Ornament />

      {/* ── Footer ────────────────────────────────────────── */}
      <Footer />
    </div>
  );
}
