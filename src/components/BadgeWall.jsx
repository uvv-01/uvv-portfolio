import { useEffect, useState, useCallback } from "react";
import "./BadgeWall.css";
import achievements from "../data/achievements.js";
import { fetchGithubProfile } from "../utils/github.js";

// engraved monogram per badge type
const MARKS = {
  "lc-50": "50",
  "lc-100": "100",
  "active-pi": "PS",
  gssoc: "GS",
  "gh-open-source": null, // uses GitHub mark
  "gh-public-repos": null,
  "gh-followers": null,
};

function GithubMark() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path
        fill="currentColor"
        d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"
      />
    </svg>
  );
}

export default function BadgeWall({ goBack }) {
  const [selected, setSelected] = useState(null);
  const [gh, setGh] = useState(null);

  useEffect(() => {
    let alive = true;
    fetchGithubProfile().then((p) => alive && setGh(p));
    return () => {
      alive = false;
    };
  }, []);

  const liveValue = useCallback(
    (key) => {
      if (!gh) return "…";
      if (key === "public_repos") return gh.public_repos;
      if (key === "followers") return gh.followers;
      return null;
    },
    [gh]
  );

  return (
    <div className="badge-wall" role="dialog" aria-label="Achievement wall">
      <div className="wall-bg" aria-hidden="true" />
      <div className="wall-shade" aria-hidden="true" />

      <header className="wall-head">
        <h1>Trophies of the Wall</h1>
        <p>Each plate was earned, not hung for decoration.</p>
      </header>

      <ul className="wall-badges">
        {achievements.map((a, i) => (
          <li key={a.id} className="badge-item" style={{ "--hang-delay": `${i * 0.35}s` }}>
            <button
              type="button"
              className="badge"
              onClick={() => setSelected(a)}
              aria-label={`${a.title}${a.subtitle ? ` — ${a.subtitle}` : ""}`}
            >
              <span className="badge-nail" aria-hidden="true" />
              <span className="badge-string" aria-hidden="true" />
              <span className="badge-disc">
                <span className="badge-mark" aria-hidden="true">
                  {MARKS[a.id] === null ? <GithubMark /> : MARKS[a.id] || "★"}
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
          <div className="badge-card" role="dialog" aria-label={selected.title}>
            <button
              type="button"
              className="badge-card-close"
              onClick={() => setSelected(null)}
              aria-label="Close details"
            >
              &#215;
            </button>
            <h2>{selected.title}</h2>
            {selected.title_long && <p className="badge-long">{selected.title_long}</p>}
            {selected.subtitle && <p className="badge-sub">{selected.subtitle}</p>}
            {selected.live && (
              <p className="badge-live">
                <span className="badge-live-num">{liveValue(selected.live)}</span>
                <span className="badge-live-label">
                  {selected.live === "public_repos" ? "public repositories" : "followers"} on GitHub
                </span>
              </p>
            )}
            {selected.detail && <p className="badge-detail">{selected.detail}</p>}
            {!selected.detail && !selected.live && (
              <p className="badge-detail badge-pending">
                Details pending — the smith has not engraved this plate yet.
              </p>
            )}
            {selected.source && (
              <a
                className="badge-source"
                href={selected.source}
                target="_blank"
                rel="noreferrer"
              >
                View source &#8599;
              </a>
            )}
          </div>
        </div>
      )}

      <button type="button" className="wall-back" onClick={goBack}>
        &#8592; Return to the Workshop
      </button>
    </div>
  );
}
