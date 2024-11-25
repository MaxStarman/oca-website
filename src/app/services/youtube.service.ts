import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, tap} from 'rxjs/operators';
import {Observable, of, ReplaySubject} from "rxjs";
import {environment} from '../../enviroments/enviroment';


@Injectable({
    providedIn: 'root'
})
export class YoutubeService {

    isLoading = false;
    hasError = false
    /** Security
     * Store API keys securely: Never expose your API keys in client-side code. Use environment variables or secure storage mechanisms to store these keys on the server.
     * OAuth 2.0: Use OAuth 2.0 for authenticating API requests to ensure secure and controlled access.
     * Scope management: Limit the scope of API access to only what is necessary for your application to function.
     */

    private channelId = 'UCmZl5oAf_0DArAIUyv7PKHg'
    private searchUrl = 'https://www.googleapis.com/youtube/v3/search?key=';
    private videoUrl = 'https://www.googleapis.com/youtube/v3/videos?key=';
    private cachedVideos: ReplaySubject<any> = new ReplaySubject(1);
    private sessionKey = 'youtubeVideos';

    constructor(public http: HttpClient) {
    }

    getYoutubeVideos(): Observable<any> {
        const cachedData = sessionStorage.getItem(this.sessionKey);
        if (cachedData) {
            // Serve from sessionStorage
            this.cachedVideos.next(JSON.parse(cachedData));
        } else {
            // Fetch from API if not cached
            this.http.get(this.searchUrl + environment.youtubeApiKey + '&channelId=' + this.channelId + '&order=date&part=snippet &type=video,id&maxResults=5')
                .pipe(
                    tap((response: any) => {
                        sessionStorage.setItem(this.sessionKey, JSON.stringify(response));
                        this.cachedVideos.next(response);
                    }),
                    catchError(error => {
                        console.error('Error fetching YouTube videos:', error);
                        return of([]);
                    })
                ).subscribe();
        }
        return this.cachedVideos.asObservable();
    }


    fetchVideoDetails(videoId: string): Observable<any> {
        const sessionKey = `videoDetails_${videoId}`;
        const cachedVideoDetails = sessionStorage.getItem(sessionKey);

        if (cachedVideoDetails) {
            // Serve from sessionStorage
            return of(JSON.parse(cachedVideoDetails));
        } else {
            // Fetch from API if not cached
            return this.http.get(this.videoUrl + environment.youtubeApiKey + `&id=${videoId}` + '&part=snippet').pipe(
                tap(response => {
                    sessionStorage.setItem(sessionKey, JSON.stringify(response)); // Cache details
                }),
                catchError(error => {
                    console.error(`Error fetching video details for ID ${videoId}:`, error);
                    return of(null); // Gracefully handle errors by returning null
                })
            );
        }
    }

}
