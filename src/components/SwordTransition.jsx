import { useEffect, useState, useRef, useCallback } from "react";
import "./SwordTransition.css";
import swordImg from "../assets/images/sword1.png";

export default function SwordTransition({ onComplete }) {
  const [showSword, setShowSword] = useState(false);
  const [showText, setShowText] = useState(false);
  const doneRef = useRef(false);

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    const t1 = setTimeout(() => setShowSword(true), 500);
    const t2 = setTimeout(() => setShowText(true), 1800);
    const t3 = setTimeout(finish, 6000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [finish]);

  return (
    <div
      className="transition-bg"
      onClick={finish}
      role="presentation"
    >
      {showSword && (
        <img src={swordImg} alt="" className="sword-center" draggable="false" />
      )}

      {showText && (
        <div className="dialogue">
          <p>Beyond these gates lies the weight of everything I have built.</p>
          <p className="fade-line">Step forward&#8230; and choose your weapon.</p>
        </div>
      )}

      <div className="transition-hint" aria-hidden="true">
        click to continue
      </div>
    </div>
  );
}
