import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Observable} from "rxjs";


@Injectable({
    providedIn: 'root'
})
export class YoutubeService {

    apiKey: string = 'AIzaSyAZWe0J50kPWS3iLXlSNGQegdXnxTJoD7k';

    constructor(public http: HttpClient) {
    }

    getVideosForChanel(channel: string, maxResults: number): Observable<any> {
        let url = 'https://www.googleapis.com/youtube/v3/search?key=' + this.apiKey + '&channelId=' + channel
            + '&order=date&part=snippet &type=video,id&maxResults=' + maxResults.toString()
        return this.http.get(url)
            .pipe(map((res) => {
                return res;
            }))
    }
}
