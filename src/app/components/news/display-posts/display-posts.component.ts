import {
    AfterViewInit,
    Component,
    DestroyRef,
    ElementRef,
    NgZone,
    OnDestroy,
    OnInit,
    QueryList,
    ViewChild,
    ViewChildren
} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {EMPTY} from "rxjs";
import {switchMap} from "rxjs/operators";
import {InstagramService} from "../../../services/instagram.service";
import {I18nService} from "../../../i18n/i18n.service";
import {MotionService} from "../../../services/motion.service";
import {ScrollReveal} from "../../../ng-animations/scroll-reveal";

@Component({
    selector: 'display-posts',
    templateUrl: './display-posts.component.html',
    styleUrls: ['./display-posts.component.scss']
})
export class DisplayPostsComponent implements OnInit, AfterViewInit, OnDestroy {

    readonly instagramUrl = 'https://www.instagram.com/onecupcakeaway/';

    status: 'loading' | 'ready' | 'empty' | 'error' = 'loading';
    instagramData: any[] = [];
    otherPosts: any[] = [];
    selectedPost: any = null;

    @ViewChildren('videoElement') videoElements!: QueryList<ElementRef>;
    @ViewChild('morePosts') morePostsRef!: ElementRef<HTMLElement>;
    // The post cards plus the "follow us" plug, revealed in that order
    @ViewChildren('card') cards!: QueryList<ElementRef<HTMLElement>>;

    private reveal: ScrollReveal;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private instagramService: InstagramService,
                private destroyRef: DestroyRef,
                public i18n: I18nService,
                ngZone: NgZone,
                motion: MotionService
    ) {
        this.reveal = new ScrollReveal(ngZone, motion);
    }

    ngOnInit() {
        this.instagramService.getUserMedia().pipe(
            switchMap(posts => {
                this.instagramData = posts;
                if (posts.length === 0) {
                    this.status = 'empty';
                    return EMPTY;
                }
                // Listen for route changes to update state
                return this.route.paramMap;
            }),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe({
            next: params => {
                // Display the requested post, or the latest one (index 0) by default
                this.displayPost(params.get('id') || this.instagramData[0].id);
                this.status = 'ready';
            },
            error: () => this.status = 'error'
        });
    }

    ngAfterViewInit() {
        this.muteAllVideos();
        // The grid is (re)rendered whenever the feed arrives or another post is picked
        const update = () => this.reveal.update(this.morePostsRef.nativeElement, this.cards.map(card => card.nativeElement));
        update();
        this.cards.changes.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(update);
    }

    ngOnDestroy(): void {
        this.reveal.destroy();
    }

    displayPost(id: string) {
        // Unknown ids (old or deleted posts) fall back to the latest post
        this.selectedPost = this.instagramData.find(
            (post: any) => post.id === id
        ) || this.instagramData[0];
        this.otherPosts = this.instagramData.filter(
            (post: any) => post.id !== this.selectedPost.id
        );
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

    getImageSource(post: any): string {
        if (post.media_type === 'IMAGE') {
            return post.media_url;
        } else if (post.media_type === 'VIDEO') {
            return post.thumbnail_url;
        } else if (post.media_type === 'CAROUSEL_ALBUM') {
            return post.children.data[0].media_type === 'IMAGE'
                ? post.children.data[0].media_url
                : post.children.data[0].thumbnail_url;
        }
        return ''; // Default return value in case of unexpected media_type
    }

    // Redirect when a post is clicked
    viewPost(postId: string): void {
        this.router.navigate(['/news/post', postId]);
    }
}
