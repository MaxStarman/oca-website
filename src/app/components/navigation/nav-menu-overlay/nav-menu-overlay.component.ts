import {Component, DestroyRef, ElementRef, ViewChild} from '@angular/core';
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {NavService} from "../../../services/nav.service";

// The full-screen menu opened from the home logo. Behaves like a dialog: focus moves in on open, Tab stays
// inside, Esc or the close button closes it and focus returns to whatever opened it.
@Component({
    selector: 'nav-menu-overlay',
    templateUrl: './nav-menu-overlay.component.html',
    styleUrls: ['./nav-menu-overlay.component.scss']
})
export class NavMenuOverlayComponent {

    isOpen = false;

    @ViewChild('closeButton') closeButton!: ElementRef<HTMLButtonElement>;

    private returnFocusTo: HTMLElement | null = null;

    constructor(private navService: NavService,
                private host: ElementRef<HTMLElement>,
                destroyRef: DestroyRef) {
        navService.isOpen$.pipe(takeUntilDestroyed(destroyRef)).subscribe(isOpen => {
            if (isOpen && !this.isOpen) {
                this.returnFocusTo = document.activeElement as HTMLElement | null;
                // Once the overlay is rendered (it is display:none while closed)
                setTimeout(() => this.closeButton.nativeElement.focus());
            }
            this.isOpen = isOpen;
        });
    }

    close(): void {
        this.navService.close();
        this.returnFocusTo?.focus();
        this.returnFocusTo = null;
    }

    onKeydown(event: KeyboardEvent): void {
        if (event.key === 'Escape') {
            this.close();
        } else if (event.key === 'Tab') {
            this.keepFocusInside(event);
        }
    }

    // Tab past the last item wraps to the close button, Shift+Tab past it wraps to the last item
    private keepFocusInside(event: KeyboardEvent): void {
        const focusable = Array.from(this.host.nativeElement.querySelectorAll<HTMLElement>('button, a[href]'));
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
            last.focus();
            event.preventDefault();
        } else if (!event.shiftKey && document.activeElement === last) {
            first.focus();
            event.preventDefault();
        }
    }
}
