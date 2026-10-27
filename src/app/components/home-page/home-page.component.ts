import {Component} from '@angular/core';
import {NavService} from "../../services/nav.service";
import {MotionService} from "../../services/motion.service";
import {SIGNATURE} from "../../i18n/sl";

// Once the logo has been clicked, the idle pulse hint stops for the rest of the session
const HINT_SEEN_KEY = 'oca.logoClicked';
// Long enough for the press "squash" to be seen before the overlay covers the logo
const PRESS_MS = 140;

@Component({
    selector: 'home-page',
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent {

    readonly signature = SIGNATURE;
    showHint = !this.hintSeen();
    pressed = false;

    constructor(private navService: NavService,
                private motion: MotionService) {
    }

    onLogoClick() {
        this.rememberHintSeen();
        this.showHint = false;

        if (this.motion.reducedMotion) {
            this.navService.toggleNav();
            return;
        }
        this.pressed = true;
        setTimeout(() => {
            this.pressed = false;
            this.navService.toggleNav();
        }, PRESS_MS);
    }

    private hintSeen(): boolean {
        try {
            return sessionStorage.getItem(HINT_SEEN_KEY) === '1';
        } catch {
            return false;
        }
    }

    private rememberHintSeen() {
        try {
            sessionStorage.setItem(HINT_SEEN_KEY, '1');
        } catch {
            // Storage blocked: the hint just comes back on the next visit to home
        }
    }
}
