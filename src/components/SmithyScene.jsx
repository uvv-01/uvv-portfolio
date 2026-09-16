import { useEffect, useState, useRef, useCallback } from "react";
import "./smithy.css";
import projects from "../data/projects.js";
import { fetchGithubRepos } from "../utils/github.js";
import swordImg from "../assets/images/sword2.png";
import fireImg from "../assets/images/fire.png";
import anvilImg from "../assets/images/anvil.webp";
import strikeSound from "../assets/sounds/sword.mp3";

const PHASES = [
  { id: "raw", label: "RAW STOCK" },
  { id: "heating", label: "HEATING" },
  { id: "strike1", label: "FIRST STRIKE" },
  { id: "strike2", label: "SECOND STRIKE" },
  { id: "quench", label: "QUENCHING" },
  { id: "finish", label: "FINISHED BLADE" },
];

export default function SmithyScene({ goBack }) {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState("raw");
  const [forged, setForged] = useState(false);
  const [liveRepos, setLiveRepos] = useState(null);
  const timersRef = useRef([]);
  const audioRef = useRef(null);

  // shared strike audio across remounts
  useEffect(() => {
    if (!SmithyScene._audio) {
      SmithyScene._audio = new Audio(strikeSound);
      SmithyScene._audio.volume = 0.5;
    }
    audioRef.current = SmithyScene._audio;
  }, []);

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };

  // forge the current project's sword whenever it changes
  const forge = useCallback(() => {
    clearTimers();
    // reset asynchronously so the effect body never sets state synchronously
    timersRef.current.push(
      setTimeout(() => {
        setForged(false);
        setPhase("raw");
      }, 0)
    );
    const T = [400, 1200, 1900, 2600, 3400, 4200];
    const phases = ["heating", "strike1", "strike2", "quench", "finish"];
    phases.forEach((p, i) => {
      timersRef.current.push(
        setTimeout(() => {
          setPhase(p);
          if (p === "strike1" || p === "strike2") {
            const a = audioRef.current;
            if (a) {
              a.currentTime = 0;
              a.play().catch(() => {});
            }
          }
          if (p === "finish") setForged(true);
        }, T[i])
      );
    });
  }, []);

  // forge on mount and whenever the selected project changes
  useEffect(() => {
    forge();
    return clearTimers;
  }, [index, forge]);

  useEffect(() => {
    let alive = true;
    fetchGithubRepos().then((repos) => {
      if (!alive) return;
      if (repos.length) setLiveRepos(repos);
    });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % projects.length);
      else if (e.key === "ArrowLeft")
        setIndex((i) => (i - 1 + projects.length) % projects.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const project = projects[index];
  const phaseIdx = PHASES.findIndex((p) => p.id === phase);
  const live = liveRepos ? liveRepos.find((r) => r.name === project.repo) : null;

  return (
    <div className="smithy" role="dialog" aria-label="The forge — projects">
      <button type="button" className="smithy-back" onClick={goBack}>
        &#8592; Return
      </button>

      <div className="fire-glow" aria-hidden="true" />
      <img src={fireImg} alt="" aria-hidden="true" className="forge-fire" draggable="false" />

      <div className="forge-stage">
        {/* the anvil */}
        <div className="anvil-wrap" aria-hidden="true">
          <img src={anvilImg} alt="" className="anvil" draggable="false" />
        </div>

        {/* the workpiece */}
        <div className={`workpiece phase-${phase} motif-b${project.motif.blade} motif-g${project.motif.guard}`}>
          <img src={swordImg} alt="" aria-hidden="true" draggable="false" />
        </div>

        {/* forging phase track */}
        <ol className="phase-track" aria-label="Forging progress">
          {PHASES.map((p, i) => (
            <li
              key={p.id}
              className={i < phaseIdx ? "done" : i === phaseIdx ? "now" : ""}
              aria-current={i === phaseIdx ? "step" : undefined}
            >
              {p.label}
            </li>
          ))}
</ol>
      </div>

      {/* project info — revealed as the blade completes */}
      <div className={`forge-info ${forged ? "revealed" : ""}`}>
        <p className="project-eyebrow">
          FORGED WORK {index + 1} / {projects.length}
        </p>
        <h1>{project.title}</h1>
        <p className="project-desc">{project.desc}</p>
        <span className="project-tech">{project.tech}</span>

        {live && (
          <p className="project-live">
            &#9679; live from GitHub — updated{" "}
            {new Date(live.updated_at).toLocaleDateString()}
          </p>
        )}

        {project.highlights.length > 0 && (
          <ul className="project-highlights">
            {project.highlights.map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
        )}

        <div className="project-links">
          <a href={project.url} target="_blank" rel="noreferrer">
            GitHub &#8599;
          </a>
          {project.demo && <a href={project.demo} target="_blank" rel="noreferrer">Live &#8599;</a>}
        </div>

        <div className="controls">
          <button type="button" onClick={() => setIndex((i) => (i - 1 + projects.length) % projects.length)} aria-label="Previous project">
            &#9664;
          </button>
          <span className="project-count" aria-hidden="true">
            {index + 1} / {projects.length}
          </span>
          <button type="button" onClick={() => setIndex((i) => (i + 1) % projects.length)} aria-label="Next project">
            &#9654;
          </button>
        </div>
      </div>
    </div>
  );
}
