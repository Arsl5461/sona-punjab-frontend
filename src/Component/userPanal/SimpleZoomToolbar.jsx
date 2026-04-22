import React from "react";

/** Floating + / − / reset for `useSimpleUiZoom` (no canvas transform). */
export function SimpleZoomToolbar({
  show,
  zoomPercent,
  onZoomIn,
  onZoomOut,
  onReset,
}) {
  if (!show) return null;
  return (
    <div className="sp-simple-zoom-bar" role="toolbar" aria-label="Text zoom">
      <button type="button" className="sp-simple-zoom-bar__btn" onClick={onZoomOut}>
        −
      </button>
      <button type="button" className="sp-simple-zoom-bar__btn" onClick={onZoomIn}>
        +
      </button>
      <button type="button" className="sp-simple-zoom-bar__btn" onClick={onReset}>
        Reset
      </button>
      <span className="sp-simple-zoom-bar__label">{zoomPercent}%</span>
    </div>
  );
}
