import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class MotionService {

    private readonly reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    private reducedMotionSubject = new BehaviorSubject<boolean>(this.reducedMotionQuery.matches);
    reducedMotion$ = this.reducedMotionSubject.asObservable();

    constructor() {
        this.reducedMotionQuery.addEventListener('change', event => this.reducedMotionSubject.next(event.matches));
    }

    get reducedMotion(): boolean {
        return this.reducedMotionSubject.value;
    }
}
