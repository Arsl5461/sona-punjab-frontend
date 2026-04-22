import { useCallback, useState } from "react";

const ZOOM_MIN = 0.85;
const ZOOM_MAX = 1.35;
const ZOOM_STEP = 1.08;

/**
 * Light UI zoom for public pages: uses CSS `zoom` on `.sp-public` (supported in
 * Chromium, Safari 15.4+, Firefox 126+). Keeps layout flow so width stays viewport-bound.
 */
export function useSimpleUiZoom() {
  const [zoom, setZoom] = useState(1);

  const zoomIn = useCallback(() => {
    setZoom((z) => Math.min(ZOOM_MAX, Math.round(z * ZOOM_STEP * 1000) / 1000));
  }, []);

  const zoomOut = useCallback(() => {
    setZoom((z) => Math.max(ZOOM_MIN, Math.round((z / ZOOM_STEP) * 1000) / 1000));
  }, []);

  const resetZoom = useCallback(() => setZoom(1), []);

  /** Apply on the root `.sp-public` wrapper. */
  const zoomStyle = zoom !== 1 ? { zoom } : undefined;

  return {
    zoom,
    zoomIn,
    zoomOut,
    resetZoom,
    zoomStyle,
    zoomPercent: Math.round(zoom * 100),
  };
}
