import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HttpClientModule} from "@angular/common/http";
import {YtVideosComponent} from './components/yt-videos/yt-videos.component';
import {YouTubePlayerModule} from "@angular/youtube-player";
import {NewsComponent} from './components/news/news.component';
import {ContactUsComponent} from './components/contact-us/contact-us.component';
import {NavMenuOverlayComponent} from './components/navigation/nav-menu-overlay/nav-menu-overlay.component';
import {NavIconComponent} from './components/navigation/nav-icon/nav-icon.component';
import {HomePageComponent} from './components/home-page/home-page.component';
import {NgOptimizedImage} from "@angular/common";
import {BrowserAnimationsModule, provideAnimations} from '@angular/platform-browser/animations';
import {CarouselModule} from "ngx-bootstrap/carousel";
import {DisplayPostsComponent} from './components/news/display-posts/display-posts.component';
import {ContactStartPageComponent} from './components/contact-us/contact-start-page/contact-start-page.component';
import {ContentComponent} from './components/contact-us/content/content.component';
import {ReactiveFormsModule} from "@angular/forms";
import {NavMenuComponent} from './components/navigation/nav-menu/nav-menu.component';
import {AngularFireModule} from "@angular/fire/compat";
import {environment} from "../enviroments/enviroment";
import {AngularFireAnalyticsModule} from "@angular/fire/compat/analytics";
import {initializeApp} from "@angular/fire/app";
import {getAnalytics} from "@angular/fire/analytics";
import {AngularFirestoreModule} from "@angular/fire/compat/firestore";
import {NewsStartPageComponent} from './components/news/news-start-page/news-start-page.component';
import {AppCheckModule} from "@angular/fire/app-check";
import {getPerformance} from "firebase/performance";
import {SplashScreenComponent} from './components/spash-screen/splash-screen.component';

@NgModule({
    declarations: [
        AppComponent,
        YtVideosComponent,
        NewsComponent,
        ContactUsComponent,
        NavMenuOverlayComponent,
        NavIconComponent,
        HomePageComponent,
        DisplayPostsComponent,
        ContactStartPageComponent,
        ContentComponent,
        NavMenuComponent,
        NewsStartPageComponent,
        SplashScreenComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        HttpClientModule,
        YouTubePlayerModule,
        NgOptimizedImage,
        CarouselModule.forRoot(),
        ReactiveFormsModule,
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AppCheckModule,
        AngularFireAnalyticsModule,
        AngularFirestoreModule
    ],
    providers: [
        provideAnimations()
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor() {
        const app = initializeApp(environment.firebaseConfig);
        const analytics = getAnalytics(app);
        // const appCheck = initializeAppCheck(app, {
        //     provider: new ReCaptchaEnterpriseProvider(environment.siteKey),
        //     isTokenAutoRefreshEnabled: false // Set to true to allow auto-refresh.
        // })
        const perf = getPerformance(app);
    }

}
