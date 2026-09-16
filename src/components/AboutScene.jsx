import zoomImg from "../assets/images/zoom.jpeg";
import "../index.css";

export default function AboutScene({ onReturn }) {
  return (
    <div
      className="about-scene"
      style={{ backgroundImage: `url(${zoomImg})` }}
      onDoubleClick={onReturn}
    >
      <div className="overlay" />

      <div className="about-box">
        <h1 className="about-name fade-item delay1">
          <span className="about-rune" aria-hidden="true">
            &#5799;
          </span>
          Yuvraj Singh
        </h1>

        <p className="about-pronouns fade-item delay2">He / Him</p>

        <p className="fade-item delay3">
          B.Tech ECE Student | Open Source @ OpenVINO (Intel)
          <br />
          Computer Vision &#8226; Edge AI &#8226; Web Dev &#8226; Hackathons
        </p>

        <p className="fade-item delay4">
          I build intelligent systems where software meets electronics.
        </p>

        <p className="fade-item delay5">
          Contributed to OpenVINO by building environment diagnostic tools.
        </p>

        <p className="fade-item delay6">
          <b>Currently exploring:</b>
        </p>

        <ul className="fade-item delay7">
          <li>Computer Vision &amp; OpenVINO</li>
          <li>AI + Web Integration</li>
          <li>Open Source Systems</li>
        </ul>

        <button type="button" className="about-return fade-item delay7" onClick={onReturn}>
          &#8592; Return
        </button>
      </div>
    </div>
  );
}
