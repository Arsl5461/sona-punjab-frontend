import React from "react";

export function PublicPageFitShell({
  needsScaleBridge,
  bridgeStyle,
  scaledStyle,
  contentRef,
  children,
}) {
  if (needsScaleBridge) {
    return (
      <div className="sp-home-fit-outer">
        <div className="sp-home-fit-bridge" style={bridgeStyle}>
          <div ref={contentRef} className="sp-public" style={scaledStyle}>
            {children}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div ref={contentRef} className="sp-public">
      {children}
    </div>
  );
}

export function PublicPageFitBar({ show, onFit, onReset, mode, fitScale }) {
  if (!show) return null;
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
