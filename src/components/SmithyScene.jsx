import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import "./smithy.css";
import projects from "../data/projects.js";
import strikeSound from "../assets/sounds/sword.mp3";
import smithyBg from "../assets/images/smithy-bg.webp";

export default function SmithyScene({ goBack }) {
  const queryParams = useMemo(() => new URLSearchParams(window.location.search), []);
  const initialSkip =
    queryParams.get("skipIntro") === "1" ||
    queryParams.get("forged") === "1" ||
    !!queryParams.get("inspect");
  const initialInspect = queryParams.get("inspect");

  // View state: 'forging' (the cinematic loading intro) -> 'workshop' (the project workshop)
  const [viewMode, setViewMode] = useState(initialSkip ? "workshop" : "forging");

  // Forging sequence phases
  const [forgeStage, setForgeStage] = useState(initialSkip ? 4 : 0);
  const [hammerActive, setHammerActive] = useState(false);
  const [impactSparks, setImpactSparks] = useState(false);
  const [anvilJolt, setAnvilJolt] = useState(false);
  const [steamVapor, setSteamVapor] = useState(false);

  // Selected project for inspection note
  const [selectedProject, setSelectedProject] = useState(() => {
    if (!initialInspect) return null;
    return projects.find((p) => p.id === initialInspect) || null;
  });

  const audioRef = useRef(null);
  const introTimersRef = useRef([]);
  const canvasContainerRef = useRef(null);

  // Initialize strike audio safely
  useEffect(() => {
    const audio = new Audio(strikeSound);
    audio.volume = 0.55;
    audioRef.current = audio;
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }
    };
  }, []);

  const playStrike = useCallback((volume = 0.55) => {
    const a = audioRef.current;
    if (a) {
      try {
        a.currentTime = 0;
        a.volume = volume;
        a.play().catch(() => {});
      } catch (err) {
        void err;
      }
    }
  }, []);

  // Enter workshop directly
  const enterWorkshop = useCallback(() => {
    introTimersRef.current.forEach(clearTimeout);
    introTimersRef.current = [];
    setForgeStage(4);
    setViewMode("workshop");
  }, []);

  // Automatic cinematic forging intro sequence (total ~4.6 seconds)
  useEffect(() => {
    if (initialSkip) return;

    introTimersRef.current = [
      // 1.0s: Hammer begins its raised descent for strike 1
      setTimeout(() => {
        setHammerActive(true);
      }, 1000),

      // 1.45s: Strike 1 IMPACT!
      setTimeout(() => {
        playStrike(0.6);
        setImpactSparks(true);
        setAnvilJolt(true);
        setForgeStage(1);
        setTimeout(() => {
          setImpactSparks(false);
          setAnvilJolt(false);
          setHammerActive(false);
        }, 220);
      }, 1450),

      // 2.2s: Hammer raises for strike 2
      setTimeout(() => {
        setHammerActive(true);
      }, 2200),

      // 2.65s: Strike 2 IMPACT! Fuller & bevel shaped
      setTimeout(() => {
        playStrike(0.65);
        setImpactSparks(true);
        setAnvilJolt(true);
        setForgeStage(2);
        setTimeout(() => {
          setImpactSparks(false);
          setAnvilJolt(false);
          setHammerActive(false);
        }, 220);
      }, 2650),

      // 3.3s: Water quench & finishing cooling
      setTimeout(() => {
        setSteamVapor(true);
        setForgeStage(3);
        setTimeout(() => setSteamVapor(false), 800);
      }, 3300),

      // 3.9s: Reveal finished blade on anvil, camera begins pull-back
      setTimeout(() => {
        setForgeStage(4);
      }, 3900),

      // 4.6s: Seamlessly transition into the wider workshop
      setTimeout(() => {
        setViewMode("workshop");
      }, 4600),
    ];

    return () => {
      introTimersRef.current.forEach(clearTimeout);
      introTimersRef.current = [];
    };
  }, [initialSkip, playStrike]);

  // Clean keyboard listeners (Escape closes note, or leaves workshop)
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        if (selectedProject) {
          setSelectedProject(null);
        } else if (viewMode === "forging") {
          enterWorkshop();
        } else {
          goBack();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedProject, viewMode, enterWorkshop, goBack]);

  const selectSword = useCallback(
    (proj) => {
      playStrike(0.25);
      setSelectedProject((prev) => (prev?.id === proj.id ? null : proj));
    },
    [playStrike]
  );

  const scrollToStation = useCallback((station) => {
    const el = canvasContainerRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 0) return;
    if (station === "wall") {
      el.scrollTo({ left: 0, behavior: "smooth" });
    } else if (station === "anvil") {
      el.scrollTo({ left: maxScroll / 2, behavior: "smooth" });
    } else if (station === "hearth") {
      el.scrollTo({ left: maxScroll, behavior: "smooth" });
    }
  }, []);

  // Initial mobile center scroll when entering workshop
  useEffect(() => {
    if (viewMode === "workshop" && canvasContainerRef.current) {
      const el = canvasContainerRef.current;
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll > 0) {
        el.scrollLeft = maxScroll / 2;
      }
    }
  }, [viewMode]);

  return (
    <div
      className={`smithy-viewport ${viewMode === "forging" ? "is-forging-intro" : "is-workshop-mode"}`}
      role="dialog"
      aria-label="The Blacksmith Workshop — Projects"
    >
      {/* Contained workshop background */}
      <div
        className="workshop-bg-layer"
        style={{ backgroundImage: `url(${smithyBg})` }}
        aria-hidden="true"
      />
      <div className="workshop-soot-vignette" aria-hidden="true" />

      {/* ========================================================
          1. FORGING INTRO SEQUENCE (Cinematic Loading Transition)
          ======================================================== */}
      {viewMode === "forging" && (
        <section
          className="forging-intro-stage"
          aria-label="Forging the master blade transition"
        >
          {/* Anvil & Workpiece Focus */}
          <div className={`intro-anvil-rig ${anvilJolt ? "is-jolting" : ""}`}>
            {/* The Blacksmith's Hammer */}
            <div
              className={`craftsman-hammer ${hammerActive ? "is-striking" : "is-poised"}`}
              aria-hidden="true"
            >
              <svg viewBox="0 0 160 120" className="hammer-svg">
                <defs>
                  <linearGradient id="introHammerSteel" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#48423c" />
                    <stop offset="50%" stopColor="#2a2520" />
                    <stop offset="100%" stopColor="#14110e" />
                  </linearGradient>
                  <linearGradient id="introHammerWood" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#4e3828" />
                    <stop offset="50%" stopColor="#382618" />
                    <stop offset="100%" stopColor="#24170d" />
                  </linearGradient>
                </defs>
                <rect
                  x="40"
                  y="38"
                  width="105"
                  height="11"
                  rx="4"
                  fill="url(#introHammerWood)"
                  stroke="#1a110a"
                  strokeWidth="1"
                  transform="rotate(-25 90 44)"
                />
                <rect
                  x="24"
                  y="24"
                  width="34"
                  height="22"
                  rx="2"
                  fill="url(#introHammerSteel)"
                  stroke="#110d0a"
                  strokeWidth="1.5"
                />
                <polygon
                  points="24,24 18,28 18,42 24,46"
                  fill="#36302a"
                  stroke="#110d0a"
                  strokeWidth="1"
                />
                <rect x="54" y="31" width="4" height="8" rx="1" fill="#18130e" />
              </svg>
            </div>

            {/* Restrained Local Point Sparks */}
            {impactSparks && (
              <div className="point-sparks" aria-hidden="true">
                <span className="spark-ember p1" />
                <span className="spark-ember p2" />
                <span className="spark-ember p3" />
                <span className="spark-ember p4" />
                <span className="spark-ember p5" />
                <span className="spark-ember p6" />
              </div>
            )}

            {/* Steam wisp on cooling */}
            {steamVapor && (
              <div className="quench-steam" aria-hidden="true">
                <span className="vapor v1" />
                <span className="vapor v2" />
                <span className="vapor v3" />
              </div>
            )}

            {/* Workpiece on anvil face */}
            <div className={`intro-workpiece stage-${forgeStage}`}>
              {forgeStage === 0 && (
                <div className="workpiece-bar raw-stock" title="Rough incandescent billet">
                  <span className="bar-core ember-glow" />
                </div>
              )}
              {forgeStage === 1 && (
                <div className="workpiece-bar drawn-stock" title="Steel drawn and flattened">
                  <span className="bar-core ember-active" />
                </div>
              )}
              {forgeStage === 2 && (
                <div className="workpiece-bar shaped-stock" title="Fuller groove and bevel shaped">
                  <span className="bar-core ember-cooling" />
                  <span className="fuller-line" />
                </div>
              )}
              {forgeStage === 3 && (
                <div className="workpiece-bar quenched-stock" title="Tempered high-carbon dark steel">
                  <span className="bar-core tempered-steel" />
                </div>
              )}
              {forgeStage >= 4 && (
                <div className="workpiece-sword reveal" title="Master blade formed">
                  <img
                    src={projects[0].swordImg}
                    alt="Master blade"
                    className="intro-sword-img"
                    draggable="false"
                  />
                </div>
              )}
            </div>

            {/* Grounded Medieval Anvil */}
            <div className="intro-anvil-svg-wrap" aria-hidden="true">
              <svg viewBox="0 0 340 180" className="anvil-svg">
                <defs>
                  <linearGradient id="introAnvilSteel" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#48423b" />
                    <stop offset="35%" stopColor="#28221d" />
                    <stop offset="100%" stopColor="#120f0c" />
                  </linearGradient>
                  <linearGradient id="introAnvilFace" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#554d42" />
                    <stop offset="50%" stopColor="#827563" />
                    <stop offset="100%" stopColor="#483f35" />
                  </linearGradient>
                  <radialGradient id="introAnvilStump" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#1c140e" />
                    <stop offset="100%" stopColor="#080605" />
                  </radialGradient>
                </defs>
                <path
                  d="M 50 135 L 290 135 L 305 180 L 35 180 Z"
                  fill="url(#introAnvilStump)"
                  stroke="#110d09"
                  strokeWidth="2"
                />
                <line x1="60" y1="135" x2="48" y2="180" stroke="#251a12" strokeWidth="2" opacity="0.6" />
                <line x1="120" y1="135" x2="114" y2="180" stroke="#251a12" strokeWidth="2" opacity="0.4" />
                <line x1="220" y1="135" x2="228" y2="180" stroke="#251a12" strokeWidth="2" opacity="0.5" />
                <path
                  d="M 65 135 C 90 120 100 105 110 95 L 230 95 C 240 105 250 120 275 135 Z"
                  fill="url(#introAnvilSteel)"
                />
                <path
                  d="M 110 95 C 115 75 120 60 122 50 L 218 50 C 220 60 225 75 230 95 Z"
                  fill="url(#introAnvilSteel)"
                />
                <path
                  d="M 122 50 C 90 48 45 42 20 40 C 45 56 95 64 122 68 Z"
                  fill="url(#introAnvilSteel)"
                />
                <path d="M 218 50 L 300 50 L 310 70 L 225 68 Z" fill="url(#introAnvilSteel)" />
                <polygon points="20,40 300,40 300,50 20,50" fill="url(#introAnvilFace)" />
                <rect x="270" y="43" width="8" height="4" fill="#140f0b" rx="1" />
              </svg>
            </div>
          </div>

          {/* Quick Skip Option */}
          <div className="forging-intro-footer">
            <button
              type="button"
              className="skip-to-workshop-btn"
              onClick={enterWorkshop}
              aria-label="Skip forging sequence and enter project workshop immediately"
            >
              Skip to Workshop &#8594;
            </button>
          </div>
        </section>
      )}

      {/* ========================================================
          2. THE WORKSHOP ENVIRONMENT (The Workshop IS the Interface)
          ======================================================== */}
      {viewMode === "workshop" && (
        <main
          className={`workshop-floor ${selectedProject ? "has-focus" : ""}`}
          aria-label="Blacksmith Project Workshop"
        >
          {/* Top Exit Navigation */}
          <header className="workshop-top-bar">
            <button
              type="button"
              className="workshop-exit-btn"
              onClick={goBack}
              aria-label="Return to workshop chamber room"
            >
              &#8592; Workshop Chamber
            </button>
          </header>

          {/* The Physical Workshop Canvas */}
          <div className="workshop-canvas-container" ref={canvasContainerRef}>
            <div
              className={`workshop-canvas ${selectedProject ? "is-dimmed" : ""}`}
              style={{ backgroundImage: `url(${smithyBg})` }}
            >
              {/* Subtle ambient lighting layers */}
              <div className="hearth-warmth-glow" aria-hidden="true" />
              <div className="hearth-smoke-wisps" aria-hidden="true" />

              {/* --------------------------------------------------
                  PHYSICAL SWORD OBJECT 1: ON THE ANVIL
                  (FoveaEdge — Ongoing Work in Progress)
                  -------------------------------------------------- */}
              {projects[0] && (
                <button
                  type="button"
                  className={`sword-object obj-anvil ${selectedProject?.id === projects[0].id ? "is-active" : ""}`}
                  onClick={() => selectSword(projects[0])}
                  aria-label={`Inspect ${projects[0].title} — ${projects[0].physicalLocation}`}
                >
                  <div className="sword-sprite-wrap anvil-blade-wrap">
                    <img
                      src={projects[0].swordImg}
                      alt=""
                      className="sword-img rough-forged"
                      draggable="false"
                    />
                    <span className="core-ember-glow" aria-hidden="true" />
                    <span className="blade-shimmer" aria-hidden="true" />
                  </div>
                  <span className="sword-whisper-label">
                    <strong>{projects[0].title}</strong>
                    <small>{projects[0].physicalLocation}</small>
                  </span>
                </button>
              )}

              {/* --------------------------------------------------
                  PHYSICAL SWORD OBJECT 2: AT HEARTH WHETSTONE
                  (UVV Berserk Workshop — Active Finishing)
                  -------------------------------------------------- */}
              {projects[1] && (
                <button
                  type="button"
                  className={`sword-object obj-hearth ${selectedProject?.id === projects[1].id ? "is-active" : ""}`}
                  onClick={() => selectSword(projects[1])}
                  aria-label={`Inspect ${projects[1].title} — ${projects[1].physicalLocation}`}
                >
                  <div className="sword-sprite-wrap hearth-blade-wrap">
                    <img
                      src={projects[1].swordImg}
                      alt=""
                      className="sword-img whetstone-blade"
                      draggable="false"
                    />
                    <span className="hearth-hone-sparks" aria-hidden="true">
                      <span className="h-spark hs1" />
                      <span className="h-spark hs2" />
                      <span className="h-spark hs3" />
                    </span>
                    <span className="blade-shimmer" aria-hidden="true" />
                  </div>
                  <span className="sword-whisper-label">
                    <strong>{projects[1].title}</strong>
                    <small>{projects[1].physicalLocation}</small>
                  </span>
                </button>
              )}

              {/* --------------------------------------------------
                  PHYSICAL SWORD OBJECT 3: MOUNTED ON STONE WALL
                  (OpenVINO OSS Navigator — Master Greatsword)
                  -------------------------------------------------- */}
              {projects[2] && (
                <button
                  type="button"
                  className={`sword-object obj-wall-upper ${selectedProject?.id === projects[2].id ? "is-active" : ""}`}
                  onClick={() => selectSword(projects[2])}
                  aria-label={`Inspect ${projects[2].title} — ${projects[2].physicalLocation}`}
                >
                  <div className="sword-sprite-wrap wall-upper-wrap">
                    <img
                      src={projects[2].swordImg}
                      alt=""
                      className="sword-img master-greatsword"
                      draggable="false"
                    />
                    <span className="blade-shimmer" aria-hidden="true" />
                  </div>
                  <span className="sword-whisper-label">
                    <strong>{projects[2].title}</strong>
                    <small>{projects[2].physicalLocation}</small>
                  </span>
                </button>
              )}

              {/* --------------------------------------------------
                  PHYSICAL SWORD OBJECT 4: IN TIMBER RACK
                  (Face Detection Auto-Switch — Crossguard Blade)
                  -------------------------------------------------- */}
              {projects[3] && (
                <button
                  type="button"
                  className={`sword-object obj-wall-rack ${selectedProject?.id === projects[3].id ? "is-active" : ""}`}
                  onClick={() => selectSword(projects[3])}
                  aria-label={`Inspect ${projects[3].title} — ${projects[3].physicalLocation}`}
                >
                  <div className="sword-sprite-wrap wall-rack-wrap">
                    <img
                      src={projects[3].swordImg}
                      alt=""
                      className="sword-img rack-blade"
                      draggable="false"
                    />
                    <span className="blade-shimmer" aria-hidden="true" />
                  </div>
                  <span className="sword-whisper-label">
                    <strong>{projects[3].title}</strong>
                    <small>{projects[3].physicalLocation}</small>
                  </span>
                </button>
              )}

              {/* --------------------------------------------------
                  PHYSICAL SWORD OBJECT 5: ON FLOOR TIMBER RACK
                  (Arya Algorithms & Foundation — Honed Longsword)
                  -------------------------------------------------- */}
              {projects[4] && (
                <button
                  type="button"
                  className={`sword-object obj-floor-rack ${selectedProject?.id === projects[4].id ? "is-active" : ""}`}
                  onClick={() => selectSword(projects[4])}
                  aria-label={`Inspect ${projects[4].title} — ${projects[4].physicalLocation}`}
                >
                  <div className="sword-sprite-wrap floor-rack-wrap">
                    <img
                      src={projects[4].swordImg}
                      alt=""
                      className="sword-img floor-blade"
                      draggable="false"
                    />
                    <span className="blade-shimmer" aria-hidden="true" />
                  </div>
                  <span className="sword-whisper-label">
                    <strong>{projects[4].title}</strong>
                    <small>{projects[4].physicalLocation}</small>
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* ========================================================
              3. PHYSICAL WORKSHOP NOTE (Compact & Restrained)
              ======================================================== */}
          {selectedProject && (
            <aside
              className="workshop-note-backdrop"
              onClick={() => setSelectedProject(null)}
              role="dialog"
              aria-label={`Record: ${selectedProject.title}`}
            >
              <div
                className="workshop-note"
                onClick={(e) => e.stopPropagation()}
                role="document"
              >
                <button
                  type="button"
                  className="note-close-btn"
                  onClick={() => setSelectedProject(null)}
                  aria-label="Return to workshop"
                >
                  &times;
                </button>

                <div className="note-eyebrow">
                  <span className="note-location">{selectedProject.physicalLocation}</span>
                  <span className="note-sep" aria-hidden="true">&bull;</span>
                  <span className="note-stage">{selectedProject.stageLabel}</span>
                </div>

                <h2 className="note-title">{selectedProject.title}</h2>

                <p className="note-purpose">{selectedProject.shortPurpose}</p>

                <div className="note-tech">
                  <span className="tech-heading">Forged with:</span>
                  <span className="tech-tags">{selectedProject.tech}</span>
                </div>

                <div className="note-actions">
                  <a
                    href={selectedProject.url}
                    target="_blank"
                    rel="noreferrer"
                    className="note-action-link github"
                    aria-label={`Open repository for ${selectedProject.title}`}
                  >
                    GitHub &#8599;
                  </a>
                  {selectedProject.demo && (
                    <a
                      href={selectedProject.demo}
                      target="_blank"
                      rel="noreferrer"
                      className="note-action-link demo"
                      aria-label={`Open live deployment for ${selectedProject.title}`}
                    >
                      Live Demo &#8599;
                    </a>
                  )}
                </div>
              </div>
            </aside>
          )}

          {/* Ambient discovery aid on mobile */}
          <nav className="mobile-station-cues" aria-label="Workshop physical stations">
            <button
              type="button"
              className="cue-pill"
              onClick={() => scrollToStation("wall")}
            >
              &#9881; Wall Blades
            </button>
            <button
              type="button"
              className="cue-pill"
              onClick={() => scrollToStation("anvil")}
            >
              &#9874; Anvil
            </button>
            <button
              type="button"
              className="cue-pill"
              onClick={() => scrollToStation("hearth")}
            >
              &#128293; Hearth
            </button>
          </nav>
        </main>
      )}
    </div>
  );
}
