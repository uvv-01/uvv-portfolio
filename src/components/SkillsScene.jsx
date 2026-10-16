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

  useEffect(() => {
    if (animating === 0) return;
    const t = setTimeout(() => {
      animatingRef.current = false;
      setAnimating(0);
    }, 600);
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
  const dir = animating;

  const current = skills[index];

  return (
    <main className={`skills-container ${moving ? "is-animating" : ""}`} aria-label="Armory — skills as weapons">
      <div className="arc-left">
        <button
          type="button"
          className={`sword-slot left ${moving ? (dir > 0 ? "exit-far-left" : "was-center") : ""}`}
          onClick={() => changeIndex(-1)}
          aria-label={`Previous weapon: ${skills[prev].name}`}
        >
          <img src={skills[prev].img} alt="" draggable="false" className="armory-blade-img" />
        </button>

        <div
          className={`sword-slot center ${moving ? (dir > 0 ? "enter-from-right" : "enter-from-left") : ""}`}
        >
          <img key={index} src={current.img} alt={current.name} draggable="false" className="armory-blade-img" />
        </div>

        <button
          type="button"
          className={`sword-slot right ${moving ? (dir > 0 ? "was-center-right" : "exit-far-right") : ""}`}
          onClick={() => changeIndex(1)}
          aria-label={`Next weapon: ${skills[next].name}`}
        >
          <img src={skills[next].img} alt="" draggable="false" className="armory-blade-img" />
        </button>

        <div className="arc-hint" aria-hidden="true">
          &#9666; scroll / arrow keys &#9656;
        </div>
      </div>

      <div className="arc-right-panel">
        <article className="skill-text" key={index} role="region" aria-live="polite">
          <p className="skill-eyebrow">
            WEAPON OF CRAFT {index + 1} OF {COUNT} &bull; SKILLS AS WEAPONS
          </p>
          <h1 className="skill-name">{current.name}</h1>
          <p className="skill-desc">{current.desc}</p>

          <p className="skill-use">
            <span className="use-label">CRAFT &amp; APPLICATION:</span> {current.use}
          </p>
          <p className="line">{current.line}</p>

          {/* Direct connection: SKILL -> PROJECT -> EVIDENCE */}
          {current.evidenceProject && (
            <section className="skill-evidence-card" aria-label="Skill application evidence">
              <span className="evidence-badge">EVIDENCE IN WORKSHOP</span>
              <p className="evidence-project">
                Forged into: <strong>{current.evidenceProject}</strong>
              </p>
              <p className="evidence-note">{current.evidenceNote}</p>
              {current.evidenceRepo && (
                <a
                  href={current.evidenceRepo}
                  target="_blank"
                  rel="noreferrer"
                  className="evidence-link"
                >
                  Inspect Source Code &#8599;
                </a>
              )}
            </section>
          )}

          <p className="skill-forge-hint">
            <em>These blades represent tools mastered — carried into the forge to build real systems.</em>
          </p>
        </article>

        <button type="button" className="back-btn" onClick={goBack} aria-label="Return to workshop chamber">
          &#8592; Return to Chamber
        </button>
      </div>
    </main>
  );
}
