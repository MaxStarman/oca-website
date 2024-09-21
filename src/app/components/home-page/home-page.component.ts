import { Component } from '@angular/core';
import {NavService} from "../../services/nav.service";

@Component({
  selector: 'home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent {

    constructor(private navService: NavService) {}

    toggleNav() {
        console.log('click')
        this.navService.toggleNav();
    }
}
