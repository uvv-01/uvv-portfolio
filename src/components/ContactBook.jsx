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
};

export default function ContactBook({ goBack }) {
  const [note, setNote] = useState("");
  const audioRef = useRef(null);

  // one Audio instance shared across remounts, so rapid open/close
  // of the book never stacks copies of the sound
  useEffect(() => {
    if (!ContactBook._audio) {
      ContactBook._audio = new Audio(pencilSound);
      ContactBook._audio.volume = 0.5;
    }
    audioRef.current = ContactBook._audio;
  }, []);

  const scratch = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0.4; // jump to the scratchy section
    audio.play().catch(() => {});
  }, []);

  return (
    <div className="contact-book" role="dialog" aria-label="Contact notebook">
      <div className="book-bg" aria-hidden="true" />

      <div className="book-page">
        <header className="book-head">
          <h1>The Scribe&apos;s Table</h1>
          <p className="book-sub">Leave a mark, or find me elsewhere.</p>
        </header>

        <ul className="book-contacts">
          {profile.contacts
            .filter((c) => c.url)
            .map((c) => (
              <li key={c.id}>
                <a href={c.url} target="_blank" rel="noreferrer" className="contact-link">
                  <span className="contact-icon" aria-hidden="true">
                    {ICONS[c.id]}
                  </span>
                  <span className="contact-label">{c.label}</span>
                  <span className="contact-arrow" aria-hidden="true">
                    &#8599;
                  </span>
                </a>
              </li>
            ))}
        </ul>

        <div className="book-writing">
          <label className="book-label" htmlFor="scribe-note">
            Write in the book
          </label>
          <textarea
            id="scribe-note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onKeyDown={scratch}
            placeholder="Your notes stay in this world. They are not sent anywhere."
            rows={5}
            spellCheck="false"
          />
          <span className="book-pen" aria-hidden="true" />
        </div>

        <button type="button" className="book-back" onClick={goBack}>
          &#8592; Return to the Workshop
        </button>
      </div>
    </div>
  );
}
