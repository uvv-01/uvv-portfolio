import { useEffect, useState } from "react";
import "./BadgeWall.css";
import achievements from "../data/achievements.js";

export default function BadgeWall({ goBack }) {
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        if (selected) setSelected(null);
        else goBack();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, goBack]);

  return (
    <main className="badge-wall" role="dialog" aria-label="Achievement wall">
      <div className="wall-bg" aria-hidden="true" />
      <div className="wall-shade" aria-hidden="true" />

      <header className="wall-head">
        <span className="wall-eyebrow">PHYSICAL RECORDS OF MILESTONES</span>
        <h1>Trophies of the Wall</h1>
        <p>Each plate was earned through consistency and verified technical contribution.</p>
      </header>

      <ul className="wall-badges" aria-label="Achievement plates">
        {achievements.map((a, i) => (
          <li key={a.id} className="badge-item" style={{ "--hang-delay": `${i * 0.08}s` }}>
            <button
              type="button"
              className="badge"
              onClick={() => setSelected(a)}
              aria-label={`${a.category}: ${a.title} — ${a.subtitle}`}
            >
              <span className="badge-nail" aria-hidden="true" />
              <span className="badge-string" aria-hidden="true" />
              <span className="badge-disc">
                <span className="badge-mark" aria-hidden="true">
                  {a.monogram}
                </span>
              </span>
              <span className="badge-plate">{a.title}</span>
            </button>
          </li>
        ))}
      </ul>

      {selected && (
        <div
          className="badge-modal"
          role="presentation"
          onClick={(e) => e.target === e.currentTarget && setSelected(null)}
        >
          <article className="badge-card" role="dialog" aria-label={selected.title}>
            <button
              type="button"
              className="badge-card-close"
              onClick={() => setSelected(null)}
              aria-label="Close details"
            >
              &#215;
            </button>

            <span className="badge-category-tag">{selected.category}</span>
            <h2>{selected.title}</h2>
            {selected.subtitle && <p className="badge-sub">{selected.subtitle}</p>}

            <p className="badge-detail">{selected.detail}</p>

            {selected.verification && (
              <p className="badge-verification">
                <span className="veri-icon" aria-hidden="true">&#9679;</span> {selected.verification}
              </p>
            )}

            {selected.source && (
              <a
                className="badge-source"
                href={selected.source}
                target="_blank"
                rel="noreferrer"
              >
                Inspect Public Record &#8599;
              </a>
            )}
          </article>
        </div>
      )}

      <button type="button" className="wall-back" onClick={goBack} aria-label="Return to workshop chamber">
        &#8592; Return to the Workshop
      </button>
    </main>
  );
}
