import {Component, Input, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {NavService} from "../../../services/nav.service";
import {Router} from "@angular/router";

@Component({
    selector: 'nav-icon',
    templateUrl: './nav-icon.component.html',
    styleUrls: ['./nav-icon.component.scss']
})
export class NavIconComponent implements OnInit {

    @Input()
    type: string = 'home';  // 'nav-menu' | 'prev-page'
    @Input()
    icon: string = 'cupcake';  // 'note' | 'alert'

    iconPath!: string;
    iconH!: number;
    iconW!: number;

    constructor(private navService: NavService,
                private router: Router,
                private location: Location) {
    }

    ngOnInit() {
        this.updateIcon()
    }

    iconClicked() {

        if (this.type == 'nav-menu') {
            this.navService.toggleNav();
        } else if (this.type == 'prev-page') {
            this.goBack();
        } else {
            this.router.navigate([''])
        }
    }

    private updateIcon(): void {
        const iconsMap: Record<string, string> = {
            'cupcake': '../../../assets/svg-icons/cupcake-white.svg',
            'note': '../../../assets/svg-icons/note-white.svg',
            'alert': '../../../assets/svg-icons/alert-white.svg'
        };
        const iconsSize: Record<string, [number, number]> = {
            'cupcake': [63, 52],
            'note': [74, 48],
            'alert': [76, 87]
        };

        this.iconPath = iconsMap[this.icon];
        this.iconH = iconsSize[this.icon][0];
        this.iconW = iconsSize[this.icon][1];
    }

    private goBack(): void {
        if (window.history.length > 1) {
            this.location.back();
        } else {
            // Redirect to a fallback route (e.g., home page)
            this.router.navigate(['']);
        }
    }


}
