# OCA Website

This repository contains the Angular application that powers the official website for **Oca band**, a four-piece
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

