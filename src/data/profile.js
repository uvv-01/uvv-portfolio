// ---------------------------------------------------------------
// Profile / contact configuration.
// Only verified information lives here. Anything the owner has not
// supplied stays null and the UI simply omits it.
// ---------------------------------------------------------------

export const profile = {
  name: "Yuvraj Singh",
  pronouns: "He / Him",
  role: "B.Tech ECE Student",
  org: "Open Source @ OpenVINO (Intel)",
  tagline: "I build intelligent systems where software meets electronics.",
  githubUser: "uvv-01",
  contacts: [
    { id: "github", label: "GitHub", url: "https://github.com/uvv-01" },
    { id: "linkedin", label: "LinkedIn", url: null }, // TODO(owner): add profile URL
    { id: "email", label: "Email", url: "mailto:yuvrajsinghdnb336@gmail.com" },
    { id: "leetcode", label: "LeetCode", url: null }, // TODO(owner): add profile URL
  ],
};
