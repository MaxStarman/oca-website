import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {NAV_LINKS, NavService} from "../../../services/nav.service";
import {I18nService} from "../../../i18n/i18n.service";

// Fixed bar on every page: home (the cupcake), the three pages by name with the current one marked,
// and the language switch. Pages keep their full-bleed layouts underneath it (see --oca-header-h).
@Component({
    selector: 'site-header',
    templateUrl: './site-header.component.html',
    styleUrls: ['./site-header.component.scss']
})
export class SiteHeaderComponent {

    readonly links = NAV_LINKS;

    constructor(public router: Router,
                public nav: NavService,
                public i18n: I18nService) {
    }
}
