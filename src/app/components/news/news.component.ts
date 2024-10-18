import {Component, OnInit} from '@angular/core';
import {NavService} from "../../services/nav.service";
import {InstagramService} from "../../services/instagram.service";

@Component({
    selector: 'news-page',
    templateUrl: './news.component.html',
    styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {

    backgroundImage: string = '/assets/images/news-start-full.jpeg'; // Initial background image
    posts: any = [];

    constructor(private navService: NavService,
                private instagramService: InstagramService) {
        this.navService.isOpen$.subscribe((isOpen) => {
            if (!isOpen) {
                this.backgroundImage = '/assets/images/news-start-full.jpeg';
            }
        })
    }

    ngOnInit() {
        this.instagramService.getUserMedia().subscribe(posts => {
            this.posts = posts.data
            console.log(this.posts)
        })
    }

    // On click, change the background and scroll to the next section
    onBackgroundClick() {
        this.backgroundImage = '/assets/images/title-screen-bg.jpeg'; // Change to second background image

        // Wait 1 seconds and then scroll to the next section
        setTimeout(() => {
            document.getElementById('nextSection')?.scrollIntoView({behavior: 'smooth'});
        }, 1000);
    }

    /** Za bolj smooth prehod */
    // showOverlay: boolean = false;
    //
    // // On click, show the overlay and then scroll to the next section
    // onBackgroundClick() {
    //     this.showOverlay = true; // Display the overlay with a fade-in effect
    //
    //     // Wait 2 seconds, then scroll to the next section
    //     setTimeout(() => {
    //         document.getElementById('nextSection')?.scrollIntoView({ behavior: 'smooth' });
    //     }, 2000);
    // }
}
