import {
    AfterViewInit,
    Component,
    ElementRef,
    HostListener,
    Input,
    NgZone,
    OnDestroy,
    ViewChild
} from '@angular/core';
import {Router} from "@angular/router";
import {I18nService} from "../../../i18n/i18n.service";
import {MotionService} from "../../../services/motion.service";

@Component({
    selector: 'nav-menu',
    templateUrl: './nav-menu.component.html',
    styleUrls: ['./nav-menu.component.scss']
})
export class NavMenuComponent implements AfterViewInit, OnDestroy {

    isMobile = false;

    @Input()
    isFromOverlay = false;

    @ViewChild('bgVideo') bgVideo!: ElementRef<HTMLVideoElement>;

    private videoObserver?: IntersectionObserver;

    constructor(private router: Router,
                private ngZone: NgZone,
                private motion: MotionService,
                public i18n: I18nService) {
        this.checkScreenSize();
    }

    // Detect screen size on window resize
    @HostListener('window:resize', [])
    checkScreenSize() {
        this.isMobile = window.innerWidth < 992; // Mobile and tablet breakpoint
    }

    // Every page has a nav-menu footer plus the home overlay: only the one on screen plays.
    // The closed overlay is display:none, so it counts as not visible until it opens.
    ngAfterViewInit(): void {
        const video = this.bgVideo.nativeElement;
        // Angular creates <video> from script, where the `muted` attribute only sets defaultMuted.
        // Browsers refuse to autoplay unmuted video, so set the property itself.
        video.muted = true;
        this.ngZone.runOutsideAngular(() => {
            this.videoObserver = new IntersectionObserver(entries => {
                // Several changes can arrive in one batch, oldest first: only the latest matters
                const entry = entries[entries.length - 1];
                if (entry.isIntersecting && !this.motion.reducedMotion) {
                    video.play().catch(() => {
                        // Autoplay refused (e.g. data saver): the first frame stays as a still
                    });
                } else {
                    video.pause();
                }
            }, {threshold: 0.5});
            this.videoObserver.observe(video);
        });
    }

    ngOnDestroy(): void {
        this.videoObserver?.disconnect();
    }

    onLinkClick(event: Event, routerLink: string) {
        if (this.isMobile) {
            const linkElement = (event.target as HTMLElement).closest('.mobile-animation');
            if (linkElement) {
                // Add the animation class
                linkElement.classList.add('animate');

                // Remove the animation class after the animation duration
                setTimeout(() => {
                    linkElement.classList.remove('animate');
                    this.goTo(routerLink);
                }, 200); // Match the CSS animation duration
            }
        } else {
            this.goTo(routerLink);
        }
    }

    // The route transition scrolls to the top and NavService closes the overlay. The router ignores
    // links to the page we're already on, so from that page's own footer just glide back up.
    private goTo(routerLink: string) {
        if (this.router.url === routerLink) {
            window.scrollTo({top: 0, behavior: 'smooth'});
        } else {
            this.router.navigate([routerLink]);
        }
    }
}
