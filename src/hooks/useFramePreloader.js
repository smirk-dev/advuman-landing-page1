import { useState, useEffect } from 'react';
import { SEQUENCES, COLORS } from '../constants';

// ── Placeholder frame generator ────────────────────────────────────────────
// Creates a dark labeled frame via OffscreenCanvas — no network, instant.
function createPlaceholder(sequenceKey, index, frameCount) {
  try {
    const W = 960, H = 540;
    const canvas = new OffscreenCanvas(W, H);
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = COLORS.bg;
    ctx.fillRect(0, 0, W, H);

    // Subtle grid
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.04)';
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 80) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y < H; y += 80) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    // Progress bar
    const p = index / Math.max(frameCount - 1, 1);
    ctx.fillStyle = 'rgba(255, 215, 0, 0.12)';
    ctx.fillRect(0, H - 4, W, 4);
    ctx.fillStyle = COLORS.gold;
    ctx.fillRect(0, H - 4, p * W, 4);

    // Center label
    ctx.fillStyle = 'rgba(255, 215, 0, 0.22)';
    ctx.font = `bold 26px Arial Narrow, Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(
      `[ ${sequenceKey.toUpperCase()} · ${String(index + 1).padStart(3, '0')} / ${frameCount} ]`,
      W / 2,
      H / 2,
    );

    return canvas.transferToImageBitmap();
  } catch {
    return null;
  }
}

function getFrameUrls(seqConfig, index) {
  const pad = String(index + 1).padStart(seqConfig.pad, '0');
  const paths = [seqConfig.basePath, ...(seqConfig.basePathFallbacks ?? [])];
  return [...new Set(paths)].map((basePath) =>
    `${basePath}/${seqConfig.filePrefix}${pad}${seqConfig.fileSuffix}`,
  );
}

// ── Hook ───────────────────────────────────────────────────────────────────
// sequence   — key in SEQUENCES ('hero' | 'signals' | 'hormuz' | 'roi')
// frameCount — can be omitted; defaults to SEQUENCES[sequence].frameCount
export function useFramePreloader(sequence, frameCount) {
  const seqConfig = SEQUENCES[sequence];
  const count = frameCount ?? seqConfig?.frameCount ?? 0;

  const [frames, setFrames]         = useState(null);
  const [isReady, setIsReady]       = useState(false);
  const [loadProgress, setProgress] = useState(0);

  useEffect(() => {
    if (!seqConfig || count === 0) return;
    let cancelled = false;

    // ── Placeholder mode (per-sequence) ───────────────────────────────────
    if (seqConfig.placeholder) {
      const bitmaps = Array.from({ length: count }, (_, i) =>
        createPlaceholder(sequence, i, count),
      );
      setFrames(bitmaps);
      setProgress(1);
      setIsReady(true);
      return;
    }

    // ── Load real frames ───────────────────────────────────────────────────
    const imgs = new Array(count).fill(null);
    let loaded = 0;

    const promises = Array.from({ length: count }, (_, i) =>
      new Promise((resolve) => {
        const urls = getFrameUrls(seqConfig, i);
        const img = new Image();

        const tryNext = (attempt = 0) => {
          if (attempt >= urls.length) {
            loaded++;
            if (!cancelled) setProgress(loaded / count);
            resolve();
            return;
          }

          img.onload = () => {
            imgs[i] = img;
            loaded++;
            if (!cancelled) setProgress(loaded / count);
            resolve();
          };

          img.onerror = () => tryNext(attempt + 1);
          img.src = urls[attempt];
        };

        tryNext();
      }),
    );

    Promise.all(promises).then(() => {
      if (!cancelled) {
        setFrames(imgs);
        setIsReady(true);
      }
    });

    return () => { cancelled = true; };
  }, [sequence, count]);

  return { frames, isReady, loadProgress };
}
