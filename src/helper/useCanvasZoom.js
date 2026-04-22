import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

/** Padding inside the visual viewport when computing “fit”. */
const VIEWPORT_PAD = 20;

/** One toolbar step (~12% per click). */
const ZOOM_STEP = 1.12;

/** User zoom limits (absolute scale). */
const SCALE_MAX = 2;
const SCALE_MIN_USER = 0.5;

function readViewportSize() {
  if (typeof window === "undefined") return { vw: 0, vh: 0 };
  const vv = window.visualViewport;
  const vw = Math.max(1, (vv?.width ?? window.innerWidth) - VIEWPORT_PAD);
  const vh = Math.max(1, (vv?.height ?? window.innerHeight) - VIEWPORT_PAD);
  return { vw, vh };
}

/**
 * Lower bound for scale: allow shrinking to at least `fitContain` when the canvas
 * is larger than the viewport; otherwise keep a 0.5 floor for manual zoom-out.
 */
export function scaleLowerBound(fitContain) {
  return Math.min(SCALE_MIN_USER, fitContain);
}

export function clampCanvasScale(scale, fitContain) {
  const lo = scaleLowerBound(fitContain);
  return Math.min(SCALE_MAX, Math.max(lo, scale));
}

function computeFitContain(contentW, contentH) {
  if (contentW < 1 || contentH < 1) return 1;
  const { vw, vh } = readViewportSize();
  return Math.min(vw / contentW, vh / contentH);
}

function distance(a, b) {
  const dx = a.clientX - b.clientX;
  const dy = a.clientY - b.clientY;
  return Math.hypot(dx, dy) || 1;
}

/**
 * Fixed-canvas public pages: CSS `transform: scale()` on `.sp-public` inside
 * `CanvasZoomShell` (bridge sizing so overflow matches the scaled box).
 *
 * Behaviour:
 * - **Auto-fit** — first time content gets a stable width/height, scale is set to
 *   `min(viewportW / contentW, viewportH / contentH)` so the full canvas fits.
 * - **Resize** — keeps the user’s current zoom when possible; reclamps to new fit.
 * - **Limits** — absolute scale is clamped to `[min(0.5, fit), 2]` so you can zoom
 *   out to at least 0.5× unless the fit ratio is smaller (very large canvases).
 * - **Manual** — toolbar + / − (see `ZOOM_STEP`), **Ctrl + wheel** (trackpad pinch),
 *   and **two-finger pinch** on the stage (non-passive `touchmove` / `wheel`).
 */
export function useCanvasZoom(layoutKey) {
  const contentRef = useRef(null);
  const layoutEpochRef = useRef(null);
  const dimsRef = useRef({ w: 0, h: 0, ready: false });
  const fitContainRef = useRef(1);
  const scaleRef = useRef(1);

  const [dims, setDims] = useState({ w: 0, h: 0, ready: false });
  const [scale, setScale] = useState(1);
  const [isGesturing, setIsGesturing] = useState(false);

  const pinchRef = useRef({
    active: false,
    startDist: 1,
    startScale: 1,
  });

  const applyScale = useCallback((next) => {
    const clamped = clampCanvasScale(next, fitContainRef.current);
    scaleRef.current = clamped;
    setScale(clamped);
  }, []);

  const measure = useCallback(() => {
    const el = contentRef.current;
    if (!el) return;
    const w = Math.ceil(el.scrollWidth);
    const h = Math.ceil(el.scrollHeight);
    if (w < 1 || h < 1) return;

    const fit = computeFitContain(w, h);
    fitContainRef.current = fit;

    const prev = dimsRef.current;
    const becameReady = !prev.ready;

    let nextScale = scaleRef.current;
    if (becameReady) {
      nextScale = clampCanvasScale(fit, fit);
    } else if (prev.ready) {
      nextScale = clampCanvasScale(scaleRef.current, fit);
    }

    scaleRef.current = nextScale;
    setScale(nextScale);
    dimsRef.current = { w, h, ready: true };
    setDims((d) => {
      if (d.w === w && d.h === h && d.ready) return d;
      return { w, h, ready: true };
    });
  }, []);

  useLayoutEffect(() => {
    const prevEpoch = layoutEpochRef.current;
    layoutEpochRef.current = layoutKey;
    if (prevEpoch != null && prevEpoch !== layoutKey) {
      dimsRef.current = { w: 0, h: 0, ready: false };
      setDims({ w: 0, h: 0, ready: false });
      scaleRef.current = 1;
      setScale(1);
    }
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(measure);
    });
    return () => cancelAnimationFrame(id);
  }, [layoutKey, measure]);

  useEffect(() => {
    let raf = 0;
    const schedule = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        raf = 0;
        measure();
      });
    };

    window.addEventListener("resize", schedule);
    window.addEventListener("orientationchange", schedule);
    window.visualViewport?.addEventListener("resize", schedule);

    const el = contentRef.current;
    let ro;
    if (el && typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(schedule);
      ro.observe(el);
    }
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("orientationchange", schedule);
      window.visualViewport?.removeEventListener("resize", schedule);
      ro?.disconnect();
    };
  }, [measure]);

  const zoomIn = useCallback(() => {
    applyScale(scaleRef.current * ZOOM_STEP);
  }, [applyScale]);

  const zoomOut = useCallback(() => {
    applyScale(scaleRef.current / ZOOM_STEP);
  }, [applyScale]);

  const fitToViewport = useCallback(() => {
    applyScale(fitContainRef.current);
  }, [applyScale]);

  const onWheel = useCallback(
    (e) => {
      if (!e.ctrlKey) return;
      e.preventDefault();
      const factor = Math.exp(-e.deltaY * 0.0015);
      applyScale(scaleRef.current * factor);
    },
    [applyScale]
  );

  const onTouchStart = useCallback((e) => {
    if (e.touches.length === 2) {
      const d = distance(e.touches[0], e.touches[1]);
      pinchRef.current = {
        active: true,
        startDist: d,
        startScale: scaleRef.current,
      };
      setIsGesturing(true);
    }
  }, []);

  const onTouchMove = useCallback(
    (e) => {
      if (!pinchRef.current.active || e.touches.length < 2) return;
      e.preventDefault();
      const d = distance(e.touches[0], e.touches[1]);
      const next =
        pinchRef.current.startScale * (d / pinchRef.current.startDist);
      applyScale(next);
    },
    [applyScale]
  );

  const endPinch = useCallback(() => {
    if (pinchRef.current.active) {
      pinchRef.current.active = false;
      setIsGesturing(false);
    }
  }, []);

  const transformActive = dims.ready && dims.w > 0 && dims.h > 0;

  const bridgeStyle = transformActive
    ? { width: dims.w * scale, height: dims.h * scale }
    : undefined;

  const scaledStyle = transformActive
    ? {
        position: "absolute",
        top: 0,
        left: 0,
        width: dims.w,
        height: dims.h,
        transform: `scale(${scale})`,
        transformOrigin: "top left",
      }
    : undefined;

  const useFittedBodyClass = transformActive && scale < 0.999;

  useEffect(() => {
    if (!useFittedBodyClass) {
      document.body.classList.remove("sp-home-fitted-scale");
      return undefined;
    }
    document.body.classList.add("sp-home-fitted-scale");
    return () => document.body.classList.remove("sp-home-fitted-scale");
  }, [useFittedBodyClass]);

  const stageHandlers = {
    onWheel,
    onTouchStart,
    onTouchMove,
    onTouchEnd: endPinch,
    onTouchCancel: endPinch,
  };

  return {
    contentRef,
    transformActive,
    bridgeStyle,
    scaledStyle,
    contentTransition: !isGesturing,
    onWheel,
    onTouchStart,
    onTouchMove,
    endPinch,
    zoomIn,
    zoomOut,
    fitToViewport,
    scale,
  };
}
