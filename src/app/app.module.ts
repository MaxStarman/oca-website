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
import {environment} from "../enviroments/enviroment";
import {initializeApp, provideFirebaseApp} from "@angular/fire/app";
import {getAnalytics, provideAnalytics, ScreenTrackingService} from "@angular/fire/analytics";
import {getPerformance, providePerformance} from "@angular/fire/performance";
import {NewsStartPageComponent} from './components/news/news-start-page/news-start-page.component';
import {SplashScreenComponent} from './components/spash-screen/splash-screen.component';
import {LoadingService} from "./services/loading.service";
import {LoadingPipe} from "./pipes/loading.pipe";

// Only wire up Firebase when a config is present, so the app still runs with placeholder environments.
const firebaseEnabled = !!environment.firebaseConfig.apiKey;
const firebaseImports = firebaseEnabled ? [
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAnalytics(() => getAnalytics()),
    providePerformance(() => getPerformance())
] : [];

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
        SplashScreenComponent,
        LoadingPipe
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
        ...firebaseImports
    ],
    providers: [
        provideAnimations(),
        LoadingService,
        // Logs a page_view to Analytics on every route change
        ...(firebaseEnabled ? [ScreenTrackingService] : [])
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
