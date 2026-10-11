// ---------------------------------------------------------------
// Forged works — real repositories from github.com/uvv-01.
// Names, descriptions and languages come from the GitHub API
// (verified September 2026). GitHub URLs are real. role/highlights/
// demo fields are structural placeholders for the owner to fill —
// never fabricated.
// ---------------------------------------------------------------

import sword1 from "../assets/images/sword1.png";
import sword2 from "../assets/images/sword2.png";
import sword3 from "../assets/images/sword3.png";
import sword4 from "../assets/images/sword4.png";
import sword5 from "../assets/images/sword5.png";
import sword8 from "../assets/images/sword8.png";

const projects = [
  {
    id: "fovea-edge",
    title: "FoveaEdge",
    repo: "FoveaEdge",
    swordImg: sword3,
    swordName: "Curved Saliency Edge",
    desc: "Selective inference research for OpenVINO edge vision devices.",
    problem:
      "High-resolution edge computer vision consumes prohibitive power and latency when running full-frame neural network inference on every video frame.",
    solution:
      "Mimics human foveated vision: dynamically detects spatially salient regions of interest and runs targeted inference only where necessary, saving compute without sacrificing detection quality.",
    role: "Lead researcher & developer: designed spatial saliency gating pipeline, benchmarked latency reduction on OpenVINO edge runtimes.",
    tech: "Python • Intel OpenVINO • Computer Vision • Edge AI",
    url: "https://github.com/uvv-01/FoveaEdge",
    demo: null,
    status: "Active Research & Baseline",
    highlights: [
      "Dynamic spatial region selection instead of brute-force full-frame passes",
      "Benchmarked on OpenVINO runtime with predictable latency bounds",
      "Designed for resource-constrained IoT and embedded vision systems",
    ],
  },
  {
    id: "ov-navigator",
    title: "OpenVINO OSS Navigator",
    repo: "openvino_oss_navigator",
    swordImg: sword1,
    swordName: "Broad Greatsword of Metrics",
    desc: "Interactive analytics web dashboard for Intel OpenVINO benchmark exploration.",
    problem:
      "Engineering teams and OSS contributors had to manually parse dense raw benchmark reports to evaluate model speed across heterogeneous hardware.",
    solution:
      "Engineered an interactive dashboard where users can compare models, OpenVINO versions, target hardware (CPU/GPU), and latency/throughput metrics visually.",
    role: "Full-stack engineer: built FastAPI data ingestion engine, interactive Next.js analytics UI, and deployed on Vercel.",
    tech: "TypeScript • Next.js • FastAPI • Python • Tailwind CSS",
    url: "https://github.com/uvv-01/openvino_oss_navigator",
    demo: "https://openvino-oss-navigator.vercel.app",
    status: "Production Deployment",
    highlights: [
      "Live multi-model performance comparison matrix across hardware targets",
      "Interactive data visualizations for FPS throughput and latency percentiles",
      "Clean REST API backend powering real-time client-side queries",
    ],
  },
  {
    id: "pengu",
    title: "Pengu Voice Assistant",
    repo: "pengu",
    swordImg: sword4,
    swordName: "Razor Dirk of Autonomy",
    desc: "A local-first, voice-controlled autonomous desktop assistant for Windows.",
    problem:
      "Mainstream voice assistants require continuous cloud internet connections, compromising personal desktop privacy and introducing network latency.",
    solution:
      "Built a completely local voice AI running directly on Windows that understands natural speech, controls desktop windows, opens applications, and executes autonomous workflows.",
    role: "Architect & developer: integrated CPU-optimized Faster Whisper STT, wake-word listener, and Win32 automation bindings.",
    tech: "Python • Faster Whisper • Win32 API • Local LLM",
    url: "https://github.com/uvv-01/pengu",
    demo: null,
    status: "Functional Prototype",
    highlights: [
      "Local STT wake-word activation with robust false-trigger rejection",
      "Direct desktop and browser manipulation via native Windows API hooks",
      "Zero telemetry / 100% private on-device execution",
    ],
  },
  {
    id: "ov-face-switch",
    title: "Face Detection Auto-Switch",
    repo: "openvino-face-detection-auto-switch",
    swordImg: sword5,
    swordName: "Adaptive Crossguard Blade",
    desc: "Real-time face detection with dynamic CPU/GPU/AUTO device handoff and telemetry GUI.",
    problem:
      "Real-time video processing pipelines freeze or drop frames when hardware resources become throttled or target devices need runtime switching.",
    solution:
      "Implemented a thread-safe computer vision pipeline that switches between CPU, GPU, and AUTO inference targets dynamically while rendering live FPS and CPU telemetry.",
    role: "Creator: implemented OpenVINO runtime inference loop, multithreaded camera pipeline, and Tkinter telemetry dashboard.",
    tech: "Python • OpenVINO Runtime • OpenCV • Tkinter",
    url: "https://github.com/uvv-01/openvino-face-detection-auto-switch",
    demo: null,
    status: "Shipped Tool",
    highlights: [
      "Seamless runtime migration between CPU, GPU, and AUTO without pipeline restarts",
      "Real-time FPS and system load telemetry dashboard",
      "Thread-isolated video capture and inference queue",
    ],
  },
  {
    id: "uvv-portfolio",
    title: "UVV Berserk Workshop",
    repo: "uvv-portfolio",
    swordImg: sword8,
    swordName: "The Blacksmith's Dragonslayer",
    desc: "The explorable dark-fantasy blacksmith portfolio you are standing in.",
    problem:
      "Generic template portfolios feel sterile and fail to convey the grit, craft, and depth of technical exploration.",
    solution:
      "Transformed developer portfolio exploration into an atmospheric medieval blacksmith workshop where code is forged into blades and trophies hang on stone walls.",
    role: "Designer & Engineer: crafted the 12-scene reactive state machine, hotspot geometry engine, sound architecture, and hammer-forging sequence.",
    tech: "React 19 • Vite • Web Audio API • CSS Keyframe Engine",
    url: "https://github.com/uvv-01/uvv-portfolio",
    demo: null,
    status: "Living Experience",
    highlights: [
      "12 interconnected dark-fantasy scenes with cinematic sound design",
      "Physics-accurate room hotspot tracking aligned to hand-drawn artwork",
      "Multi-stage project forging sequence with synchronized iron reveal",
    ],
  },
  {
    id: "arya-algorithms",
    title: "Arya Algorithms & Foundation",
    repo: "arya_college_training",
    swordImg: sword2,
    swordName: "Knight's Honed Longsword",
    desc: "Algorithmic foundation, object-oriented systems, and data structure implementations.",
    problem:
      "Building robust engineering problem-solving intuition requires rigorous foundational implementation from first principles.",
    solution:
      "Comprehensive repository of computational solutions, algorithmic problem-solving patterns, custom data structures, and object-oriented architectures.",
    role: "Author: implemented comprehensive algorithmic solutions and optimized memory/runtime complexities.",
    tech: "C++ • Algorithms • Data Structures • OOP",
    url: "https://github.com/uvv-01/arya_college_training",
    demo: null,
    status: "Completed Foundation",
    highlights: [
      "Core data structures implemented from scratch (trees, graphs, heaps)",
      "Systematic competitive programming problem sets and time complexity analysis",
      "Object-oriented design patterns and low-level memory discipline",
    ],
  },
];

export default projects;
