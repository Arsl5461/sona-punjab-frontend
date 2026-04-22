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

/** Matches Bootstrap `md` — phones / small tablets only (not laptops). */
const WIDE_CANVAS_MEDIA = "(max-width: 991.98px)";

function clearZoomLayout(html) {
  document.body.classList.remove("sp-home-zoom-layout");
  html.classList.remove("sp-ios-touch", "sp-ios-chrome");
}

function applyZoomLayout(html) {
  document.body.classList.add("sp-home-zoom-layout");
  const ios = isAppleTouchDevice();
  if (ios) html.classList.add("sp-ios-touch");
  else html.classList.remove("sp-ios-touch");
  if (ios && isChromeIOS()) html.classList.add("sp-ios-chrome");
  else html.classList.remove("sp-ios-chrome");
}

/**
 * On **narrow viewports only** (≤992px): `body.sp-home-zoom-layout` matches the
 * alsadatdhunni.com pattern — ~1050px-wide canvas + native pinch-zoom, with
 * horizontal scroll on table wrappers (see `apna-shauq-home.css`).
 *
 * On **laptops / wide browsers**: the class is **not** applied — fluid layout
 * without forced min-width.
 */
export function usePublicZoomLayout() {
  useEffect(() => {
    const html = document.documentElement;
    const mq = window.matchMedia(WIDE_CANVAS_MEDIA);

    const sync = () => {
      if (mq.matches) applyZoomLayout(html);
      else clearZoomLayout(html);
    };

    sync();
    mq.addEventListener("change", sync);
    window.addEventListener("orientationchange", sync);

    return () => {
      mq.removeEventListener("change", sync);
      window.removeEventListener("orientationchange", sync);
      clearZoomLayout(html);
    };
  }, []);
}
