import { useEffect, useState, useRef, useCallback } from "react";
import "./JourneyForge.css";

const CHAPTERS = [
  {
    id: "genesis",
    act: "ACT I",
    title: "The First Spark",
    subtitle: "Electronics & Physics Foundation",
    milestone: "Arya College of Engineering • B.Tech ECE",
    desc: "In semiconductor physics, circuit architectures, and digital logic gates, the initial spark was struck. Before high-level software, there was an understanding of how electrons move through silicon.",
    flameScale: 0.45,
    flameIntensity: "low",
    tag: "Hardware & Logic Core",
  },
  {
    id: "crucible",
    act: "ACT II",
    title: "Crucible of Logic",
    subtitle: "Algorithmic Rigor & Data Structures",
    milestone: "Data Structures • C++ • Java • LeetCode 100+",
    desc: "The flame gained heat through rigorous algorithmic discipline. Implementing core trees, graphs, and memory-safe structures from scratch, solving 100+ competitive programming challenges to forge intuition.",
    flameScale: 0.7,
    flameIntensity: "medium",
    tag: "Algorithmic Discipline",
  },
  {
    id: "inventions",
    act: "ACT III",
    title: "First Inventions",
    subtitle: "Autonomous Agents & Vision Systems",
    milestone: "Pengu Voice Assistant • Face Detection Auto-Switch",
    desc: "The workshop took shape. Code turned into physical agency: local-first desktop automation with Faster Whisper, and multithreaded computer vision pipelines dynamically migrating across CPU/GPU targets.",
    flameScale: 0.95,
    flameIntensity: "high",
    tag: "Applied Engineering",
  },
  {
    id: "open-realm",
    act: "ACT IV",
    title: "The Open Realm",
    subtitle: "Collaborative Open Source",
    milestone: "Intel OpenVINO • GSSoC • OSS Navigator",
    desc: "Stepping beyond solitary craft into the global open source commons. Contributing diagnostic tools to Intel OpenVINO, building benchmark telemetry dashboards with Next.js and FastAPI, and shipping pull requests for public repositories.",
    flameScale: 1.15,
    flameIntensity: "radiant",
    tag: "Global Collaboration",
  },
  {
    id: "frontier",
    act: "ACT V",
    title: "The Living Frontier",
    subtitle: "Edge AI & Selective Inference",
    milestone: "FoveaEdge • Active Research • Berserk Workshop",
    desc: "The master forge stands ablaze. Active research into human foveated vision for edge devices (FoveaEdge) to save compute without sacrificing accuracy. Crafting intelligent systems where software meets edge silicon.",
    flameScale: 1.35,
    flameIntensity: "master",
    tag: "Current Mastery",
  },
];

export default function JourneyForge({ goBack }) {
  const [current, setCurrent] = useState(0);
  const containerRef = useRef(null);
  const touchStartY = useRef(0);
  const lockRef = useRef(false);

  const goToChapter = useCallback((idx) => {
    if (lockRef.current) return;
    const bounded = Math.max(0, Math.min(idx, CHAPTERS.length - 1));
    if (bounded === current) return;
    lockRef.current = true;
    setCurrent(bounded);
    setTimeout(() => {
      lockRef.current = false;
    }, 450);
  }, [current]);

  const nextChapter = useCallback(() => {
    if (current < CHAPTERS.length - 1) goToChapter(current + 1);
  }, [current, goToChapter]);

  const prevChapter = useCallback(() => {
    if (current > 0) goToChapter(current - 1);
  }, [current, goToChapter]);

  // Wheel listener with throttle
  const handleWheel = useCallback((e) => {
    if (Math.abs(e.deltaY) < 20 || lockRef.current) return;
    if (e.deltaY > 0) nextChapter();
    else prevChapter();
  }, [nextChapter, prevChapter]);

  // Touch swipe support
  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    const diff = touchStartY.current - e.changedTouches[0].clientY;
    if (Math.abs(diff) > 40) {
      if (diff > 0) nextChapter();
      else prevChapter();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        goBack();
      } else if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        nextChapter();
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        prevChapter();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goBack, nextChapter, prevChapter]);

  const ch = CHAPTERS[current];

  return (
    <div
      ref={containerRef}
      className={`journey-world act-${current + 1}`}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      role="dialog"
      aria-label="The Developer Journey"
    >
      {/* Parallax Depth Layer 1: Ambient Cavern & World Atmosphere */}
      <div className="world-cavern-backdrop" aria-hidden="true" />

      {/* Parallax Depth Layer 2: The Evolving Hearth Flame */}
      <div className={`world-hearth-flame intensity-${ch.flameIntensity}`} aria-hidden="true">
        <div
          className="flame-body"
          style={{ transform: `scale(${ch.flameScale})` }}
        >
          <span className="flame-core" />
          <span className="flame-ember-halo" />
        </div>
      </div>

      {/* Milestone Stage */}
      <main className="chapter-arena">
        {/* Top Header & Act Landmark */}
        <header className="chapter-landmark">
          <span className="act-badge">{ch.act} &bull; MEMORY PROGRESSION</span>
          <h1 className="chapter-title">{ch.title}</h1>
          <p className="chapter-subtitle">{ch.subtitle}</p>
        </header>

        {/* Milestone Narrative Card */}
        <article className="milestone-card" key={ch.id}>
          <div className="card-milestone-pill">
            <span className="pill-dot" aria-hidden="true" />
            <span className="pill-text">{ch.milestone}</span>
          </div>

          <p className="milestone-narrative">{ch.desc}</p>

          <footer className="milestone-meta">
            <span className="meta-tag">{ch.tag}</span>
          </footer>
        </article>

        {/* Progression Controls */}
        <nav className="chapter-nav-bar" aria-label="Journey navigation">
          <button
            type="button"
            className="act-btn prev"
            onClick={prevChapter}
            disabled={current === 0}
            aria-label="Previous chapter"
          >
            &#9650; Previous
          </button>

          <span className="act-indicator" aria-live="polite">
            {current + 1} / {CHAPTERS.length}
          </span>

          <button
            type="button"
            className="act-btn next"
            onClick={nextChapter}
            disabled={current === CHAPTERS.length - 1}
            aria-label="Next chapter"
          >
            Next &#9660;
          </button>
        </nav>
      </main>

      {/* Side Chapter Scrubber Rail */}
      <aside className="timeline-rail" aria-label="Timeline chapters">
        {CHAPTERS.map((c, i) => (
          <button
            key={c.id}
            type="button"
            className={`rail-notch ${i === current ? "is-active" : ""} ${i < current ? "is-past" : ""}`}
            onClick={() => goToChapter(i)}
            aria-label={`Jump to ${c.act}: ${c.title}`}
          >
            <span className="notch-dot" />
            <span className="notch-tooltip">{c.act}: {c.title}</span>
          </button>
        ))}
      </aside>

      {/* Fixed Return Button */}
      <button
        type="button"
        className="journey-leave-btn"
        onClick={goBack}
        aria-label="Return to workshop chamber"
      >
        &#8592; Workshop
      </button>
    </div>
  );
}
