import { useEffect, useRef, useState, useCallback } from "react";
import "./skills.css";
import skills from "../data/skills.js";

const COUNT = skills.length;
const mod = (i) => (i + COUNT) % COUNT;

export default function SkillsScene({ goBack }) {
  const [index, setIndex] = useState(0);
  // 0 = at rest, +1 = forward transition, -1 = backward transition
  const [animating, setAnimating] = useState(0);
  const animatingRef = useRef(false);
  const indexRef = useRef(0);

  const changeIndex = useCallback((delta) => {
    if (delta === 0 || animatingRef.current) return;
    animatingRef.current = true;
    indexRef.current = mod(indexRef.current + delta);
    setAnimating(delta > 0 ? 1 : -1);
    setIndex(indexRef.current);
  }, []);

  // One timer, driven by state. Cannot leak and cannot wedge:
  // even under rapid input every accepted change starts a clean cycle.
  useEffect(() => {
    if (animating === 0) return;
    const t = setTimeout(() => {
      animatingRef.current = false;
      setAnimating(0);
    }, 800);
    return () => clearTimeout(t);
  }, [animating]);

  useEffect(() => {
    const onWheel = (e) => {
      if (Math.abs(e.deltaY) < 8) return;
      changeIndex(e.deltaY > 0 ? 1 : -1);
    };
    const onKey = (e) => {
      if (e.key === "ArrowRight") changeIndex(1);
      else if (e.key === "ArrowLeft") changeIndex(-1);
      else if (e.key === "Escape") goBack();
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
    };
  }, [changeIndex, goBack]);

  const prev = mod(index - 1);
  const next = mod(index + 1);
  const moving = animating !== 0;
  const dir = animating; // 1 = forward (content slides left), -1 = backward

  return (
    <div className={`skills-container ${moving ? "is-animating" : ""}`}>
      <div className="arc-left">
        <button
          type="button"
          className={`sword-slot left ${moving ? (dir > 0 ? "exit-far-left" : "was-center") : ""}`}
          onClick={() => changeIndex(-1)}
          aria-label={`Previous skill: ${skills[prev].name}`}
        >
          <img src={skills[prev].img} alt="" draggable="false" />
        </button>

        <div
          className={`sword-slot center ${moving ? (dir > 0 ? "enter-from-right" : "enter-from-left") : ""}`}
        >
          <img key={index} src={skills[index].img} alt={skills[index].name} draggable="false" />
        </div>

        <button
          type="button"
          className={`sword-slot right ${moving ? (dir > 0 ? "was-center-right" : "exit-far-right") : ""}`}
          onClick={() => changeIndex(1)}
          aria-label={`Next skill: ${skills[next].name}`}
        >
          <img src={skills[next].img} alt="" draggable="false" />
        </button>

        <div className="arc-hint" aria-hidden="true">
          &#9666; scroll / arrows &#9656;
        </div>
      </div>

      <div className="arc-right-panel">
        <div className="skill-text" key={index} role="region" aria-live="polite">
          <p className="skill-eyebrow">
            WEAPON OF CRAFT {index + 1} OF {COUNT} &bull; SKILLS AS WEAPONS
          </p>
          <h1>{skills[index].name}</h1>
          <p className="skill-desc">{skills[index].desc}</p>
          <p className="skill-use">
            <span className="use-label">CRAFT &amp; APPLICATION:</span> {skills[index].use}
          </p>
          <p className="line">{skills[index].line}</p>
          <p className="skill-forge-hint">
            <em>These blades represent tools mastered — carried into the forge to build real systems.</em>
          </p>
        </div>
        <button type="button" className="back-btn" onClick={goBack}>
          &#8592; Return to Chamber
        </button>
      </div>
    </div>
  );
}
