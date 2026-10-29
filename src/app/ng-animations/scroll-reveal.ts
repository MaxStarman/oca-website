import {NgZone} from '@angular/core';
import {MotionService} from "../services/motion.service";

// GSAP + ScrollTrigger as a lazy chunk, registered once (shared by home and the pages)
const loadGsapOnce = () => Promise.all([import("gsap"), import("gsap/ScrollTrigger")])
    .then(([{gsap}, {ScrollTrigger}]) => {
        gsap.registerPlugin(ScrollTrigger);
        return {gsap, ScrollTrigger};
    });
let gsapPromise: ReturnType<typeof loadGsapOnce> | undefined;

export function loadGsap() {
    gsapPromise ??= loadGsapOnce();
    return gsapPromise;
}

// The motion language of the content pages: items rise in one after another while their tall section
// scrolls through its pinned 100vh block, scrubbed to the scroll position. Call update() whenever the
// items are (re)rendered (feeds arrive asynchronously) and destroy() on component destroy.
export class ScrollReveal {

    private revert?: () => void;
    private version = 0;

    constructor(private ngZone: NgZone, private motion: MotionService) {
    }

    async update(section: HTMLElement, items: HTMLElement[]): Promise<void> {
        const version = ++this.version;
        this.revert?.();
        this.revert = undefined;
        // Reduced motion: everything simply stays visible
        if (this.motion.reducedMotion || items.length === 0) {
            return;
        }
        const {gsap} = await loadGsap();
        if (version !== this.version) {
            return; // re-rendered or destroyed while GSAP was loading
        }
        this.ngZone.runOutsideAngular(() => {
            const context = gsap.context(() => {
                gsap.timeline({scrollTrigger: {trigger: section, start: 'top 85%', end: 'top -40%', scrub: 0.6}})
                    .fromTo(items,
                        {autoAlpha: 0, y: 80, rotate: i => i % 2 ? 2.5 : -2.5},
                        {autoAlpha: 1, y: 0, rotate: 0, stagger: 0.25, ease: 'power2.out'});
            }, section);
            this.revert = () => context.revert();
        });
    }

    destroy(): void {
        this.version++;
        this.revert?.();
    }
}
