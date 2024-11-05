import {Component, EventEmitter, Output} from '@angular/core';

@Component({
    selector: 'start-page',
    templateUrl: './start-page.component.html',
    styleUrls: ['./start-page.component.scss']
})
export class StartPageComponent {

    @Output()
    clicked = new EventEmitter<void>();

    onClick() {
        this.clicked.emit();
    }
}
