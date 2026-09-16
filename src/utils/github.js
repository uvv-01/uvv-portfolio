// ---------------------------------------------------------------
// Reusable GitHub data layer. Single place for API access so no
// component scatters fetch calls. Every consumer must survive
// failure: offline / rate-limited / partial data are all fine —
// the UI falls back to the static data layer.
// ---------------------------------------------------------------

import { profile } from "../data/profile.js";

const API = "https://api.github.com";
const cache = new Map();

async function getJson(url) {
  if (cache.has(url)) return cache.get(url);
  const res = await fetch(url, { headers: { Accept: "application/vnd.github+json" } });
  if (!res.ok) throw new Error(`GitHub API ${res.status}`);
  const data = await res.json();
  cache.set(url, data);
  return data;
}

/** Profile facts (name, public_repos, followers...). Returns null on failure. */
export async function fetchGithubProfile() {
  try {
    return await getJson(`${API}/users/${profile.githubUser}`);
  } catch {
    return null;
  }
}

/** Original (non-fork) repositories, newest first. Returns [] on failure. */
export async function fetchGithubRepos() {
  try {
    const repos = await getJson(`${API}/users/${profile.githubUser}/repos?per_page=100&sort=updated`);
    return repos.filter((r) => !r.fork);
  } catch {
    return [];
  }
}
