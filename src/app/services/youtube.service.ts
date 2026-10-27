import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, map, shareReplay, tap} from 'rxjs/operators';
import {Observable, of, throwError} from "rxjs";
import {environment} from '../../enviroments/enviroment';


@Injectable({
    providedIn: 'root'
})
export class YoutubeService {

    /** Security
     * Store API keys securely: Never expose your API keys in client-side code. Use environment variables or secure storage mechanisms to store these keys on the server.
     * OAuth 2.0: Use OAuth 2.0 for authenticating API requests to ensure secure and controlled access.
     * Scope management: Limit the scope of API access to only what is necessary for your application to function.
     */

    readonly channelUrl = 'https://www.youtube.com/channel/UCmZl5oAf_0DArAIUyv7PKHg';
    private channelId = 'UCmZl5oAf_0DArAIUyv7PKHg'
    private searchUrl = 'https://www.googleapis.com/youtube/v3/search';
    private videoUrl = 'https://www.googleapis.com/youtube/v3/videos';
    private iframeApiUrl = 'https://www.youtube.com/iframe_api';
    private videos$?: Observable<any[]>;
    private sessionKey = 'youtubeVideos';

    constructor(public http: HttpClient) {
    }

    // Emits the latest uploads once (from sessionStorage or the API) or errors; callers show their own error state.
    getYoutubeVideos(): Observable<any[]> {
        if (!this.videos$) {
            this.videos$ = this.loadYoutubeVideos().pipe(
                map((response: any) => response?.items || []),
                catchError(error => {
                    console.error('Error fetching YouTube videos:', error);
                    // Drop the failed request so the next visit retries
                    this.videos$ = undefined;
                    return throwError(() => error);
                }),
                shareReplay(1)
            );
        }
        return this.videos$;
    }


    fetchVideoDetails(videoId: string): Observable<any> {
        const sessionKey = `videoDetails_${videoId}`;
        const cachedVideoDetails = sessionStorage.getItem(sessionKey);

        if (cachedVideoDetails) {
            // Serve from sessionStorage
            return of(JSON.parse(cachedVideoDetails));
        }
        if (!environment.youtubeApiKey) {
            return of(null);
        }
        // Fetch from API if not cached
        return this.http.get(this.videoUrl, {
            params: {key: environment.youtubeApiKey, id: videoId, part: 'snippet'}
        }).pipe(
            tap(response => {
                sessionStorage.setItem(sessionKey, JSON.stringify(response)); // Cache details
            }),
            catchError(error => {
                console.error(`Error fetching video details for ID ${videoId}:`, error);
                return of(null); // Gracefully handle errors by returning null
            })
        );
    }

    // @angular/youtube-player v16 does not load the IFrame API itself; add it once, only when a player is needed.
    loadIframeApi(): void {
        if (document.querySelector(`script[src="${this.iframeApiUrl}"]`)) {
            return;
        }
        const tag = document.createElement('script');
        tag.src = this.iframeApiUrl;
        document.body.appendChild(tag);
    }

    private loadYoutubeVideos(): Observable<any> {
        const cachedData = sessionStorage.getItem(this.sessionKey);
        if (cachedData) {
            // Serve from sessionStorage
            return of(JSON.parse(cachedData));
        }
        if (!environment.youtubeApiKey) {
            return throwError(() => new Error('YouTube API key not configured'));
        }
        // Fetch from API if not cached
        return this.http.get(this.searchUrl, {
            params: {
                key: environment.youtubeApiKey,
                channelId: this.channelId,
                order: 'date',
                part: 'snippet',
                type: 'video',
                maxResults: '5'
            }
        }).pipe(
            tap(response => sessionStorage.setItem(this.sessionKey, JSON.stringify(response)))
        );
    }

}
