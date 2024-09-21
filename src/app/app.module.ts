import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HttpClientModule} from "@angular/common/http";
import {YtVideosComponent} from './components/yt-videos/yt-videos.component';
import {YouTubePlayerModule} from "@angular/youtube-player";
import {NewsComponent} from './components/news/news.component';
import {ContactUsComponent} from './components/contact-us/contact-us.component';
import {NavMenuComponent} from './components/nav-menu/nav-menu.component';
import {NavMenuIconComponent} from './components/nav-menu/nav-menu-icon/nav-menu-icon.component';
import {HomePageComponent} from './components/home-page/home-page.component';
import {NgOptimizedImage} from "@angular/common";
import { LoadingScreenComponent } from './components/loading-screen/loading-screen.component';

@NgModule({
    declarations: [
        AppComponent,
        YtVideosComponent,
        NewsComponent,
        ContactUsComponent,
        NavMenuComponent,
        NavMenuIconComponent,
        HomePageComponent,
        LoadingScreenComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        YouTubePlayerModule,
        NgOptimizedImage
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
