import {Component} from '@angular/core';
import {MEMBERS} from "../../content/members";
import {I18nService} from "../../i18n/i18n.service";

// Each member's name with their instruments slowly orbiting around it: "each of us plays several"
// shown rather than said. Renders nothing until MEMBERS has content.
@Component({
    selector: 'instrument-orbit',
    templateUrl: './instrument-orbit.component.html',
    styleUrls: ['./instrument-orbit.component.scss']
})
export class InstrumentOrbitComponent {

    readonly members = MEMBERS;

    constructor(public i18n: I18nService) {
    }

    // Spreads the instruments evenly around the circle; --angle is used by the SCSS transforms
    angle(index: number, count: number): string {
        return `${(360 / count) * index}deg`;
    }
}
