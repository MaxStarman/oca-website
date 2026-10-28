import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class MotionService {

    private readonly reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    private reducedMotionSubject = new BehaviorSubject<boolean>(this.reducedMotionQuery.matches);
    reducedMotion$ = this.reducedMotionSubject.asObservable();

    // Phones and weak CPUs get lighter effects (capped pixel ratio, 30 fps, static grain);
    // <oca-stage> reads this to pick its three.js quality level.
    readonly isLowPower = window.matchMedia('(pointer: coarse)').matches
        || (navigator.hardwareConcurrency ?? 8) <= 4;

    constructor() {
        this.reducedMotionQuery.addEventListener('change', event => this.reducedMotionSubject.next(event.matches));
    }

    get reducedMotion(): boolean {
        return this.reducedMotionSubject.value;
    }
}
