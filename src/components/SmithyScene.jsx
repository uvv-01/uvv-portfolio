import { useEffect, useState, useRef, useCallback } from "react";
import "./smithy.css";
import projects from "../data/projects.js";
import { fetchGithubRepos } from "../utils/github.js";
import strikeSound from "../assets/sounds/sword.mp3";

const FORGE_STEPS = [
  { id: "raw", num: "I", label: "Raw Billet", action: "Stoke the Forge", hint: "Ignite hearth flame to heat the unworked iron" },
  { id: "heating", num: "II", label: "Cherry Heat", action: "First Strike", hint: "Strike the glowing billet upon the anvil" },
  { id: "strike1", num: "III", label: "Draw Steel", action: "Shape Blade", hint: "Strike again to flatten and draw the fuller" },
  { id: "shaping", num: "IV", label: "Bevel & Guard", action: "Quench Blade", hint: "Plunge the incandescent metal into cold water" },
  { id: "quench", num: "V", label: "Water Quench", action: "Polish & Unveil", hint: "Hone edge, fit the pommel, and inspect the weapon" },
  { id: "finish", num: "VI", label: "Master Blade", action: "Strike & Re-forge", hint: "Weapon forged. Project revealed." },
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

  const [sparks, setSparks] = useState(false);
  const [impactFlash, setImpactFlash] = useState(false);
  const [screenJolt, setScreenJolt] = useState(false);
  const [steam, setSteam] = useState(false);
  const [forgedSet, setForgedSet] = useState(() => {
    const p = new URLSearchParams(window.location.search);
    return p.get("forged") === "1" ? new Set([projects[0].id]) : new Set();
  });
  const [liveRepos, setLiveRepos] = useState(null);

  const audioRef = useRef(null);
  const sparkTimerRef = useRef(null);
  const steamTimerRef = useRef(null);

  const project = projects[index];

  // Initialize and clean up strike audio strictly
  useEffect(() => {
    const audio = new Audio(strikeSound);
    audio.volume = 0.55;
    audioRef.current = audio;
    return () => {
      audio.pause();
      audio.currentTime = 0;
      audioRef.current = null;
    };
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

  const selectProject = useCallback(
    (i) => {
      setIndex(i);
      const proj = projects[i];
      if (forgedSet.has(proj.id)) {
        setStage("finish");
        setForged(true);
      } else {
        setStage("raw");
        setForged(false);
      }
    },
    [forgedSet]
  );

  const prevProject = useCallback(() => {
    const next = (index - 1 + projects.length) % projects.length;
    selectProject(next);
  }, [index, selectProject]);

  const nextProject = useCallback(() => {
    const next = (index + 1) % projects.length;
    selectProject(next);
  }, [index, selectProject]);

  // Fetch live repo facts
  useEffect(() => {
    let alive = true;
    fetchGithubRepos().then((repos) => {
      if (alive && repos.length) setLiveRepos(repos);
    });
    return () => {
      alive = false;
    };
  }, []);

  // Interactive forging step trigger
  const handleForgeAction = useCallback(() => {
    if (stage === "raw") {
      // Step 1 -> Heat
      setStage("heating");
    } else if (stage === "heating") {
      // Step 2 -> Strike 1
      playStrike();
      setImpactFlash(true);
      setScreenJolt(true);
      setSparks(true);
      if (sparkTimerRef.current) clearTimeout(sparkTimerRef.current);
      sparkTimerRef.current = setTimeout(() => {
        setSparks(false);
        setImpactFlash(false);
        setScreenJolt(false);
      }, 450);
      setStage("strike1");
    } else if (stage === "strike1") {
      // Step 3 -> Strike 2 (Shaping)
      playStrike();
      setImpactFlash(true);
      setScreenJolt(true);
      setSparks(true);
      if (sparkTimerRef.current) clearTimeout(sparkTimerRef.current);
      sparkTimerRef.current = setTimeout(() => {
        setSparks(false);
        setImpactFlash(false);
        setScreenJolt(false);
      }, 450);
      setStage("shaping");
    } else if (stage === "shaping") {
      // Step 4 -> Quench in water
      setSteam(true);
      if (steamTimerRef.current) clearTimeout(steamTimerRef.current);
      steamTimerRef.current = setTimeout(() => setSteam(false), 800);
      setStage("quench");
    } else if (stage === "quench") {
      // Step 5 -> Polish and unveil finished sword
      setStage("finish");
      setForged(true);
      setForgedSet((prev) => new Set(prev).add(project.id));
    } else if (stage === "finish") {
      // Re-forge the current blade
      setStage("raw");
      setForged(false);
    }
  }, [stage, playStrike, project.id]);

  // Instant skip to blade
  const instantFinish = useCallback(() => {
    setStage("finish");
    setForged(true);
    setForgedSet((prev) => new Set(prev).add(project.id));
  }, [project.id]);

  // Clean timers on unmount
  useEffect(() => {
    return () => {
      if (sparkTimerRef.current) clearTimeout(sparkTimerRef.current);
      if (steamTimerRef.current) clearTimeout(steamTimerRef.current);
    };
  }, []);

  // Keyboard navigation & interaction
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        goBack();
      } else if (e.key === "ArrowRight") {
        nextProject();
      } else if (e.key === "ArrowLeft") {
        prevProject();
      } else if (e.key === " " || e.key === "Enter") {
        // Prevent default space scroll
        if (e.target.tagName !== "BUTTON" && e.target.tagName !== "A") {
          e.preventDefault();
          handleForgeAction();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goBack, handleForgeAction, nextProject, prevProject]);

  const stepObj = FORGE_STEPS.find((s) => s.id === stage) || FORGE_STEPS[0];
  const stepIdx = FORGE_STEPS.findIndex((s) => s.id === stage);
  const live = liveRepos ? liveRepos.find((r) => r.name === project.repo) : null;

  return (
    <div className={`forge-scene ${screenJolt ? "scene-jolt" : ""}`} role="dialog" aria-label="The forge — projects">
      {/* Self-contained Forge Stage */}
      <div className="forge-stage">
        {/* Top Header Bar: Return + Weapon Selector */}
        <header className="forge-nav">
          <button
            type="button"
            className="forge-back-btn"
            onClick={goBack}
            aria-label="Return to workshop chamber"
          >
            &#8592; Chamber
          </button>

          <div className="weapon-rack" role="tablist" aria-label="Weapons of the forge">
            {projects.map((p, i) => (
              <button
                key={p.id}
                type="button"
                role="tab"
                aria-selected={i === index}
                className={`rack-item ${i === index ? "is-selected" : ""} ${
                  forgedSet.has(p.id) ? "is-forged" : ""
                }`}
                onClick={() => selectProject(i)}
                aria-label={`Select weapon: ${p.title} (${p.swordName})`}
                title={`${p.title} — ${p.swordName}`}
              >
                <img src={p.swordImg} alt="" aria-hidden="true" className="rack-sword-thumb" />
                <span className="rack-label">{p.title}</span>
              </button>
            ))}
          </div>
        </header>

        {/* Ambient Forge Hearth & Thermal Glow */}
        <div className={`hearth-glow ${stage !== "raw" ? "is-active" : ""}`} aria-hidden="true" />

        {/* The Central Anvil & Workpiece Area */}
        <div className="anvil-zone">
          {/* Anvil Strike Flash */}
          {impactFlash && <div className="impact-flash" aria-hidden="true" />}

          {/* Spark Shower */}
          {sparks && (
            <div className="anvil-sparks" aria-hidden="true">
              <span className="spark s1" />
              <span className="spark s2" />
              <span className="spark s3" />
              <span className="spark s4" />
              <span className="spark s5" />
              <span className="spark s6" />
              <span className="spark s7" />
              <span className="spark s8" />
              <span className="spark s9" />
              <span className="spark s10" />
            </div>
          )}

          {/* Quenching Steam */}
          {steam && (
            <div className="quench-steam" aria-hidden="true">
              <span className="vapor v1" />
              <span className="vapor v2" />
              <span className="vapor v3" />
            </div>
          )}

          {/* The Workpiece (Metal evolving into sword) */}
          <div className={`workpiece-container stage-${stage}`}>
            {stage === "raw" && (
              <div className="workpiece-billet raw" title="Raw unworked iron billet">
                <span className="billet-core" />
              </div>
            )}

            {stage === "heating" && (
              <div className="workpiece-billet heated" title="Heated incandescent iron">
                <span className="billet-glow" />
                <span className="heat-shimmer" />
              </div>
            )}

            {stage === "strike1" && (
              <div className="workpiece-billet drawn" title="Drawn and flattened blade stock">
                <span className="billet-spine" />
              </div>
            )}

            {stage === "shaping" && (
              <div className="workpiece-billet shaped" title="Shaped weapon with fuller and guard">
                <span className="blade-taper" />
              </div>
            )}

            {stage === "quench" && (
              <div className="workpiece-billet quenched" title="Tempered high-carbon steel">
                <span className="quench-sheen" />
              </div>
            )}

            {stage === "finish" && (
              <div className="workpiece-sword" title={`Finished blade: ${project.swordName}`}>
                <img
                  src={project.swordImg}
                  alt={project.swordName}
                  className="forged-sword-img"
                  draggable="false"
                />
                <div className="sword-aura" aria-hidden="true" />
              </div>
            )}
          </div>

          {/* The Blacksmith's Anvil (Artisan Crafted Silhouette) */}
          <div className="craftsman-anvil" aria-hidden="true">
            <svg viewBox="0 0 340 180" className="anvil-svg">
              <defs>
                <linearGradient id="anvilSteel" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#4a443d" />
                  <stop offset="35%" stopColor="#2b2520" />
                  <stop offset="100%" stopColor="#15120f" />
                </linearGradient>
                <linearGradient id="anvilFace" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#554d42" />
                  <stop offset="50%" stopColor="#8c7d6b" />
                  <stop offset="100%" stopColor="#483f35" />
                </linearGradient>
                <radialGradient id="anvilStump" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#1e1610" />
                  <stop offset="100%" stopColor="#0b0806" />
                </radialGradient>
              </defs>
              {/* Wooden Block Stump */}
              <path d="M 50 135 L 290 135 L 305 180 L 35 180 Z" fill="url(#anvilStump)" stroke="#110d09" strokeWidth="2" />
              <line x1="60" y1="135" x2="48" y2="180" stroke="#2a1f17" strokeWidth="2" opacity="0.6" />
              <line x1="120" y1="135" x2="114" y2="180" stroke="#2a1f17" strokeWidth="2" opacity="0.4" />
              <line x1="220" y1="135" x2="228" y2="180" stroke="#2a1f17" strokeWidth="2" opacity="0.5" />
              {/* Iron Anvil Base Footing */}
              <path d="M 65 135 C 90 120 100 105 110 95 L 230 95 C 240 105 250 120 275 135 Z" fill="url(#anvilSteel)" />
              {/* Anvil Waist & Core */}
              <path d="M 110 95 C 115 75 120 60 122 50 L 218 50 C 220 60 225 75 230 95 Z" fill="url(#anvilSteel)" />
              {/* Left Horn (Conical Horn) */}
              <path d="M 122 50 C 90 48 45 42 20 40 C 45 56 95 64 122 68 Z" fill="url(#anvilSteel)" />
              {/* Right Heel & Cutting Table */}
              <path d="M 218 50 L 300 50 L 310 70 L 225 68 Z" fill="url(#anvilSteel)" />
              {/* Top Face (Hardened Flat Steel) */}
              <polygon points="20,40 300,40 300,50 20,50" fill="url(#anvilFace)" />
              {/* Hardy Hole Detail */}
              <rect x="270" y="43" width="8" height="4" fill="#18130e" rx="1" />
            </svg>
          </div>
        </div>

        {/* Tactical Game Interaction Bar */}
        <div className="forge-controller">
          {/* Progress Markers */}
          <div className="forge-track" aria-label="Forging steps">
            {FORGE_STEPS.map((s, idx) => (
              <div
                key={s.id}
                className={`track-pip ${idx <= stepIdx ? "done" : ""} ${idx === stepIdx ? "active" : ""}`}
                title={`${s.num}. ${s.label}`}
              >
                <span className="pip-num">{s.num}</span>
                <span className="pip-label">{s.label}</span>
              </div>
            ))}
          </div>

          {/* Primary Action Button */}
          <div className="action-row">
            <button
              type="button"
              className={`strike-trigger-btn ${stage === "finish" ? "reforge-mode" : ""}`}
              onClick={handleForgeAction}
              aria-label={stepObj.action}
            >
              <span className="btn-icon" aria-hidden="true">
                {stage === "finish" ? "↻" : "⚔"}
              </span>
              <span className="btn-text">{stepObj.action}</span>
              <span className="key-hint" aria-hidden="true">[Space]</span>
            </button>

            {!forged && (
              <button
                type="button"
                className="skip-blade-btn"
                onClick={instantFinish}
                aria-label="Inspect finished project immediately"
              >
                Inspect Blade &#8594;
              </button>
            )}
          </div>

          <p className="forge-status-hint" aria-live="polite">
            {stepObj.hint}
          </p>
        </div>

        {/* The Project Reward (Dossier unfolds once sword is completed) */}
        {forged && (
          <aside className="project-reward-dossier" aria-label={`Project details for ${project.title}`}>
            <div className="dossier-inner">
              <div className="dossier-header">
                <span className="dossier-badge">FORGED WEAPON {index + 1} OF {projects.length}</span>
                <h1 className="dossier-title">{project.title}</h1>
                <p className="dossier-moniker">&#9876; Blade Identity: <em>{project.swordName}</em></p>
              </div>

              {/* Technologies / Weapon Inscriptions */}
              <div className="dossier-tech-tags" aria-label="Technologies used">
                {project.tech.split("•").map((t, idx) => (
                  <span key={idx} className="tech-tag">
                    {t.trim()}
                  </span>
                ))}
              </div>

              {/* Purpose & Engineering Narrative */}
              <div className="dossier-body">
                <div className="dossier-field">
                  <h3>The Purpose</h3>
                  <p>{project.solution || project.desc}</p>
                </div>

                <div className="dossier-field">
                  <h3>Engineering Contribution</h3>
                  <p>{project.role}</p>
                </div>

                {project.highlights && project.highlights.length > 0 && (
                  <ul className="dossier-highlights">
                    {project.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                )}

                {live && (
                  <p className="dossier-live-stat">
                    &#9679; GitHub Active &bull; Updated {new Date(live.updated_at).toLocaleDateString()}
                  </p>
                )}
              </div>

              {/* Links & Quick Switcher */}
              <div className="dossier-actions">
                <div className="dossier-links">
                  <a href={project.url} target="_blank" rel="noreferrer" className="dossier-btn primary">
                    Repository &#8599;
                  </a>
                  {project.demo && (
                    <a href={project.demo} target="_blank" rel="noreferrer" className="dossier-btn secondary">
                      Live Demo &#8599;
                    </a>
                  )}
                </div>

                <div className="dossier-nav">
                  <button
                    type="button"
                    onClick={prevProject}
                    aria-label="Previous forged work"
                  >
                    &#9664;
                  </button>
                  <span className="nav-index">{index + 1}/{projects.length}</span>
                  <button
                    type="button"
                    onClick={nextProject}
                    aria-label="Next forged work"
                  >
                    &#9654;
                  </button>
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
