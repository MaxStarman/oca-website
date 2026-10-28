import {
    AfterViewInit,
    Component,
    DestroyRef,
    ElementRef,
    HostListener,
    NgZone,
    OnDestroy,
    OnInit,
    QueryList,
    ViewChild,
    ViewChildren
} from '@angular/core';
import {YoutubeService} from "../../services/youtube.service";
import {ActivatedRoute, Router} from "@angular/router";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {EMPTY} from "rxjs";
import {switchMap} from "rxjs/operators";
import {I18nService} from "../../i18n/i18n.service";
import {MotionService} from "../../services/motion.service";
import {ScrollReveal} from "../../ng-animations/scroll-reveal";

@Component({
    selector: 'yt-videos',
    templateUrl: './yt-videos.component.html',
    styleUrls: ['./yt-videos.component.scss']
})
export class YtVideosComponent implements OnInit, AfterViewInit, OnDestroy {

    status: 'loading' | 'ready' | 'empty' | 'error' = 'loading';
    videos: any[] = [];
    otherVideos: any[] = [];
    selectedVideo: any = {snippet: {thumbnails: {medium: {url: ''}}, title: '', description: '', publishedAt: ''}};

    // False shows the thumbnail facade; true swaps in the real player
    playerActive = false;

    playerWidth = 640; // Default width
    playerHeight = 390; // Default height

    @ViewChild('moreVideos') moreVideosRef!: ElementRef<HTMLElement>;
    @ViewChildren('card') cards!: QueryList<ElementRef<HTMLElement>>;

    private reveal: ScrollReveal;

    constructor(
        public ytService: YoutubeService,
        private route: ActivatedRoute,
        private router: Router,
        private destroyRef: DestroyRef,
        public i18n: I18nService,
        ngZone: NgZone,
        motion: MotionService
    ) {
        this.reveal = new ScrollReveal(ngZone, motion);
    }

    @HostListener('window:resize', ['$event'])
    onResize(event: Event): void {
        this.adjustPlayerSize((event.target as Window).innerWidth);
    }


    ngOnInit(): void {
        this.adjustPlayerSize(window.innerWidth); // Adjust video player size

        this.ytService.getYoutubeVideos().pipe(
            switchMap(videos => {
                this.videos = videos;
                // Search results come HTML-escaped ("Rock &amp; Roll"); the grid shows them as text
                videos.forEach(video => video.snippet.title = decodeEntities(video.snippet.title));
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

    // The grid is (re)rendered whenever the feed arrives or another video is picked; a cached feed
    // can already be on screen here
    ngAfterViewInit(): void {
        const update = () => this.reveal.update(this.moreVideosRef.nativeElement, this.cards.map(card => card.nativeElement));
        update();
        this.cards.changes.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(update);
    }

    ngOnDestroy(): void {
        this.reveal.destroy();
    }

    fetchAndDisplayVideo(videoId: string) {
        return this.ytService.fetchVideoDetails(videoId).pipe(
            switchMap(details => {
                if (details && details.items && details.items[0]) {
                    this.selectedVideo = details.items[0];
                    this.playerActive = false;
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

    // Largest thumbnail YouTube has for this video (maxres/standard only exist for some uploads)
    get facadeThumbnail(): string {
        const thumbnails = this.selectedVideo.snippet.thumbnails;
        return (thumbnails.maxres || thumbnails.standard || thumbnails.high || thumbnails.medium).url;
    }

    playVideo(): void {
        this.ytService.loadIframeApi();
        this.playerActive = true;
    }

    // Redirect when a video is clicked
    viewVideo(videoId: string): void {
        this.router.navigate(['/music/video', videoId]);
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

function decodeEntities(text: string): string {
    return new DOMParser().parseFromString(text, 'text/html').documentElement.textContent ?? text;
}
