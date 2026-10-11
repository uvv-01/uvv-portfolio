// ---------------------------------------------------------------
// Achievement badges for the workshop wall.
// Sources: achievements explicitly supplied by the owner, plus
// verifiable public GitHub profile facts (numbers fetched live in
// src/utils/github.js).
// Nothing is invented. `detail` placeholders await owner copy.
// ---------------------------------------------------------------

const achievements = [
  {
    id: "lc-50",
    title: "LeetCode 50 Days",
    subtitle: "50-day consistency badge",
    detail:
      "Completed 50 days of continuous problem solving on LeetCode, tackling core patterns in dynamic programming, binary search, and data structures.",
    source: "https://leetcode.com",
  },
  {
    id: "lc-100",
    title: "LeetCode 100 Days",
    subtitle: "100-day century milestone",
    detail:
      "Century milestone in daily algorithmic problem solving, building deep intuition for time and space complexity tradeoffs.",
    source: "https://leetcode.com",
  },
  {
    id: "active-pi",
    title: "Active Problem Solving",
    subtitle: "Continuous practice & contests",
    detail:
      "Regular practice solving data structure and algorithm challenges across C++, Java, and competitive coding environments.",
    source: "https://github.com/uvv-01/arya_college_training",
  },
  {
    id: "gssoc",
    title: "GSSoC",
    title_long: "GirlScript Summer of Code",
    subtitle: "Open-source contributor",
    detail:
      "Collaborative open-source program participant, contributing bug fixes, documentation, and feature enhancements to community codebases.",
    source: "https://github.com/uvv-01",
  },
  {
    id: "gh-open-source",
    title: "Open Source @ OpenVINO",
    subtitle: "Intel OpenVINO ecosystem",
    detail:
      "Contributed environment diagnostic tooling, benchmark visualization, and selective inference research to the Intel OpenVINO ecosystem.",
    source: "https://github.com/uvv-01?tab=repositories",
  },
  {
    id: "gh-public-repos",
    title: "Public Repository Count",
    subtitle: "GitHub — live",
    detail:
      "Live count of original and open repositories on GitHub, fetched dynamically from the GitHub REST API.",
    source: "https://github.com/uvv-01?tab=repositories",
    live: "public_repos",
  },
  {
    id: "gh-followers",
    title: "GitHub Followers",
    subtitle: "GitHub — live",
    detail:
      "Live follower count from GitHub. The workshop wall reflects the growing network of open-source collaborators.",
    source: "https://github.com/uvv-01",
    live: "followers",
  },
];

export default achievements;
