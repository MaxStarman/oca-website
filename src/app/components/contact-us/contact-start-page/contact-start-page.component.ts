import {Component, EventEmitter, Output} from '@angular/core';

@Component({
    selector: 'contact-start-page',
    templateUrl: './contact-start-page.component.html',
    styleUrls: ['./contact-start-page.component.scss']
})
export class ContactStartPageComponent {

    @Output()
    clicked = new EventEmitter<void>();

    onClick() {
        this.clicked.emit();
    }
}
