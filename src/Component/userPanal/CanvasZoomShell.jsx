import React, { useEffect, useRef } from "react";

/**
 * Fixed-layout public canvas: stable `.sp-public` + bridge sizing for `transform: scale()`.
 * Registers **non-passive** `wheel` / `touchmove` on the stage root so `preventDefault`
 * works for Ctrl+wheel and two-finger pinch (programmatic zoom).
 */
export function CanvasZoomShell({
  transformActive,
  bridgeStyle,
  scaledStyle,
  contentRef,
  contentTransition,
  onWheelCapture,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  onTouchCancel,
  children,
}) {
  const stageRef = useRef(null);

  useEffect(() => {
    const el = stageRef.current;
    if (!el || !onWheelCapture) return undefined;
    const wheel = (e) => onWheelCapture(e);
    el.addEventListener("wheel", wheel, { passive: false });
    return () => el.removeEventListener("wheel", wheel);
  }, [onWheelCapture]);

  useEffect(() => {
    const el = stageRef.current;
    if (!el || !onTouchMove) return undefined;
    const move = (e) => onTouchMove(e);
    el.addEventListener("touchmove", move, { passive: false });
    return () => el.removeEventListener("touchmove", move);
  }, [onTouchMove]);

  return (
    <div
      ref={stageRef}
      className="sp-canvas-zoom-stage"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onTouchCancel={onTouchCancel}
    >
      <div className="sp-canvas-zoom-root">
        <div
          className={
            transformActive
              ? "sp-canvas-zoom-bridge"
              : "sp-canvas-zoom-bridge sp-canvas-zoom-bridge--flow"
          }
          style={transformActive ? bridgeStyle : undefined}
        >
          <div
            ref={contentRef}
            className={`sp-public${
              contentTransition ? " sp-canvas-zoom-content--smooth" : ""
            }`}
            style={transformActive ? scaledStyle : undefined}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Fixed toolbar (outside scaled tree). */
export function CanvasZoomToolbar({
  show,
  onFit,
  onZoomIn,
  onZoomOut,
  scalePct,
}) {
  if (!show) return null;
  return (
    <div className="sp-canvas-zoom-bar" role="toolbar" aria-label="Canvas zoom">
      <button type="button" className="sp-canvas-zoom-bar__btn" onClick={onFit}>
        Fit
      </button>
      <button
        type="button"
        className="sp-canvas-zoom-bar__btn sp-canvas-zoom-bar__btn--icon"
        onClick={onZoomOut}
        aria-label="Zoom out"
      >
        −
      </button>
      <button
        type="button"
        className="sp-canvas-zoom-bar__btn sp-canvas-zoom-bar__btn--icon"
        onClick={onZoomIn}
        aria-label="Zoom in"
      >
        +
      </button>
      <span className="sp-canvas-zoom-bar__label" aria-live="polite">
        {scalePct}%
      </span>
    </div>
  );
}
