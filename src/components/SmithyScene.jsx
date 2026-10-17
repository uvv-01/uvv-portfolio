import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import "./smithy.css";
import projects from "../data/projects.js";
import { fetchGithubRepos } from "../utils/github.js";
import strikeSound from "../assets/sounds/sword.mp3";
import smithyBg from "../assets/images/smithy-bg.webp";

export default function SmithyScene({ goBack }) {
  // Check if visitor specifically requested instant workshop or specific project in URL
  const queryParams = useMemo(() => new URLSearchParams(window.location.search), []);
  const initialSkip = queryParams.get("skipIntro") === "1" || queryParams.get("forged") === "1" || !!queryParams.get("inspect");
  const initialInspect = queryParams.get("inspect");

  // View state: 'forging' (the cinematic loading intro) -> 'workshop' (the project workshop)
  const [viewMode, setViewMode] = useState(initialSkip ? "workshop" : "forging");

  // Forging sequence phases:
  // 0 = raw metal in coals/on anvil
  // 1 = hammer strike 1 (draw steel)
  // 2 = hammer strike 2 (fuller & bevel)
  // 3 = cooling & finishing
  // 4 = finished blade reveal + camera pull away
  const [forgeStage, setForgeStage] = useState(initialSkip ? 4 : 0);
  const [hammerActive, setHammerActive] = useState(false);
  const [impactSparks, setImpactSparks] = useState(false);
  const [anvilJolt, setAnvilJolt] = useState(false);
  const [steamVapor, setSteamVapor] = useState(false);

  // Workshop state
  const [selectedProject, setSelectedProject] = useState(() => {
    if (!initialInspect) return null;
    return projects.find((p) => p.id === initialInspect) || null;
  });
  const [activeZone, setActiveZone] = useState("all"); // 'all', 'ongoing', 'sharpening', 'completed'
  const [liveRepos, setLiveRepos] = useState(null);

  const audioRef = useRef(null);
  const introTimersRef = useRef([]);

  // Split projects into the three physical workshop zones
  const ongoingProjects = useMemo(() => projects.filter((p) => p.stage === "ongoing"), []);
  const sharpeningProject = useMemo(() => projects.find((p) => p.stage === "finishing") || projects[2], []);
  const completedProjects = useMemo(() => projects.filter((p) => p.stage === "completed"), []);

  // Initialize audio instance safely
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

  // Fetch real GitHub facts for live metadata updates
  useEffect(() => {
    let alive = true;
    fetchGithubRepos().then((repos) => {
      if (alive && repos.length) setLiveRepos(repos);
    });
    return () => {
      alive = false;
    };
  }, []);

  // Transition into workshop directly
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
        playStrike();
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
        playStrike();
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

  // Clean keyboard listeners
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

  const selectedLive = useMemo(() => {
    if (!selectedProject || !liveRepos) return null;
    return liveRepos.find((r) => r.name === selectedProject.repo) || null;
  }, [selectedProject, liveRepos]);

  return (
    <div
      className={`smithy-viewport ${viewMode === "forging" ? "is-forging-intro" : "is-workshop-mode"}`}
      role="dialog"
      aria-label="The Blacksmith Workshop — Projects"
    >
      {/* Contained workshop background — zero bleed into previous scenes */}
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
                <rect x="40" y="38" width="105" height="11" rx="4" fill="url(#introHammerWood)" stroke="#1a110a" strokeWidth="1" transform="rotate(-25 90 44)" />
                <rect x="24" y="24" width="34" height="22" rx="2" fill="url(#introHammerSteel)" stroke="#110d0a" strokeWidth="1.5" />
                <polygon points="24,24 18,28 18,42 24,46" fill="#36302a" stroke="#110d0a" strokeWidth="1" />
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

            {/* Workpiece strictly on anvil face */}
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
                <path d="M 50 135 L 290 135 L 305 180 L 35 180 Z" fill="url(#introAnvilStump)" stroke="#110d09" strokeWidth="2" />
                <line x1="60" y1="135" x2="48" y2="180" stroke="#251a12" strokeWidth="2" opacity="0.6" />
                <line x1="120" y1="135" x2="114" y2="180" stroke="#251a12" strokeWidth="2" opacity="0.4" />
                <line x1="220" y1="135" x2="228" y2="180" stroke="#251a12" strokeWidth="2" opacity="0.5" />
                <path d="M 65 135 C 90 120 100 105 110 95 L 230 95 C 240 105 250 120 275 135 Z" fill="url(#introAnvilSteel)" />
                <path d="M 110 95 C 115 75 120 60 122 50 L 218 50 C 220 60 225 75 230 95 Z" fill="url(#introAnvilSteel)" />
                <path d="M 122 50 C 90 48 45 42 20 40 C 45 56 95 64 122 68 Z" fill="url(#introAnvilSteel)" />
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
          2. THE PROJECT WORKSHOP FLOOR
          ======================================================== */}
      {viewMode === "workshop" && (
        <main
          className={`workshop-floor ${selectedProject ? "has-focus" : ""}`}
          aria-label="Blacksmith Project Workshop"
        >
          {/* Top Bar: Return to Room + Mobile Zone Selector */}
          <header className="workshop-top-bar">
            <button
              type="button"
              className="workshop-exit-btn"
              onClick={goBack}
              aria-label="Return to workshop chamber room"
            >
              &#8592; Workshop Chamber
            </button>

            {/* Mobile / Compact Category Selector */}
            <nav className="workshop-zone-nav" aria-label="Workshop zones">
              <button
                type="button"
                className={`zone-nav-btn ${activeZone === "all" ? "is-active" : ""}`}
                onClick={() => setActiveZone("all")}
              >
                All Stations
              </button>
              <button
                type="button"
                className={`zone-nav-btn ${activeZone === "ongoing" ? "is-active" : ""}`}
                onClick={() => setActiveZone("ongoing")}
              >
                Half-Forged (WIP)
              </button>
              <button
                type="button"
                className={`zone-nav-btn ${activeZone === "sharpening" ? "is-active" : ""}`}
                onClick={() => setActiveZone("sharpening")}
              >
                Hearth &amp; Hone
              </button>
              <button
                type="button"
                className={`zone-nav-btn ${activeZone === "completed" ? "is-active" : ""}`}
                onClick={() => setActiveZone("completed")}
              >
                Finished Blades
              </button>
            </nav>
          </header>

          {/* Main 3-Zone Workshop Environment */}
          <div className="workshop-stations-layout">
            {/* ----------------------------------------------------
                ZONE 1: HALF-FORGED SWORDS (Ongoing Projects)
                ---------------------------------------------------- */}
            {(activeZone === "all" || activeZone === "ongoing") && (
              <section
                className="workshop-station station-ongoing"
                aria-label="Half-forged swords — ongoing work in progress"
              >
                <div className="station-header">
                  <span className="station-eyebrow">&#9881; ANVIL &amp; STANDS</span>
                  <h2 className="station-title">Half-Forged Swords</h2>
                  <p className="station-desc">Unfinished blades currently being shaped on the anvil.</p>
                </div>

                <div className="swords-rack ongoing-rack">
                  {ongoingProjects.map((proj) => (
                    <article
                      key={proj.id}
                      className={`sword-stand ongoing-stand ${selectedProject?.id === proj.id ? "is-selected" : ""}`}
                      onClick={() => setSelectedProject(proj)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") setSelectedProject(proj);
                      }}
                      aria-label={`Inspect ongoing work: ${proj.title}`}
                    >
                      <div className="stand-pedestal" aria-hidden="true" />
                      <div className="half-forged-blade-preview">
                        <img
                          src={proj.swordImg}
                          alt=""
                          className="blade-img partial-forge"
                          draggable="false"
                        />
                        <span className="rough-glow-sheen" aria-hidden="true" />
                      </div>
                      <div className="stand-tag">
                        <span className="tag-status">WIP &bull; {proj.stageLabel}</span>
                        <h3 className="tag-title">{proj.title}</h3>
                        <small className="tag-identity">{proj.swordName}</small>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {/* ----------------------------------------------------
                ZONE 2: HEARTH FIRE + SHARPENING (Active Finishing)
                ---------------------------------------------------- */}
            {(activeZone === "all" || activeZone === "sharpening") && (
              <section
                className="workshop-station station-hearth"
                aria-label="Hearth fire and sharpening stone — active finishing"
              >
                <div className="station-header">
                  <span className="station-eyebrow">&#128293; THE HEARTH WHEEL</span>
                  <h2 className="station-title">Fire &amp; Sharpening</h2>
                  <p className="station-desc">Master blade receiving its final whetstone polish.</p>
                </div>

                <div
                  className={`sharpening-hearth-rig ${selectedProject?.id === sharpeningProject.id ? "is-selected" : ""}`}
                  onClick={() => setSelectedProject(sharpeningProject)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") setSelectedProject(sharpeningProject);
                  }}
                  aria-label={`Inspect sharpening work: ${sharpeningProject.title}`}
                >
                  {/* Believable Small Hearth Fire */}
                  <div className="hearth-fire-box" aria-hidden="true">
                    <div className="fire-core" />
                    <div className="fire-flame f1" />
                    <div className="fire-flame f2" />
                    <div className="fire-flame f3" />
                    <div className="hearth-embers-cluster">
                      <span className="ember e1" />
                      <span className="ember e2" />
                      <span className="ember e3" />
                    </div>
                  </div>

                  {/* Whetstone Sharpening Surface with Subtly Moving Blade */}
                  <div className="sharpening-stone-surface" aria-hidden="true">
                    <div className="whetstone-block" />
                    <div className="hone-sparks-stream">
                      <span className="h-spark s1" />
                      <span className="h-spark s2" />
                      <span className="h-spark s3" />
                    </div>
                    <div className="hone-blade-wrap">
                      <img
                        src={sharpeningProject.swordImg}
                        alt=""
                        className="hone-blade-img"
                        draggable="false"
                      />
                    </div>
                  </div>

                  <div className="sharpening-card-tag">
                    <span className="tag-status">ACTIVE &bull; {sharpeningProject.stageLabel}</span>
                    <h3 className="tag-title">{sharpeningProject.title}</h3>
                    <small className="tag-identity">{sharpeningProject.swordName}</small>
                  </div>
                </div>
              </section>
            )}

            {/* ----------------------------------------------------
                ZONE 3: FINISHED SWORDS (Completed Projects)
                ---------------------------------------------------- */}
            {(activeZone === "all" || activeZone === "completed") && (
              <section
                className="workshop-station station-completed"
                aria-label="Finished swords — completed projects"
              >
                <div className="station-header">
                  <span className="station-eyebrow">&#9876; THE ARMORY WALL</span>
                  <h2 className="station-title">Finished Blades</h2>
                  <p className="station-desc">Completed weapons honed and ready for battle.</p>
                </div>

                <div className="swords-rack completed-rack">
                  {completedProjects.map((proj) => (
                    <article
                      key={proj.id}
                      className={`sword-stand completed-stand ${selectedProject?.id === proj.id ? "is-selected" : ""}`}
                      onClick={() => setSelectedProject(proj)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") setSelectedProject(proj);
                      }}
                      aria-label={`Inspect completed sword: ${proj.title}`}
                    >
                      <div className="stand-pedestal finished" aria-hidden="true" />
                      <div className="finished-blade-preview">
                        <img
                          src={proj.swordImg}
                          alt=""
                          className="blade-img finished-polish"
                          draggable="false"
                        />
                        <span className="steel-glint" aria-hidden="true" />
                      </div>
                      <div className="stand-tag">
                        <span className="tag-status completed">SHIPPED</span>
                        <h3 className="tag-title">{proj.title}</h3>
                        <small className="tag-identity">{proj.swordName}</small>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* ========================================================
              3. RESTRAINED PROJECT FOCUS DOSSIER (Selected Sword)
              ======================================================== */}
          {selectedProject && (
            <aside
              className="project-inspection-modal"
              role="dialog"
              aria-label={`Inspection: ${selectedProject.title}`}
            >
              <div
                className="modal-backdrop"
                onClick={() => setSelectedProject(null)}
                aria-hidden="true"
              />

              <div className="inspection-card">
                <button
                  type="button"
                  className="card-close-btn"
                  onClick={() => setSelectedProject(null)}
                  aria-label="Return to workshop floor"
                >
                  &times;
                </button>

                {/* Left Column: Sword Visual in Focus */}
                <div className="card-sword-focus">
                  <img
                    src={selectedProject.swordImg}
                    alt={selectedProject.swordName}
                    className="focused-sword-img"
                    draggable="false"
                  />
                  <div className="blade-seal">
                    <span className="seal-moniker">{selectedProject.swordName}</span>
                    <span className="seal-stage-badge">
                      {selectedProject.stage === "ongoing"
                        ? "Half-Forged (In Progress)"
                        : selectedProject.stage === "finishing"
                        ? "On the Whetstone (Finishing)"
                        : "Master Blade (Completed)"}
                    </span>
                  </div>
                </div>

                {/* Right Column: Verified Project Facts */}
                <div className="card-details-panel">
                  <header className="details-header">
                    <div className="status-pill">
                      <span className="status-dot" />
                      {selectedProject.stageLabel}
                    </div>
                    <h2 className="details-title">{selectedProject.title}</h2>
                    <p className="details-desc">{selectedProject.desc}</p>
                  </header>

                  {/* Tech Tags */}
                  <div className="details-tech-row" aria-label="Technologies used">
                    {selectedProject.tech.split("•").map((t, idx) => (
                      <span key={idx} className="tech-badge">
                        {t.trim()}
                      </span>
                    ))}
                  </div>

                  {/* Content for Ongoing vs Completed */}
                  <div className="details-content-body">
                    {selectedProject.stage === "ongoing" ? (
                      <>
                        <div className="field-group">
                          <h3>What It Is</h3>
                          <p>{selectedProject.whatItIs}</p>
                        </div>
                        <div className="field-group">
                          <h3>What I Am Building</h3>
                          <p>{selectedProject.whatBuilding}</p>
                        </div>
                        <div className="field-group">
                          <h3>Current Technical Stage</h3>
                          <p>{selectedProject.currentPhase}</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="field-group">
                          <h3>Purpose</h3>
                          <p>{selectedProject.purpose}</p>
                        </div>
                        <div className="field-group">
                          <h3>What I Built</h3>
                          <p>{selectedProject.built}</p>
                        </div>
                        {selectedProject.result && (
                          <div className="field-group">
                            <h3>Verified Result</h3>
                            <p>{selectedProject.result}</p>
                          </div>
                        )}
                      </>
                    )}

                    {/* Highlights */}
                    {selectedProject.highlights && (
                      <ul className="details-highlights">
                        {selectedProject.highlights.map((h, i) => (
                          <li key={i}>{h}</li>
                        ))}
                      </ul>
                    )}

                    {/* Live GitHub status if available */}
                    {selectedLive && (
                      <p className="details-live-stat">
                        &#9679; GitHub Active &bull; Last updated {new Date(selectedLive.updated_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  {/* Actions: Repository & Demo */}
                  <footer className="details-footer">
                    <div className="footer-links">
                      <a
                        href={selectedProject.url}
                        target="_blank"
                        rel="noreferrer"
                        className="project-cta primary"
                        aria-label={`Open GitHub repository for ${selectedProject.title}`}
                      >
                        Inspect Repository &#8599;
                      </a>
                      {selectedProject.demo && (
                        <a
                          href={selectedProject.demo}
                          target="_blank"
                          rel="noreferrer"
                          className="project-cta secondary"
                          aria-label={`Open live demo for ${selectedProject.title}`}
                        >
                          Live Deployment &#8599;
                        </a>
                      )}
                    </div>

                    <button
                      type="button"
                      className="return-floor-btn"
                      onClick={() => setSelectedProject(null)}
                    >
                      &#8592; Back to Workshop Floor
                    </button>
                  </footer>
                </div>
              </div>
            </aside>
          )}
        </main>
      )}
    </div>
  );
}
