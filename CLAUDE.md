# CLAUDE.md

Website for **Oca / One Cupcake Away**, a four-piece psychedelic rock band from Koper, Slovenia.
Angular 16 SPA (NgModule-based, not standalone), deployed to Firebase Hosting. All user-facing copy is in **Slovene**.

## Commands

```bash
npm install          # node_modules is not committed
npm start            # ng serve, dev config, http://localhost:4200
npm run build        # ng build, production config -> dist/oca-website
npm test             # karma, but there are currently NO *.spec.ts files
firebase deploy      # hosting only; serves dist/oca-website
```

`startSPA` / `buildSPA` (single-spa) scripts exist but are **not wired up** — see Known issues.

## Environment / secrets

- Config lives in `src/enviroments/` (note the misspelling — keep it; imports depend on it).
- Both files are tracked in git (placeholders only, since commit `15cb135`) but also listed in `.gitignore`;
  `.gitignore` has no effect on tracked files, so filling in real keys WILL show in `git status` — don't commit them.
- Code expects these keys on `environment` (the committed placeholders do NOT define them, so the app
  fails to type-check until they are added locally):
  - `firebaseConfig` — used in `app.module.ts` (Analytics + Performance)
  - `youtubeApiKey` — `services/youtube.service.ts`
  - `instagramAccessToken`, `instagramAccId` — `services/instagram.service.ts`
- `angular.json` has **no `fileReplacements`**, so `enviroment.prod.ts` is never used; every build imports
  `enviroment.ts`.
- Everything in `environment` ships to the browser. Do not add anything there that must stay secret.

## Architecture

```
src/app/
  app.module.ts            single root NgModule; declares every component
  app-routing.module.ts    routes (below)
  app.component.*          <splash-screen> for a fixed 1.5 s, then <router-outlet>
  components/
    home-page/             landing: logo click opens the full-screen nav overlay
    navigation/
      nav-menu/            video-background menu (Novice / Glasba / Kontakt); also embedded at the
                           bottom of every content page as a footer
      nav-menu-overlay/    fixed overlay wrapping nav-menu, toggled via NavService
      nav-icon/            quarter-circle cupcake button, top-right; type 'home' -> navigate to '/',
                           type 'nav-menu' -> close overlay
    news/                  /news: news-start-page (click "breaks" image) -> fades to display-posts
      display-posts/       Instagram feed: featured post + grid of others, carousel via ngx-bootstrap
    yt-videos/             /music: featured YouTube video (@angular/youtube-player) + grid
    contact-us/            /contact: contact-start-page -> fades to content (phone, email, location)
    spash-screen/          (folder name misspelled) splash with pulsing cupcake
  services/
    instagram.service.ts   Graph API /media, cached in sessionStorage + ReplaySubject
    youtube.service.ts     Data API search + videos, cached in sessionStorage
    nav.service.ts         BehaviorSubject<boolean> for overlay open state
    loading.service.ts     unused (wiring in app.component is commented out)
  pipes/loading.pipe.ts    unused
  ng-animations/           fadeIn / fadeOut triggers shared by news + contact
src/styles.scss            imports Bootstrap SCSS, global h1/p fonts, keyframes
src/styles/                _mixins (headerBgImage, pagesBaseBgImage), _typography (@font-face), _animations
```

Routes: `''` home · `news` · `news/post/:id` · `music` · `music/video/:id` · `contact` · `**` -> `''`.

### Conventions

- Component selectors have **no `app-` prefix** (`nav-icon`, `display-posts`, `content`, ...).
- 4-space indent, double-quoted imports with `{X}` (no spaces), SCSS per component.
- Navigation is done imperatively with `router.navigate()` from `(click)` handlers, followed by
  `viewportScroller.scrollToPosition([0,0])`; there is no `routerLink` usage yet.
- Page layout pattern: sticky header (`67.66vh`) + description strip (`32.34vh`), then a `300vh` section
  with a sticky inner `100vh` block (scroll-pinning effect), then `<nav-menu>` as the footer.
- Fonts: `Ethnocentric` for `h1`, `Jersey 10` for `p` (global in `styles.scss`).
- API data is typed as `any`; Instagram/YouTube response shapes are used directly in templates.

## Known issues (as of 2026-10-27)

- **Leaked key**: a YouTube API key was committed in `8c831e5` and is still in history. It must be rotated
  and HTTP-referrer-restricted in Google Cloud Console.
- Instagram long-lived token is shipped to clients and expires every 60 days; when it does, the news page
  renders blank (errors are swallowed, no fallback UI).
- `firebase.json` has no SPA rewrite, so refreshing/deep-linking `/news/post/:id` or `/music` 404s.
- Firebase is initialised twice (`AngularFireModule.initializeApp` and `initializeApp` in the module ctor).
- Bootstrap is loaded 3x (SCSS import 5.3.3, CDN CSS 5.0.2, CDN JS) and Font Awesome 2x (npm + kit);
  the YouTube iframe API is also loaded manually although `@angular/youtube-player` loads it itself.
- `assets/videos/oca-nav-video.mp4` is ~31 MB and autoplays in every nav-menu instance (home overlay + each
  page footer).
- `main.single-spa.ts` is an unmodified Bitovi template (`@bitovi/micro-fe-billing`); single-spa is not
  configured in `angular.json` and `single-spa`/`systemjs-webpack-interop` are not dependencies.
- `angular.json` lists `src/favicon.ico`, which does not exist; `index.html` has `lang="en"` for Slovene content.
- No tests, no linting config.
