import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {YtVideosComponent} from "./components/yt-videos/yt-videos.component";
import {NewsComponent} from "./components/news/news.component";
import {ContactUsComponent} from "./components/contact-us/contact-us.component";
import {HomePageComponent} from "./components/home-page/home-page.component";
import {DisplayPostsComponent} from "./components/news/display-posts/display-posts.component";
import {routeWipeGuard} from "./services/route-wipe.service";

// routeWipeGuard holds each page change until the transition covers the screen (RouteWipeService)
const routes: Routes = [
    {path: '', component: HomePageComponent, canActivate: [routeWipeGuard]},
    {path: 'news', component: NewsComponent, canActivate: [routeWipeGuard]},
    {path: 'news/post/:id', component: DisplayPostsComponent, canActivate: [routeWipeGuard]},
    {path: 'music', component: YtVideosComponent, canActivate: [routeWipeGuard]},
    {path: 'music/video/:id', component: YtVideosComponent, canActivate: [routeWipeGuard]},
    {path: 'contact', component: ContactUsComponent, canActivate: [routeWipeGuard]},
    {path: '**', redirectTo: ''}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
