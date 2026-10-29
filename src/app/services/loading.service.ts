import {Inject, Injectable} from '@angular/core';
import {DOCUMENT} from "@angular/common";
import {NavigationCancel, NavigationEnd, NavigationError, Router} from "@angular/router";
import {filter, firstValueFrom} from "rxjs";
import {MotionService} from "./motion.service";

// Never flicker: the loading screen stays at least this long after page start...
const MIN_MS = 800;
// ...and never hang: it goes away after this long, whatever is still loading.
const MAX_MS = 4000;

/**
 * Controls the static loading screen (#oca-loader) in index.html. It is plain HTML so it shows on
 * first paint, before the JS bundle has downloaded. Removed once the first route has rendered,
 * the fonts are ready and every held task has settled.
 */
@Injectable({
    providedIn: 'root',
})
export class LoadingService {

    private tasks: Promise<unknown>[] = [];

    constructor(@Inject(DOCUMENT) private document: Document,
                private router: Router,
                private motion: MotionService) {
    }

    // Keep the loading screen up until `task` settles: for something the first screen can't show without
    // (no caller at the moment; the 3D cupcake used to hold its three.js chunk here).
    hold(task: Promise<unknown>): void {
        this.tasks.push(task);
    }

    dismissWhenReady(): void {
        const firstRoute = firstValueFrom(this.router.events.pipe(
            filter(event => event instanceof NavigationEnd
                || event instanceof NavigationCancel
                || event instanceof NavigationError)
        ));
        // Routed components are created before NavigationEnd, so their hold() calls are in by then
        const ready = firstRoute.then(() => Promise.allSettled([this.document.fonts.ready, ...this.tasks]));
        const minDelay = this.wait(MIN_MS - performance.now());
        const maxDelay = this.wait(MAX_MS - performance.now());

        Promise.race([Promise.all([ready, minDelay]), maxDelay]).then(() => this.hide());
    }

    private hide(): void {
        const loader = this.document.getElementById('oca-loader');
        if (!loader) {
            return;
        }
        // The exit (cupcake grows and fades) is a CSS transition in index.html
        loader.classList.add('is-done');
        setTimeout(() => loader.remove(), this.motion.reducedMotion ? 300 : 800);
    }

    private wait(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, Math.max(0, ms)));
    }
}
