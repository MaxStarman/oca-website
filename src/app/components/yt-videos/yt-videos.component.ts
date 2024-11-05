import {Component, OnInit} from '@angular/core';
import {YoutubeService} from "../../services/youtube.service";
import {Subject, takeUntil} from "rxjs";

@Component({
    selector: 'yt-videos',
    templateUrl: './yt-videos.component.html',
    styleUrls: ['./yt-videos.component.scss']
})
export class YtVideosComponent implements OnInit {


    videos: any = [];
    private unsubscribe$: Subject<any> = new Subject();

    constructor(private ytService: YoutubeService) {
    }

    // TODO read videos only once per session
    ngOnInit() {
        this.ytService.getYoutubeVideos().subscribe(data => {
            this.videos = data.items
        })
    }


//     YT player Angular wrapper
//     https://github.com/angular/components/tree/main/src/youtube-player
}
