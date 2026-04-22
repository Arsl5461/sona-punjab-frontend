import { useCallback, useState } from "react";

/** Manual − / + range (50% … 135%). */
const ZOOM_MIN = 0.5;
const ZOOM_MAX = 1.35;
const ZOOM_STEP = 1.08;

/** "Fit" may go lower so very wide tables still fit (then you can use + to nudge). */
const FIT_ZOOM_MIN = 0.25;

/**
 * UI zoom for public pages: CSS `zoom` on the root `.sp-public` ref you pass in.
 * − / + stay within 50%–135%; **Fit** sets zoom from measured content vs viewport
 * (width & height), capped at 100% so we never upscale, floor 25% for sanity.
 */
export function useSimpleUiZoom(rootRef) {
  const [zoom, setZoom] = useState(1);

  const zoomIn = useCallback(() => {
    setZoom((z) => Math.min(ZOOM_MAX, Math.round(z * ZOOM_STEP * 1000) / 1000));
  }, []);

  const zoomOut = useCallback(() => {
    setZoom((z) => Math.max(ZOOM_MIN, Math.round((z / ZOOM_STEP) * 1000) / 1000));
  }, []);

  const resetZoom = useCallback(() => setZoom(1), []);

  /**
   * One-shot: zoom so the whole `.sp-public` block fits in the visual viewport.
   * Temporarily resets to 100% for a reliable `scrollWidth` / `scrollHeight` read.
   */
  const fitToScreen = useCallback(() => {
    const el = rootRef?.current;
    if (!el) return;
    setZoom(1);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const vv = window.visualViewport;
        const vw = Math.max(120, (vv?.width ?? window.innerWidth) - 20);
        const vh = Math.max(120, (vv?.height ?? window.innerHeight) - 20);
        const w = el.scrollWidth;
        const h = el.scrollHeight;
        if (w < 1 || h < 1) return;
        const raw = Math.min(vw / w, vh / h, 1);
        const next = Math.min(ZOOM_MAX, Math.max(FIT_ZOOM_MIN, raw));
        setZoom(Math.round(next * 1000) / 1000);
      });
    });
  }, [rootRef]);

  const zoomStyle = zoom !== 1 ? { zoom } : undefined;

  return {
    zoom,
    zoomIn,
    zoomOut,
    resetZoom,
    fitToScreen,
    zoomStyle,
    zoomPercent: Math.round(zoom * 100),
  };
}
