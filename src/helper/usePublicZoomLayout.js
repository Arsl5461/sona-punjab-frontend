import { useEffect } from "react";

/** iPhone / iPad / iPadOS “desktop” UA — all use WebKit for layout & gestures. */
export function isAppleTouchDevice() {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  if (/iPhone|iPod/i.test(ua)) return true;
  if (/iPad/i.test(ua)) return true;
  if (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) return true;
  return false;
}

/** Google Chrome on iOS (still WebKit; gesture + viewport edge cases differ slightly). */
export function isChromeIOS() {
  if (typeof navigator === "undefined") return false;
  return /CriOS/i.test(navigator.userAgent);
}

/**
 * Public “wide canvas” pages: body.sp-home-zoom-layout + optional html classes
 * so iOS Safari / Chrome can use viewport pinch-zoom without nested scrollers
 * stealing gestures (see apna-shauq-home.css).
 */
export function usePublicZoomLayout() {
  useEffect(() => {
    const html = document.documentElement;
    document.body.classList.add("sp-home-zoom-layout");

    const ios = isAppleTouchDevice();
    if (ios) html.classList.add("sp-ios-touch");
    if (ios && isChromeIOS()) html.classList.add("sp-ios-chrome");

    return () => {
      document.body.classList.remove("sp-home-zoom-layout");
      html.classList.remove("sp-ios-touch", "sp-ios-chrome");
    };
  }, []);
}
