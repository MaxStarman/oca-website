import {Component} from '@angular/core';
import {animate, style, transition, trigger} from "@angular/animations";
import {MotionService} from "../../services/motion.service";
import {fadeAnimations} from "../../ng-animations/animations";

@Component({
    selector: 'news-page',
    templateUrl: './news.component.html',
    styleUrls: ['./news.component.scss'],
    animations: [
        ...fadeAnimations,
        // 'shatter' keeps the start page in the DOM, unchanged, while its shards fall (news-start-page
        // CSS); with reduced motion it simply fades
        trigger('startPageLeave', [
            transition('shatter => void', [animate('1400ms')]),
            transition('fade => void', [animate('1000ms', style({opacity: 0}))])
        ])
    ]
})
export class NewsComponent {

    showStartPage = true;
    readonly startPageLeave: 'shatter' | 'fade';

    constructor(motion: MotionService) {
        this.startPageLeave = motion.reducedMotion ? 'fade' : 'shatter';
    }

    toggleStartPage() {
        this.showStartPage = !this.showStartPage;
    }
}
