import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
    selector: 'nav-menu',
    templateUrl: './nav-menu.component.html',
    styleUrls: ['./nav-menu.component.scss']
})
export class NavMenuComponent {

    @Output() toggleNav = new EventEmitter<void>();

    @Input()
    isFromOverlay = false;

    notifyParent() {
        this.toggleNav.emit();
    }
}
