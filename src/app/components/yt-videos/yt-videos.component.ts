import {Component, OnInit} from '@angular/core';
import {YoutubeService} from "../../services/youtube.service";
import {Subject, takeUntil} from "rxjs";

@Component({
    selector: 'app-yt-videos',
    templateUrl: './yt-videos.component.html',
    styleUrls: ['./yt-videos.component.scss']
})
export class YtVideosComponent implements OnInit {

    /** Security
     * Store API keys securely: Never expose your API keys in client-side code. Use environment variables or secure storage mechanisms to store these keys on the server.
     * OAuth 2.0: Use OAuth 2.0 for authenticating API requests to ensure secure and controlled access.
     * Scope management: Limit the scope of API access to only what is necessary for your application to function.
     */

    ocaCid = 'UCmZl5oAf_0DArAIUyv7PKHg'
    videos: any = []
    private unsubscribe$: Subject<any> = new Subject();

    constructor(private ytService: YoutubeService) {
    }

    // TODO read videos only once per session
    ngOnInit() {
        // this.ytService.getVideosForChanel(this.ocaCid, 5).pipe(
        //     takeUntil(this.unsubscribe$)
        // ).subscribe(res => {
        //     for (let element of res["items"]) {
        //         this.videos.push(element)
        //     }
        // })
    }
    getVideos(){
        this.ytService.getVideosForChanel(this.ocaCid, 5).pipe(
            takeUntil(this.unsubscribe$)
        ).subscribe(res => {
            for (let element of res["items"]) {
                this.videos.push(element)
            }
        })
    }

    consoleLog(){
        this.getVideos()
        console.log(this.videos)
    }

//     YT player Angular wrapper
//     https://github.com/angular/components/tree/main/src/youtube-player
}
