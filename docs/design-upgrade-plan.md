# Oca — frontend design upgrade plan

Status: Phases 1 and 2 implemented (2026-10-28); Phase 1 video re-encode still pending (see §5). Branch: `feat/design-upgrade`
(branched from `fix/tier1-functional`, which has the build fixes `master` doesn't have yet).

## Direction (from interview)

| Topic | Decision |
|---|---|
| Message | High-quality music; every member a virtuoso on several instruments; psychedelic storytelling, sound before lyrics |
| Palette | Warm 70s earth, one teal "pop" accent |
| Motion | Immersive but readable; full `prefers-reduced-motion` fallback |
| 3D | Procedural 3D cupcake (hero) + audio-reactive visual |
| Home | Sound-first: experience before text ("show, don't tell"); logo in front, 3D cupcake behind it; no "Vstopi" button, the logo itself invites the click |
| Type | Keep Ethnocentric (h1) + Jersey 10 (p) |
| Devices | Mobile-first; lighter 3D on phones, full on desktop |
| Audio | **Not now.** Leave hooks + `TODO(audio)` comments; MP3 previews come later |
| Content | Use existing assets; mark slots with `TODO(content)` comments |
| Loading | Black screen with the cupcake on start |
| Languages | Slovene (default) + English, switchable |
| Copy | Minimal new copy, first person ("we"), only confirmed facts — see §0 |

Structure stays: same routes, splash, nav overlay, sticky header + description strip,
`300vh` pinned section, `<nav-menu>` footer.

## 0. Copy rules

- **Keep copy to a minimum.** Reuse and extend the existing text; motion and sound carry the message.
- **First person plural** ("smo", "igramo" / "we", "our").
- **Only confirmed facts.** Confirmed so far: we're a four-piece band from Koper, Slovenia;
  each of us is a virtuoso on our instrument; each of us plays several instruments; our style is
  psychedelic storytelling; sound and music come before lyrics; we focus on high-quality music.
  No member names, instrument lists, releases, gigs, awards or influences until you provide them.
  Those slots stay empty and get a `TODO(content)` comment, with no placeholder text that looks real.
- All new lines are **drafts for your review** before they ship.

### Existing copy (kept, moved into translation files)
- Home intro: "Smo 4-članski bando iz Kopra. Pripovedno - plesna, psihadelična rock 'n' roll
  mineštra po primorsko. EN BIŠKOTIN ČA!"
- Nav: Novice · Glasba · Kontakt
- Contact: "ALE, DEJMO SE ZMENIT", the contact paragraph, "KOPER, SLOVENIJA", phone, email
- Feed states: loading / empty / error messages; image alt texts (fix "moja ikonca" → descriptive)
- Instagram captions and YouTube titles come from the APIs and are **not translated**.

### New copy (draft, the only additions)

| Where | SL | EN |
|---|---|---|
| Home manifesto line 1 | Vsak od nas je virtuoz na svojem inštrumentu – in vsak igra več kot enega. | Each of us is a virtuoso on our instrument – and each of us plays more than one. |
| Home manifesto line 2 | Najprej zvok in glasba, šele nato besede. | Sound and music first, words second. |
| Language toggle | SL / EN | SL / EN |
| EN home intro (translation of existing) | — | We're a four-piece band from Koper. Storytelling, danceable, psychedelic rock 'n' roll stew, Primorska style. |

**"EN BIŠKOTIN ČA!" is always in Slovene, in both languages, and never changed.** It is not a
translation key: it lives as a fixed string shared by both dictionaries.

## 1. Foundations

### Loading screen (replaces the fixed 1.5 s splash)
- Pure black (`#000`) full screen with the centered cupcake (cream/ochre tint of the existing
  SVG), keeping the current `shrinkGrow` pulse.
- **Inline in `index.html`** (plain HTML + CSS, no Angular) so it shows right away on first paint,
  with no white flash while the JS bundle downloads. Angular removes it when ready.
- "Ready" = fonts loaded (`document.fonts.ready`) + first route rendered + (home only) the 3D chunk
  preloaded. Minimum ~800 ms so it doesn't flicker, maximum ~4 s timeout so it can never hang.
- Exit: cupcake scales up and fades as the page fades in (reduced motion: simple fade).
- `TODO(audio)`: optional first-tap "start sound" moment could live here later.

### Languages (SL / EN)
- **Small in-house runtime i18n**, no new dependency:
  - `src/app/i18n/sl.ts` (source of truth) and `en.ts` typed as `typeof sl`, so a missing
    English key is a **compile error**.
  - `I18nService`: current language as `BehaviorSubject<'sl' | 'en'>`; initial value from
    `localStorage` (wrapped in try/catch), else `navigator.language` starting with `sl` → `sl`,
    otherwise `en`. Updates `<html lang>` (also fixes the current `lang="en"` issue).
  - `t` pipe: `{{ 'nav.music' | t }}` (pure: false, cheap dictionary lookup).
- Toggle **SL / EN** in the nav menu (overlay + footer), Ethnocentric, ochre for the active language.
- Why not the alternatives: `@angular/localize` builds a separate app per language and needs
  per-locale hosting rewrites; `ngx-translate` is fine but a dependency for ~25 strings.
  Switch later if the copy grows a lot.

### Color tokens — `src/styles/_tokens.scss` (new), CSS custom properties on `:root`

```
--oca-bg:        #1C130C   near-black brown (page base)
--oca-bg-raised: #2A1D13   cards, strips
--oca-text:      #F3E6CC   cream (body text — replaces black <p>)
--oca-text-dim:  #BFA98A
--oca-ochre:     #E0892B   primary accent, links, focus rings
--oca-rust:      #B5432A   secondary accent, hover, errors
--oca-teal:      #4FB3A0   the one "trippy" pop: active states, audio glow
--oca-ease:      cubic-bezier(.22,1,.36,1)
--oca-dur-s/m/l: 200ms / 500ms / 1200ms
```

- Replace the ~15 hard-coded colors in component SCSS with tokens (keep Instagram/YouTube brand
  colors only where they are a brand mark).
- Override Bootstrap `$body-bg`, `$body-color`, `$primary` before the Bootstrap import so its
  components follow the palette.
- `p` changes from black to `--oca-text`; the dry-earth / stone images get a warm dark
  overlay (`mix-blend-mode: multiply` + gradient). That also closes the old TODO in `_mixins.scss`.

### Global texture
- Animated film-grain overlay (tiny tiled noise PNG or SVG `feTurbulence`, `pointer-events:none`,
  4–6 % opacity). It's cheap and gives every page the 70s analog feel.
- Soft vignette on the sticky headers.

### Motion system
- **GSAP + ScrollTrigger** for scroll-driven scenes inside the existing `300vh`/sticky blocks
  (scrub, pin, staggered text reveals). **Lenis** for smooth scroll (optional, off on touch).
- Keep `@angular/animations` for route transitions and the existing `fadeIn/fadeOut`; add
  a shared route animation ("liquid wipe": ochre → rust gradient sweep, ~700 ms).
- `MotionService`: exposes `reducedMotion$` (from `matchMedia`) and `isLowPower` (mobile / low
  `hardwareConcurrency`); every effect checks it.
- Run all GSAP/three.js loops **outside `NgZone`** (`ngZone.runOutsideAngular`) so they
  don't trigger change detection every frame.

## 2. 3D + audio-reactive layer

### `<oca-stage>` component (reusable WebGL canvas)
- **three.js**, lazy-loaded via dynamic `import('three')` so the initial bundle doesn't grow.
- **Procedural cupcake**: `LatheGeometry` for the cup (ribbed), noise-displaced sphere/torus
  stack for the frosting. Custom shader material in ochre→rust with teal fresnel rim, slow
  "breathing" vertex displacement, tilts toward the pointer / gyroscope on phones, morphs with scroll.
- Shader uniforms `uLevel`, `uBass`, `uMid`, `uHigh` drive displacement + color shift.
- Fallbacks: no WebGL / reduced motion → static rendered PNG of the cupcake (or the existing
  `cupcake-white.svg`) with a CSS pulse.
- Mobile: `pixelRatio` capped at 1.5, fewer segments, 30 fps cap, pause when off-screen
  (`IntersectionObserver`) or tab hidden.

### `AudioReactiveService` (stub now)
```ts
// TODO(audio): replace idle generator with Web Audio AnalyserNode fed by
// self-hosted MP3 previews (assets/audio/*.mp3). Keep this interface stable.
levels$: Observable<{ level: number; bass: number; mid: number; high: number }>
```
- Today it emits a slow, organic "idle" signal (layered sine/noise at ~70 BPM), so the
  visual already moves like it's listening. Later, swap in real FFT data without touching the
  stage component.
- Reserve a play/mute button in the UI (hidden behind a flag until audio exists).

## 3. Page by page

### Loading screen
- See §1: black screen + cupcake, real readiness instead of a fixed timer.

### Home (sound-first)
1. **Logo in front, 3D cupcake behind it (option B).** Full-screen `<oca-stage>` as the
   background layer: a large, slow, breathing 3D cupcake, partly blurred/dimmed so the letters stay
   readable. The existing "ONE CUPCAKE AWAY" logo sits centered on top, recolored to cream with CSS
   (the PNG is unchanged). **No "Vstopi" button and no hint text.**
   `<!-- TODO(audio): start preview track on first logo tap -->`
2. **Making the logo obviously clickable without text:**
   - The `<a>` without `href` becomes a real `<button>` (keyboard focusable, Enter/Space work),
     with a translated `aria-label` ("Odpri meni" / "Open menu"). It's read by screen readers but not visible.
   - **Cursor:** a custom cupcake cursor over the logo (`cursor: url(cupcake-white.svg) 16 16, pointer`),
     so the cursor itself says "this is the cupcake". Falls back to the normal hand.
   - **Hover (desktop):** the logo lifts slightly (scale 1.04) with a warm ochre glow, the arrow
     "↘" nudges toward its tip, and the 3D cupcake behind leans toward the pointer and brightens,
     so the whole scene reacts to the logo.
   - **Idle hint (all devices, important on phones with no hover):** if nothing has been clicked
     after ~3 s, the logo does a soft "breath" pulse with an expanding ochre ring every few seconds,
     the same pulse rhythm as the loading-screen cupcake. That ties the two together as "the cupcake
     you tap". It stops forever after the first click (remembered per session).
   - **Press:** quick squash (scale 0.96) before the nav overlay opens, so the tap feels physical.
   - Keyboard focus: visible ochre focus ring. Reduced motion: no pulse/lean, only glow on hover/focus.
3. On scroll (pinned section), the text reveals line by line: the existing intro, then the two
   manifesto lines from §0. No other text.
4. "Instrument orbit" strip: **layout and animation only**, with no names or instruments invented.
   `<!-- TODO(content): member names, instruments per member, photos, clips per instrument -->`
   Hidden until that content exists.
5. Logo click → nav overlay (same behavior as now).

### Glasba (`/music`)
- Featured video in a warm "projector" frame (ochre glow that slowly drifts in hue).
- **YouTube facade**: thumbnail + play button; load the real iframe only on click. Big
  performance win and avoids the IFrame API on load.
- Grid cards: scale + grain + caption slide on hover/tap; staggered reveal on scroll.
- `<!-- TODO(content): instrument credits per video (who plays what) -->`

### Novice (`/news`)
- Keep the "breaks" image → posts flow; make it a crack/shatter-style reveal (CSS clip-path
  animation) instead of a plain fade.
- Instagram grid with the same card motion language as Glasba.

### Kontakt (`/contact`)
- Same intro pattern; contact items animate in with stagger; teal hover accents.

### Nav menu / footer
- **Video**: re-encode `oca-nav-video.mp4` (31 MB) to ~720p H.264 + WebM at ~2–4 MB with
  a poster frame. Autoplay only in the open overlay; footers show the poster and play when
  ≥50 % visible (`IntersectionObserver`), pausing otherwise.
- Menu items: text-distortion hover (SVG displacement filter) in ochre.

## 4. Libraries

| Package | Why | Cost |
|---|---|---|
| `three` | 3D cupcake + shaders | ~150 kB gz, lazy chunk |
| `gsap` (+ ScrollTrigger) | scroll scenes, timelines | ~45 kB gz |
| `lenis` (optional) | smooth scroll | ~4 kB gz |
| `simplex-noise` (optional) | idle audio signal / CPU noise | ~2 kB |

Check each against Angular 16 / TS 5.1 before installing (pin versions).

## 5. Phases

1. **Foundations** ✅: loading screen, SL/EN i18n (move all existing copy), tokens, Bootstrap
   overrides, grain, `MotionService`, video play-on-visible, YouTube facade, logo affordance.
   - **Not done: video re-encode** (ffmpeg isn't installed on the dev machine). Run, then add the
     poster to `nav-menu.component.html`:
     ```
     ffmpeg -i src/assets/videos/oca-nav-video.mp4 -vf scale=-2:720 -c:v libx264 -crf 28 -preset slow -an -movflags +faststart src/assets/videos/oca-nav-video-720.mp4
     ffmpeg -i src/assets/videos/oca-nav-video.mp4 -ss 1 -frames:v 1 -vf scale=-2:720 src/assets/videos/oca-nav-poster.jpg
     ```
   - The arrow "nudge" on hover needs the arrow as a separate SVG (it's baked into `oca-main.png`);
     for now the whole logo lifts and glows.
   - Each page has its own palette accent: Glasba ochre, Novice teal, Kontakt rust.
2. **Home** ✅: `<oca-stage>` + procedural cupcake + `AudioReactiveService` stub + manifesto scroll scene.
   - `AudioReactiveService` exposes a synchronous `read(time)` instead of `levels$`: the render loop
     samples it once per frame, which an Observable would only add overhead to.
   - Cupcake colors are ochre/rust (frosting) and dark brown (cup), never cream, so the cream logo
     in front keeps its contrast. Canvas at 60 % opacity, 1.5 px blur on desktop only.
   - Rendering stops when off-screen, when the nav overlay is open, when the footer video covers it,
     and when the tab is hidden. Phones: 30 fps, pixel ratio ≤ 1.5, no blur.
   - Instrument orbit is built but hidden: fill `src/app/content/members.ts` to show it.
   - Production: three.js chunk ~98 kB, GSAP + ScrollTrigger ~40 kB (transfer), all lazy; initial
     bundle +12 kB.
3. **Pages**: route transition, music/news/contact motion, nav hover effects.
4. **Polish & perf**: reduced-motion audit, Lighthouse on mid-range Android, bundle budgets,
   `lang="sl"` in `index.html`.

## 6. Content slots to fill later (`TODO(content)` / `TODO(audio)`)
- MP3 previews (and per-instrument stems, if you want a "solo each instrument" feature later)
- Member photos + short clips per instrument
- Instrument list per member, instrument credits per video
- Approval of the draft SL/EN lines in §0 and of the English translations of existing copy
- Optional `.glb` cupcake model (can replace the procedural one 1:1)
- Story artwork per song (could become shader textures)

## Open questions
- Reference sites you love? (The Mobbin search failed because it needs a paid plan.)
