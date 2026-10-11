import { useState, useRef, useEffect, useCallback } from "react";
import "./ContactBook.css";
import { profile } from "../data/profile.js";
import pencilSound from "../assets/sounds/pencil.mp3";

const ICONS = {
  github: (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path
        fill="currentColor"
        d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"
      />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.55V9h3.57v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.55C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.72C24 .77 23.2 0 22.22 0Z"
      />
    </svg>
  ),
  email: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M2 4h20a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Zm10 8.7L21 6H3l9 6.7ZM3 8.4V19h18V8.4l-9 6.7-9-6.7Z"
      />
    </svg>
  ),
  leetcode: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M13.4 2.1 8.8 6.7a1.3 1.3 0 1 0 1.8 1.8l2.8-2.8 2.8 2.8a1.3 1.3 0 1 0 1.8-1.8L15.2 2.1a1.3 1.3 0 0 0-1.8 0ZM6.6 8.9 2.7 12.8a1.3 1.3 0 0 0 0 1.8l3.9 3.9 1.6 1.6a1.3 1.3 0 1 0 1.8-1.8l-1.6-1.6 1.6-1.6a1.3 1.3 0 1 0-1.8-1.8l-1.6 1.6-1.6-1.6 1.6-1.6a1.3 1.3 0 1 0-1.8-1.8Z"
      />
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069ZM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0Zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881Z"
      />
    </svg>
  ),
};

export default function ContactBook({ goBack }) {
  const [note, setNote] = useState(() => {
    try {
      return localStorage.getItem("uvv_scribe_note") || "";
    } catch {
      return "";
    }
  });

  const audioRef = useRef(null);
  const audioTimeoutRef = useRef(null);

  // Audio lifecycle: instantiate once and GUARANTEE clean stop on unmount
  useEffect(() => {
    const audio = new Audio(pencilSound);
    audio.volume = 0.35;
    audioRef.current = audio;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }
      if (audioTimeoutRef.current) {
        clearTimeout(audioTimeoutRef.current);
      }
    };
  }, []);

  // Safe debounced pencil audio feedback while typing
  const playPencilScratch = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    try {
      if (a.paused || a.currentTime > 1.2) {
        a.currentTime = 0.2;
        a.play().catch(() => {});
      }
      if (audioTimeoutRef.current) clearTimeout(audioTimeoutRef.current);
      audioTimeoutRef.current = setTimeout(() => {
        if (audioRef.current) audioRef.current.pause();
      }, 350);
    } catch (err) {
      void err;
    }
  }, []);

  const handleNoteChange = (e) => {
    const val = e.target.value;
    setNote(val);
    playPencilScratch();
    try {
      localStorage.setItem("uvv_scribe_note", val);
    } catch (err) {
      void err;
    }
  };

  const clearNote = () => {
    setNote("");
    try {
      localStorage.removeItem("uvv_scribe_note");
    } catch (err) {
      void err;
    }
  };

  const handleExit = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    goBack();
  }, [goBack]);

  // Clean keyboard listener
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") handleExit();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleExit]);

  return (
    <div className="scribe-desk-scene" role="dialog" aria-label="The Scribe's Table — Contacts and Notes">
      <div className="desk-backdrop" aria-hidden="true" />

      {/* The Open Journal Artifact */}
      <article className="scribe-journal">
        <header className="journal-header">
          <div className="journal-seal" aria-hidden="true">⚜</div>
          <h1 className="journal-title">The Scribe&apos;s Table</h1>
          <p className="journal-subtitle">Leave a mark upon this realm, or find me across the outer world.</p>
        </header>

        {/* Embossed Contact Cards */}
        <section className="journal-section" aria-label="Developer channels">
          <div className="contacts-grid">
            {profile.contacts
              .filter((c) => c.url)
              .map((c) => (
                <a
                  key={c.id}
                  href={c.url}
                  target="_blank"
                  rel="noreferrer"
                  className="contact-card"
                  aria-label={`${c.label}: ${c.value || c.url}`}
                >
                  <span className="card-icon" aria-hidden="true">
                    {ICONS[c.id]}
                  </span>
                  <div className="card-info">
                    <span className="card-label">{c.label}</span>
                    <span className="card-val">{c.value || "Connect"}</span>
                  </div>
                  <span className="card-arrow" aria-hidden="true">&#8599;</span>
                </a>
              ))}
          </div>
        </section>

        {/* Working Scribe Note / Parchment Area */}
        <section className="journal-section writing-area" aria-label="Parchment note area">
          <div className="writing-header">
            <label htmlFor="scribe-parchment-input" className="writing-label">
              Inscribe a Note
            </label>
            {note && (
              <button
                type="button"
                onClick={clearNote}
                className="clear-note-btn"
                aria-label="Clear handwritten note"
              >
                Clear Ink &times;
              </button>
            )}
          </div>

          <div className="parchment-textarea-wrap">
            <textarea
              id="scribe-parchment-input"
              value={note}
              onChange={handleNoteChange}
              placeholder="Your inscriptions are saved in local memory. They remain here across visits..."
              rows={4}
              spellCheck="false"
              className="parchment-input"
            />
            <div className="quill-indicator" aria-hidden="true" />
          </div>
        </section>

        {/* Clean Return Button */}
        <footer className="journal-footer">
          <button
            type="button"
            className="journal-return-btn"
            onClick={handleExit}
            aria-label="Close journal and return to workshop chamber"
          >
            &#8592; Return to Workshop
          </button>
        </footer>
      </article>
    </div>
  );
}
