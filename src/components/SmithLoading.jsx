import { useEffect, useState, useCallback, useRef } from "react";
import "./smithloading.css";

import smithBg from "../assets/images/smithy-bg.webp";
import hammer1 from "../assets/images/hammer1.webp";
import hammer2 from "../assets/images/hammer2.webp";
import hammer3 from "../assets/images/hammer3.webp";

// beat sheet (ms) — forge reveal -> hammer 1 -> hammer 2 -> strike -> flash -> quote -> advance
const T = {
  forge: 900,
  hammer1: 1400,
  hammer2: 2300,
  strike: 3000,
  flash: 3100,
  quote: 3600,
  advance: 5600,
};

export default function SmithLoading({ onComplete }) {
  const [stage, setStage] = useState(0); // 0 forge, 1-3 hammer frames, 4 flash/quote
  const doneRef = useRef(false);
  const timersRef = useRef([]);

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    timersRef.current = [
      setTimeout(() => setStage(1), T.forge),
      setTimeout(() => setStage(2), T.hammer1),
      setTimeout(() => setStage(3), T.hammer2),
      setTimeout(() => setStage(4), T.strike),
      setTimeout(finish, T.advance),
    ];
    return () => timersRef.current.forEach(clearTimeout);
  }, [finish]);

  const skip = useCallback(() => finish(), [finish]);

  return (
    <div
      className={`smith-loading ${stage >= 4 ? "struck" : ""}`}
      onClick={skip}
      role="presentation"
    >
      <img
        src={smithBg}
        alt=""
        aria-hidden="true"
        className="forge-image"
        draggable="false"
      />
      <div className="dark-layer" />

      <div className="hammer-zone" aria-hidden="true">
        {stage >= 1 && stage < 4 && (
          <img
            key={stage}
            src={stage === 1 ? hammer1 : stage === 2 ? hammer2 : hammer3}
            alt=""
            className={`hammer-frame ${stage === 3 ? "strike" : ""}`}
            draggable="false"
          />
        )}
      </div>

      <div className={`flash ${stage >= 4 ? "show" : ""}`} aria-hidden="true" />

      <div className={`forge-quote ${stage >= 4 ? "reveal-text" : ""}`}>
        <h1>THE FORGE AWAKENS</h1>
        <p>All steel begins as raw metal.</p>
        <p>Only through fire, pressure and countless strikes does it become a weapon.</p>
        <p className="forge-quote-last">
          Not all weapons are forged from steel.
          <br />
          Some are forged from code.
        </p>
      </div>

      <button type="button" className="skip-btn" onClick={skip}>
        skip
      </button>
    </div>
  );
}
