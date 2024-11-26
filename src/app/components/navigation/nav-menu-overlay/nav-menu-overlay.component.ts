import {Component} from '@angular/core';
import {NavService} from "../../../services/nav.service";

@Component({
    selector: 'nav-menu-overlay',
    templateUrl: './nav-menu-overlay.component.html',
    styleUrls: ['./nav-menu-overlay.component.scss']
})
export class NavMenuOverlayComponent {
// full page navigation
    isOpen = false;

    constructor(private navService: NavService) {
        this.navService.isOpen$.subscribe(isOpen => {
            this.isOpen = isOpen;
        });
    }

    onToggleNav() {
        this.navService.toggleNav();
    }
}
