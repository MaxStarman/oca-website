import {Component, EventEmitter, HostListener, Input, Output} from '@angular/core';
import {ViewportScroller} from "@angular/common";
import {Router} from "@angular/router";

@Component({
    selector: 'nav-menu',
    templateUrl: './nav-menu.component.html',
    styleUrls: ['./nav-menu.component.scss']
})
export class NavMenuComponent {

    isMobile = false;

    @Output() toggleNav = new EventEmitter<void>();

    @Input()
    isFromOverlay = false;

    constructor(private viewportScroller: ViewportScroller,
                private router: Router) {
        this.checkScreenSize();
    }

    // Detect screen size on window resize
    @HostListener('window:resize', [])
    checkScreenSize() {
        this.isMobile = window.innerWidth < 992; // Mobile and tablet breakpoint
    }

    notifyParentAndHandleEvent(event: Event, routerLink: string) {
        // this.viewportScroller.scrollToPosition([0, 0]);

        if (this.isMobile) {
            const linkElement = (event.target as HTMLElement).closest('.link-item');
            if (linkElement) {
                // Add the animation class
                linkElement.classList.add('animate');

                // Remove the animation class after the animation duration
                setTimeout(() => {
                    linkElement.classList.remove('animate');

                    // TODO (optional) ce user klikne link strani na kateri je je, ga pelje na vrh strani
                    this.router.navigate([routerLink])

                }, 200); // Match the CSS animation duration
            }
        } else {
            this.router.navigate([routerLink])
            this.toggleNav.emit();
        }
    }
}
