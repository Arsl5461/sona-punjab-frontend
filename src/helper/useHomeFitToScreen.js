import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

const PAD = 24;

function readViewport() {
  if (typeof window === "undefined") return { w: 0, h: 0 };
  const vv = window.visualViewport;
  return {
    w: Math.max(32, (vv?.width ?? window.innerWidth) - PAD),
    h: Math.max(32, (vv?.height ?? window.innerHeight) - PAD),
  };
}

/**
 * Measures `.sp-public` and applies CSS scale so banner + header + marquee + table
 * fit in the visual viewport when possible (`mode === "auto"`). "100%" uses natural
 * layout (browser pinch-zoom only).
 */
export function useHomeFitToScreen(layoutKey) {
  const contentRef = useRef(null);
  const [mode, setMode] = useState("auto");
  const modeRef = useRef(mode);
  modeRef.current = mode;
  const [dims, setDims] = useState({ w: 0, h: 0, s: 1 });

  const measure = useCallback(() => {
    const el = contentRef.current;
    if (!el) return;
    const w = Math.ceil(el.scrollWidth);
    const h = Math.ceil(el.scrollHeight);
    if (w < 1 || h < 1) return;
    const { w: vw, h: vh } = readViewport();
    const sAuto = Math.min(vw / w, vh / h, 1);
    const s = modeRef.current === "natural" ? 1 : sAuto;
    setDims((prev) => {
      if (prev.w === w && prev.h === h && prev.s === s) return prev;
      return { w, h, s };
    });
  }, []);

  useLayoutEffect(() => {
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(measure);
    });
    return () => cancelAnimationFrame(id);
  }, [measure, layoutKey, mode]);

  useEffect(() => {
    const onResize = () => {
      requestAnimationFrame(measure);
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    window.visualViewport?.addEventListener("resize", onResize);

    const el = contentRef.current;
    let ro;
    if (el && typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => onResize());
      ro.observe(el);
    }
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      window.visualViewport?.removeEventListener("resize", onResize);
      ro?.disconnect();
    };
  }, [measure]);

  const setFitAuto = useCallback(() => {
    modeRef.current = "auto";
    setMode("auto");
    requestAnimationFrame(() => {
      requestAnimationFrame(measure);
    });
  }, [measure]);

  const setFitNatural = useCallback(() => {
    modeRef.current = "natural";
    setMode("natural");
    requestAnimationFrame(() => {
      requestAnimationFrame(measure);
    });
  }, [measure]);

  const needsScaleBridge =
    mode === "auto" && dims.s < 1 && dims.w > 0 && dims.h > 0;

  useEffect(() => {
    if (!needsScaleBridge) {
      document.body.classList.remove("sp-home-fitted-scale");
      return undefined;
    }
    document.body.classList.add("sp-home-fitted-scale");
    return () => document.body.classList.remove("sp-home-fitted-scale");
  }, [needsScaleBridge]);

  return {
    contentRef,
    needsScaleBridge,
    bridgeStyle: needsScaleBridge
      ? { width: dims.w * dims.s, height: dims.h * dims.s }
      : undefined,
    scaledStyle: needsScaleBridge
      ? {
          position: "absolute",
          top: 0,
          left: 0,
          width: dims.w,
          height: dims.h,
          transform: `scale(${dims.s})`,
          transformOrigin: "top left",
        }
      : undefined,
    setFitAuto,
    setFitNatural,
    mode,
    fitScale: dims.s,
  };
}
