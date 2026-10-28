import {AfterViewInit, Component, DestroyRef, ElementRef, NgZone, OnDestroy, ViewChild} from '@angular/core';
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {NavService} from "../../services/nav.service";
import {MotionService} from "../../services/motion.service";
import {LoadingService} from "../../services/loading.service";
import {SIGNATURE, TranslationKey} from "../../i18n/sl";
import {loadCupcakeScene, StageComponent} from "../stage/stage.component";

// Once the logo has been clicked, the idle pulse hint stops for the rest of the session
const HINT_SEEN_KEY = 'oca.logoClicked';
// Long enough for the press "squash" to be seen before the overlay covers the logo
const PRESS_MS = 140;

@Component({
    selector: 'home-page',
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements AfterViewInit, OnDestroy {

    readonly signature = SIGNATURE;
    readonly lines: TranslationKey[] = ['home.intro', 'home.manifesto1', 'home.manifesto2'];

    showHint = !this.hintSeen();
    pressed = false;
    logoHovered = false;
    navOpen = false;

    @ViewChild('manifesto') manifestoRef!: ElementRef<HTMLElement>;
    @ViewChild('footer') footerRef!: ElementRef<HTMLElement>;
    @ViewChild(StageComponent) stage!: StageComponent;

    private revertScrollScene?: () => void;

    constructor(private navService: NavService,
                private motion: MotionService,
                private ngZone: NgZone,
                loadingService: LoadingService,
                destroyRef: DestroyRef) {
        // Start downloading three.js now and keep the loading screen up until it's here,
        // so the cupcake is already breathing when the screen lifts
        if (!motion.reducedMotion) {
            loadingService.hold(loadCupcakeScene());
        }
        navService.isOpen$.pipe(takeUntilDestroyed(destroyRef)).subscribe(open => this.navOpen = open);
    }

    async ngAfterViewInit(): Promise<void> {
        // Reduced motion: no scroll scene, every line is simply visible
        if (this.motion.reducedMotion) {
            return;
        }
        const [{gsap}, {ScrollTrigger}] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
        gsap.registerPlugin(ScrollTrigger);
        const section = this.manifestoRef.nativeElement;
        const lines = Array.from(section.querySelectorAll<HTMLElement>('.line'));

        this.ngZone.runOutsideAngular(() => {
            const context = gsap.context(() => {
                // Each line rises in as the one before it fades back, like the current verse in a song
                const timeline = gsap.timeline({
                    scrollTrigger: {trigger: section, start: 'top top', end: 'bottom bottom', scrub: 0.6}
                });
                lines.forEach((line, i) => {
                    timeline.fromTo(line, {autoAlpha: 0, y: 48}, {autoAlpha: 1, y: 0, duration: 1}, i === 0 ? 0 : '>-0.2');
                    if (i > 0) {
                        timeline.to(lines[i - 1], {opacity: 0.4, duration: 0.8}, '<');
                    }
                });
                timeline.to({}, {duration: 0.6}); // hold the last line before the section ends

                // The cupcake turns, shrinks and dims behind the text over the same stretch
                ScrollTrigger.create({
                    trigger: section,
                    start: 'top bottom',
                    end: 'bottom bottom',
                    onUpdate: self => this.stage?.setScrollProgress(self.progress)
                });
            }, section);

            // Once the footer video (almost) fills the screen the cupcake can't be seen: stop rendering it.
            // Same visibility pattern as the nav-menu video.
            const footerObserver = new IntersectionObserver(entries => {
                this.stage?.setCovered(entries[entries.length - 1].intersectionRatio >= 0.98);
            }, {threshold: [0, 0.98]});
            footerObserver.observe(this.footerRef.nativeElement);

            this.revertScrollScene = () => {
                context.revert();
                footerObserver.disconnect();
            };
        });
    }

    ngOnDestroy(): void {
        this.revertScrollScene?.();
    }

    onLogoClick() {
        this.rememberHintSeen();
        this.showHint = false;

        if (this.motion.reducedMotion) {
            this.navService.toggleNav();
            return;
        }
        this.pressed = true;
        setTimeout(() => {
            this.pressed = false;
            this.navService.toggleNav();
        }, PRESS_MS);
    }

    private hintSeen(): boolean {
        try {
            return sessionStorage.getItem(HINT_SEEN_KEY) === '1';
        } catch {
            return false;
        }
    }

    private rememberHintSeen() {
        try {
            sessionStorage.setItem(HINT_SEEN_KEY, '1');
        } catch {
            // Storage blocked: the hint just comes back on the next visit to home
        }
    }
}
