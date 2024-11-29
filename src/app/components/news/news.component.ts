import {Component} from '@angular/core';
import {fadeAnimations} from "../../ng-animations/animations";

@Component({
    selector: 'news-page',
    templateUrl: './news.component.html',
    styleUrls: ['./news.component.scss'],
    animations: fadeAnimations
})
export class NewsComponent {

    showStartPage = true;

    toggleStartPage() {
        this.showStartPage = !this.showStartPage;
    }
}
