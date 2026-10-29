import {inject, Injectable, NgZone} from '@angular/core';
import {CanActivateFn, NavigationCancel, NavigationEnd, NavigationError, Router} from "@angular/router";
import {MotionService} from "./motion.service";

// The wipe element is 140vh tall with wavy top and bottom edges; these keep its body over the viewport
const BELOW = 'translateY(100vh)';
const COVERING = 'translateY(-20vh)';
const ABOVE = 'translateY(-140vh)';
// An animation that hasn't advanced at all by then is getting no frames (see finishIfStalled)
const STALL_CHECK_MS = 300;

// Page changes happen behind a liquid ochre -> rust sweep: it rises over the old page (the route guard
// waits for that), the router swaps pages and we scroll to the top out of sight, then it rises away.
@Injectable({
    providedIn: 'root'
})
export class RouteWipeService {

    private element?: HTMLElement;
    private animation?: Animation;
    private covered = false;
    // A navigation was cancelled while the wipe was still rising: drop it again once it's up
    private revealWhenCovered = false;

    constructor(private router: Router,
                private motion: MotionService,
                private ngZone: NgZone) {
        router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                // 'instant' skips the global `scroll-behavior: smooth`, which would still be scrolling on reveal
                window.scrollTo({top: 0, left: 0, behavior: 'instant'});
                this.reveal();
            } else if (event instanceof NavigationCancel || event instanceof NavigationError) {
                this.reveal();
            }
        });
    }

    attach(element: HTMLElement): void {
        this.element = element;
    }

    cover(): Promise<boolean> {
        const element = this.element;
        // The first navigation is hidden by the loading screen; reduced motion swaps pages directly
        if (!element || !this.router.navigated || this.motion.reducedMotion || this.covered) {
            return Promise.resolve(true);
        }
        this.revealWhenCovered = false;
        return this.ngZone.runOutsideAngular(() => {
            // Start from wherever an interrupted reveal left it
            const from = this.animation ? getComputedStyle(element).transform : BELOW;
            this.animation?.cancel();
            element.classList.add('is-active');
            this.animation = element.animate([{transform: from}, {transform: COVERING}], {
                duration: 380,
                easing: 'cubic-bezier(.65, 0, .35, 1)',
                fill: 'forwards'
            });
            finishIfStalled(this.animation);
            return this.animation.finished.then(() => {
                this.covered = true;
                if (this.revealWhenCovered) {
                    this.reveal();
                }
                return true;
            }, () => true);
        });
    }

    private reveal(): void {
        const element = this.element;
        if (!element) {
            return;
        }
        if (!this.covered) {
            this.revealWhenCovered = !!this.animation;
            return;
        }
        this.covered = false;
        this.ngZone.runOutsideAngular(() => {
            this.animation?.cancel();
            // Short hold so the new page has rendered underneath and the cupcake registers
            this.animation = element.animate([{transform: COVERING}, {transform: ABOVE}], {
                duration: 620,
                delay: 120,
                easing: 'cubic-bezier(.5, 0, .2, 1)',
                fill: 'both' // hold the covering pose through the delay too
            });
            finishIfStalled(this.animation);
            this.animation.finished.then(() => {
                element.classList.remove('is-active');
                this.animation?.cancel();
                this.animation = undefined;
            }, () => {
                // Cancelled by a new cover(): it takes over from here
            });
        });
    }
}

export const routeWipeGuard: CanActivateFn = () => inject(RouteWipeService).cover();

// Without frames (background tab, a window that isn't being drawn) an animation never advances and its
// `finished` never settles, which would hold the navigation forever. A decorative effect must never
// block navigation, so jump such an animation to its end.
function finishIfStalled(animation: Animation): void {
    setTimeout(() => {
        if (animation.playState === 'running' && !animation.currentTime) {
            animation.finish();
        }
    }, STALL_CHECK_MS);
}
