// ---------------------------------------------------------------
// Forged works — real repositories from github.com/uvv-01.
// Physically positioned in the blacksmith's workshop:
// - Anvil: Unfinished blade (work in progress)
// - Hearth whetstone: Blade being finished / refined
// - Wall pegs / rack: Completed, battle-ready master swords
// ---------------------------------------------------------------

import sword1 from "../assets/images/sword1.png";
import sword2 from "../assets/images/sword2.png";
import sword3 from "../assets/images/sword3.png";
import sword5 from "../assets/images/sword5.png";
import sword8 from "../assets/images/sword8.png";

const projects = [
  // --- ANVIL WORKPIECE (Ongoing Research / Work In Progress) ---
  {
    id: "fovea-edge",
    title: "FoveaEdge",
    repo: "FoveaEdge",
    stage: "ongoing",
    physicalLocation: "Unfinished blade on anvil",
    stageLabel: "Work in progress",
    swordImg: sword3,
    swordName: "Curved Saliency Edge",
    desc: "Selective inference research for OpenVINO edge vision devices.",
    shortPurpose: "Selective neural inference research for Intel OpenVINO edge runtimes. Dynamically isolates spatial regions of interest to eliminate redundant full-frame compute on low-power IoT devices.",
    tech: "Python • Intel OpenVINO • Edge AI • Computer Vision",
    url: "https://github.com/uvv-01/FoveaEdge",
    demo: null,
  },

  // --- HEARTH WHETSTONE (Active Finishing & Polishing) ---
  {
    id: "uvv-portfolio",
    title: "UVV Berserk Workshop",
    repo: "uvv-portfolio",
    stage: "finishing",
    physicalLocation: "Blade on the hearth whetstone",
    stageLabel: "Active finishing",
    swordImg: sword8,
    swordName: "The Blacksmith's Dragonslayer",
    desc: "The explorable dark-fantasy blacksmith portfolio you are standing in.",
    shortPurpose: "An interactive Berserk-inspired blacksmith workshop portfolio where developer skills become forged blades and achievements hang on stone walls.",
    tech: "React 19 • Vite • Web Audio API • CSS Engine",
    url: "https://github.com/uvv-01/uvv-portfolio",
    demo: null,
  },

  // --- WALL MOUNT (Completed Master Greatsword) ---
  {
    id: "ov-navigator",
    title: "OpenVINO OSS Navigator",
    repo: "openvino_oss_navigator",
    stage: "completed",
    physicalLocation: "Master greatsword mounted on stone",
    stageLabel: "Completed & deployed",
    swordImg: sword1,
    swordName: "Broad Greatsword of Metrics",
    desc: "Interactive analytics web dashboard for Intel OpenVINO benchmark exploration.",
    shortPurpose: "Full-stack analytics platform aggregating benchmark throughput, latency metrics, and hardware runtimes across the Intel OpenVINO ecosystem.",
    tech: "TypeScript • Next.js • FastAPI • Python • Tailwind",
    url: "https://github.com/uvv-01/openvino_oss_navigator",
    demo: "https://openvino-oss-navigator.vercel.app",
  },

  // --- WALL RACK (Completed Crossguard Blade) ---
  {
    id: "ov-face-switch",
    title: "Face Detection Auto-Switch",
    repo: "openvino-face-detection-auto-switch",
    stage: "completed",
    physicalLocation: "Crossguard blade in timber rack",
    stageLabel: "Completed tool",
    swordImg: sword5,
    swordName: "Adaptive Crossguard Blade",
    desc: "Real-time face detection with dynamic CPU/GPU/AUTO device handoff and telemetry GUI.",
    shortPurpose: "Real-time edge computer vision pipeline with dynamic CPU/GPU/AUTO device migration, preventing video freezing when hardware resources throttle.",
    tech: "Python • OpenVINO Runtime • OpenCV • Tkinter",
    url: "https://github.com/uvv-01/openvino-face-detection-auto-switch",
    demo: null,
  },

  // --- FLOOR RACK (Completed Algorithmic Foundation) ---
  {
    id: "arya-algorithms",
    title: "Arya Algorithms & Foundation",
    repo: "arya_college_training",
    stage: "completed",
    physicalLocation: "Honed longsword on timber rack",
    stageLabel: "Completed foundation",
    swordImg: sword2,
    swordName: "Knight's Honed Longsword",
    desc: "Algorithmic foundation, object-oriented systems, and data structure implementations.",
    shortPurpose: "Algorithmic foundation and memory-efficient data structure implementations built from first principles in modern C++.",
    tech: "C++ • Algorithms • Data Structures • OOP",
    url: "https://github.com/uvv-01/arya_college_training",
    demo: null,
  },
];

export default projects;
