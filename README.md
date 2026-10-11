# UVV Portfolio

An explorable, dark-fantasy developer portfolio. You enter an ancient
blacksmith's workshop, and every important object in the room is a part of
the developer's real profile:

- the **scribe's table** holds contacts and a book you can write in,
- the **wall** holds earned achievement badges,
- the **fire** remembers the developer journey,
- the **sword** represents skills,
- the **forge** shapes real GitHub projects into weapons.

Built with React 19 + Vite.

## Features

- Interactive workshop: 12 connected scenes instead of page sections
- Contact Book: parchment notebook with a working pen, note writing with
  pencil sound, and contact links (GitHub, email — configurable)
- Trophy Wall: hanging achievement medallions with swing hover, detail
  panels, and live GitHub counters fetched from the GitHub API
- Journey Forge: cinematic ember-trail timeline of the developer journey
- Three-slot sword arc for skills navigation (click, scroll, arrow keys)
- Project Forge: authentic 7-stage forging sequence:
  1. Raw Stock — unworked iron ingot resting across the anvil
  2. Heating — drawn into the forge fire, glowing cherry red
  3. First Strike — blacksmith hammer strikes with sound and spark burst
  4. Shaping — metal yields under hammer blows into blade contours
  5. Quenching — hardened in cold water with steam hiss
  6. Polishing — edge honed, crossguard and pommel aligned
  7. Reveal — weapon presented proudly while project dossier is unveiled
- Top weapon rack selector allowing direct switching across 6 forged works
- Fast skip action ("Skip to Blade") and re-forge action ("Strike & Re-forge")
- Local note persistence: visitor reflections on the Scribe's Table are saved to `localStorage` (`uvv_scribe_note`)
- Aspect-ratio locked workshop chamber (`1536 / 1024`) preventing hotspot drift across viewports
- Clean transparent weapon assets with exact alpha channels contouring each blade
- Live GitHub integration (profile facts, repository metadata, update dates) with graceful fallback
- Ambient audio with an always-accessible toggle; audio never blocks navigation
- Full keyboard navigation (arrow keys for swords and rack, Tab, Escape to return)
- Reduced-motion accessibility support across all stylesheets

## Scene / Navigation Overview

```
Entry
 ├── Character -> Loading -> About
 │                          └── Return -> Entry
 │
 └── Sword -> RoomLoading -> Room (the workshop)
                               ├── Scribe's table -> Contact Book
                               ├── Trophy wall    -> Achievements
                               ├── Fire           -> Journey Forge
                               ├── Sword          -> SwordTransition -> Skills
                               └── Forge          -> SmithLoading   -> Project Forge
```

## The Interactive Objects

| Object | Scene | What it holds |
|---|---|---|
| Book + pen on the table | Contact Book | Contact links (GitHub, LinkedIn, Instagram, Email), persistent notepad, pencil audio |
| Badges on the wall | Trophy Wall | Medallions for LeetCode (50/100 Days, Problem Solving), GSSoC, OpenVINO, Public Repos, Followers |
| The fire | Journey Forge | Milestone timeline rendered as an ember trail from ECE foundation to open-source |
| The sword | Skills | Three-slot sword carousel representing core engineering languages and stacks |
| The anvil | Project Forge | 7-stage forging sequence showcasing 6 engineered repositories as forged blades |

## Data Layer

All personal content lives in editable modules — nothing is invented:

```
src/data/profile.js       # name, contacts (add LinkedIn/LeetCode URLs here)
src/data/skills.js        # skill swords + supporting lines
src/data/achievements.js  # wall badges (add dates/certificate links here)
src/data/journey.js       # milestone sequence (add details per milestone)
src/data/projects.js      # forged works, sourced from real repositories
src/utils/github.js       # reusable GitHub API layer with caching + fallback
```

GitHub facts (repository names, descriptions, languages, update dates,
public repo count, followers) are fetched live from the public GitHub API
and degrade gracefully: if the API is unavailable, the portfolio still
works with the static configuration.

## Tech Stack

- [React 19](https://react.dev) — UI
- [Vite](https://vite.dev) — build tool and dev server
- Plain CSS (per-scene stylesheets, no CSS framework)
- WebP images, CSS keyframe animations, standard Web Audio APIs

## Project Structure

```
src/
├── App.jsx                    # scene state + audio lifecycle
├── main.jsx
├── index.css                  # global reset, About, entry loader
├── data/                      # profile, skills, achievements, journey, projects
├── utils/github.js            # GitHub data fetching with fallback
├── components/
│   ├── EntryScene.jsx         # world entry (warrior / sword)
│   ├── LoadingScene.jsx       # sword-frame loader
│   ├── AboutScene.jsx         # identity screen
│   ├── RoomLoading.jsx        # glitch loader
│   ├── RoomScene.jsx          # the workshop hub (5 zones)
│   ├── ContactBook.jsx/.css   # scribe's table: contacts + writing
│   ├── BadgeWall.jsx/.css     # achievement medallions
│   ├── JourneyForge.jsx/.css  # ember-trail journey timeline
│   ├── SwordTransition.jsx    # cinematic gate to skills
│   ├── SkillsScene.jsx        # three-slot sword arc
│   ├── SmithLoading.jsx       # forge loader (hammer sequence)
│   └── SmithyScene.jsx        # project forging showcase
└── assets/
    ├── images/                # webp assets (source pngs kept alongside)
    └── sounds/                # ambient music, sword strike, pencil
```

## Animations

- **Sword forging** — the centerpiece. Raw stock lies on the anvil, heats
  to a glow, takes two hammer strikes (with strike sound and screen jolt),
  is quenched, and is presented as a finished blade while project details
  fade in beneath.
- **Sword arc** — directional keyframe transitions between skill swords.
- **Badge wall** — medallions drop in, swing on hover, open detail cards.
- **Journey forge** — rising embers, dancing flame, staggered milestone
  cards, a burning current step.
- All decorative motion is disabled or minimized under
  `prefers-reduced-motion: reduce`.

## Responsive Design

Layouts adapt across desktop, laptop, tablet, and mobile breakpoints
(440 px through 1920 px) using percentage positioning, `clamp()` sizing,
and an explicit zone list on small screens. Verified with zero horizontal
overflow at the reference widths.

## Accessibility

- All interactive targets are semantic `<button>` elements with `aria-label`s
- Dialog-style scenes expose `role="dialog"` with labels
- Keyboard navigation: arrows for skills/projects, Tab for controls
- Visible `:focus-visible` outlines on every control
- Decorative imagery marked `aria-hidden`; content images have `alt` text
- `prefers-reduced-motion` respected scene by scene

## Performance

Image payload reduced from roughly 26 MB to about 1.2 MB by converting
the large scene assets to WebP while preserving the source PNGs in the
repository for future edits. Audio files are reused (never re-created per
interaction) and paused, not rewound, between scenes.

## Local Development

```bash
npm install
npm run dev
```

## Build Commands

```bash
npm run build     # production build to dist/
npm run preview   # preview the production build
npm run lint      # eslint
```

## Deployment

Any static host works (`npm run build` then serve `dist/`), e.g. Vercel,
Netlify, or GitHub Pages.

## Asset Notes

- Original full-resolution artwork lives in `src/assets/images/` next to
  its optimized `.webp` counterparts.
- Music and sound effects live in `src/assets/sounds/`.
- GitHub iconography is rendered inline as SVG.
- All rights reserved on artwork and audio; repository code is shown as
  the developer's own work.

## License

All rights reserved. Artwork, audio, and content may not be reused without
permission.
