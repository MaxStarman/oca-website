import {AfterViewInit, Component, DestroyRef, ElementRef, OnInit, QueryList, ViewChildren} from '@angular/core';
import {ViewportScroller} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {EMPTY} from "rxjs";
import {switchMap} from "rxjs/operators";
import {InstagramService} from "../../../services/instagram.service";
import {I18nService} from "../../../i18n/i18n.service";

@Component({
    selector: 'display-posts',
    templateUrl: './display-posts.component.html',
    styleUrls: ['./display-posts.component.scss']
})
export class DisplayPostsComponent implements OnInit, AfterViewInit {

    readonly instagramUrl = 'https://www.instagram.com/onecupcakeaway/';

    status: 'loading' | 'ready' | 'empty' | 'error' = 'loading';
    instagramData: any[] = [];
    otherPosts: any[] = [];
    selectedPost: any = null;

    @ViewChildren('videoElement') videoElements!: QueryList<ElementRef>;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private viewportScroller: ViewportScroller,
                private instagramService: InstagramService,
                private destroyRef: DestroyRef,
                public i18n: I18nService
    ) {
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
        this.viewportScroller.scrollToPosition([0, 0]);
    }
}
