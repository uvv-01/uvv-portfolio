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
        aria-label="Enter about"
        style={{
          position: "absolute",
          top: "15%",
          left: "56%",
          width: "180px",
          height: "230px",
          cursor: "pointer",
          zIndex: 10,
          background: "transparent",
          border: "none",
          padding: 0,
        }}
      />

      <button
        type="button"
        onClick={handleSwordClick}
        aria-label="Enter the world"
        style={{
          position: "absolute",
          top: "50%",
          left: "40%",
          width: "120px",
          height: "250px",
          cursor: "pointer",
          zIndex: 10,
          background: "transparent",
          border: "none",
          padding: 0,
        }}
      />

      <div
        style={{
          position: "absolute",
          bottom: "40px",
          width: "100%",
          textAlign: "center",
          color: "white",
          opacity: 0.8,
          letterSpacing: "1px",
          fontSize: "14px",
        }}
      >
        Click the warrior or the sword
      </div>
    </div>
  );
}
