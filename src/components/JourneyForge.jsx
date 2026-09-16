import { useEffect, useState } from "react";
import "./JourneyForge.css";
import journey from "../data/journey.js";
import { fetchGithubProfile } from "../utils/github.js";

export default function JourneyForge({ goBack }) {
  const [gh, setGh] = useState(null);

  useEffect(() => {
    let alive = true;
    fetchGithubProfile().then((p) => alive && setGh(p));
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="journey" role="dialog" aria-label="Developer journey">
      <div className="journey-bg" aria-hidden="true" />
      <div className="journey-embers" aria-hidden="true">
        <span /><span /><span /><span /><span /><span /><span />
      </div>

      <header className="journey-head">
        <div className="journey-flame" aria-hidden="true">
          <span className="flame-core" />
          <span className="flame-halo" />
        </div>
        <h1>What the Fire Remembers</h1>
        <p className="journey-sub">
          Every step was heated, struck, and shaped.
          {gh ? ` ${gh.public_repos} public repositories and counting.` : ""}
        </p>
      </header>

      <ol className="journey-trail">
        {journey.map((m, i) => (
          <li
            key={m.id}
            className={`trail-step ${m.kind === "current" ? "is-current" : ""} ${
              m.kind === "origin" ? "is-origin" : ""
            }`}
            style={{ "--step-delay": `${0.25 + i * 0.22}s` }}
          >
            {i > 0 && <span className="trail-link" aria-hidden="true" />}
            <span className="trail-node" aria-hidden="true">
              <span className="node-core" />
            </span>
            <div className="trail-card">
              <h2>{m.title}</h2>
              {m.title_long && <p className="trail-long">{m.title_long}</p>}
              {m.detail && <p className="trail-detail">{m.detail}</p>}
              {!m.detail && (
                <p className="trail-detail trail-pending">
                  Story pending — this metal has not been engraved yet.
                </p>
              )}
              {m.kind === "current" && (
                <span className="trail-heat" aria-hidden="true" />
              )}
            </div>
          </li>
        ))}
      </ol>

      <button type="button" className="journey-back" onClick={goBack}>
        &#8592; Return to the Workshop
      </button>
    </div>
  );
}
