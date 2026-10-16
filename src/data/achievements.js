// ---------------------------------------------------------------
// Achievement badges for the workshop wall.
// Curated, authentic physical records.
// Explicitly categorized: Personal Milestone, Contribution, Participation, Academic.
// Never represents participation as winning or follower counts as awards.
// ---------------------------------------------------------------

const achievements = [
  {
    id: "lc-100",
    category: "Personal Milestone",
    title: "LeetCode 100 Days",
    subtitle: "Century Consistency Milestone",
    detail:
      "Century milestone in daily algorithmic problem solving, building intuition for time and space complexity tradeoffs across dynamic programming, trees, and graphs.",
    verification: "Verified Milestone on LeetCode",
    source: "https://leetcode.com",
    monogram: "100",
  },
  {
    id: "lc-50",
    category: "Personal Milestone",
    title: "LeetCode 50 Days",
    subtitle: "Daily Habit Milestone",
    detail:
      "Completed 50 consecutive days of continuous problem solving on LeetCode, tackling core patterns in binary search, recursion, and data structures.",
    verification: "Verified Milestone on LeetCode",
    source: "https://leetcode.com",
    monogram: "50",
  },
  {
    id: "gh-open-source",
    category: "Contribution",
    title: "OpenVINO Contributor",
    subtitle: "Intel Ecosystem Tooling",
    detail:
      "Engineered benchmark analytics, environment diagnostics, and selective inference pipelines contributing to the open-source Intel OpenVINO developer ecosystem.",
    verification: "Public GitHub Repositories",
    source: "https://github.com/uvv-01/openvino_oss_navigator",
    monogram: "OV",
  },
  {
    id: "gssoc",
    category: "Participation",
    title: "GSSoC Open Source",
    title_long: "GirlScript Summer of Code",
    subtitle: "Open-Source Program Participant",
    detail:
      "Participated in collaborative open-source sprints, raising pull requests, reviewing community codebases, and shipping documentation and bug fixes.",
    verification: "Open-Source Collaboration",
    source: "https://github.com/uvv-01",
    monogram: "GS",
  },
  {
    id: "sih-prototyping",
    category: "Participation & Engineering",
    title: "Smart India Hackathon",
    subtitle: "National Hackathon Contender",
    detail:
      "Prototyped full-stack and edge software solutions under tight time constraints, addressing real-world problem statements through rapid development.",
    verification: "National Engineering Hackathon",
    source: "https://github.com/uvv-01",
    monogram: "SIH",
  },
  {
    id: "academic-foundation",
    category: "Academic Milestone",
    title: "B.Tech ECE Foundation",
    subtitle: "Arya College of Engineering",
    detail:
      "Undergraduate engineering foundation in Electronics and Communication: digital logic, circuit theory, semiconductor physics, and embedded software boundaries.",
    verification: "Undergraduate Engineering Curriculum",
    source: "https://github.com/uvv-01/arya_college_training",
    monogram: "ECE",
  },
];

export default achievements;
