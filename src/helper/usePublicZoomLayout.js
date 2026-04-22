import { useEffect } from "react";

/** iPhone / iPad / iPadOS “desktop” UA — WebKit for layout & gestures. */
export function isAppleTouchDevice() {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  if (/iPhone|iPod/i.test(ua)) return true;
  if (/iPad/i.test(ua)) return true;
  if (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
    return true;
  return false;
}

/** Chrome on iOS (WebKit; viewport / gesture edge cases differ slightly). */
export function isChromeIOS() {
  if (typeof navigator === "undefined") return false;
  return /CriOS/i.test(navigator.userAgent);
}

/**
 * Public “wide canvas” home / tournament / club pages: `body.sp-home-zoom-layout`
 * so the layout stays desktop-width; users **pinch-zoom** the viewport (see
 * `public/index.html` meta + `apna-shauq-home.css`) to shrink the whole page on
 * phones — same idea as your reference screenshot.
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
