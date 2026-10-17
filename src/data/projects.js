// ---------------------------------------------------------------
// Forged works — real repositories from github.com/uvv-01.
// Categorized by physical workshop stage:
// - ongoing: Half-forged swords currently being worked on
// - finishing: In the hearth fire / sharpening area
// - completed: Finished swords on the armory racks
// ---------------------------------------------------------------

import sword1 from "../assets/images/sword1.png";
import sword2 from "../assets/images/sword2.png";
import sword3 from "../assets/images/sword3.png";
import sword4 from "../assets/images/sword4.png";
import sword5 from "../assets/images/sword5.png";
import sword8 from "../assets/images/sword8.png";

const projects = [
  // --- ONGOING PROJECTS (Half-Forged Swords) ---
  {
    id: "fovea-edge",
    title: "FoveaEdge",
    repo: "FoveaEdge",
    stage: "ongoing",
    stageLabel: "Work in progress",
    swordImg: sword3,
    swordName: "Curved Saliency Edge (Unfinished Stock)",
    desc: "Selective inference research for OpenVINO edge vision devices.",
    whatItIs: "Selective neural inference research for Intel OpenVINO edge vision runtimes.",
    whatBuilding: "Designing a dynamic spatial saliency gating pipeline that runs neural passes exclusively on regions of interest, avoiding wasteful full-frame compute on low-power IoT devices.",
    currentPhase: "Benchmarking latency reduction bounds and calibrating threshold gating across edge devices.",
    tech: "Python • Intel OpenVINO • Computer Vision • Edge AI",
    url: "https://github.com/uvv-01/FoveaEdge",
    demo: null,
    highlights: [
      "Dynamic spatial region selection instead of brute-force full-frame passes",
      "Benchmarked on OpenVINO runtime with predictable latency bounds",
      "Designed for resource-constrained IoT and embedded vision systems",
    ],
  },
  {
    id: "pengu",
    title: "Pengu Voice Assistant",
    repo: "pengu",
    stage: "ongoing",
    stageLabel: "Work in progress",
    swordImg: sword4,
    swordName: "Razor Dirk (Rough Fuller)",
    desc: "A local-first, voice-controlled autonomous desktop assistant for Windows.",
    whatItIs: "A local-first, voice-controlled autonomous desktop assistant for Windows.",
    whatBuilding: "Building a private, zero-cloud speech interface with CPU-optimized Faster Whisper STT, wake-word listener, and native Win32 window automation hooks.",
    currentPhase: "Tuning false-trigger rejection and integrating native desktop workflow action bindings.",
    tech: "Python • Faster Whisper • Win32 API • Local LLM",
    url: "https://github.com/uvv-01/pengu",
    demo: null,
    highlights: [
      "Local STT wake-word activation with robust false-trigger rejection",
      "Direct desktop and browser manipulation via native Windows API hooks",
      "Zero telemetry / 100% private on-device execution",
    ],
  },

  // --- FINISHING AREA (Hearth Fire & Sharpening Whetstone) ---
  {
    id: "uvv-portfolio",
    title: "UVV Berserk Workshop",
    repo: "uvv-portfolio",
    stage: "finishing",
    stageLabel: "On the Whetstone / Active Finishing",
    swordImg: sword8,
    swordName: "The Blacksmith's Dragonslayer",
    desc: "The explorable dark-fantasy blacksmith portfolio you are standing in.",
    purpose: "Transform developer portfolio exploration into an atmospheric medieval blacksmith workshop where code is forged into blades and trophies hang on stone walls.",
    built: "Architected the 12-scene reactive state machine, physics-calibrated room hotspot engine, sound architecture, and authentic blacksmith workshop transition.",
    tech: "React 19 • Vite • Web Audio API • CSS Animation Engine",
    result: "Zero-bleed workshop experience with tactile stations, realistic forging loading sequence, and physical project swords.",
    url: "https://github.com/uvv-01/uvv-portfolio",
    demo: null,
    highlights: [
      "12 interconnected dark-fantasy scenes with synchronized sound design",
      "Physical forge loading sequence transitioning into 3-zone project workshop",
      "Authentic developer evidence directly mapped to physical swordsmithing stages",
    ],
  },

  // --- COMPLETED PROJECTS (Finished Master Swords) ---
  {
    id: "ov-navigator",
    title: "OpenVINO OSS Navigator",
    repo: "openvino_oss_navigator",
    stage: "completed",
    stageLabel: "Completed & Deployed",
    swordImg: sword1,
    swordName: "Broad Greatsword of Metrics",
    desc: "Interactive analytics web dashboard for Intel OpenVINO benchmark exploration.",
    purpose: "Solved the manual parsing of dense raw benchmark reports for Intel OpenVINO across heterogeneous hardware targets.",
    built: "Engineered full-stack analytics platform with FastAPI data ingestion engine, interactive Next.js analytics UI, and real-time visualization.",
    tech: "TypeScript • Next.js • FastAPI • Python • Tailwind CSS",
    result: "Deployed on Vercel with live multi-model comparison matrix across CPU/GPU targets and interactive throughput percentiles.",
    url: "https://github.com/uvv-01/openvino_oss_navigator",
    demo: "https://openvino-oss-navigator.vercel.app",
    highlights: [
      "Live multi-model performance comparison matrix across hardware targets",
      "Interactive data visualizations for FPS throughput and latency percentiles",
      "Clean REST API backend powering real-time client-side queries",
    ],
  },
  {
    id: "ov-face-switch",
    title: "Face Detection Auto-Switch",
    repo: "openvino-face-detection-auto-switch",
    stage: "completed",
    stageLabel: "Completed Tool",
    swordImg: sword5,
    swordName: "Adaptive Crossguard Blade",
    desc: "Real-time face detection with dynamic CPU/GPU/AUTO device handoff and telemetry GUI.",
    purpose: "Prevents video pipeline freezing or frame drops when hardware resources throttle during real-time computer vision inference.",
    built: "Implemented multithreaded camera queue, OpenVINO runtime inference loop, and dynamic CPU/GPU/AUTO device migration with Tkinter telemetry.",
    tech: "Python • OpenVINO Runtime • OpenCV • Tkinter",
    result: "Shipped tool supporting real-time runtime migration between CPU, GPU, and AUTO without pipeline restart.",
    url: "https://github.com/uvv-01/openvino-face-detection-auto-switch",
    demo: null,
    highlights: [
      "Seamless runtime migration between CPU, GPU, and AUTO without pipeline restarts",
      "Real-time FPS and system load telemetry dashboard",
      "Thread-isolated video capture and inference queue",
    ],
  },
  {
    id: "arya-algorithms",
    title: "Arya Algorithms & Foundation",
    repo: "arya_college_training",
    stage: "completed",
    stageLabel: "Completed Foundation",
    swordImg: sword2,
    swordName: "Knight's Honed Longsword",
    desc: "Algorithmic foundation, object-oriented systems, and data structure implementations.",
    purpose: "Building rigorous computational intuition and low-level algorithmic discipline from first principles.",
    built: "Implemented custom data structures from scratch (trees, graphs, heaps) and solved 100+ competitive coding challenges in C++.",
    tech: "C++ • Algorithms • Data Structures • OOP",
    result: "Optimized memory/runtime complexities across comprehensive algorithmic problem sets.",
    url: "https://github.com/uvv-01/arya_college_training",
    demo: null,
    highlights: [
      "Core data structures implemented from scratch (trees, graphs, heaps)",
      "Systematic competitive programming problem sets and time complexity analysis",
      "Object-oriented design patterns and low-level memory discipline",
    ],
  },
];

export default projects;
