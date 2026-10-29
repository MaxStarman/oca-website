import {Injectable} from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";
import {BehaviorSubject} from "rxjs";
import {filter} from "rxjs/operators";
import {TranslationKey} from "../i18n/sl";
import {MotionService} from "./motion.service";

export interface NavLink {
    path: string;
    label: TranslationKey;
    // The page's own palette color (Novice teal, Glasba ochre, Kontakt rust), marks the current page
    accent: string;
    icon: string;
    iconWidth: number;
    iconHeight: number;
}

// The site's pages, in the same order everywhere (header and the big video menu)
export const NAV_LINKS: NavLink[] = [
    {
        path: '/news', label: 'nav.news', accent: 'var(--oca-teal)',
        icon: 'assets/svg-icons/alert-white.svg', iconWidth: 87, iconHeight: 76
    },
    {
        path: '/music', label: 'nav.music', accent: 'var(--oca-ochre)',
        icon: 'assets/svg-icons/note-white.svg', iconWidth: 48, iconHeight: 74
    },
    {
        path: '/contact', label: 'nav.contact', accent: 'var(--oca-rust)',
        icon: 'assets/svg-icons/mail-white.svg', iconWidth: 93, iconHeight: 74
    },
];

@Injectable({
    providedIn: 'root'
})
export class NavService {

    private isOpenSubject = new BehaviorSubject<boolean>(false);
    isOpen$ = this.isOpenSubject.asObservable();

    // Picking a page closes the overlay once the route transition has covered the screen
    constructor(private router: Router,
                private motion: MotionService) {
        router.events.pipe(filter(event => event instanceof NavigationEnd))
            .subscribe(() => this.isOpenSubject.next(false));
    }

    toggleNav() {
        this.isOpenSubject.next(!this.isOpenSubject.value);
    }

    close() {
        this.isOpenSubject.next(false);
    }

    // For link clicks: the router ignores a link to the page we're already on, so glide back to the top
    scrollUpIfCurrent(path: string): void {
        if (this.router.url === path) {
            window.scrollTo({top: 0, behavior: this.motion.reducedMotion ? 'instant' : 'smooth'});
        }
    }
}
