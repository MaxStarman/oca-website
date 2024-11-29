import {Component, EventEmitter, Output} from '@angular/core';

@Component({
    selector: 'news-start-page',
    templateUrl: './news-start-page.component.html',
    styleUrls: ['./news-start-page.component.scss']
})
export class NewsStartPageComponent {

    backgroundImage: string = '/assets/images/news/news-start-full.jpeg'; // Initial background image

    @Output()
    clicked = new EventEmitter<void>();

    // On click, change the background and scroll to the next section
    onBackgroundClick() {
        this.backgroundImage = '/assets/images/news/news-start-broken.jpeg'; // Change to second background image

        // Wait 1 seconds and then emit event to parent component

        setTimeout(() => {
            this.clicked.emit();
        }, 1000);

    }
}
