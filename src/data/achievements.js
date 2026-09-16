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
    subtitle: "50-day challenge",
    detail: null, // TODO(owner): short description + date/period
    source: null, // TODO(owner): certificate/profile link
  },
  {
    id: "lc-100",
    title: "LeetCode 100 Days",
    subtitle: "100-day challenge",
    detail: null, // TODO(owner)
    source: null, // TODO(owner)
  },
  {
    id: "active-pi",
    title: "Active Problem Solving",
    subtitle: "Consistent practice",
    detail: null, // TODO(owner)
    source: null, // TODO(owner)
  },
  {
    id: "gssoc",
    title: "GSSoC",
    title_long: "GirlScript Summer of Code",
    detail: null, // TODO(owner): role, year, contributions
    source: null, // TODO(owner)
  },
  {
    id: "gh-open-source",
    title: "Open Source @ OpenVINO",
    subtitle: "Intel OpenVINO ecosystem",
    detail:
      "Contributed environment diagnostic tooling to the OpenVINO ecosystem (see the forge for the works).",
    source: "https://github.com/uvv-01?tab=repositories",
  },
  {
    id: "gh-public-repos",
    title: "Public Repository Count",
    subtitle: "GitHub — live",
    detail:
      "Live count of public repositories on the owner's GitHub profile, fetched from the GitHub API.",
    source: "https://github.com/uvv-01?tab=repositories",
    live: "public_repos",
  },
  {
    id: "gh-followers",
    title: "GitHub Followers",
    subtitle: "GitHub — live",
    detail:
      "Live follower count from the GitHub API. The workshop wall updates as the community grows.",
    source: "https://github.com/uvv-01",
    live: "followers",
  },
];

export default achievements;
