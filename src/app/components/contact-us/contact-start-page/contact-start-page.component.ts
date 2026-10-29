import {Component, EventEmitter, Output} from '@angular/core';

@Component({
    selector: 'contact-start-page',
    templateUrl: './contact-start-page.component.html',
    styleUrls: ['./contact-start-page.component.scss']
})
export class ContactStartPageComponent {

    @Output()
    clicked = new EventEmitter<void>();

    private continued = false;

    // Click, wheel or swipe (scrollIntent); a wheel gesture fires many events, so only the first counts
    onClick() {
        if (!this.continued) {
            this.continued = true;
            this.clicked.emit();
        }
    }
}
