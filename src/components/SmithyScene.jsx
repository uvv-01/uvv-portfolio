import { useEffect, useState, useRef, useCallback } from "react";
import "./smithy.css";
import projects from "../data/projects.js";
import anvilImg from "../assets/images/anvil.webp";

export default function SmithyScene({ goBack }) {
  const [index, setIndex] = useState(0);
  // 0 = rest, +1 = next (slide left), -1 = prev (slide right)
  const [direction, setDirection] = useState(0);
  const timerRef = useRef(null);

  const step = useCallback((delta) => {
    setDirection(delta);
    setIndex((prev) => (prev + delta + projects.length) % projects.length);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setDirection(0), 480);
  }, []);

  const nextProject = useCallback(() => step(1), [step]);
  const prevProject = useCallback(() => step(-1), [step]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("keydown", handler);
      clearTimeout(timerRef.current);
    };
  }, [step]);

  const project = projects[index];
  const dirClass =
    direction > 0 ? "dir-next" : direction < 0 ? "dir-prev" : "dir-rest";

  return (
    <div className="smithy">
      <button type="button" className="smithy-back" onClick={goBack}>
        &#8592; Return
      </button>

      <div className="fire-glow" aria-hidden="true" />

      <div className="anvil-wrapper">
        <img
          src={anvilImg}
          alt=""
          aria-hidden="true"
          className="anvil"
          draggable="false"
        />

        <div className={`project-card ${dirClass}`} key={index}>
          <p className="project-eyebrow">
            FORGED WORK {index + 1} / {projects.length}
          </p>
          <h1>{project.title}</h1>
          <p>{project.desc}</p>
          <span>{project.tech}</span>

          <div className="controls">
            <button
              type="button"
              onClick={prevProject}
              aria-label="Previous project"
            >
              &#9664;
            </button>
            <span className="project-count" aria-hidden="true">
              {index + 1} / {projects.length}
            </span>
            <button
              type="button"
              onClick={nextProject}
              aria-label="Next project"
            >
              &#9654;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
