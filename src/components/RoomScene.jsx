import roomImg from "../assets/images/room.webp";
import "./RoomScene.css";

export default function RoomScene({
  goToBook,
  goToWall,
  goToJourney,
  goToSkills,
  goToSmithy,
}) {
  return (
    <main className="room-scene" aria-label="The Blacksmith's Workshop">
      <div className="room-stage" style={{ backgroundImage: `url(${roomImg})` }}>
        {/* Ambient shadow and hearth lighting vignette */}
        <div className="room-ambient-lighting" aria-hidden="true" />

        {/* Mobile-only Chamber Title */}
        <div className="room-mobile-header" aria-hidden="true">
          <span className="room-mobile-eyebrow">THE BLACKSMITH&apos;S WORKSHOP</span>
          <h2 className="room-mobile-title">Chamber Stations</h2>
        </div>

        {/* 1. SCRIBE'S TABLE — book & pen: contacts + journal */}
        <button
          type="button"
          className="room-zone zone-book"
          onClick={goToBook}
          aria-label="Study manuscript — contacts and journal notes"
        >
          <span className="zone-indicator" aria-hidden="true" />
          <span className="zone-label" aria-hidden="true">
            <span className="zone-action">Read</span>
            <span className="zone-title">The Scribe&apos;s Table</span>
            <small>contacts &amp; notes</small>
          </span>
        </button>

        {/* 2. TROPHY WALL — physical milestone plaques */}
        <button
          type="button"
          className="room-zone zone-wall"
          onClick={goToWall}
          aria-label="Inspect wall — achievements and milestones"
        >
          <span className="zone-indicator" aria-hidden="true" />
          <span className="zone-label" aria-hidden="true">
            <span className="zone-action">Inspect</span>
            <span className="zone-title">Trophy Wall</span>
            <small>milestones</small>
          </span>
        </button>

        {/* 3. HEARTH FIRE — the chronological journey */}
        <button
          type="button"
          className="room-zone zone-fire"
          onClick={goToJourney}
          aria-label="Tend the fire — developer journey progression"
        >
          <span className="zone-indicator" aria-hidden="true" />
          <span className="zone-label" aria-hidden="true">
            <span className="zone-action">Tend</span>
            <span className="zone-title">The Hearth Fire</span>
            <small>journey progression</small>
          </span>
        </button>

        {/* 4. SWORD RACK — skills as weapons */}
        <button
          type="button"
          className="room-zone zone-sword"
          onClick={goToSkills}
          aria-label="Examine the armory — skills as weapons"
        >
          <span className="zone-indicator" aria-hidden="true" />
          <span className="zone-label" aria-hidden="true">
            <span className="zone-action">Study</span>
            <span className="zone-title">The Armory</span>
            <small>skills as weapons</small>
          </span>
        </button>

        {/* 5. THE FORGE WORKTABLE — forging projects */}
        <button
          type="button"
          className="room-zone zone-smithy"
          onClick={goToSmithy}
          aria-label="Enter the forge — projects crafted on the anvil"
        >
          <span className="zone-indicator" aria-hidden="true" />
          <span className="zone-label" aria-hidden="true">
            <span className="zone-action">Forge</span>
            <span className="zone-title">The Anvil</span>
            <small>projects</small>
          </span>
        </button>
      </div>
    </main>
  );
}
