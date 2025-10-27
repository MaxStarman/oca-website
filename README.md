# OCA Website

This repository contains the Angular single-page application that powers the official website for **Oca**, a four-piece
psychedelic rock band from Koper, Slovenia. The site is built with Angular 16 and styled with Bootstrap to deliver a
mobile-friendly experience for fans who want to follow the band, watch their latest videos, and explore upcoming news and
events.

## Features

- **Immersive landing page** with custom animations, a splash screen, and an overlay navigation menu that keeps the focus
  on the band's visuals and branding.
- **Instagram news feed** that fetches the latest media from the band's account, complete with video support and deep-link
  routing for individual posts.
- **YouTube integration** that surfaces the most recent uploads from the band's channel, including cached responses for
  faster repeat visits.
- **Modular component structure** (navigation, news, splash screen, YouTube videos, contact form, etc.) that keeps the
  codebase easy to extend.
- **Single-spa compatibility** so the site can run either as a standalone Angular application or be composed as part of a
  larger micro-frontend experience.

## Tech stack

- [Angular 16](https://angular.io/) with the Angular Router and Angular Animations
- [Bootstrap 5](https://getbootstrap.com/) and Font Awesome icons for styling
- [Firebase](https://firebase.google.com/) configuration for deployment
- Instagram Graph API and YouTube Data API integrations, with request caching handled in-browser

## Getting started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Start the local development server**

   ```bash
   npm start
   ```

   The app will be available at `http://localhost:4200/`.

3. **Run in single-spa mode (optional)**

   ```bash
   npm run startSPA
   ```

   This serves the application on port `4207` so it can be mounted by a single-spa root configuration.

## Building for production

```bash
npm run build
```

For a micro-frontend-friendly build, use:

```bash
npm run buildSPA
```

Both commands emit the compiled assets into the `dist/` directory.

## Environment configuration

To enable the Instagram and YouTube integrations, provide the required API keys and tokens in the environment files under
`src/enviroments/`. During development populate `enviroment.ts`, and for production builds update `enviroment.prod.ts` with
the secure values.

## Contributing

Issues and pull requests are welcome! Please open an issue first to discuss substantial changes.

## License

This project is distributed under the MIT License. See the `LICENSE` file (if present) for details.
