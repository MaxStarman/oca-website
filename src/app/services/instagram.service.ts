import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, of, throwError} from "rxjs";
import {environment} from "../../enviroments/enviroment";
import {catchError, map, shareReplay, tap} from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class InstagramService {


    private apiUrl = 'https://graph.instagram.com/v21.0';
    private accessToken = environment.instagramAccessToken;
    private accountId = environment.instagramAccId;
    private sessionKey = 'instagramPosts';
    private posts$?: Observable<any[]>;


    constructor(private http: HttpClient) {
    }

    // Emits the post list once (from sessionStorage or the API) or errors; callers show their own error state.
    getUserMedia(): Observable<any[]> {
        if (!this.posts$) {
            this.posts$ = this.loadUserMedia().pipe(
                map((response: any) => response?.data || []),
                catchError(error => {
                    console.error('Error fetching Instagram posts:', error);
                    // Drop the failed request so the next visit retries
                    this.posts$ = undefined;
                    return throwError(() => error);
                }),
                shareReplay(1)
            );
        }
        return this.posts$;
    }

    private loadUserMedia(): Observable<any> {
        const cachedData = sessionStorage.getItem(this.sessionKey);
        if (cachedData) {
            // Serve from sessionStorage
            return of(JSON.parse(cachedData));
        }
        if (!this.accessToken || !this.accountId) {
            return throwError(() => new Error('Instagram access token / account id not configured'));
        }
        // Fetch from API if not cached
        return this.http.get(`${this.apiUrl}/${this.accountId}/media`, {
            params: {
                fields: 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,children{media_type,media_url,thumbnail_url}',
                limit: '5',
                access_token: this.accessToken
            }
        }).pipe(
            tap(response => sessionStorage.setItem(this.sessionKey, JSON.stringify(response)))
        );
    }

}
