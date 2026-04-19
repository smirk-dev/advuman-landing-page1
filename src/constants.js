// ── External URLs ──────────────────────────────────────────────────────────
export const CALENDLY_URL       = 'https://calendly.com/advuman/15min';
export const TALLY_FALLBACK_URL = 'https://tally.so/r/advuman-waitlist';

// ── Corridor Stub Data ─────────────────────────────────────────────────────
export const STUB_CORRIDOR_STATUS = {
  corridors: [
    { id: 'uk-india', state: 'ACTIVE', score: 55.25, updated: '2026-04-09' },
    { id: 'uk-egypt', state: 'WATCH',  score: 11.0,  updated: '2026-04-09' },
  ],
};

// ── Sequence Configuration ─────────────────────────────────────────────────
// Each entry defines how frames are loaded and played for a scroll-canvas section.
//
// placeholder: true  → generate dark frames via OffscreenCanvas (no files needed)
// placeholder: false → load real files from basePath
//
// URL built as: `{basePath}/{filePrefix}{NNN}{fileSuffix}`
// where NNN is zero-padded to `pad` digits, starting at 1.
export const SEQUENCES = {
  hero: {
    placeholder:  false,               // real frames available
    frameCount:   160,
    scrollHeight: 160 * 12,            // 1920px — ~12px of scroll per frame
    basePath:     '/sequence1',
    basePathFallbacks: [
      '/sequence1',
      '/public/sequence1',
      './public/sequence1',
      'public/sequence1',
    ],
    filePrefix:   'ezgif-frame-',
    fileSuffix:   '.png',
    pad:          3,
  },
  signals: {
    placeholder:  false,               // real frames available
    frameCount:   160,
    scrollHeight: 160 * 12,            // 1920px
    basePath:     '/sequence2',
    filePrefix:   'ezgif-frame-',
    fileSuffix:   '.png',
    pad:          3,
  },
  hormuz: {
    placeholder:  true,
    frameCount:   90,
    scrollHeight: 90 * 12,             // 1080px
    basePath:     '/sequence3',
    filePrefix:   'frame_',
    fileSuffix:   '.webp',
    pad:          3,
  },
  roi: {
    placeholder:  true,
    frameCount:   50,
    scrollHeight: 50 * 10,             // 500px
    basePath:     '/sequence4',
    filePrefix:   'frame_',
    fileSuffix:   '.webp',
    pad:          3,
  },
};

// ── Brand Colors (JS, for canvas use) ─────────────────────────────────────
export const COLORS = {
  bg:      '#070d0a',
  gold:    '#ffd700',
  red:     '#ff3b3b',
  teal:    '#00c896',
  blue:    '#4488ff',
};
