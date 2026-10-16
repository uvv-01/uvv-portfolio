import { useEffect, useState, useRef, useCallback } from "react";
import "./smithy.css";
import projects from "../data/projects.js";
import { fetchGithubRepos } from "../utils/github.js";
import strikeSound from "../assets/sounds/sword.mp3";
import smithyBg from "../assets/images/smithy-bg.webp";

// 7 Realistic physical swordsmithing stages
const FORGE_STEPS = [
  { id: "heat", num: "I", label: "Hearth Heat", action: "Stoke Hearth", hint: "Steel billet heats in the charcoal hearth coals" },
  { id: "position", num: "II", label: "Mount on Anvil", action: "Position Bar", hint: "Glowing billet rests securely upon the hardened anvil face" },
  { id: "strike", num: "III", label: "Draw Steel", action: "Strike Steel", hint: "Hammer falls squarely on incandescent metal to flatten billet" },
  { id: "shape", num: "IV", label: "Fuller & Bevel", action: "Shape Fuller", hint: "Second blow draws the central fuller and bevels the cutting edge" },
  { id: "quench", num: "V", label: "Water Quench", action: "Quench Blade", hint: "Incandescent steel is plunged into cold water with a hiss of steam" },
  { id: "hone", num: "VI", label: "Whetstone Hone", action: "Hone Edge", hint: "Fine whetstone removes forge scale and hones the sharp cutting edge" },
  { id: "reveal", num: "VII", label: "Master Blade", action: "Inspect Project", hint: "Weapon forged. Project engineering dossier revealed." },
];

export default function SmithyScene({ goBack }) {
  const [index, setIndex] = useState(() => {
    const p = new URLSearchParams(window.location.search);
    const i = parseInt(p.get("proj") || "0", 10);
    return isNaN(i) ? 0 : Math.max(0, Math.min(i, projects.length - 1));
  });

  const [stage, setStage] = useState(() => {
    const p = new URLSearchParams(window.location.search);
    return p.get("forged") === "1" ? "reveal" : "heat";
  });

  const [forged, setForged] = useState(() => {
    const p = new URLSearchParams(window.location.search);
    return p.get("forged") === "1";
  });

  const [hammerSwinging, setHammerSwinging] = useState(false);
  const [sparks, setSparks] = useState(false);
  const [anvilJolt, setAnvilJolt] = useState(false);
  const [steam, setSteam] = useState(false);
  const [forgedSet, setForgedSet] = useState(() => {
    const p = new URLSearchParams(window.location.search);
    return p.get("forged") === "1" ? new Set([projects[0].id]) : new Set();
  });
  const [liveRepos, setLiveRepos] = useState(null);

  const audioRef = useRef(null);
  const actionTimerRef = useRef(null);

  const project = projects[index];

  // Initialize and clean up strike audio strictly
  useEffect(() => {
    const audio = new Audio(strikeSound);
    audio.volume = 0.5;
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
        setStage("reveal");
        setForged(true);
      } else {
        setStage("heat");
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

  // Physical forging step trigger
  const handleForgeAction = useCallback(() => {
    if (stage === "heat") {
      // Stage 1 -> Stage 2: Move heated bar from coals to anvil face
      setStage("position");
    } else if (stage === "position") {
      // Stage 2 -> Stage 3: Primary strike
      setHammerSwinging(true);
      if (actionTimerRef.current) clearTimeout(actionTimerRef.current);

      // Impact timing: hammer contacts workpiece at 180ms
      actionTimerRef.current = setTimeout(() => {
        playStrike();
        setSparks(true);
        setAnvilJolt(true);

        setTimeout(() => {
          setSparks(false);
          setAnvilJolt(false);
          setHammerSwinging(false);
          setStage("strike");
        }, 220);
      }, 180);
    } else if (stage === "strike") {
      // Stage 3 -> Stage 4: Second strike to draw fuller and bevel
      setHammerSwinging(true);
      if (actionTimerRef.current) clearTimeout(actionTimerRef.current);

      actionTimerRef.current = setTimeout(() => {
        playStrike();
        setSparks(true);
        setAnvilJolt(true);

        setTimeout(() => {
          setSparks(false);
          setAnvilJolt(false);
          setHammerSwinging(false);
          setStage("shape");
        }, 220);
      }, 180);
    } else if (stage === "shape") {
      // Stage 4 -> Stage 5: Plunge into water quench
      setSteam(true);
      if (actionTimerRef.current) clearTimeout(actionTimerRef.current);
      actionTimerRef.current = setTimeout(() => {
        setSteam(false);
      }, 800);
      setStage("quench");
    } else if (stage === "quench") {
      // Stage 5 -> Stage 6: Whetstone hone
      setStage("hone");
    } else if (stage === "hone") {
      // Stage 6 -> Stage 7: Reveal finished master blade & dossier
      setStage("reveal");
      setForged(true);
      setForgedSet((prev) => new Set(prev).add(project.id));
    } else if (stage === "reveal") {
      // Re-forge current blade
      setStage("heat");
      setForged(false);
    }
  }, [stage, playStrike, project.id]);

  // Instant skip to finished blade
  const instantFinish = useCallback(() => {
    setStage("reveal");
    setForged(true);
    setForgedSet((prev) => new Set(prev).add(project.id));
  }, [project.id]);

  // Clean timers on unmount
  useEffect(() => {
    return () => {
      if (actionTimerRef.current) clearTimeout(actionTimerRef.current);
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
    <div className="forge-scene" role="dialog" aria-label="The forge — projects">
      {/* Contained, distinct workshop background */}
      <div
        className="forge-contained-bg"
        style={{ backgroundImage: `url(${smithyBg})` }}
        aria-hidden="true"
      />
      <div className="forge-vignette-overlay" aria-hidden="true" />

      {/* Self-contained Forge Stage */}
      <div className="forge-stage">
        {/* Top Header Bar: Return + Weapon Selector Rack */}
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

        {/* The Central Anvil & Workpiece Area */}
        <div className={`anvil-zone ${anvilJolt ? "is-jolting" : ""}`}>
          {/* Blacksmith's Realistic Hammer (poised or swinging) */}
          {stage !== "heat" && stage !== "quench" && stage !== "reveal" && (
            <div
              className={`craftsman-hammer ${hammerSwinging ? "is-swinging" : ""}`}
              aria-hidden="true"
            >
              <svg viewBox="0 0 160 120" className="hammer-svg">
                <defs>
                  <linearGradient id="hammerHeadSteel" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#48423c" />
                    <stop offset="50%" stopColor="#2a2520" />
                    <stop offset="100%" stopColor="#14110e" />
                  </linearGradient>
                  <linearGradient id="hammerHandleWood" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#4e3828" />
                    <stop offset="50%" stopColor="#382618" />
                    <stop offset="100%" stopColor="#24170d" />
                  </linearGradient>
                </defs>
                {/* Hickory Wood Handle */}
                <rect x="40" y="38" width="105" height="11" rx="4" fill="url(#hammerHandleWood)" stroke="#1a110a" strokeWidth="1" transform="rotate(-25 90 44)" />
                {/* Steel Sledge Head */}
                <rect x="24" y="24" width="34" height="22" rx="2" fill="url(#hammerHeadSteel)" stroke="#110d0a" strokeWidth="1.5" />
                {/* Peen bevel and wedge */}
                <polygon points="24,24 18,28 18,42 24,46" fill="#36302a" stroke="#110d0a" strokeWidth="1" />
                <rect x="54" y="31" width="4" height="8" rx="1" fill="#18130e" />
              </svg>
            </div>
          )}

          {/* Point-Impact Sparks (confined to contact point) */}
          {sparks && (
            <div className="point-sparks" aria-hidden="true">
              <span className="spark-ember p1" />
              <span className="spark-ember p2" />
              <span className="spark-ember p3" />
              <span className="spark-ember p4" />
              <span className="spark-ember p5" />
              <span className="spark-ember p6" />
            </div>
          )}

          {/* Quenching Steam Wisp */}
          {steam && (
            <div className="quench-steam" aria-hidden="true">
              <span className="vapor v1" />
              <span className="vapor v2" />
              <span className="vapor v3" />
            </div>
          )}

          {/* The Workpiece — resting directly on the anvil face */}
          <div className={`workpiece-stage stage-${stage}`}>
            {stage === "heat" && (
              <div className="workpiece-bar in-hearth" title="Bar in hearth coals">
                <span className="bar-core ember-cherry" />
              </div>
            )}

            {stage === "position" && (
              <div className="workpiece-bar on-anvil incandescent" title="Incandescent bar resting on anvil">
                <span className="bar-core ember-cherry" />
                <span className="anvil-contact-shadow" />
              </div>
            )}

            {stage === "strike" && (
              <div className="workpiece-bar on-anvil drawn-stock" title="Drawn and flattened blade stock">
                <span className="bar-core ember-hot" />
                <span className="fuller-indentation" />
              </div>
            )}

            {stage === "shape" && (
              <div className="workpiece-bar on-anvil shaped-blank" title="Shaped blade with bevel and fuller">
                <span className="bar-core ember-cooling" />
                <span className="bevel-ridge" />
              </div>
            )}

            {stage === "quench" && (
              <div className="workpiece-bar on-anvil quenched-steel" title="Tempered high-carbon dark steel">
                <span className="bar-core tempered-grey" />
              </div>
            )}

            {stage === "hone" && (
              <div className="workpiece-bar on-anvil honed-edge" title="Honed cutting edge with whetstone">
                <span className="bar-core honed-steel" />
                <span className="whetstone-hone-glint" />
              </div>
            )}

            {stage === "reveal" && (
              <div className="workpiece-sword" title={`Master blade: ${project.swordName}`}>
                <img
                  src={project.swordImg}
                  alt={project.swordName}
                  className="forged-sword-img"
                  draggable="false"
                />
              </div>
            )}
          </div>

          {/* The Blacksmith's Anvil on Oak Stump */}
          <div className="craftsman-anvil" aria-hidden="true">
            <svg viewBox="0 0 340 180" className="anvil-svg">
              <defs>
                <linearGradient id="anvilSteelGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#48423b" />
                  <stop offset="35%" stopColor="#28221d" />
                  <stop offset="100%" stopColor="#120f0c" />
                </linearGradient>
                <linearGradient id="anvilFaceGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#554d42" />
                  <stop offset="50%" stopColor="#827563" />
                  <stop offset="100%" stopColor="#483f35" />
                </linearGradient>
                <radialGradient id="anvilStumpGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#1c140e" />
                  <stop offset="100%" stopColor="#080605" />
                </radialGradient>
              </defs>
              {/* Oak Tree Stump Base */}
              <path d="M 50 135 L 290 135 L 305 180 L 35 180 Z" fill="url(#anvilStumpGrad)" stroke="#110d09" strokeWidth="2" />
              <line x1="60" y1="135" x2="48" y2="180" stroke="#251a12" strokeWidth="2" opacity="0.6" />
              <line x1="120" y1="135" x2="114" y2="180" stroke="#251a12" strokeWidth="2" opacity="0.4" />
              <line x1="220" y1="135" x2="228" y2="180" stroke="#251a12" strokeWidth="2" opacity="0.5" />
              {/* Anvil Base Footing */}
              <path d="M 65 135 C 90 120 100 105 110 95 L 230 95 C 240 105 250 120 275 135 Z" fill="url(#anvilSteelGrad)" />
              {/* Anvil Waist */}
              <path d="M 110 95 C 115 75 120 60 122 50 L 218 50 C 220 60 225 75 230 95 Z" fill="url(#anvilSteelGrad)" />
              {/* Conical Horn */}
              <path d="M 122 50 C 90 48 45 42 20 40 C 45 56 95 64 122 68 Z" fill="url(#anvilSteelGrad)" />
              {/* Heel & Cutting Table */}
              <path d="M 218 50 L 300 50 L 310 70 L 225 68 Z" fill="url(#anvilSteelGrad)" />
              {/* Hardened Flat Steel Face (Contact Zone) */}
              <polygon points="20,40 300,40 300,50 20,50" fill="url(#anvilFaceGrad)" />
              {/* Hardy Hole Detail */}
              <rect x="270" y="43" width="8" height="4" fill="#140f0b" rx="1" />
            </svg>
          </div>
        </div>

        {/* Tactical Game Interaction Bar */}
        <div className="forge-controller">
          {/* Progress Markers (7 Physical Steps) */}
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
              className={`strike-trigger-btn ${stage === "reveal" ? "reforge-mode" : ""}`}
              onClick={handleForgeAction}
              aria-label={stepObj.action}
            >
              <span className="btn-icon" aria-hidden="true">
                {stage === "reveal" ? "↻" : "⚔"}
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

        {/* The Project Reward Dossier */}
        {forged && (
          <aside className="project-reward-dossier" aria-label={`Project details for ${project.title}`}>
            <div className="dossier-inner">
              <header className="dossier-header">
                <span className="dossier-badge">FORGED WEAPON {index + 1} OF {projects.length}</span>
                <h1 className="dossier-title">{project.title}</h1>
                <p className="dossier-moniker">&#9876; Blade Identity: <em>{project.swordName}</em></p>
              </header>

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
