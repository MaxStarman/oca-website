import {Component} from '@angular/core';

const FADE_MS = 1000;

@Component({
    selector: 'contact-us',
    templateUrl: './contact-us.component.html',
    styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent {

    showStartPage = true;
    showContent = false;

    // A short beat on the title, then the content fades in and the start page goes once it has faded out
    onStartPageDone() {
        setTimeout(() => {
            this.showContent = true;
            setTimeout(() => this.showStartPage = false, FADE_MS);
        }, 500);
    }
}
