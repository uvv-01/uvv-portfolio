import { useState, useEffect, useRef, useCallback } from "react";
import EntryScene from "./components/EntryScene";
import LoadingScene from "./components/LoadingScene";
import RoomLoading from "./components/RoomLoading";
import AboutScene from "./components/AboutScene";
import RoomScene from "./components/RoomScene";
import ContactBook from "./components/ContactBook";
import BadgeWall from "./components/BadgeWall";
import JourneyForge from "./components/JourneyForge";
import SkillsScene from "./components/SkillsScene";
import SwordTransition from "./components/SwordTransition";
import SmithLoading from "./components/SmithLoading";
import SmithyScene from "./components/SmithyScene";
import bgMusic from "./assets/sounds/entry.mp3";
import "./index.css";

const AUDIO_SCENES = ["entry", "about"];

export default function App() {
  const [scene, setScene] = useState("entry");
  const [muted, setMuted] = useState(false);
  const audioRef = useRef(null);

  // One Audio instance for the app's lifetime. Music plays on entry/about;
  // elsewhere it pauses — but never rewinds, so returning resumes the track.
  useEffect(() => {
    const audio = new Audio(bgMusic);
    audio.loop = true;
    audio.volume = 0.4;
    audioRef.current = audio;
    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!muted && AUDIO_SCENES.includes(scene)) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [scene, muted]);

  const go = useCallback((next) => setScene(next), []);

  return (
    <div className="app-root">
      {scene === "entry" && (
        <EntryScene goToAbout={() => go("loading")} goToRoom={() => go("roomLoading")} />
      )}

      {scene === "loading" && <LoadingScene onFinish={() => go("about")} />}

      {scene === "about" && <AboutScene onReturn={() => go("entry")} />}

      {scene === "roomLoading" && <RoomLoading onComplete={() => go("room")} />}

      {scene === "room" && (
        <RoomScene
          goToBook={() => go("book")}
          goToWall={() => go("wall")}
          goToJourney={() => go("journey")}
          goToSkills={() => go("swordTransition")}
          goToSmithy={() => go("smithloading")}
        />
      )}

      {scene === "book" && <ContactBook goBack={() => go("room")} />}

      {scene === "wall" && <BadgeWall goBack={() => go("room")} />}

      {scene === "journey" && <JourneyForge goBack={() => go("room")} />}

      {scene === "swordTransition" && <SwordTransition onComplete={() => go("skills")} />}

      {scene === "skills" && <SkillsScene goBack={() => go("room")} />}

      {scene === "smithloading" && <SmithLoading onComplete={() => go("smithy")} />}

      {scene === "smithy" && <SmithyScene goBack={() => go("room")} />}

      <button
        type="button"
        className={`sound-toggle ${muted ? "is-muted" : ""}`}
        onClick={() => setMuted((m) => !m)}
        aria-label={muted ? "Unmute music" : "Mute music"}
      >
        {muted ? "sound: off" : "sound: on"}
      </button>
    </div>
  );
}
