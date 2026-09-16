# UVV Portfolio

An explorable, dark-fantasy developer portfolio. Instead of scrolling a page,
you walk a small world: a warrior marks the story, a sword marks the skills,
and a forge marks the work. Skills are weapons. Projects are forged.

Built with React 19 + Vite.

## Features

- Interactive scene system: 9 connected scenes instead of page sections
- Three-slot sword arc for skills navigation (click, scroll, arrow keys)
- Cinematic loaders with staged reveals (entry, room, forge)
- Projects presented on the anvil, with animated card transitions
- Ambient music with a mute control (never required for navigation)
- Skip controls on cinematic sequences
- Reduced-motion support throughout

## Scene / Navigation Overview

```
Entry
 ├── Character -> Loading -> About
 │                          └── Return -> Entry
 │
 └── Sword -> RoomLoading -> Room
                              ├── Sword zone -> SwordTransition -> Skills
                              │                                       |
                              │                                 (Return to Room)
                              │
                              └── Forge zone -> SmithLoading -> Smithy
                                                                 |
                                                           (Return to Room)
```

- **Entry** — click the warrior to read the story, or the sword to enter the world.
- **Room** — the central hub. Two faintly glowing zones reveal their names on hover/focus.
- **Skills** — the armory. Three swords in an arc: the center sword is the active
  skill; the sides preview the previous and next. Navigate by clicking a side
  sword, scrolling, or using the arrow keys. The list loops in both directions.
- **Smithy** — the forge. Projects are forged one by one on the anvil.
  Navigate with the on-screen controls or the arrow keys.

## Tech Stack

- [React 19](https://react.dev) — UI
- [Vite](https://vite.dev) — build tool and dev server
- Plain CSS (per-scene stylesheets, no CSS framework)
- WebP images, CSS keyframe animations, Web Audio via the standard `Audio` API

## Project Structure

```
src/
├── App.jsx                  # scene state + audio lifecycle
├── main.jsx
├── index.css                # global reset, About, entry loader
├── data/
│   ├── skills.js            # sword/skill entries
│   └── projects.js          # forged-work entries
├── components/
│   ├── EntryScene.jsx       # world entry
│   ├── LoadingScene.jsx     # sword-frame loader
│   ├── AboutScene.jsx       # identity screen
│   ├── RoomLoading.jsx      # glitch loader
│   ├── RoomScene.jsx        # central hub
│   ├── SwordTransition.jsx  # cinematic gate to skills
│   ├── SkillsScene.jsx      # three-slot sword arc
│   ├── SmithLoading.jsx     # forge loader (hammer sequence)
│   └── SmithyScene.jsx      # projects showcase
└── assets/
    ├── images/              # webp assets (source pngs kept alongside)
    └── sounds/              # ambient music, sword sfx
```

## Animations

- **Sword arc** — directional keyframe transitions. The incoming sword enters
  from the edge the motion implies, the previous center settles into its side
  slot, and the oldest sword exits. Driven by state, not fragile timers.
- **Forge loader** — staged beats: forge reveal, dark layer, hammer raise,
  cock-back, strike, impact flash, quote, auto-advance.
- **Room hub** — zones breathe with a faint ember glow; labels appear on
  hover or keyboard focus.
- All decorative motion is disabled or minimized under
  `prefers-reduced-motion: reduce`.

## Responsive Design

Layouts adapt across desktop, laptop, tablet, and mobile breakpoints
(440 px through 1920 px) using percentage positioning and `clamp()` sizing.
Verified with zero horizontal overflow at the reference widths.

## Accessibility

- All interactive targets are semantic `<button>` elements with `aria-label`s
- Keyboard navigation: arrows for skills/projects, Tab for controls
- Visible `:focus-visible` outlines on every control
- Decorative imagery marked `aria-hidden`; content images have `alt` text
- `prefers-reduced-motion` respected scene by scene

## Performance

Image payload reduced from roughly 26 MB to about 1.2 MB by converting the
large scene assets to WebP while preserving the source PNGs for future edits.

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

## Asset Notes

Original full-resolution artwork lives in `src/assets/images/` next to its
optimized `.webp` counterparts. Music and sound effects live in
`src/assets/sounds/`.

## License

All rights reserved. Artwork, audio, and content may not be reused without
permission.
