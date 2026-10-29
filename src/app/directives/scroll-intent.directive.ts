import {Directive, EventEmitter, HostListener, Output} from '@angular/core';

// Minimum finger travel (px) that counts as a swipe rather than a tap
const SWIPE_PX = 40;

// Emits when the visitor tries to scroll past the element: wheel or trackpad down, or a swipe up on a
// touch screen. The full-screen intros (Novice, Kontakt) have nothing to scroll, so this lets that
// instinctive gesture continue to the content, just like a click does.
@Directive({
    selector: '[scrollIntent]'
})
export class ScrollIntentDirective {

    @Output() scrollIntent = new EventEmitter<void>();

    private touchStartY?: number;

    @HostListener('wheel', ['$event'])
    onWheel(event: WheelEvent): void {
        if (event.deltaY > 0) {
            this.scrollIntent.emit();
        }
    }

    @HostListener('touchstart', ['$event'])
    onTouchStart(event: TouchEvent): void {
        this.touchStartY = event.touches[0]?.clientY;
    }

    @HostListener('touchend', ['$event'])
    onTouchEnd(event: TouchEvent): void {
        const endY = event.changedTouches[0]?.clientY;
        if (this.touchStartY !== undefined && endY !== undefined && this.touchStartY - endY > SWIPE_PX) {
            this.scrollIntent.emit();
        }
        this.touchStartY = undefined;
    }
}
