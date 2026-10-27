import {Component, DestroyRef, HostListener, OnInit} from '@angular/core';
import {YoutubeService} from "../../services/youtube.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ViewportScroller} from "@angular/common";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {EMPTY} from "rxjs";
import {switchMap} from "rxjs/operators";

@Component({
    selector: 'yt-videos',
    templateUrl: './yt-videos.component.html',
    styleUrls: ['./yt-videos.component.scss']
})
export class YtVideosComponent implements OnInit {

    status: 'loading' | 'ready' | 'empty' | 'error' = 'loading';
    videos: any[] = [];
    otherVideos: any[] = [];
    selectedVideo: any = {snippet: {thumbnails: {medium: {url: ''}}, title: '', description: '', publishedAt: ''}};

    playerWidth = 640; // Default width
    playerHeight = 390; // Default height

    constructor(
        public ytService: YoutubeService,
        private route: ActivatedRoute,
        private router: Router,
        private viewportScroller: ViewportScroller,
        private destroyRef: DestroyRef
    ) {
    }

    @HostListener('window:resize', ['$event'])
    onResize(event: Event): void {
        this.adjustPlayerSize((event.target as Window).innerWidth);
    }


    ngOnInit(): void {
        this.adjustPlayerSize(window.innerWidth); // Adjust video player size
        this.ytService.loadIframeApi();

        this.ytService.getYoutubeVideos().pipe(
            switchMap(videos => {
                this.videos = videos;
                if (videos.length === 0) {
                    this.status = 'empty';
                    return EMPTY;
                }
                // Listen for route changes to update state
                return this.route.paramMap;
            }),
            // Video detail view, or the latest video by default
            switchMap(params => this.fetchAndDisplayVideo(params.get('id') || this.videos[0].id.videoId)),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe({
            error: () => this.status = 'error'
        });
    }

    fetchAndDisplayVideo(videoId: string) {
        return this.ytService.fetchVideoDetails(videoId).pipe(
            switchMap(details => {
                if (details && details.items && details.items[0]) {
                    this.selectedVideo = details.items[0];
                    // Filter out the selected video from the grid
                    this.otherVideos = this.videos.filter(
                        (video) => video.id.videoId !== videoId
                    );
                    this.status = 'ready';
                } else {
                    this.status = 'error';
                }
                return EMPTY;
            })
        );
    }

    // Redirect when a video is clicked
    viewVideo(videoId: string): void {
        this.router.navigate(['/music/video', videoId]);
        this.viewportScroller.scrollToPosition([0, 0]);
    }

    private adjustPlayerSize(screenWidth: number): void {
        if (screenWidth < 480) {
            // Small screen (e.g., phones)
            this.playerWidth = 300;
            this.playerHeight = 169; // Maintain 16:9 ratio
        } else if (screenWidth < 768) {
            // Medium screen (e.g., tablets)
            this.playerWidth = 380;
            this.playerHeight = 205; // Maintain 16:9 ratio
        } else {
            // Large screen (e.g., desktops)
            this.playerWidth = 640;
            this.playerHeight = 390; // Maintain 16:9 ratio
        }
    }
}
