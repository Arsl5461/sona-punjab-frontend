import React from "react";

/**
 * One stable DOM tree: `.sp-public` is never remounted, only inline styles toggle
 * after the first measurement (avoids marquee / image “blink”).
 */
export function PublicPageFitShell({
  scaledLayoutActive,
  bridgeStyle,
  scaledStyle,
  contentRef,
  children,
}) {
  return (
    <div className="sp-home-fit-outer">
      <div
        className={
          scaledLayoutActive
            ? "sp-home-fit-bridge"
            : "sp-home-fit-bridge sp-home-fit-bridge--flow"
        }
        style={scaledLayoutActive ? bridgeStyle : undefined}
      >
        <div
          ref={contentRef}
          className="sp-public"
          style={scaledLayoutActive ? scaledStyle : undefined}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export function PublicPageFitBar({
  show,
  onFit,
  onReset,
  mode,
  fitScale,
  isMobileFit,
}) {
  if (!show || isMobileFit) return null;
  return (
    <div className="sp-home-fit-bar" role="toolbar" aria-label="Page zoom">
      <button type="button" className="sp-home-fit-bar__btn" onClick={onFit}>
        Fit screen
      </button>
      <button type="button" className="sp-home-fit-bar__btn" onClick={onReset}>
        100%
      </button>
      {mode === "auto" && fitScale < 1 ? (
        <span className="sp-home-fit-bar__label" aria-live="polite">
          {Math.round(fitScale * 100)}% scale
        </span>
      ) : null}
    </div>
  );
}
