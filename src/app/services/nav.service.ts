import {Injectable} from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";
import {BehaviorSubject} from "rxjs";
import {filter} from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class NavService {

    private isOpenSubject = new BehaviorSubject<boolean>(false);
    isOpen$ = this.isOpenSubject.asObservable();

    // Picking a page closes the overlay once the route transition has covered the screen
    constructor(router: Router) {
        router.events.pipe(filter(event => event instanceof NavigationEnd))
            .subscribe(() => this.isOpenSubject.next(false));
    }

    toggleNav() {
        this.isOpenSubject.next(!this.isOpenSubject.value);
    }


}
