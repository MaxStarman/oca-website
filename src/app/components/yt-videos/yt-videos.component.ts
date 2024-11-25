import {Component, OnInit} from '@angular/core';
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

    constructor(
        private ytService: YoutubeService,
        private route: ActivatedRoute,
        private router: Router,
        private viewportScroller: ViewportScroller
    ) {
    }

    ngOnInit(): void {
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

}
