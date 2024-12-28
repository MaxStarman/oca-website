import {Component, Input} from '@angular/core';
import {NavService} from "../../../services/nav.service";
import {Router} from "@angular/router";

@Component({
    selector: 'nav-icon',
    templateUrl: './nav-icon.component.html',
    styleUrls: ['./nav-icon.component.scss']
})
export class NavIconComponent {

    @Input()
    type: string = 'home';

    iconPath = '../../../assets/svg-icons/cupcake-white.svg';
    iconH = 63;
    iconW = 52;

    constructor(private navService: NavService,
                private router: Router,
    ) {
    }

    iconClicked() {
        if (this.type == 'nav-menu') {
            this.navService.toggleNav();
        } else {
            this.router.navigate([''])
        }
    }
}
