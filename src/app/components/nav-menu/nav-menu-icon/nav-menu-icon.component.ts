import {Component} from '@angular/core';
import {NavService} from "../../../services/nav.service";

@Component({
    selector: 'nav-menu-icon',
    templateUrl: './nav-menu-icon.component.html',
    styleUrls: ['./nav-menu-icon.component.scss']
})
export class NavMenuIconComponent {

    constructor(private navService: NavService) {
    }

    toggleNav() {
        console.log('click on icon')
        this.navService.toggleNav();
    }

    // TODO problem z hover cez icon btn ko je odprt nav-menu. V ozadju je zrenderan se en enak icon-btn
}
