import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

const PAD = 24;
/** Viewport max-width treated as “mobile” — always fit-to-screen, no layout branch swap. */
const MOBILE_MAX_WIDTH = 896;

function readViewport() {
  if (typeof window === "undefined") return { w: 0, h: 0 };
  const vv = window.visualViewport;
  return {
    w: Math.max(32, (vv?.width ?? window.innerWidth) - PAD),
    h: Math.max(32, (vv?.height ?? window.innerHeight) - PAD),
  };
}

function useMobileFitViewport() {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(`(max-width: ${MOBILE_MAX_WIDTH}px)`).matches;
  });

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_MAX_WIDTH}px)`);
    const onChange = () => setIsMobile(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return isMobile;
}

/**
 * Measures `.sp-public` and applies CSS scale so banner + header + marquee + table
 * fit in the visual viewport. On viewports ≤896px, fit is always on (same as “Fit screen”).
 * Desktop “100%” uses scale 1 inside a stable shell (no remount) once layout is known.
 */
export function useHomeFitToScreen(layoutKey) {
  const contentRef = useRef(null);
  const isMobile = useMobileFitViewport();
  const [mode, setMode] = useState("auto");
  const modeRef = useRef(mode);
  modeRef.current = mode;

  const [dims, setDims] = useState({ w: 0, h: 0, s: 1, layoutReady: false });
  const layoutKeyRef = useRef(null);

  const measure = useCallback(() => {
    const el = contentRef.current;
    if (!el) return;
    const w = Math.ceil(el.scrollWidth);
    const h = Math.ceil(el.scrollHeight);
    if (w < 1 || h < 1) return;
    const { w: vw, h: vh } = readViewport();
    const sAuto = Math.min(vw / w, vh / h, 1);
    const useNatural =
      !isMobile && modeRef.current === "natural";
    const rawS = useNatural ? 1 : sAuto;
    const s = Math.round(Math.min(1, rawS) * 10000) / 10000;

    setDims((prev) => {
      const layoutReady = true;
      const wSame = prev.w === w;
      const hSame = prev.h === h;
      const sSame = Math.abs(prev.s - s) < 0.008;
      if (wSame && hSame && sSame && prev.layoutReady === layoutReady) {
        return prev;
      }
      return { w, h, s, layoutReady };
    });
  }, [isMobile]);

  useLayoutEffect(() => {
    if (layoutKeyRef.current !== layoutKey) {
      const shouldReset = layoutKeyRef.current != null;
      layoutKeyRef.current = layoutKey;
      if (shouldReset) {
        setDims({ w: 0, h: 0, s: 1, layoutReady: false });
      }
    }
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(measure);
    });
    return () => cancelAnimationFrame(id);
  }, [measure, layoutKey]);

  useLayoutEffect(() => {
    if (isMobile) return undefined;
    const id = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(id);
  }, [measure, mode, isMobile]);

  useEffect(() => {
    let raf = 0;
    const scheduleMeasure = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        raf = 0;
        measure();
      });
    };

    const onResize = () => scheduleMeasure();
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    window.visualViewport?.addEventListener("resize", onResize);

    const el = contentRef.current;
    let ro;
    if (el && typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => scheduleMeasure());
      ro.observe(el);
    }
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      window.visualViewport?.removeEventListener("resize", onResize);
      ro?.disconnect();
    };
  }, [measure]);

  useEffect(() => {
    if (isMobile && mode !== "auto") {
      modeRef.current = "auto";
      setMode("auto");
    }
  }, [isMobile, mode]);

  const setFitAuto = useCallback(() => {
    modeRef.current = "auto";
    setMode("auto");
    requestAnimationFrame(() => {
      requestAnimationFrame(measure);
    });
  }, [measure]);

  const setFitNatural = useCallback(() => {
    if (isMobile) return;
    modeRef.current = "natural";
    setMode("natural");
    requestAnimationFrame(() => {
      requestAnimationFrame(measure);
    });
  }, [measure, isMobile]);

  /** Mobile + shrink + desktop “100%” need the transform shell; wide desktop at 100% scale stays in flow to avoid extra reflow. */
  const scaledLayoutActive =
    dims.layoutReady &&
    dims.w > 0 &&
    dims.h > 0 &&
    (isMobile || mode === "natural" || dims.s < 0.999);

  const useFittedBodyClass =
    scaledLayoutActive && dims.s < 0.999 && !(mode === "natural" && !isMobile);

  useEffect(() => {
    if (!useFittedBodyClass) {
      document.body.classList.remove("sp-home-fitted-scale");
      return undefined;
    }
    document.body.classList.add("sp-home-fitted-scale");
    return () => document.body.classList.remove("sp-home-fitted-scale");
  }, [useFittedBodyClass]);

  const bridgeStyle = scaledLayoutActive
    ? { width: dims.w * dims.s, height: dims.h * dims.s }
    : undefined;

  const scaledStyle = scaledLayoutActive
    ? {
        position: "absolute",
        top: 0,
        left: 0,
        width: dims.w,
        height: dims.h,
        transform: `scale(${dims.s})`,
        transformOrigin: "top left",
      }
    : undefined;

  return {
    contentRef,
    scaledLayoutActive,
    bridgeStyle,
    scaledStyle,
    setFitAuto,
    setFitNatural,
    mode,
    fitScale: dims.s,
    isMobileFit: isMobile,
  };
}
