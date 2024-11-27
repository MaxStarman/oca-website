import {Component, OnInit} from '@angular/core';
import {InstagramService} from "../../services/instagram.service";

@Component({
    selector: 'news-page',
    templateUrl: './news.component.html',
    styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {

    backgroundImage: string = '/assets/images/news/news-start-full.jpeg'; // Initial background image
    instagramData: any = [];

    constructor(private instagramService: InstagramService) {
    }

    ngOnInit() {
        this.instagramService.getUserMedia().subscribe(posts => {
            this.instagramData = posts.data
        })
    }

    // On click, change the background and scroll to the next section
    onBackgroundClick() {
        this.backgroundImage = '/assets/images/news/news-start-broken.jpeg'; // Change to second background image

        // Wait 1 seconds and then scroll to the next section
        // TODO make smooth transition
        setTimeout(() => {
            document.getElementById('nextSection')?.scrollIntoView({behavior: 'smooth'});
        }, 1000);
    }
}
