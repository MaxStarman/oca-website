import {Component} from '@angular/core';
import {animate, style, transition, trigger} from "@angular/animations";

@Component({
    selector: 'contact-us',
    templateUrl: './contact-us.component.html',
    styleUrls: ['./contact-us.component.scss'],
    animations: [
        trigger('fadeIn', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate('1000ms', style({ opacity: 1 }))
            ]),
            transition(':leave', [
                animate('1000ms', style({ opacity: 0 }))
            ])
        ]),
        trigger('fadeOut', [
            transition(':leave', [
                animate('1000ms', style({ opacity: 0 }))
            ])
        ])
    ]
})
export class ContactUsComponent {

    showStartPage = true;

    toggleStartPage() {
        this.showStartPage = !this.showStartPage;

        setTimeout(() => {
            this.showStartPage = false;
        }, 500);
    }
}
