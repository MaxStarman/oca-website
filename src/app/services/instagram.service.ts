import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, of, ReplaySubject} from "rxjs";
import {environment} from "../../enviroments/enviroment";
import {catchError, tap} from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class InstagramService {


    private apiUrl = 'https://graph.instagram.com/v21.0';
    private accessToken = environment.instagramAccessToken;
    private accountId = environment.instagramAccId;
    private sessionKey = 'instagramPosts';
    private cachedPosts: ReplaySubject<any> = new ReplaySubject(1);


    constructor(private http: HttpClient) {
    }

    getUserMedia(): Observable<any> {
        const cachedData = sessionStorage.getItem(this.sessionKey);
        if (cachedData) {
            // Serve from sessionStorage
            this.cachedPosts.next(JSON.parse(cachedData));
        } else {
            // Fetch from API if not cached
            this.http.get(`${this.apiUrl}/${this.accountId}/media`, {
                params: {
                    fields: 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,children{media_type,media_url,thumbnail_url}',
                    limit: '5',
                    access_token: this.accessToken
                }
            }).pipe(
                tap((response: any) => {
                    sessionStorage.setItem(this.sessionKey, JSON.stringify(response));
                    this.cachedPosts.next(response);
                }),
                catchError(error => {
                    console.error('Error fetching Instagram posts:', error);
                    return of([]);
                })
            ).subscribe();
        }
        return this.cachedPosts.asObservable();
    }

}
