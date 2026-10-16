import { useEffect, useState, useCallback, useRef } from "react";
import "./roomLoading.css";

export default function RoomLoading({ onComplete }) {
  const [showContent, setShowContent] = useState(false);
  const doneRef = useRef(false);

  const enter = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    if (onComplete) onComplete();
  }, [onComplete]);

  useEffect(() => {
    const t1 = setTimeout(() => setShowContent(true), 400);
    const t2 = setTimeout(enter, 2800);

    const onKey = (e) => {
      if (e.key === "Enter" || e.key === " " || e.key === "Escape") enter();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener("keydown", onKey);
    };
  }, [enter]);

  return (
    <div
      className="forge-gate-bg"
      onClick={enter}
      role="presentation"
    >
      <div className="forge-embers" aria-hidden="true">
        <span /><span /><span /><span /><span /><span /><span />
      </div>

      <div className="gate-glow" aria-hidden="true" />

      {showContent && (
        <div className="gate-content">
          <p className="gate-eyebrow" aria-hidden="true">&#9876; THE BLACKSMITH'S CHAMBER &#9876;</p>
          <h1 className="gate-title">UNSEALING THE FORGE</h1>
          <p className="gate-sub">The fire awakens. Old iron remembers every strike.</p>

          <div className="gate-plate">
            <span className="gate-rune" aria-hidden="true">&#5799;</span>
            <div className="gate-meta">
              <span className="meta-label">WORKSHOP STATUS</span>
              <span className="meta-value">EMBERS LIT &bull; WEAPONS MOUNTED</span>
            </div>
          </div>

          <button
            type="button"
            className="gate-skip-btn"
            onClick={(e) => {
              e.stopPropagation();
              enter();
            }}
            aria-label="Enter the workshop immediately"
          >
            Step Inside &#8594;
          </button>
        </div>
      )}

      <div className="gate-vignette" aria-hidden="true" />
    </div>
  );
}