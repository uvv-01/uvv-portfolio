import { useRef, useEffect, useState, useCallback } from "react";
import entryImg from "../assets/images/entry.jpeg";

export default function EntryScene({ goToAbout, goToRoom }) {
  const [zoom, setZoom] = useState(false);
  const timerRef = useRef(null);

  const enter = useCallback((destination) => {
    if (timerRef.current) return; // ignore double-activation during zoom
    setZoom(true);
    timerRef.current = setTimeout(() => destination(), 1000);
  }, []);

  const handleCharacterClick = useCallback(() => enter(goToAbout), [enter, goToAbout]);
  const handleSwordClick = useCallback(() => enter(goToRoom), [enter, goToRoom]);

  // clear the zoom-out timer if the scene unmounts mid-transition
  useEffect(() => () => clearTimeout(timerRef.current), []);

  return (
    <div
      style={{
        width: "100%",
        height: "100dvh",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <img
        src={entryImg}
        alt="A lone warrior standing before a giant sword"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transition: "transform 1s ease-in-out",
          transform: zoom ? "scale(1.4)" : "scale(1)",
        }}
      />

      <button
        type="button"
        onClick={handleCharacterClick}
        aria-label="Enter about — Yuvraj Singh"
        className="entry-hotspot warrior-hotspot"
        style={{
          position: "absolute",
          top: "8%",
          left: "50%",
          width: "28%",
          height: "46%",
          cursor: "pointer",
          zIndex: 10,
          background: "transparent",
          border: "none",
          padding: 0,
        }}
      >
        <span className="entry-tooltip" aria-hidden="true">
          THE WARRIOR
          <small>about yuvraj</small>
        </span>
      </button>

      <button
        type="button"
        onClick={handleSwordClick}
        aria-label="Enter the workshop — forged weapons"
        className="entry-hotspot sword-hotspot"
        style={{
          position: "absolute",
          top: "44%",
          left: "24%",
          width: "32%",
          height: "50%",
          cursor: "pointer",
          zIndex: 10,
          background: "transparent",
          border: "none",
          padding: 0,
        }}
      >
        <span className="entry-tooltip" aria-hidden="true">
          THE DRAGONSLAYER
          <small>enter the workshop</small>
        </span>
      </button>

      <div
        style={{
          position: "absolute",
          bottom: "32px",
          width: "100%",
          textAlign: "center",
          color: "rgba(255, 244, 224, 0.85)",
          letterSpacing: "2px",
          fontSize: "13px",
          pointerEvents: "none",
          zIndex: 15,
          textShadow: "0 2px 8px rgba(0,0,0,0.8)",
        }}
      >
        Select the <strong>Warrior</strong> to learn about Yuvraj, or the <strong>Sword</strong> to enter the Forge
      </div>
    </div>
  );
}
