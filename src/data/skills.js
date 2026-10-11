import sword1 from "../assets/images/sword1.png";
import sword2 from "../assets/images/sword2.png";
import sword3 from "../assets/images/sword3.png";
import sword4 from "../assets/images/sword4.png";
import sword5 from "../assets/images/sword5.png";
import sword6 from "../assets/images/sword6.png";
import sword7 from "../assets/images/sword7.png";
import sword8 from "../assets/images/sword8.png";

// One entry per sword in the arc. All skills/claims here come from
// the About scene content supplied by the owner. `line` is the
// second supporting line — PLACEHOLDER until owner copy arrives.
const skills = [
  {
    name: "Java Backend",
    desc: "OOP + DSA foundation",
    use: "Backend logic and structured problem solving",
    line: "Object-oriented design patterns, clean class hierarchies, and robust algorithmic fundamentals.",
    img: sword1,
  },
  {
    name: "Web Dev",
    desc: "React & Next.js UI systems",
    use: "Interactive interfaces, like this workshop and the OSS Navigator",
    line: "Component state orchestration, responsive layouts, Tailwind CSS, and custom keyframe animations.",
    img: sword2,
  },
  {
    name: "Computer Vision",
    desc: "OpenCV + OpenVINO",
    use: "Real-time camera feeds, detection, and edge inference",
    line: "Frame pre-processing, bounding box calculations, and live video stream orchestration.",
    img: sword3,
  },
  {
    name: "Edge AI / OpenVINO",
    desc: "Intel OpenVINO runtime",
    use: "Optimizing neural network inference on CPU, iGPU, and edge devices",
    line: "Dynamic hardware switching, selective spatial inference research, and throughput profiling.",
    img: sword4,
  },
  {
    name: "Open Source",
    desc: "GitHub ecosystem tooling",
    use: "OpenVINO diagnostic tools, benchmark dashboards, and community collaboration",
    line: "Cross-repo contributions, benchmark tooling, and reproducible open-source documentation.",
    img: sword5,
  },
  {
    name: "DSA & Problem Solving",
    desc: "LeetCode & C++ competitive coding",
    use: "Algorithmic thinking, optimization, and time/space complexity analysis",
    line: "Consistent multi-day challenge milestones, data structure implementation, and contest fundamentals.",
    img: sword6,
  },
  {
    name: "Electronics (ECE)",
    desc: "Hardware & embedded concepts",
    use: "Where software logic meets physical semiconductor circuits",
    line: "Circuit analysis, test equipment, signal fundamentals, and basic electrical drawings.",
    img: sword7,
  },
  {
    name: "Systems & Automation",
    desc: "Local AI & desktop workflows",
    use: "On-device speech processing, Win32 API hooks, and task automation",
    line: "Local Whisper STT inference, zero-cloud desktop control, and background task orchestrators.",
    img: sword8,
  },
];

export default skills;
