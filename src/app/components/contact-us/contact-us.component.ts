import {Component} from '@angular/core';
import {fadeAnimations} from "../../ng-animations/animations";

@Component({
    selector: 'contact-us',
    templateUrl: './contact-us.component.html',
    styleUrls: ['./contact-us.component.scss'],
    animations: fadeAnimations
})
export class ContactUsComponent {

    showStartPage = true;

    toggleStartPage() {
        setTimeout(() => {
            this.showStartPage = false;
        }, 500);
    }
}
