import {AfterViewInit, Component, ElementRef, NgZone, OnDestroy, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {MotionService} from "../../../services/motion.service";
import {ScrollReveal} from "../../../ng-animations/scroll-reveal";

@Component({
    selector: 'content',
    templateUrl: './content.component.html',
    styleUrls: ['./content.component.scss']
})
export class ContentComponent implements AfterViewInit, OnDestroy {

    @ViewChild('contactSection') contactSectionRef!: ElementRef<HTMLElement>;
    @ViewChildren('item') items!: QueryList<ElementRef<HTMLElement>>;

    private reveal: ScrollReveal;

    constructor(ngZone: NgZone, motion: MotionService) {
        this.reveal = new ScrollReveal(ngZone, motion);
    }

    // Phone, email and location arrive one by one as the section scrolls into its pinned block
    ngAfterViewInit(): void {
        this.reveal.update(this.contactSectionRef.nativeElement, this.items.map(item => item.nativeElement));
    }

    ngOnDestroy(): void {
        this.reveal.destroy();
    }
}
