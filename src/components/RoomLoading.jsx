import { useEffect, useState } from "react";
import "./roomLoading.css";

export default function RoomLoading({ onComplete }) {
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => {
      setShowText(true);
    }, 800);

    const t2 = setTimeout(() => {
      if (onComplete) onComplete();
    }, 5000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onComplete]);

  return (
    <div className="glitch-bg">
      <div className="noise"></div>
      <div className="scanlines"></div>

      {showText && (
        <div className="glitch-wrapper">
          <div className="glitch-title" data-text="FORBIDDEN ROOM DETECTED">
            FORBIDDEN ROOM DETECTED
          </div>

          <div className="glitch-sub" data-text="BOUND BY OLD OATHS">
            BOUND BY OLD OATHS
          </div>

          <div className="glitch-sub" data-text="THE AIR BREAKS APART">
            THE AIR BREAKS APART
          </div>

          <div className="status-box">
            <p>SEAL: <span className="danger">BROKEN</span></p>
            <p>ROOM STATE: <span className="warn">UNSTABLE</span></p>
            <p>ENTRY: <span className="ok">FORCED</span></p>
          </div>
        </div>
      )}

      <div className="flash"></div>
      <div className="vignette"></div>
    </div>
  );
}