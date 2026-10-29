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
  - `firebaseConfig` — `services/analytics.service.ts` (Analytics + Performance + a screen_view per route,
    loaded lazily after the first page); skipped entirely if `apiKey` is empty
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
  app.component.*          <site-header>, <router-outlet>; asks LoadingService to dismiss the loading screen;
                           starts AnalyticsService; hosts the route-wipe element and shared SVG filters
                           (#oca-warp, nav-menu label hover)
  components/
    home-page/             landing: logo (click -> nav overlay) between flowing 70s stripes on both sides
                           (assets/images/ribbon.svg, CSS transform only), then a pinned GSAP ScrollTrigger
                           manifesto scene, <instrument-orbit>, <nav-menu> footer
    instrument-orbit/      members + their instruments orbiting; renders nothing while MEMBERS is empty
    icon/                  <icon name="...">: inline SVG icons (shapes copied from Font Awesome Free, see icons.ts)
    navigation/
      site-header/         fixed bar on every page: cupcake = home, Novice / Glasba / Kontakt (current page
                           underlined in its color, aria-current), SL/EN switch
      nav-menu/            big video menu (icon + label per page, current page marked); in the home overlay
                           and as the footer of every page
      nav-menu-overlay/    full-screen dialog around nav-menu, opened from the home logo via NavService;
                           close button, Esc, focus kept inside and returned to the logo
    news/                  /news: news-start-page (click / scroll / swipe on the photo: it cracks and shatters)
                           -> display-posts
      display-posts/       Instagram feed: featured post + grid of others, carousel via ngx-bootstrap
    yt-videos/             /music: featured YouTube video (@angular/youtube-player) + grid
    contact-us/            /contact: contact-start-page (click / scroll / swipe) -> fades to content
                           (phone, email, location)
  directives/scroll-intent.directive.ts  (scrollIntent) output: wheel down or swipe up on an element
  i18n/                    sl.ts (source) + en.ts (typed against it), I18nService (lang from
                           localStorage / navigator, sets <html lang>), `t` pipe: {{ 'nav.music' | t }}.
                           SIGNATURE ("EN BIŠKOTIN ČA!") is never translated.
  content/members.ts       MEMBERS (empty until the band provides names + instruments)
  models/app-environment.ts  typed shape of the environment files
  services/
    instagram.service.ts   Graph API /media -> Observable<post[]>; sessionStorage + shareReplay cache;
                           ERRORS (not silent) on failure/missing config, failed request is not cached
    youtube.service.ts     Data API search + videos, same pattern; also lazy-loads the YouTube IFrame API
                           (@angular/youtube-player v16 does not load it itself)
    nav.service.ts         NAV_LINKS (the pages, shared by header and menu), overlay open state (closes
                           itself on NavigationEnd), scrollUpIfCurrent() for links to the current page
    analytics.service.ts   Firebase Analytics + Performance via dynamic import() once the first page is up
    route-wipe.service.ts  page transition: routeWipeGuard (on every route) waits until the liquid wipe
                           covers the screen, then scrolls to top and reveals on NavigationEnd
    loading.service.ts     removes the static #oca-loader in index.html (black screen + cupcake) once the
                           first route, fonts and hold()-ed tasks are done; min 800 ms, max 4 s
    motion.service.ts      reducedMotion flag (+ reducedMotion$) for effects
  ng-animations/           scroll-reveal.ts: loadGsap() (lazy, shared) + ScrollReveal (cards rise in,
                           scrubbed, inside 300vh sections)
src/styles.scss            imports the Bootstrap partials the site uses, global h1/p fonts, film grain,
                           .oca-card (grid cards; accent via --card-accent), --oca-header-h / --oca-ribbon-w
src/styles/                _tokens (palette SCSS vars; also exposed as --oca-* CSS vars on :root),
                           _mixins (headerBgImage, earthBg, pagesBaseBgImage), _typography (WOFF2 fonts),
                           _animations (all shared @keyframes; imported once, globally, by styles.scss)
docs/design-upgrade-plan.md  design direction, copy rules and phases for the visual upgrade
```

Routes: `''` home · `news` · `news/post/:id` · `music` · `music/video/:id` · `contact` · `**` -> `''`.

### Conventions

- Component selectors have **no `app-` prefix** (`site-header`, `display-posts`, `content`, ...).
- 4-space indent, double-quoted imports with `{X}` (no spaces), SCSS per component.
- Navigation links are real links: `<a [routerLink]>` with `routerLinkActive` + `ariaCurrentWhenActive`
  (header and menu, from `NAV_LINKS`); grid cards navigate with `router.navigate()` from `(click)`.
  Don't scroll manually afterwards: RouteWipeService scrolls to the top while the transition covers the
  screen. Every route needs `canActivate: [routeWipeGuard]`. Content sits under the fixed header: keep
  it clear with `var(--oca-header-h)`.
- Page layout pattern: sticky header (`67.66vh`) + description strip (`32.34vh`), then a `300vh` section
  with a sticky inner `100vh` block (scroll-pinning effect), then `<nav-menu>` as the footer.
- Fonts: `Ethnocentric` for `h1`, `Jersey 10` for `p` (global in `styles.scss`).
- Colors: only `var(--oca-*)` tokens (or `$oca-*` in SCSS); brand colors (Instagram/YouTube) are the exception.
- All user-facing text goes through the `t` pipe with keys in `i18n/sl.ts` + `en.ts`. Copy is first person
  plural, minimal, and states only facts the band confirmed (see docs/design-upgrade-plan.md §0).
- Clickable things are `<button>`s (keyboard reachable), navigation is `<a routerLink>`; never `<a>` without `href`.
- Icons: `<icon name="...">` (inline SVG, 1em, currentColor). No icon fonts.
- Respect `prefers-reduced-motion` in every new animation.
- Heavy libraries (gsap, firebase) are only ever `import()`-ed lazily; per-frame work runs in
  `ngZone.runOutsideAngular`. New dependencies are pinned to exact versions in package.json.
- No `@angular/animations` (removed for bundle size): enter/leave effects are CSS classes + timers (see
  news / contact-us).
- Images are WebP (the originals are in git history), fonts WOFF2 with the original file as fallback.
- API data is typed as `any`; Instagram/YouTube response shapes are used directly in templates.
- Feed components (`display-posts`, `yt-videos`) keep `status: 'loading' | 'ready' | 'empty' | 'error'` and
  render a spinner / fallback link (Slovene copy) accordingly. Subscriptions use `switchMap` over
  `route.paramMap` + `takeUntilDestroyed(destroyRef)`.
- Bootstrap comes only from the SCSS partials in `styles.scss` (add a partial / utility key there when a new
  class is needed); don't re-add CDN tags to `index.html`. Bootstrap's JS bundle is not loaded (carousel
  is ngx-bootstrap).

## Known issues (as of 2026-10-29)

- **Leaked key**: a YouTube API key was committed in `8c831e5` and is still in history. It must be rotated
  and HTTP-referrer-restricted in Google Cloud Console.
- Instagram long-lived token is shipped to clients and expires every 60 days (the news page then shows its
  error state). Proper fix: fetch/refresh server-side (e.g. scheduled Firebase Function).
- YouTube `search` costs 100 quota units per uncached session (~100 sessions/day on default quota);
  `playlistItems` on the uploads playlist would cost 1.
- Initial bundle is ~443 kB (under the 500 kB budget), but `content`, `display-posts`, `yt-videos` and
  `home-page` component styles exceed the 2 kB warning (`content` is at 4.98 of the 5 kB error budget: put
  shared styles in `styles.scss` rather than growing it).
- `assets/videos/oca-nav-video.mp4` is ~31 MB (index at the end of the file, so no fast start); it loads only
  when a nav-menu is on screen (`preload="none"`), but then streams the big file. Re-encode: see the plan, §5.
- `assets/images/stone-wall.png` (1.3 MB) is not used anywhere.
- `main.single-spa.ts` is an unmodified Bitovi template (`@bitovi/micro-fe-billing`); single-spa is not
  configured in `angular.json` and `single-spa`/`systemjs-webpack-interop` are not dependencies.
- `angular.json` lists `src/favicon.ico`, which does not exist.
- No tests, no linting config.
