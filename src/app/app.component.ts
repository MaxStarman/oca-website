import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {LoadingService} from "./services/loading.service";
import {RouteWipeService} from "./services/route-wipe.service";
import {AnalyticsService} from "./services/analytics.service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {

    @ViewChild('routeWipe') routeWipeRef!: ElementRef<HTMLElement>;

    constructor(loadingService: LoadingService,
                private routeWipe: RouteWipeService,
                analytics: AnalyticsService) {
        // Subscribe before the initial navigation starts so its NavigationEnd isn't missed
        loadingService.dismissWhenReady();
        analytics.init();
    }

    ngAfterViewInit(): void {
        this.routeWipe.attach(this.routeWipeRef.nativeElement);
    }
}
