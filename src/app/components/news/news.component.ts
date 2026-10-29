import {Component} from '@angular/core';
import {MotionService} from "../../services/motion.service";

// Shard animation (news-start-page CSS) or, with reduced motion, the crossfade
const SHATTER_MS = 1400;
const FADE_MS = 1000;

@Component({
    selector: 'news-page',
    templateUrl: './news.component.html',
    styleUrls: ['./news.component.scss']
})
export class NewsComponent {

    showStartPage = true;
    showPosts = false;
    // Reduced motion: the start page fades out instead of shattering
    readonly fadeOut: boolean;

    constructor(motion: MotionService) {
        this.fadeOut = motion.reducedMotion;
    }

    // The posts appear underneath right away; the start page goes once its exit has played
    onStartPageDone() {
        this.showPosts = true;
        setTimeout(() => this.showStartPage = false, this.fadeOut ? FADE_MS : SHATTER_MS);
    }
}
