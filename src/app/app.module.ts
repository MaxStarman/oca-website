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
import {HomePageComponent} from './components/home-page/home-page.component';
import {NgOptimizedImage, registerLocaleData} from "@angular/common";
import localeSl from "@angular/common/locales/sl";
import {CarouselModule} from "ngx-bootstrap/carousel";
import {DisplayPostsComponent} from './components/news/display-posts/display-posts.component';
import {ContactStartPageComponent} from './components/contact-us/contact-start-page/contact-start-page.component';
import {ContentComponent} from './components/contact-us/content/content.component';
import {NavMenuComponent} from './components/navigation/nav-menu/nav-menu.component';
import {NewsStartPageComponent} from './components/news/news-start-page/news-start-page.component';
import {TranslatePipe} from "./i18n/translate.pipe";
import {InstrumentOrbitComponent} from './components/instrument-orbit/instrument-orbit.component';
import {SiteHeaderComponent} from './components/navigation/site-header/site-header.component';
import {IconComponent} from './components/icon/icon.component';
import {ScrollIntentDirective} from './directives/scroll-intent.directive';

// Slovene month names etc. for the date pipe (English is built in)
registerLocaleData(localeSl);

@NgModule({
    declarations: [
        AppComponent,
        YtVideosComponent,
        NewsComponent,
        ContactUsComponent,
        NavMenuOverlayComponent,
        HomePageComponent,
        DisplayPostsComponent,
        ContactStartPageComponent,
        ContentComponent,
        NavMenuComponent,
        NewsStartPageComponent,
        TranslatePipe,
        InstrumentOrbitComponent,
        SiteHeaderComponent,
        IconComponent,
        ScrollIntentDirective
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        YouTubePlayerModule,
        NgOptimizedImage,
        CarouselModule.forRoot()
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
