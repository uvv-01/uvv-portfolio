import { useEffect, useState, useRef, useCallback } from "react";
import "./smithy.css";
import projects from "../data/projects.js";
import { fetchGithubRepos } from "../utils/github.js";
import fireImg from "../assets/images/fire.webp";
import hammer1 from "../assets/images/hammer1.webp";
import hammer2 from "../assets/images/hammer2.webp";
import hammer3 from "../assets/images/hammer3.webp";
import strikeSound from "../assets/sounds/sword.mp3";

const STAGES = [
  { id: "raw", label: "I. RAW STOCK", desc: "Unworked iron ingot on the anvil" },
  { id: "heating", label: "II. HEATING", desc: "Drawn into the fire, glowing cherry red" },
  { id: "strike1", label: "III. FIRST STRIKE", desc: "Blacksmith strikes the heated stock" },
  { id: "shaping", label: "IV. SHAPING", desc: "Metal yields under pressure into blade form" },
  { id: "quench", label: "V. QUENCHING", desc: "Hardened in cold water, steam hisses" },
  { id: "polish", label: "VI. POLISHING", desc: "Honing edge, guard and pommel set" },
  { id: "finish", label: "VII. REVEAL", desc: "Finished blade presented" },
];

export default function SmithyScene({ goBack }) {
  const [index, setIndex] = useState(() => {
    const p = new URLSearchParams(window.location.search);
    const i = parseInt(p.get("proj") || "0", 10);
    return isNaN(i) ? 0 : Math.max(0, Math.min(i, projects.length - 1));
  });
  const [stage, setStage] = useState(() => {
    const p = new URLSearchParams(window.location.search);
    return p.get("forged") === "1" ? "finish" : "raw";
  });
  const [forged, setForged] = useState(() => {
    const p = new URLSearchParams(window.location.search);
    return p.get("forged") === "1";
  });
  const [hammerActive, setHammerActive] = useState(null); // null | 1 | 2 | 3
  const [sparks, setSparks] = useState(false);
  const [forgedSet, setForgedSet] = useState(() => {
    const p = new URLSearchParams(window.location.search);
    return p.get("forged") === "1" ? new Set([projects[0].id]) : new Set();
  });
  const [liveRepos, setLiveRepos] = useState(null);
  const timersRef = useRef([]);
  const audioRef = useRef(null);

  const project = projects[index];

  // Persistent strike sound
  useEffect(() => {
    if (!SmithyScene._audio) {
      SmithyScene._audio = new Audio(strikeSound);
      SmithyScene._audio.volume = 0.55;
    }
    audioRef.current = SmithyScene._audio;
  }, []);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  const playStrike = useCallback(() => {
    const a = audioRef.current;
    if (a) {
      try {
        a.currentTime = 0;
        a.play().catch(() => {});
      } catch (err) {
        void err;
      }
    }
  }, []);

  // Complete 7-stage forging sequence
  const startForging = useCallback(() => {
    clearTimers();
    // reset asynchronously so effect body never calls setState synchronously
    timersRef.current.push(
      setTimeout(() => {
        setForged(false);
        setStage("raw");
        setHammerActive(null);
        setSparks(false);
      }, 0)
    );

    // 500ms: heating
    timersRef.current.push(
      setTimeout(() => {
        setStage("heating");
      }, 500)
    );

    // 1200ms: hammer descends for strike 1
    timersRef.current.push(
      setTimeout(() => {
        setHammerActive(1);
      }, 1200)
    );
    timersRef.current.push(
      setTimeout(() => {
        setHammerActive(2);
      }, 1450)
    );
    timersRef.current.push(
      setTimeout(() => {
        setHammerActive(3);
        setStage("strike1");
        setSparks(true);
        playStrike();
      }, 1700)
    );
    timersRef.current.push(
      setTimeout(() => {
        setHammerActive(null);
        setSparks(false);
      }, 2050)
    );

    // 2250ms: second strike + shaping
    timersRef.current.push(
      setTimeout(() => {
        setHammerActive(2);
      }, 2250)
    );
    timersRef.current.push(
      setTimeout(() => {
        setHammerActive(3);
        setStage("shaping");
        setSparks(true);
        playStrike();
      }, 2500)
    );
    timersRef.current.push(
      setTimeout(() => {
        setHammerActive(null);
        setSparks(false);
      }, 2850)
    );

    // 3100ms: quenching
    timersRef.current.push(
      setTimeout(() => {
        setStage("quench");
      }, 3100)
    );

    // 3700ms: polishing
    timersRef.current.push(
      setTimeout(() => {
        setStage("polish");
      }, 3700)
    );

    // 4300ms: finish and reveal
    timersRef.current.push(
      setTimeout(() => {
        setStage("finish");
        setForged(true);
        setForgedSet((prev) => new Set(prev).add(project.id));
      }, 4300)
    );
  }, [clearTimers, playStrike, project.id]);

  // Instant skip to reveal
  const instantFinish = useCallback(() => {
    clearTimers();
    setHammerActive(null);
    setSparks(false);
    setStage("finish");
    setForged(true);
    setForgedSet((prev) => new Set(prev).add(project.id));
  }, [clearTimers, project.id]);

  // When changing projects: if already forged in this session, show immediately; else forge
  useEffect(() => {
    let t = null;
    if (forgedSet.has(project.id)) {
      t = setTimeout(() => {
        setStage("finish");
        setForged(true);
        setHammerActive(null);
        setSparks(false);
      }, 0);
    } else {
      startForging();
    }
    return () => {
      if (t) clearTimeout(t);
      clearTimers();
    };
  }, [index, forgedSet, project.id, startForging, clearTimers]);

  // Live GitHub repositories query
  useEffect(() => {
    let alive = true;
    fetchGithubRepos().then((repos) => {
      if (alive && repos.length) setLiveRepos(repos);
    });
    return () => {
      alive = false;
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") {
        setIndex((i) => (i + 1) % projects.length);
      } else if (e.key === "ArrowLeft") {
        setIndex((i) => (i - 1 + projects.length) % projects.length);
      } else if (e.key === "Escape") {
        goBack();
      } else if (e.key === " " && !forged) {
        e.preventDefault();
        instantFinish();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [forged, goBack, instantFinish]);

  const stageIdx = STAGES.findIndex((s) => s.id === stage);
  const live = liveRepos ? liveRepos.find((r) => r.name === project.repo) : null;

  return (
    <div className="smithy" role="dialog" aria-label="The forge — projects">
      <button
        type="button"
        className="smithy-back"
        onClick={goBack}
        aria-label="Return to workshop chamber"
      >
        &#8592; Return to Chamber
      </button>

      {/* WEAPON RACK / SELECTOR AT TOP */}
      <nav className="weapon-rack" aria-label="Forged weapon rack">
        <span className="rack-title" aria-hidden="true">WEAPONS OF THE FORGE:</span>
        <div className="rack-swords">
          {projects.map((p, i) => (
            <button
              key={p.id}
              type="button"
              className={`rack-item ${i === index ? "is-selected" : ""} ${
                forgedSet.has(p.id) ? "is-forged" : ""
              }`}
              onClick={() => setIndex(i)}
              aria-label={`Inspect ${p.title} (${p.swordName})`}
              title={`${p.title} — ${p.swordName}`}
            >
              <img src={p.swordImg} alt="" aria-hidden="true" className="rack-sword-thumb" />
              <span className="rack-label">{p.title}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* AMBIENT FIRE & GLOW */}
      <div className="fire-glow" aria-hidden="true" />
      <img src={fireImg} alt="" aria-hidden="true" className="forge-fire" draggable="false" />

      {/* CENTRAL FORGE STAGE */}
      <div className="forge-stage">
        {/* HAMMER FRAME (when swinging) */}
        {hammerActive && (
          <div className="blacksmith-hammer-wrap" aria-hidden="true">
            <img
              src={hammerActive === 1 ? hammer1 : hammerActive === 2 ? hammer2 : hammer3}
              alt=""
              className={`blacksmith-hammer hammer-strike-${hammerActive}`}
              draggable="false"
            />
          </div>
        )}

        {/* SPARKS BURST ON IMPACT */}
        {sparks && (
          <div className="anvil-sparks" aria-hidden="true">
            <span /><span /><span /><span /><span /><span />
          </div>
        )}

        {/* THE WORKPIECE (rests and shapes directly on the forge anvil) */}

        {/* THE WORKPIECE (dedicated sword for each project) */}
        <div className={`workpiece stage-${stage} ${sparks ? "impact-jolt" : ""}`}>
          <img
            src={project.swordImg}
            alt={project.swordName}
            className="workpiece-img"
            draggable="false"
          />
        </div>

        {/* FORGING STAGE PROGRESS TRACK */}
        <ol className="stage-track" aria-label="Forging stages">
          {STAGES.map((s, i) => (
            <li
              key={s.id}
              className={i < stageIdx ? "done" : i === stageIdx ? "current" : ""}
              aria-current={i === stageIdx ? "step" : undefined}
            >
              <span className="stage-step-num">{i + 1}</span>
              <span className="stage-step-label">{s.label.split(". ")[1]}</span>
            </li>
          ))}
        </ol>

        {/* FAST ACTION: SKIP / RE-FORGE */}
        <div className="stage-quick-actions">
          {!forged ? (
            <button
              type="button"
              className="quick-forge-btn"
              onClick={instantFinish}
              aria-label="Skip forging animation and inspect sword immediately"
            >
              Skip to Blade &#8594;
            </button>
          ) : (
            <button
              type="button"
              className="quick-forge-btn reforge"
              onClick={startForging}
              aria-label="Strike and re-forge this weapon"
            >
              &#8635; Strike &amp; Re-forge
            </button>
          )}
        </div>
      </div>

      {/* PROJECT INFORMATION PANEL — REVEALED AS BLADE COMPLETES */}
      <div className={`forge-info ${forged ? "revealed" : ""}`} role="region" aria-label="Project details">
        <div className="forge-info-inner">
          <div className="info-header">
            <p className="project-eyebrow">
              FORGED WORK {index + 1} OF {projects.length} &bull; {project.status}
            </p>
            <h1 className="project-title">{project.title}</h1>
            <p className="project-weapon-name">&#9876; Blade Identity: <em>{project.swordName}</em></p>
          </div>

          <div className="project-tech-tags">
            {project.tech.split("•").map((t, idx) => (
              <span key={idx} className="tech-chip">
                {t.trim()}
              </span>
            ))}
          </div>

          <div className="info-sections">
            <div className="info-block">
              <h3>The Challenge</h3>
              <p>{project.problem}</p>
            </div>

            <div className="info-block">
              <h3>The Craft &amp; Solution</h3>
              <p>{project.solution}</p>
            </div>

            <div className="info-block">
              <h3>Yuvraj&apos;s Contribution</h3>
              <p>{project.role}</p>
            </div>
          </div>

          {project.highlights && project.highlights.length > 0 && (
            <ul className="project-highlights">
              {project.highlights.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          )}

          {live && (
            <p className="project-live">
              &#9679; GitHub Active &bull; Last updated {new Date(live.updated_at).toLocaleDateString()}
            </p>
          )}

          <div className="project-footer">
            <div className="project-links">
              <a href={project.url} target="_blank" rel="noreferrer" className="btn-link repo">
                View Repository &#8599;
              </a>
              {project.demo && (
                <a href={project.demo} target="_blank" rel="noreferrer" className="btn-link live">
                  Open Live Demo &#8599;
                </a>
              )}
            </div>

            <div className="project-pager">
              <button
                type="button"
                onClick={() => setIndex((i) => (i - 1 + projects.length) % projects.length)}
                aria-label="Previous forged work"
              >
                &#9664; Prev
              </button>
              <span className="pager-count" aria-hidden="true">
                {index + 1} / {projects.length}
              </span>
              <button
                type="button"
                onClick={() => setIndex((i) => (i + 1) % projects.length)}
                aria-label="Next forged work"
              >
                Next &#9654;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
