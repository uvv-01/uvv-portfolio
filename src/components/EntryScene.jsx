import { useRef, useEffect, useState, useCallback } from "react";
import "./EntryScene.css";
import bladeImg from "../assets/images/sword1.png";

export default function EntryScene({ goToAbout, goToRoom }) {
  const [isEntering, setIsEntering] = useState(false);
  const [isWiping, setIsWiping] = useState(false);
  const timerRef = useRef(null);
  const wipeTimerRef = useRef(null);

  // Approach the blade and enter through its reflective steel surface
  const handleEnterWorkshop = useCallback(() => {
    if (isEntering) return;
    setIsEntering(true);

    // After camera scales into the steel, trigger the darkness wipe
    wipeTimerRef.current = setTimeout(() => {
      setIsWiping(true);
    }, 700);

    // Complete the transition into the workshop chamber
    timerRef.current = setTimeout(() => {
      goToRoom();
    }, 1300);
  }, [isEntering, goToRoom]);

  // Clean timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (wipeTimerRef.current) clearTimeout(wipeTimerRef.current);
    };
  }, []);

  // Keyboard support: Space / Enter to enter workshop
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Enter" || e.key === " ") {
        if (e.target.tagName !== "BUTTON") {
          e.preventDefault();
          handleEnterWorkshop();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleEnterWorkshop]);

  return (
    <main className="entry-universe" aria-label="Entrance: Darkness before revelation">
      {/* Environmental depths: deep soot vignette & subtle hearth warmth */}
      <div className="entry-hearth-dust" aria-hidden="true" />
      <div className="entry-vignette" aria-hidden="true" />
      <div className={`entry-darkness-wipe ${isWiping ? "is-wiping" : ""}`} aria-hidden="true" />

      {/* The Central Sword Focal Stage */}
      <div className={`entry-blade-stage ${isEntering ? "is-entering" : ""}`}>
        <div
          className="entry-blade-wrapper"
          onClick={handleEnterWorkshop}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleEnterWorkshop();
            }
          }}
          aria-label="Approach the blade — enter the blacksmith workshop"
        >
          <img
            src={bladeImg}
            alt="Worn dark steel broadsword in low workshop light"
            className="entry-blade-img"
            draggable="false"
          />
          {/* Raking specular light gliding down the blade edge */}
          <div className="blade-glint-sweep" aria-hidden="true" />
          <div className="steel-reflection-pass" aria-hidden="true" />
        </div>
      </div>

      {/* Understated narrative controls */}
      <nav className="entry-narrative" aria-label="Workshop entry navigation">
        <h1 className="entry-presence-title">The Craftsman&apos;s Blade</h1>
        <p className="entry-presence-sub">Near darkness before the forge awakens</p>

        <div className="entry-actions">
          <button
            type="button"
            className="entry-enter-btn"
            onClick={handleEnterWorkshop}
            aria-label="Enter the workshop chamber"
          >
            Enter the Workshop &#8594;
          </button>

          {goToAbout && (
            <button
              type="button"
              className="entry-chronicle-btn"
              onClick={goToAbout}
              aria-label="Inspect the developer's chronicle"
            >
              The Chronicle
            </button>
          )}
        </div>
      </nav>
    </main>
  );
}
