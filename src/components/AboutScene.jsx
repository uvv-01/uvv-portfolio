import "../index.css";

export default function AboutScene({ onReturn, goToRoom }) {
  return (
    <main
      className="about-scene dark-craftsman-about"
      onDoubleClick={onReturn}
      aria-label="About the Craftsman — Yuvraj Singh"
    >
      <div className="about-vignette" aria-hidden="true" />

      <article className="about-box">
        <header className="about-header">
          <span className="about-eyebrow">THE CRAFTSMAN&apos;S CHRONICLE</span>
          <h1 className="about-name fade-item delay1">
            Yuvraj Singh
          </h1>
          <p className="about-pronouns fade-item delay2">He / Him &bull; B.Tech ECE Student</p>
        </header>

        <section className="about-content">
          <p className="fade-item delay3 about-intro">
            Open Source Contributor @ Intel OpenVINO. Focused on Computer Vision, Edge AI inference optimization, and systems where software logic directly commands electronics.
          </p>

          <div className="about-divider fade-item delay4" aria-hidden="true" />

          <p className="fade-item delay4">
            <strong>Foundational Principle:</strong>
            <br />
            Every project begins as raw logic on the anvil. Mastery is earned by understanding time-complexity, memory constraints, and silicon behavior.
          </p>

          <p className="fade-item delay5">
            <strong>Active Technical Focus:</strong>
          </p>

          <ul className="fade-item delay6">
            <li>Selective spatial neural inference for edge vision runtimes</li>
            <li>Hardware-switching computer vision pipelines (CPU/GPU/AUTO)</li>
            <li>Full-stack benchmark exploration and reproducible developer tooling</li>
          </ul>
        </section>

        <footer className="about-actions fade-item delay7">
          <button type="button" className="about-return" onClick={onReturn} aria-label="Return to blade">
            &#8592; The Blade
          </button>
          {goToRoom && (
            <button
              type="button"
              className="about-return primary-entry"
              onClick={goToRoom}
              aria-label="Enter the workshop chamber"
            >
              Enter Workshop &#8594;
            </button>
          )}
        </footer>
      </article>
    </main>
  );
}
