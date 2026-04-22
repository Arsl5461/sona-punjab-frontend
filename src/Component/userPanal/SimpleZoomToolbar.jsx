import React from "react";

/** Floating − / + / Fit / Reset for `useSimpleUiZoom`. */
export function SimpleZoomToolbar({
  show,
  zoomPercent,
  onZoomIn,
  onZoomOut,
  onFit,
  onReset,
}) {
  if (!show) return null;
  return (
    <div className="sp-simple-zoom-bar" role="toolbar" aria-label="Page zoom">
      <button type="button" className="sp-simple-zoom-bar__btn" onClick={onZoomOut}>
        −
      </button>
      <button type="button" className="sp-simple-zoom-bar__btn" onClick={onZoomIn}>
        +
      </button>
      {onFit ? (
        <button type="button" className="sp-simple-zoom-bar__btn" onClick={onFit}>
          Fit
        </button>
      ) : null}
      <button type="button" className="sp-simple-zoom-bar__btn" onClick={onReset}>
        Reset
      </button>
      <span className="sp-simple-zoom-bar__label">{zoomPercent}%</span>
    </div>
  );
}
