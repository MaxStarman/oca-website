import {ChangeDetectorRef, Component, EventEmitter, Output} from '@angular/core';
import {MotionService} from "../../../services/motion.service";

// Shard outlines fanning out from the impact point (52% 46%) to the edges. Each falls with its own
// sideways drift, spin and start delay.
const SHARDS = [
    {clip: 'polygon(52% 46%, 0 64%, 0 0, 30% 0)', dx: '-14vw', rot: '-24deg', delay: '40ms'},
    {clip: 'polygon(52% 46%, 30% 0, 74% 0)', dx: '-3vw', rot: '11deg', delay: '120ms'},
    {clip: 'polygon(52% 46%, 74% 0, 100% 0, 100% 36%)', dx: '12vw', rot: '19deg', delay: '0ms'},
    {clip: 'polygon(52% 46%, 100% 36%, 100% 78%)', dx: '16vw', rot: '-14deg', delay: '160ms'},
    {clip: 'polygon(52% 46%, 100% 78%, 100% 100%, 56% 100%)', dx: '7vw', rot: '28deg', delay: '80ms'},
    {clip: 'polygon(52% 46%, 56% 100%, 0 100%, 0 64%)', dx: '-9vw', rot: '-32deg', delay: '200ms'},
];

// How long the cracked photo shows before it shatters
const CRACK_MS = 450;

@Component({
    selector: 'news-start-page',
    templateUrl: './news-start-page.component.html',
    styleUrls: ['./news-start-page.component.scss']
})
export class NewsStartPageComponent {

    readonly shards = SHARDS;

    backgroundImage: string = '/assets/images/news/news-start-full.jpeg'; // Initial background image
    broken = false;
    shattering = false;

    @Output()
    clicked = new EventEmitter<void>();

    constructor(private motion: MotionService,
                private changeDetector: ChangeDetectorRef) {
    }

    // Click: the photo cracks, then shatters. The posts render underneath as the shards fall
    // (NewsComponent keeps this page around until they're gone).
    onBackgroundClick() {
        this.backgroundImage = '/assets/images/news/news-start-broken.jpeg';
        this.broken = true;

        setTimeout(() => {
            this.shattering = !this.motion.reducedMotion;
            // Render the shards now: once the parent removes this page (and keeps it only for its leave
            // animation), change detection no longer reaches it
            this.changeDetector.detectChanges();
            this.clicked.emit();
        }, this.motion.reducedMotion ? 600 : CRACK_MS);
    }
}
