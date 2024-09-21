import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class NavService {

    private isOpenSubject = new BehaviorSubject<boolean>(false);
    isOpen$ = this.isOpenSubject.asObservable();

    toggleNav() {
        this.isOpenSubject.next(!this.isOpenSubject.value);
    }


}
