import {AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChildren} from '@angular/core';
import {ViewportScroller} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {InstagramService} from "../../../services/instagram.service";

@Component({
    selector: 'display-posts',
    templateUrl: './display-posts.component.html',
    styleUrls: ['./display-posts.component.scss']
})
export class DisplayPostsComponent implements OnInit, AfterViewInit {

    instagramData: any = [];
    otherPosts: any[] = [];
    selectedPost: any = [];

    @ViewChildren('videoElement') videoElements!: QueryList<ElementRef>;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private viewportScroller: ViewportScroller,
                private instagramService: InstagramService
    ) {
    }

    ngOnInit() {
        this.instagramService.getUserMedia().subscribe(posts => {
            this.instagramData = posts.data || [];
            if (this.instagramData.length > 0) {
                // Listen for route changes to update state
                this.route.paramMap.subscribe((params: any) => {
                    const postId = params.get('id');

                    if (postId) {
                        // Display post details
                        this.displayPost(postId);
                    } else {
                        // Display the latest post by default (index 0)
                        this.displayPost(this.instagramData[0].id);
                    }
                });
            }
        })
    }

    ngAfterViewInit() {
        this.muteAllVideos();
    }

    displayPost(id: string) {
        this.selectedPost = this.instagramData.find(
            (post: any) => post.id === id
        );
        this.otherPosts = this.instagramData.filter(
            (post: any) => post.id !== id
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
