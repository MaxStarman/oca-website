import {Component} from '@angular/core';
import {NavService} from "../../services/nav.service";

@Component({
    selector: 'nav-menu',
    templateUrl: './nav-menu.component.html',
    styleUrls: ['./nav-menu.component.scss']
})
export class NavMenuComponent {
// full page navigation
    isOpen = false;

    constructor(private navService: NavService) {
        this.navService.isOpen$.subscribe(isOpen => {
            this.isOpen = isOpen;
        });
    }

    toggleNav() {
        console.log('click on icon')
        this.navService.toggleNav();
    }
}
