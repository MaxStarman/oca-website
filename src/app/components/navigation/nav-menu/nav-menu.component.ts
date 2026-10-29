import {AfterViewInit, Component, ElementRef, NgZone, OnDestroy, ViewChild} from '@angular/core';
import {NAV_LINKS, NavService} from "../../../services/nav.service";
import {MotionService} from "../../../services/motion.service";

// The big video menu: inside the home overlay and as the footer of every page
@Component({
    selector: 'nav-menu',
    templateUrl: './nav-menu.component.html',
    styleUrls: ['./nav-menu.component.scss']
})
export class NavMenuComponent implements AfterViewInit, OnDestroy {

    readonly links = NAV_LINKS;

    @ViewChild('bgVideo') bgVideo!: ElementRef<HTMLVideoElement>;

    private videoObserver?: IntersectionObserver;

    constructor(public nav: NavService,
                private ngZone: NgZone,
                private motion: MotionService) {
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
}
