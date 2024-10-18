import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, tap} from 'rxjs/operators';
import {Observable, of, ReplaySubject} from "rxjs";
import { environment } from '../../enviroments/enviroment';


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

    /** Dva API klica za dodatne info o videjih
     *  za 5 videjov je potrebnih 6 klicev
     *  za extra data je potrebno klicati API za vsak video posebaj
    */
    /*
        private searchUrl = 'https://www.googleapis.com/youtube/v3/search';
        private videoUrl = 'https://www.googleapis.com/youtube/v3/videos';
        private apiKey = environment.youtubeApiKey;
        private sessionKey = 'youtubeVideos';

        constructor(private http: HttpClient) {}

        // Function to search for videos and fetch their details
        searchVideos(query: string, channelId: string = ''): Observable<any> {
            const cachedData = sessionStorage.getItem(this.sessionKey);

            if (cachedData) {
                // If data exists in sessionStorage, return it as Observable
                return of(JSON.parse(cachedData));
            }

            // If no cached data, make API calls
            const url = `${this.searchUrl}?key=${this.apiKey}&q=${query}&channelId=${channelId}&part=snippet&type=video&maxResults=5`;

            return this.http.get<any>(url).pipe(
                // Extract video IDs from search results
                map(response => response.items.map((item: any) => item.id.videoId)),
                // Use video IDs to get video details
                switchMap(videoIds => this.getVideoDetails(videoIds)),
                // Save result to sessionStorage after fetching video details
                tap(videos => {
                    sessionStorage.setItem(this.sessionKey, JSON.stringify(videos));
                })
            );
        }

        // Function to fetch video details by video IDs
        getVideoDetails(videoIds: string[]): Observable<any> {
            const ids = videoIds.join(',');
            const url = `${this.videoUrl}?key=${this.apiKey}&id=${ids}&part=snippet,contentDetails,statistics`;

            return this.http.get<any>(url).pipe(
                map(response => response.items)
            );
        }
        */

    /**
     *
     */
}
