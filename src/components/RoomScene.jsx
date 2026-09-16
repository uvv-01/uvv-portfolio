import roomImg from "../assets/images/room.webp";
import "./RoomScene.css";

export default function RoomScene({ goToSkills, goToSmithy }) {
  return (
    <div
      className="room-scene"
      style={{ backgroundImage: `url(${roomImg})` }}
    >
      <button
        type="button"
        className="room-zone zone-sword"
        onClick={goToSkills}
        aria-label="Enter the armory — skills"
      >
        <span className="zone-label" aria-hidden="true">
          THE ARMORY
          <small>skills</small>
        </span>
      </button>

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
