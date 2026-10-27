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
- Shape is the `AppEnvironment` interface in `src/app/models/app-environment.ts` (lives outside
  `src/enviroments/` because that folder is gitignored, so new files there would never be committed):
  - `firebaseConfig` — `app.module.ts` (Analytics + Performance + ScreenTracking); skipped entirely if `apiKey` is empty
  - `youtubeApiKey` — `services/youtube.service.ts`
  - `instagramAccessToken`, `instagramAccId` — `services/instagram.service.ts`
- Committed values are empty strings, so a fresh clone builds and runs; the feeds then show their error state.
- Production builds swap in `enviroment.prod.ts` via `fileReplacements` in `angular.json`.
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
  models/app-environment.ts  typed shape of the environment files
  services/
    instagram.service.ts   Graph API /media -> Observable<post[]>; sessionStorage + shareReplay cache;
                           ERRORS (not silent) on failure/missing config, failed request is not cached
    youtube.service.ts     Data API search + videos, same pattern; also lazy-loads the YouTube IFrame API
                           (@angular/youtube-player v16 does not load it itself)
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
- Feed components (`display-posts`, `yt-videos`) keep `status: 'loading' | 'ready' | 'empty' | 'error'` and
  render a spinner / fallback link (Slovene copy) accordingly. Subscriptions use `switchMap` over
  `route.paramMap` + `takeUntilDestroyed(destroyRef)`.
- Bootstrap comes only from the SCSS import in `styles.scss` and Font Awesome only from `angular.json` styles;
  don't re-add CDN tags to `index.html`. Bootstrap's JS bundle is not loaded (carousel is ngx-bootstrap).

## Known issues (as of 2026-10-27)

- **Leaked key**: a YouTube API key was committed in `8c831e5` and is still in history. It must be rotated
  and HTTP-referrer-restricted in Google Cloud Console.
- Instagram long-lived token is shipped to clients and expires every 60 days (the news page then shows its
  error state). Proper fix: fetch/refresh server-side (e.g. scheduled Firebase Function).
- YouTube `search` costs 100 quota units per uncached session (~100 sessions/day on default quota);
  `playlistItems` on the uploads playlist would cost 1.
- Production build warns on budgets: initial bundle ~844 kB (budget 500 kB), and `content` / `display-posts`
  component styles exceed the 2 kB warning.
- `assets/videos/oca-nav-video.mp4` is ~31 MB and autoplays in every nav-menu instance (home overlay + each
  page footer).
- `main.single-spa.ts` is an unmodified Bitovi template (`@bitovi/micro-fe-billing`); single-spa is not
  configured in `angular.json` and `single-spa`/`systemjs-webpack-interop` are not dependencies.
- `angular.json` lists `src/favicon.ico`, which does not exist; `index.html` has `lang="en"` for Slovene content.
- No tests, no linting config.
