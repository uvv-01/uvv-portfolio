import sword1 from "../assets/images/sword1.png";
import sword2 from "../assets/images/sword2.png";
import sword3 from "../assets/images/sword3.png";
import sword4 from "../assets/images/sword4.png";
import sword5 from "../assets/images/sword5.png";
import sword6 from "../assets/images/sword6.png";
import sword7 from "../assets/images/sword7.png";
import sword8 from "../assets/images/sword8.png";

// Skills represented as weapons of craft.
// Direct relationship: SKILL → PROJECT → EVIDENCE.
const skills = [
  {
    id: "java-backend",
    name: "Java Backend",
    desc: "Object-Oriented Architecture & DSA",
    use: "Backend logic, modular architectures, and structured problem solving",
    line: "Clean class hierarchies, separation of concerns, and robust algorithmic fundamentals.",
    evidenceProject: "Arya Algorithms & Foundation",
    evidenceRepo: "https://github.com/uvv-01/arya_college_training",
    evidenceNote: "Implemented from first principles in academic and competitive coding repositories.",
    img: sword1,
  },
  {
    id: "web-dev",
    name: "Web Technologies",
    desc: "React, Next.js & Modern UI Architecture",
    use: "Interactive interfaces, telemetry dashboards, and reactive state machines",
    line: "Component state orchestration, responsive layouts, Tailwind CSS, and custom keyframe engines.",
    evidenceProject: "OpenVINO OSS Navigator",
    evidenceRepo: "https://github.com/uvv-01/openvino_oss_navigator",
    evidenceNote: "Shipped the Next.js benchmark explorer and crafted this 12-scene Berserk workshop.",
    img: sword2,
  },
  {
    id: "computer-vision",
    name: "Computer Vision",
    desc: "OpenCV & Video Pipeline Processing",
    use: "Real-time camera feeds, spatial saliency, and bounding box analytics",
    line: "Frame pre-processing, multithreaded capture queues, and live video stream orchestration.",
    evidenceProject: "FoveaEdge",
    evidenceRepo: "https://github.com/uvv-01/FoveaEdge",
    evidenceNote: "Benchmarked dynamic spatial region selection on edge cameras to conserve power.",
    img: sword3,
  },
  {
    id: "edge-ai",
    name: "Edge AI / OpenVINO",
    desc: "Intel OpenVINO Inference Runtime",
    use: "Low-latency neural network inference across CPU, iGPU, and constrained hardware",
    line: "Dynamic hardware switching, selective spatial inference research, and throughput profiling.",
    evidenceProject: "Face Detection Auto-Switch",
    evidenceRepo: "https://github.com/uvv-01/openvino-face-detection-auto-switch",
    evidenceNote: "Built runtime failover between CPU, GPU, and AUTO without pipeline restarts.",
    img: sword4,
  },
  {
    id: "open-source",
    name: "Open Source Systems",
    desc: "Production Git & Collaborative Tooling",
    use: "OpenVINO diagnostic tools, benchmark dashboards, and community collaboration",
    line: "Cross-repo contributions, benchmark tooling, and reproducible open-source documentation.",
    evidenceProject: "OpenVINO OSS Navigator",
    evidenceRepo: "https://github.com/uvv-01/openvino_oss_navigator",
    evidenceNote: "Open-source contributor to Intel OpenVINO tools and community repositories.",
    img: sword5,
  },
  {
    id: "dsa",
    name: "DSA & Problem Solving",
    desc: "C++ Competitive Programming & Complexity Analysis",
    use: "Algorithmic thinking, optimization, and time/space complexity analysis",
    line: "Consistent 100+ day problem-solving milestones, tree/graph implementations, and contest fundamentals.",
    evidenceProject: "Arya Algorithms & Foundation",
    evidenceRepo: "https://github.com/uvv-01/arya_college_training",
    evidenceNote: "Verified 100-day century badge on LeetCode; core algorithmic implementations in C++.",
    img: sword6,
  },
  {
    id: "electronics",
    name: "Electronics (ECE)",
    desc: "Hardware & Semiconductor Fundamentals",
    use: "Where software logic meets physical semiconductor circuits",
    line: "Circuit analysis, signal fundamentals, test equipment, and embedded silicon constraints.",
    evidenceProject: "B.Tech ECE Academic Foundation",
    evidenceRepo: null,
    evidenceNote: "Deep background in physical circuit architecture and hardware-software boundaries.",
    img: sword7,
  },
  {
    id: "systems-automation",
    name: "Systems & Automation",
    desc: "Local AI & Native Windows APIs",
    use: "On-device speech processing, wake-word listeners, and Win32 automation",
    line: "Local Faster Whisper STT, zero-cloud desktop control, and background task orchestrators.",
    evidenceProject: "Pengu Voice Assistant",
    evidenceRepo: "https://github.com/uvv-01/pengu",
    evidenceNote: "Autonomous desktop voice control with 100% private on-device execution.",
    img: sword8,
  },
];

export default skills;
