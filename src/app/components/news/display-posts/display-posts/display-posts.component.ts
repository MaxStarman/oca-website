import {AfterViewInit, Component, ElementRef, Input, QueryList, ViewChildren} from '@angular/core';

@Component({
    selector: 'display-posts',
    templateUrl: './display-posts.component.html',
    styleUrls: ['./display-posts.component.scss']
})
export class DisplayPostsComponent implements AfterViewInit {

    @Input()
    posts: any = [];

    @ViewChildren('videoElement') videoElements!: QueryList<ElementRef>;

    expandedPosts: boolean[] = []; // Array to track expanded state by index

    constructor() {
    }

    ngAfterViewInit() {
        this.muteAllVideos();
    }

    toggleCaption(index: number) {
        this.expandedPosts[index] = !this.expandedPosts[index];
    }

    isExpanded(index: number): boolean {
        return this.expandedPosts[index];
    }

    // Function to mute all video elements
    muteAllVideos() {
        this.videoElements.forEach((videoElement) => {
            const video = videoElement.nativeElement;
            video.muted = true;
            video.play().catch((error: any) => {
                console.log('Auto-play or mute might be blocked by the browser: ', error);
            });
        });
    }
}
