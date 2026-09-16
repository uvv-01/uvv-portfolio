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
    <div className="room-scene" style={{ backgroundImage: `url(${roomImg})` }}>
      {/* TABLE — book & pen: contacts + writing */}
      <button
        type="button"
        className="room-zone zone-book"
        onClick={goToBook}
        aria-label="Open the scribe's table — contacts and notes"
      >
        <span className="zone-label" aria-hidden="true">
          THE SCRIBE&apos;S TABLE
          <small>contacts</small>
        </span>
      </button>

      {/* WALL — hanging achievement badges */}
      <button
        type="button"
        className="room-zone zone-wall"
        onClick={goToWall}
        aria-label="Examine the wall — achievements"
      >
        <span className="zone-label" aria-hidden="true">
          TROPHY WALL
          <small>achievements</small>
        </span>
      </button>

      {/* FIRE — the developer journey */}
      <button
        type="button"
        className="room-zone zone-fire"
        onClick={goToJourney}
        aria-label="Stand by the fire — the journey"
      >
        <span className="zone-label" aria-hidden="true">
          THE FIRE
          <small>journey</small>
        </span>
      </button>

      {/* SWORD — skills */}
      <button
        type="button"
        className="room-zone zone-sword"
        onClick={goToSkills}
        aria-label="Take up the sword — skills"
      >
        <span className="zone-label" aria-hidden="true">
          THE ARMORY
          <small>skills</small>
        </span>
      </button>

      {/* FORGE — projects */}
      <button
        type="button"
        className="room-zone zone-smithy"
        onClick={goToSmithy}
        aria-label="Enter the forge — projects"
      >
        <span className="zone-label" aria-hidden="true">
          THE FORGE
          <small>projects</small>
        </span>
      </button>
    </div>
  );
}
