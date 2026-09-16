import { useEffect, useState, useRef } from "react";

// frames
import frame1 from "../assets/images/frame1.webp";
import frame2 from "../assets/images/frame2.webp";
import frame3 from "../assets/images/frame3.webp";

// sound
import swordSound from "../assets/sounds/sword.mp3";

const frames = [frame1, frame2, frame3];

export default function LoadingScene({ onFinish }) {
  const [index, setIndex] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    let i = 0;

    // 🎵 create audio once
    audioRef.current = new Audio(swordSound);
    audioRef.current.volume = 0.6;

    const interval = setInterval(() => {
      i++;

      // ⚔️ PLAY SOUND ON IMPACT FRAME (frame2)
      if (i === 1 && audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }

      if (i < frames.length) {
        setIndex(i);
      } else {
        clearInterval(interval);

        setTimeout(() => {
          onFinish();
        }, 600);
      }
    }, 400); // ⏳ slower for better feel

    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <div className="loading-screen">
      <img
        src={frames[index]}
        alt="loading"
        className="frame-img"
      />

      <p className="loading-text">Loading... 100%</p>
    </div>
  );
}