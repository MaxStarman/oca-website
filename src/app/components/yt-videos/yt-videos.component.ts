import {Component, HostListener, OnInit} from '@angular/core';
import {YoutubeService} from "../../services/youtube.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ViewportScroller} from "@angular/common";

@Component({
    selector: 'yt-videos',
    templateUrl: './yt-videos.component.html',
    styleUrls: ['./yt-videos.component.scss']
})
export class YtVideosComponent implements OnInit {

    videos: any[] = [];
    otherVideos: any[] = [];
    selectedVideo: any = null;

    playerWidth = 640; // Default width
    playerHeight = 390; // Default height

    constructor(
        private ytService: YoutubeService,
        private route: ActivatedRoute,
        private router: Router,
        private viewportScroller: ViewportScroller
    ) {
    }

    @HostListener('window:resize', ['$event'])
    onResize(event: Event): void {
        this.adjustPlayerSize((event.target as Window).innerWidth);
    }


    ngOnInit(): void {
        this.adjustPlayerSize(window.innerWidth); // Adjust video player size

        this.ytService.getYoutubeVideos().subscribe(data => {
            this.videos = data.items
        })
        // Listen for route changes to update state
        this.route.paramMap.subscribe((params: any) => {
            const videoId = params.get('id');
            if (videoId) {
                this.fetchAndDisplayVideo(videoId); // Video detail view
            } else if (this.videos.length > 0) {
                // Display the latest video by default
                this.fetchAndDisplayVideo(this.videos[0].id.videoId);
            }
        });
    }

    fetchAndDisplayVideo(videoId: string): void {
        this.ytService.fetchVideoDetails(videoId).subscribe(details => {
            this.selectedVideo = details.items[0];

            // Filter out the selected video from the grid
            this.otherVideos = this.videos.filter(
                (video) => video.id.videoId !== videoId
            );
        });
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
