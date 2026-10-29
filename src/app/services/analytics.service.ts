import {Injectable, NgZone, reflectComponentType} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {ActivatedRouteSnapshot, NavigationEnd, Router} from "@angular/router";
import {filter, first} from "rxjs/operators";
import {environment} from "../../enviroments/enviroment";

// Firebase Analytics + Performance Monitoring, loaded only once the first page is up and the browser is
// idle, so the SDK is not part of the initial bundle (it used to be, via AngularFire, even with Firebase
// switched off). Logs a screen_view on every route change with the same fields AngularFire's
// ScreenTrackingService used. Does nothing while environment.firebaseConfig.apiKey is empty.
@Injectable({
    providedIn: 'root'
})
export class AnalyticsService {

    constructor(private router: Router,
                private title: Title,
                private ngZone: NgZone) {
    }

    // Call once at startup, before the initial navigation
    init(): void {
        if (!environment.firebaseConfig.apiKey) {
            return;
        }
        this.router.events.pipe(filter(event => event instanceof NavigationEnd), first()).subscribe(() => {
            const start = () => this.ngZone.runOutsideAngular(() => this.load());
            'requestIdleCallback' in window ? requestIdleCallback(start, {timeout: 4000}) : setTimeout(start, 2000);
        });
    }

    private async load(): Promise<void> {
        const [{initializeApp}, {getAnalytics, logEvent}, {getPerformance}] = await Promise.all([
            import("firebase/app"), import("firebase/analytics"), import("firebase/performance")
        ]);
        const app = initializeApp(environment.firebaseConfig);
        const analytics = getAnalytics(app);
        getPerformance(app); // collects page-load and network traces on its own

        const logScreenView = () => logEvent(analytics, 'screen_view', this.screenViewParams());
        logScreenView(); // the page the visitor landed on
        this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(logScreenView);
    }

    private screenViewParams() {
        let snapshot: ActivatedRouteSnapshot = this.router.routerState.snapshot.root;
        while (snapshot.firstChild) {
            snapshot = snapshot.firstChild;
        }
        // The route pattern ('music/video/:id'), so all videos group under one screen
        const screenName = snapshot.pathFromRoot.map(s => s.routeConfig?.path).filter(path => path).join('/') || '/';
        const screenClass = snapshot.component ? reflectComponentType(snapshot.component)?.selector : undefined;
        return {
            screen_name: screenName,
            firebase_screen: screenName,
            screen_class: screenClass,
            firebase_screen_class: screenClass,
            page_path: this.router.url,
            page_title: this.title.getTitle()
        };
    }
}
